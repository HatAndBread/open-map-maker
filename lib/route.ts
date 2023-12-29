import L from "leaflet"
import type { FeatureCollection, Geometry, Feature, Position, LineString, GeometryObject, GeometryCollection } from "geojson"
import Topography, { getTopography, configure, TopoLayer } from 'leaflet-topography';
import UndoManager from "undo-manager"
import OSRM from "./osrm"
import ControlPointMarker from "./control-point-marker"
import toGeoJSON from "./to-geojson"
import type {Ref} from "vue"
import { Chart } from "chart.js";
import GeoJsonToGpx from "@dwayneparton/geojson-to-gpx"
import nearestPoint from "@turf/nearest-point"
import nearestPointOnLine from "@turf/nearest-point-on-line"
import round from "lodash.round"
import distance from "@turf/distance"
import {featureCollection, point as turfPoint, lineString } from "@turf/helpers"
import { useRuntimeConfig } from "nuxt/app"

type GeometryTypes = "Point" | "MultiPoint" | "LineString" | "MultiLineString" | "Polygon" | "MultiPolygon" | "GeometryCollection"
const topoOptions = {
  token: useRuntimeConfig().public.mapboxKey
}

const previewOptions = { color: "rgba(200,100,100,0.4)" }
export default class Route {
  geoJSON: FeatureCollection
  runningGeoJSON: FeatureCollection
  osrm: OSRM
  map?: L.Map
  line?: L.Polyline
  runningLine?: L.Polyline
  controlPointLayer: L.LayerGroup
  undoManager: UndoManager
  preview?: L.Polyline
  chart?: Chart
  reactiveStats: Ref<ReactiveStats>

  constructor(osrm: OSRM, reactiveStats: Ref<ReactiveStats>) {
    this.osrm = osrm
    this.reactiveStats = reactiveStats
    const latestRoute = window.localStorage ? localStorage.getItem("latest-route") : null
    this.geoJSON = latestRoute ? JSON.parse(latestRoute) : starterObject()
    this.runningGeoJSON = starterObject()
    this.undoManager = new UndoManager()
    this.controlPointLayer = new L.LayerGroup()
  }

  get route() {
    return this.geoJSON.features[0] as Feature<LineString>
  }

  get routeCoordinates() {
    return this.route.geometry.coordinates
  }

  get startLatLng(): L.LatLngExpression | null {
    if (!this.routeCoordinates[0]) return null
      console.log(this.routeCoordinates[0])
    return {lat: this.routeCoordinates[0][1], lng: this.routeCoordinates[0][0]}
  }

  get lastCoord() {
    return this.routeCoordinates[this.routeCoordinates.length - 1]
  }

  get controlPointCoordinates() {
    return this.controlPoints.geometry.coordinates
  }

  get controlPoints() {
    return this.geoJSON.features[1] as Feature<LineString>
  }

  get latLngs() {
    return this.coordinatesToLatLngs(this.routeCoordinates)
  }

  get runningLatLngs() {
    //@ts-ignore
    return this.coordinatesToLatLngs(this.runningGeoJSON.features[0].geometry.coordinates)
  }

  undo() {
    this.undoManager.undo()
    this.drawRoute()
  }

  redo() {
    this.undoManager.redo()
    this.drawRoute()
  }

  addCoordinates(positions: Position[]) {
    const undo = () => {
      for (let i = 0; i < positions.length; i++) {
        this.routeCoordinates.pop()
      }
      this.controlPointCoordinates.pop()
    }
    const redo = () => {
      for (let i = 0; i < positions.length; i++) {
        this.routeCoordinates.push(positions[i])
      }
      this.addControlPoint(positions[positions.length - 1])
    }
    this.undoManager.add({undo, redo})
    redo()
  }

  addControlPoint(position: Position) {
    this.controlPoints.geometry.coordinates.push(position)
  }

  addControlPointAt(index: number, position: Position) {
    const undo = () => {
      this.controlPointCoordinates.splice(index, 1)
    }
    const redo = () => {
      this.controlPointCoordinates.splice(index, 0, position)
    }
    this.undoManager.add({undo, redo})
    redo()
  }

