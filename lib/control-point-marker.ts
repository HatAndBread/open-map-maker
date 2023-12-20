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
  lastPreview: L.Polyline | undefined
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
      const {coordinates} = await this.fetchCoords(e.latlng)
      if (coordinates && this.map) {
        if (this.lastPreview) {
          this.lastPreview.remove()
          const preview = L.polyline(coordinatesToLatLngs(coordinates), { color: "rgba(100,0,200,0.3)" })
          this.lastPreview = preview;
          this.lastPreview.addTo(this.map)
        } else {
          this.lastPreview = L.polyline(coordinatesToLatLngs(coordinates), { color: "rgba(100,0,200,0.3)" })
          this.lastPreview.addTo(this.map)
        }
      }
    }, 500)
    
    this.leafletMarker.on("drag", handleDrag)
    
    this.leafletMarker.on("dragend", async (e) => {
      const droppedLatLng = e.target.getLatLng()
      if (this.routeCoordinates.length === 1) {
        this.controlPointCoordinates[0] = [droppedLatLng.lng, droppedLatLng.lat] 
        this.route.drawRoute()
        return;
      }
      const {coordinates, previous, next, currentCoords} = await this.fetchCoords(droppedLatLng);

      let x = true;
      [200, 500, 1000, 1500].forEach((n) => {
        setTimeout(() => {
          if (this.lastPreview && x) {
            x = false
            this.lastPreview.remove()
          }
        }, n)
      })
      if (this.lastPreview) this.lastPreview.remove()
      if (!coordinates) return

      let start: number
      let end: number
      if (next && previous) {
        const segmentToCut = [previous, next].map((x) => {
          return this.routeCoordinates
            .map((y, i) => y[0] === x[0] && y[1] === x[1] ? i : null)
            .filter((x) => typeof x === "number")
        }) as number[][]
        start = segmentToCut[0][0] || 1
        end = segmentToCut[1].find((s) => s > segmentToCut[0][0]) as number
      } else if (previous) {
        start = this.routeCoordinates.findIndex((x) => x[0] === previous[0] && x[1] === previous[1])
        end = Infinity
      } else if (next) {
        this.routeCoordinates.shift()
        start = 0
        end = this.routeCoordinates.findIndex((x) => x[0] === next[0] && x[1] === next[1])
      } else {
        return
      }
      if (typeof start === "number" && typeof end === "number") {
        this.routeCoordinates.splice(start, end - start, ...coordinates)
        this.controlPointCoordinates[this.index] = currentCoords
        this.route.drawRoute()
      }
    })
  }

  async fetchCoords(latlng: L.LatLng) {
    const previous = this.controlPointCoordinates[this.index - 1]
    const next = this.controlPointCoordinates[this.index + 1]
    const newCoords = [latlng.lng, latlng.lat]
    const points = [previous, newCoords, next].filter(Boolean)
    const coordinates = await this.route.osrm.routeBetweenPoints(points) as Position[]
    const currentCoords = nearestPoint(newCoords, featureCollection(coordinates.map((c) => turfPoint(c)))).geometry.coordinates
    return {coordinates, previous, next, currentCoords}
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
}

function coordinatesToLatLngs(coordinates: number[][]) {
  return coordinates.map((p) => [p[1], p[0]]) as L.LatLngExpression[]
}
