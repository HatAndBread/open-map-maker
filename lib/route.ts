import L from "leaflet"
import type { FeatureCollection, Geometry, Feature, Position, LineString, GeometryObject, GeometryCollection } from "geojson"
import UndoManager from "undo-manager"
import OSRM from "./osrm"
type GeometryTypes = "Point" | "MultiPoint" | "LineString" | "MultiLineString" | "Polygon" | "MultiPolygon" | "GeometryCollection"

export default class Route {
  geoJSON: FeatureCollection
  osrm: OSRM
  map?: L.Map
  line?: L.Polyline
  controlPointLayer: L.LayerGroup
  undoManager: UndoManager
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
    return this.routeCoordinates.map((p) => [p[1], p[0]]) as L.LatLngExpression[]
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
    console.log(marker)
    return marker
  }

  addControlPointMarkers() {
    if (!this.map) return
    if (this.controlPointLayer) this.map.removeLayer(this.controlPointLayer)
    this.controlPointLayer = new L.LayerGroup(this.controlPointMakers())
    this.controlPointLayer.addTo(this.map)
  }

  
  controlPointMarker(coord: number[], index: number) {
    const controlPointIcon: L.IconOptions = {
      iconUrl: "controlpoint.png",
      iconSize: [32,32]
    };
    const originalLatLng: L.LatLngExpression = [coord[1], coord[0]]
    const marker =  new L.Marker(originalLatLng, {
      icon: L.icon(controlPointIcon),
      draggable: true,
    });
    marker.on("dragend", (e) => {
      const previous = this.controlPointCoordinates[index - 1]
      const next = this.controlPointCoordinates[index + 1]
      const newLatLng = e.target.getLatLng()
      if (previous && next) {
        console.log(previous, next, newLatLng)
      } else if (previous) {
        console.log(previous, newLatLng)
      } else if (next) {
        console.log(next, newLatLng)
      }
    })

    return marker
  }

  controlPointMakers() {
    const markers = [this.startMarker()]
    for (let i = 0; i < this.controlPointCoordinates.length; i++) {
      markers.push(this.controlPointMarker(this.controlPointCoordinates[i], i));
    }
    return markers
  }

  nextPointIndex(point: number[]) {
    this.routeCoordinates.findIndex((_, i) => {
      const last = this.routeCoordinates[i - 1]
      if (last?.[0] == point?.[0] && last?.[1] == point?.[1]) return i
    })
  }

  previousPoint(point: Point) {

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
        //const els = await elevation.fetch(result)
        //for (let i = 0; i < els.length; i++) {
        //  result[i][2] = els[i].elevation
        //}
      this.addCoordinates(result)
      }
    } else {
      this.addCoordinates([newPoint])
  }
    this.drawRoute();
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

