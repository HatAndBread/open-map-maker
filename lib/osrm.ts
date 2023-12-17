import type { LineString } from "geojson"
import { useRuntimeConfig } from "nuxt/app"
const baseUrl = "https://api.mapbox.com/directions/v5"
const config = useRuntimeConfig()

export default class OSRM {
  currentProfile: "mapbox/driving-traffic" | "mapbox/driving" | "mapbox/walking" | "mapbox/cycling"
  constructor() {
    this.currentProfile = "mapbox/walking"
  }

  async fetch(url: string) {
      const result = await window.fetch(url)
      const data = await result.json()
      return data;
  }

  async routeBetweenPoints(points: [number[], number[]]) {
    const lngLat = `${points[0][0]},${points[0][1]};${points[1][0]},${points[1][1]}?overview=full&geometries=geojson&access_token=${config.public.mapboxKey}`
    const url = `${baseUrl}/${this.currentProfile}/${lngLat}`
    try {
      const result = await this.fetch(url)
      console.log(result)
      const lineString = result.routes[0].geometry as LineString
      return lineString.coordinates;
    } catch(e) {
      console.log(e)
    }
  }
}
