import toGeoJSON from "./_togeojson"
import type { FeatureCollection, Geometry, Feature, Position, LineString, GeometryObject, GeometryCollection } from "geojson"

export default function (gpx: XMLDocument) {
  const g = toGeoJSON.gpx(gpx) as FeatureCollection
  const controlPointCoordinates = g.features
    .filter((f) => f?.geometry?.type === "Point")
    .map((p) => {
      if (p.geometry.type === "Point") {
        const gc = p.geometry
        return gc.coordinates 
      } else {
        throw new Error("??????")
      }
    })
  const lineString = g.features.filter((f) => f?.geometry?.type === "LineString")?.[0] as Feature<LineString>
  if (!controlPointCoordinates.length) {
    controlPointCoordinates[0] = lineString.geometry.coordinates[0]
    controlPointCoordinates[1] = lineString.geometry.coordinates[lineString.geometry.coordinates.length - 1]
  }
  g.features = []
  const controlPoints: Feature = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "MultiPoint",
      coordinates: controlPointCoordinates,
    },
  };

  g.features[0] = lineString
  g.features[1] = controlPoints
  if (!g.features[0]) throw new Error("No LineString found")
  return g;
}