  startMarker() {
    const start = this.controlPointCoordinates[0]
    const marker = new L.Marker([start[1], start[0]], {
      interactive: false,
      icon: L.icon({
        iconUrl: "star.svg",
        iconSize: [32, 32],
        iconAnchor: [16, 18]
      }),
    });
    return marker
  }

  get canBeDrawn() { return !!this.controlPointCoordinates[0] }

  addControlPointMarkers() {
    if (!this.map) return
    if (this.controlPointLayer) this.map.removeLayer(this.controlPointLayer)
    this.controlPointLayer = new L.LayerGroup(this.controlPointMakers())
    this.controlPointLayer.addTo(this.map)
  }
  
  controlPointMakers() {
    const markers = [this.startMarker()]
    for (let i = 0; i < this.controlPointCoordinates.length; i++) {
      markers.push(new ControlPointMarker(this, i).leafletMarker);
    }
    return markers
  }

  drawRoute() {
    if (this.map && this.canBeDrawn) {
      if (this.line) this.map.removeLayer(this.line);
      this.line?.remove()
      this.addControlPointMarkers();
      this.line = L.polyline(this.latLngs, { color: "rgba(250,0,0,0.5)" });
      this.line.addTo(this.map);
      this.saveToLS()
    }
    this.updateChart()
    this.reactiveStats.value.totalDistance = `${round(this.routeDistance(), 2)} km`
  }

  drawRunningLine() {
    if (!this.map) return
    if (this.runningLine) this.map.removeLayer(this.runningLine);
    this.runningLine?.remove()
    this.runningLine = L.polyline(this.runningLatLngs, { color: "rgba(0,50,230,0.5)" });
    this.runningLine.addTo(this.map);
  }

  updateChart() {
    if (this.chart) {
      this.chart.data.datasets[0].data = this.elevations
      this.chart.data.labels = this.elevationLabels
      this.chart.update()
    }
  }

  saveToLS() {
    if (!window.localStorage) return;
    localStorage.setItem("latest-route", JSON.stringify(this.geoJSON))
  }

  async handleClick(e: L.LeafletMouseEvent) {
    if (this.reactiveStats.value.running) return

    const latlng = e.latlng.wrap()
    const {lng, lat} = latlng
    const {elevation} = await Topography.getTopography(latlng, topoOptions);
    const newPoint = [lng, lat];
    if (this.lastCoord) {
      const result = await this.osrm.routeBetweenPoints([this.lastCoord, newPoint])
      if (result) {
        if (this.routeCoordinates.length > 1) result.shift(); // We already have the first point
        this.injectElevations(result);
        this.addCoordinates(result);
      }
    } else {
      newPoint[2] = elevation
      this.addCoordinates([newPoint]);
    }
    this.drawRoute();
  }

  async handleStraightLine(e: L.LeafletMouseEvent) {
    const latlng = e.latlng.wrap()
    const {lng, lat} = latlng
    const {elevation} = await Topography.getTopography(latlng, topoOptions);
    this.addCoordinates([[lng, lat, elevation]]);
    this.drawRoute()
  }

  handleControlPoint(e: L.LeafletMouseEvent) {
    const {lng, lat} = e.latlng.wrap()
    const newPoint = [lng, lat];
    const nearestPointInRoute = nearestPointOnLine(lineString(this.routeCoordinates), newPoint)
    const index = this.nearestPoint(newPoint).properties.featureIndex
    const thisControlPoint = this.controlPointCoordinates[index]
    let indexToInsert = index
    if (!this.controlPointCoordinates[index - 1]) {
      indexToInsert = 1
    } else if (!this.controlPointCoordinates[index + 1]) {
      indexToInsert = this.controlPointCoordinates.length - 1
    } else {
      const x = nearestPointInRoute.properties.index || 0
      const before = this.routeCoordinates.slice(0, x + 1)
      for (let i = 0; i < before.length; i++) {
        if (before[i][0] === thisControlPoint[0] && before[i][1] === thisControlPoint[1]) {
          indexToInsert = index + 1
          break;
        }
      }
    }
    this.addControlPointAt(indexToInsert, nearestPointInRoute.geometry.coordinates)
    this.drawRoute()
  }

