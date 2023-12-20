import Route from "./route"
class ControlPointMarker {
  route: Route
  coord: number[]
  index: number
  constructor(route: Route, coord: number[], index: number) {
    this.route = route
    this.coord = coord
    this.index = index
  }

  get controlPointCoordinateIndexes() {
    return this.route.controlPointCoordinateIndexes
  }
}
