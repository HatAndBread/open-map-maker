import {post} from "@/lib/requests";

const BASE_URL = "https://api.open-elevation.com/api/v1/lookup"

function transformLngLats(lngLats: number[][]) {
  const obj: {locations: Point[]} = {locations: []}
  for (let i = 0; i < lngLats.length; i++) {
    obj.locations.push({
      longitude: lngLats[i][0],
      latitude: lngLats[i][1]
    })
  }
  return obj;
}

const elevation = {
  async fetch(lngLats: number[][]) {
    const {results} = await post(BASE_URL, transformLngLats(lngLats))
    return <ResultPoint[]>results
  }
}

export default elevation;