  nearestPoint(point: number[]) {
    return nearestPoint(point, featureCollection(this.controlPointCoordinates.map((c) => turfPoint(c))))
  }
  
  coordinatesToLatLngs(coordinates: number[][]) {
    return coordinates.map((p) => [p[1], p[0]]) as L.LatLngExpression[]
  }

  routeDistance() {
    return this.routeCoordinates
      .map((c, i) => this.routeCoordinates[i + 1] ? distance(this.routeCoordinates[i], this.routeCoordinates[i + 1]) : 0)
      .reduce((prev, curr) => prev + curr, 0)
  }

  addPreview() {
    if (!this.map) return;
    this.preview = L.polyline([], previewOptions)
    this.preview.addTo(this.map)
  }

  clear() {
    const copy = {...this.geoJSON}
    const elevations = this.chart && [...this.chart.data.datasets[0].data]
    const undo = () => {
      this.geoJSON = copy
      if (this.chart && elevations) {
        this.chart.data.datasets[0].data = elevations
      }
    }
    const redo = () => {
      localStorage.removeItem("latest-route")
      this.geoJSON = starterObject()
      if (this.map && this.line) {
        this.map.removeLayer(this.line)
        this.map.removeLayer(this.controlPointLayer)
      }
      if (this.chart) {
        this.chart.data.datasets[0].data = []
      }
    }
    this.undoManager.add({undo, redo})
    redo()
    this.drawRoute()
  }

  toggleControlPoints() {
    if (this.map?.hasLayer(this.controlPointLayer)) {
      this.controlPointLayer.removeFrom(this.map)
    } else if (this.map) {
      this.controlPointLayer.addTo(this.map)
    }
  }

  toGPX() {
    const options = {
      metadata: {
        name: "Open Map Maker Route",
        author: {
          name: "Open Map Maker",
          link: {
            href: "https://www.openmapmaker.com",
          },
        },
      },
    };
    const gpx = GeoJsonToGpx(this.geoJSON, options);
    return new XMLSerializer().serializeToString(gpx);
  }

  goToStart() {
    if (!this.map || !this.startLatLng) return
    this.map?.setView(this.startLatLng, 16)
  }

  resetRunningGeoJSON() {
    this.runningGeoJSON = starterObject()
  }

  async injectElevations(arr: Position[]) {
    for (let i = 0; i < arr.length; i++) {
      const latlng = { lng: arr[i][0], lat: arr[i][1] } as L.LatLng;
      const { elevation } = await Topography.getTopography(
        latlng,
        topoOptions
      );
      arr[i][2] = elevation
      if (i === arr.length - 1) {
        this.updateChart()
        this.saveToLS()
      }
    }
  }

  get elevations() {
    return this.routeCoordinates.map((c) => c[2])
  }
  get elevationLabels(): string[] {
    return this.routeCoordinates.map((_, i) => {
      let sum = 0
      for (let j = 1; j < i; j++) {
        sum += distance(this.routeCoordinates[j - 1], this.routeCoordinates[j])
      }
      return `${round(sum, 2)} km`
    })
  }
}

function starterObject () {
  const obj = <FeatureCollection>{
    type: "FeatureCollection",
    features: []
  }
  addFeature(obj, "LineString", {name: "route"})
  addFeature(obj, "MultiPoint", {name: "controlPoints"})
  return obj;
}

function addFeature (geoJSON: FeatureCollection, type: GeometryTypes, properties: {[key: string]: string} = {}) {
  const obj = <Feature<Geometry>>{
    type: "Feature",
    geometry: {
      type,
      coordinates: [],
    },
    properties: {}
  };
  geoJSON.features.push(obj)
}

