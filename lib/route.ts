import L from "leaflet"
import type { FeatureCollection, Geometry, Feature, Position, LineString, GeometryObject, GeometryCollection } from "geojson"
import UndoManager from "undo-manager"
type LngLat = {lng: number, lat: number}
type GeometryTypes = "Point" | "MultiPoint" | "LineString" | "MultiLineString" | "Polygon" | "MultiPolygon" | "GeometryCollection"

export default class Route {
  geoJSON: FeatureCollection
  map?: L.Map
  line?: L.Polyline
  controlPointLayer: L.LayerGroup
  undoManager: UndoManager
  constructor() {
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
    }
    const redo = () => {
      for (let i = 0; i < positions.length; i++) {
        this.routeCoordinates.push(positions[i])
      }
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
        iconAnchor: [16, 17]
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

  controlPointMakers() {
    const markers = [this.startMarker()]
    for (let i = 0; i < this.controlPointCoordinates.length; i++) {
      markers.push(controlPointMarker(this.controlPointCoordinates[i]))
    }
    return markers
  }

  drawRoute() {
    if (this.map) {
      if (this.line) this.map.removeLayer(this.line)
      this.addControlPointMarkers()
      this.line = L.polyline(this.latLngs, {color: "rgba(250,0,0,0.5)"})
      this.line.addTo(this.map)
    }
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


function controlPointMarker (coord: number[]) {
  const controlPointIcon: L.IconOptions = {
    iconUrl: "controlpoint.png",
    iconSize: [32,32]
  };
  return new L.Marker([coord[1], coord[0]], {
    icon: L.icon(controlPointIcon),
    draggable: true,
  });
}
