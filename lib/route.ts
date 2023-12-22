import L from "leaflet"
import type { FeatureCollection, Geometry, Feature, Position, LineString, GeometryObject, GeometryCollection } from "geojson"
import UndoManager from "undo-manager"
import OSRM from "./osrm"
import ControlPointMarker from "./control-point-marker"
import nearestPoint from "@turf/nearest-point"
import nearestPointOnLine from "@turf/nearest-point-on-line"
import distance from "@turf/distance"
import {featureCollection, point as turfPoint, lineString } from "@turf/helpers"

type GeometryTypes = "Point" | "MultiPoint" | "LineString" | "MultiLineString" | "Polygon" | "MultiPolygon" | "GeometryCollection"

const previewOptions = { color: "rgba(200,100,100,0.4)" }
export default class Route {
  geoJSON: FeatureCollection
  osrm: OSRM
  map?: L.Map
  line?: L.Polyline
  controlPointLayer: L.LayerGroup
  undoManager: UndoManager
  preview?: L.Polyline

  constructor(osrm: OSRM) {
    this.osrm = osrm
    this.geoJSON = starterObject()
    this.undoManager = new UndoManager()
    this.controlPointLayer = new L.LayerGroup()
  }

  get route() {
    return this.geoJSON.features[0] as Feature<LineString>
  }

  get routeCoordinates() {
    return this.route.geometry.coordinates
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
    if (this.map) {
      if (this.line) this.map.removeLayer(this.line);
      this.addControlPointMarkers();
      this.line = L.polyline(this.latLngs, { color: "rgba(250,0,0,0.5)" });
      this.line.addTo(this.map);
    }
  }

  async handleClick(e: L.LeafletMouseEvent) {
    const newPoint = [e.latlng.lng, e.latlng.lat];
    if (this.lastCoord) {
      const result = await this.osrm.routeBetweenPoints([this.lastCoord, newPoint])
      if (result) {
        if (this.routeCoordinates.length > 1) result.shift() // We already have the first point
        //const els = await elevation.fetch(result)
        //for (let i = 0; i < els.length; i++) {
        //  result[i][2] = els[i].elevation
        //}
      this.addCoordinates(result)
      }
    } else {
      this.addCoordinates([newPoint]);
    }
    this.drawRoute();
  }

  handleStraightLine(e: L.LeafletMouseEvent) {
    this.addCoordinates([[e.latlng.lng, e.latlng.lat]]);
    this.drawRoute()
  }

  handleControlPoint(e: L.LeafletMouseEvent) {
    const newPoint = [e.latlng.lng, e.latlng.lat];
    const nearestPointInRoute = nearestPointOnLine(lineString(this.routeCoordinates), newPoint)
    const index = nearestPoint(newPoint, featureCollection(this.controlPointCoordinates.map((c) => turfPoint(c)))).properties.featureIndex
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
}

function starterObject () {
  const obj = <FeatureCollection>{
    type: "FeatureCollection",
    features: []
  }
  addFeature(obj, "LineString", {name: "route"})
  addFeature(obj, "LineString", {name: "controlPoints"})
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
