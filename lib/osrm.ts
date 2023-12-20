import type { LineString } from "geojson"
import { useRuntimeConfig } from "nuxt/app"
const baseUrl = "https://api.mapbox.com/directions/v5"
const config = useRuntimeConfig()

export default class OSRM {
  currentProfile: "mapbox/driving-traffic" | "mapbox/driving" | "mapbox/walking" | "mapbox/cycling"
  constructor() {
    this.currentProfile = "mapbox/walking"
  }

  get options() {
    return `?overview=full&geometries=geojson&access_token=${config.public.mapboxKey}`
  }

  pointsString(points: number[][]) {
    return points.map((p) => `${p[0]},${p[1]}`).join(";")
  }
  
  async fetch(url: string) {
      const result = await window.fetch(url)
      const data = await result.json()
      return data;
  }

  async routeBetweenPoints(points: number[][]) {
    try {
      const result = await this.fetch(`${baseUrl}/${this.currentProfile}/${this.pointsString(points)}${this.options}`)
      const lineString = result.routes[0].geometry as LineString
      return lineString.coordinates;
    } catch(e) {
      console.error(e)
    }
  }
}
