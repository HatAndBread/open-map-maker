import Route from "./route"
import L from "leaflet"
import throttle from "lodash.throttle"
import type { Position } from "geojson"
import nearestPoint from "@turf/nearest-point"
import {featureCollection, point as turfPoint} from "@turf/helpers"

export default class ControlPointMarker {
  route: Route
  coord: number[]
  index: number
  dragIsFinished: boolean
  leafletMarker: L.Marker

  constructor(route: Route, index: number) {
    this.route = route
    this.coord = route.controlPointCoordinates[index]
    this.index = index
    this.dragIsFinished = false
    this.leafletMarker = new L.Marker(this.originalLatLng, {
      icon: L.icon(this.#controlPointIcon),
      draggable: true,
    });
    this.addEventListeners()
  }

  addEventListeners() {
    const handleDrag = throttle(async (e) => {
      if (this.routeCoordinates.length === 1) return;
      const {coordinates} = await this.fetchCoords(e.latlng.wrap())
      if (coordinates && this.map && this.preview) {
        this.preview.setLatLngs(coordinatesToLatLngs(coordinates));
      }
    }, 500)
    
    this.leafletMarker.on("drag", handleDrag)
    
    this.leafletMarker.on("dragend", async (e) => {
      const droppedLatLng = e.target.getLatLng().wrap()
      if (this.routeCoordinates.length === 1) {
        this.controlPointCoordinates[0] = [droppedLatLng.lng, droppedLatLng.lat] 
        this.route.drawRoute()
        return;
      }
      const {coordinates, previous, next, currentCoords} = await this.fetchCoords(droppedLatLng);

      this.resetPreview()
      setTimeout(() => this.resetPreview(), 500)
      if (!coordinates || (!next && !previous)) return

      const[start, end] = this.coordinatesToCut(previous, next)
      let sectionToBeRemoved: Position[]
      const originalControlPointCoords = {...this.controlPointCoordinates[this.index]}
      const undo = () => {
        this.routeCoordinates.splice(start, coordinates.length, ...sectionToBeRemoved)
        this.controlPointCoordinates[this.index] = originalControlPointCoords
      }
      const redo = () => {
        sectionToBeRemoved = this.routeCoordinates.splice(start, end - start, ...coordinates)
        this.controlPointCoordinates[this.index] = currentCoords
      }
      this.undoManager.add({undo, redo})
      redo()

      this.route.drawRoute()
    })
  }

  coordinatesToCut(previous: Position, next: Position): [number, number] {
    if (next && previous) return this.middleCut(previous, next)
    if (previous) return this.endCut(previous)
    return this.beginningCut(next)
  }

  beginningCut(next: Position): [number, number] {
    this.routeCoordinates.shift()
    return [0, this.routeCoordinates.findIndex((x) => x[0] === next[0] && x[1] === next[1])]
  }

  endCut(previous: Position): [number, number] {
    return [this.routeCoordinates.findIndex((x) => x[0] === previous[0] && x[1] === previous[1]), Infinity]
  }

  middleCut(previous: Position, next: Position): [number, number] {
    const segmentToCut = [previous, next].map((x) => {
      return this.routeCoordinates
        .map((y, i) => y[0] === x[0] && y[1] === x[1] ? i : null)
        .filter((x) => typeof x === "number")
    }) as number[][]
    const start = segmentToCut[0][0] || 1
    const end = segmentToCut[1].find((s) => s > segmentToCut[0][0]) as number
    return [start, end]
  }

  async fetchCoords(latlng: L.LatLng) {
    const previous = this.controlPointCoordinates[this.index - 1]
    const next = this.controlPointCoordinates[this.index + 1]
    const newCoords = [latlng.lng, latlng.lat]
    const points = [previous, newCoords, next].filter(Boolean)
    const coordinates = await this.route.osrm.routeBetweenPoints(points) as Position[]
    if (previous) coordinates[0] = [previous[0], previous[1]] // ensure there is a corresponding route coord for the control point
    if (next) coordinates.push([next[0], next[1]]) // ensure there is a corresponding route coord for the control point
    this.route.injectElevations(coordinates)
    const currentCoords = nearestPoint(newCoords, featureCollection(coordinates.map((c) => turfPoint(c)))).geometry.coordinates
    return {coordinates, previous, next, currentCoords}
  }

  resetPreview() {
    if (this.preview) this.preview.setLatLngs([])
  }

  get #controlPointIcon() {
    return {
      iconUrl: "controlpoint.png",
      iconSize: [32,32]
    } as L.IconOptions;
  }

  get originalLatLng(): L.LatLngExpression { return [this.coord[1], this.coord[0]] }
  get map() { return this.route.map }
  get routeCoordinates() { return this.route.routeCoordinates }
  get controlPointCoordinates() { return this.route.controlPointCoordinates }
  get preview() { return this.route.preview }
  get undoManager() { return this.route.undoManager }
}

function coordinatesToLatLngs(coordinates: number[][]) {
  return coordinates.map((p) => [p[1], p[0]]) as L.LatLngExpression[]
}
