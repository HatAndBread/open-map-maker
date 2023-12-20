import Route from "./route"
import L from "leaflet"
import throttle from "lodash.throttle"
import min from "lodash.min"
import max from "lodash.max"
import nearestPoint from "@turf/nearest-point"
import {featureCollection, point as turfPoint} from "@turf/helpers"

export default class ControlPointMarker {
  route: Route
  coord: number[]
  index: number
  lastPreview: L.Polyline | undefined
  dragIsFinished: boolean
  leafletMarker: L.Marker

  constructor(route: Route, index: number) {
    this.route = route
    this.coord = route.controlPointCoordinates[index]
    this.index = index
    this.lastPreview = undefined
    this.dragIsFinished = false
    this.leafletMarker = new L.Marker(this.originalLatLng, {
      icon: L.icon(this.#controlPointIcon),
      draggable: true,
    });
    this.addEventListeners()
  }

  addEventListeners() {
    const handleDrag = throttle(async (e) => {
      if (this.dragIsFinished && this.lastPreview) {
        this.lastPreview.remove()
        this.dragIsFinished = false
        return
      }
      const {coordinates} = await this.fetchCoords(e.latlng)
      if (this.dragIsFinished && this.lastPreview) {
        this.lastPreview.remove()
        this.dragIsFinished = false
        return
      }
      if (coordinates && this.map) {
        if (this.lastPreview) this.lastPreview.remove()
        this.lastPreview = L.polyline(coordinatesToLatLngs(coordinates), { color: "rgba(100,0,200,0.3)" })
        this.lastPreview.addTo(this.map)
      }
    }, 500)
    
    this.leafletMarker.on("drag", handleDrag)
    
    this.leafletMarker.on("dragend", async (e) => {
      this.dragIsFinished = true
      const {coordinates, newCoords} = await this.fetchCoords(e.target.getLatLng())
      if (this.lastPreview) this.lastPreview.remove()
      if (!coordinates) return

      const point = this.controlPointCoordinateIndexes[this.index]
      console.log(`POINT: ${point}`)

      const newControlPointCoords = nearestPoint(newCoords, featureCollection(coordinates.map((c) => turfPoint(c)))).geometry.coordinates
      this.controlPointCoordinates[this.index] = newControlPointCoords
      const newControlPointIndex = coordinates.findIndex((c) => c[0] === newControlPointCoords[0] && c[1] === newControlPointCoords[1])
      const newDifference = newControlPointIndex + this.currentIndex[0] - this.currentIndex[1]
      console.log(`New Difference: ${newDifference}`)
      this.updateControlPointCoordinateIndexes(newDifference)

      const numberOfPlacesToRemove = !point[2] ? point[1] : point[2] - point[0]
      const placeToStartRemoving = point[0] + 1
      console.log(JSON.stringify(this.routeCoordinates))
      console.log(`Removal Start Point: ${placeToStartRemoving}, Number of Places to Remove: ${numberOfPlacesToRemove}, New Coordinates: ${coordinates}`)
      this.routeCoordinates.splice(placeToStartRemoving, numberOfPlacesToRemove, ...coordinates)
      console.log(JSON.stringify(this.routeCoordinates))
      this.route.drawRoute()
    })
  }

  indexAt(index: number) {
    return this.controlPointCoordinateIndexes[index]
  }

  get currentIndex() {return this.controlPointCoordinateIndexes[this.index]}

  updateControlPointCoordinateIndexes(newDifference: number) {
    this.indexAt(this.index)[1] += newDifference
    if (this.indexAt(this.index)[2]) this.indexAt(this.index)[2] += newDifference
    if (this.indexAt(this.index - 1)) {
      this.indexAt(this.index - 1)[2] = this.indexAt(this.index - 1)[2] += newDifference
    }
    for (let i = this.index + 1; i < this.controlPointCoordinateIndexes.length; i++) {
      for (let j = 0; j < this.indexAt(i).length; j++) {
        if (this.indexAt(i)[j]) this.indexAt(i)[j] += newDifference
      }
    }
  }

  async fetchCoords(latlng: L.LatLng) {
    const previous = this.controlPointCoordinates[this.index - 1]
    const next = this.controlPointCoordinates[this.index + 1]
    const newCoords = [latlng.lng, latlng.lat]
    const points = [previous, newCoords, next].filter(Boolean)
    const coordinates = await this.route.osrm.routeBetweenPoints(points)
    return {coordinates, previous, next, newCoords}
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
  get controlPointCoordinateIndexes() { return this.route.controlPointCoordinateIndexes }
}

function coordinatesToLatLngs(coordinates: number[][]) {
  return coordinates.map((p) => [p[1], p[0]]) as L.LatLngExpression[]
}
