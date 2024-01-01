// Elevation API
interface Point {
  latitude: number
  longitude: number
}

interface ResultPoint extends Point {
  elevation: number
}

interface ReactiveStats {
  totalDistance: string
  running: boolean
  currentElevation?: string
  deviation?: string
  speed?: string
}

declare interface Window {
  delete_modal: any;
  save_modal: any;
  upload_modal: any;
  error_modal: any;
  layers_modal: any;
}

type Server = "osm" | "cyclosm" | "satellite"

type DirectionsProfile = "mapbox/driving-traffic" | "mapbox/driving" | "mapbox/walking" | "mapbox/cycling"

declare module 'togpx';
