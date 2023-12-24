import toGeoJSON from "./_togeojson"
import type { FeatureCollection, Geometry, Feature, Position, LineString, GeometryObject, GeometryCollection } from "geojson"

export default function (gpx: XMLDocument) {
  const g = toGeoJSON.gpx(gpx) as FeatureCollection
  //@ts-ignore
  const controlPointCoordinates = g.features.filter((f) => f?.geometry?.type === "Point").map((p) => p.geometry.coordinates)
  const lineString = g.features.filter((f) => f?.geometry?.type === "LineString")?.[0]
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
  return g;
}

