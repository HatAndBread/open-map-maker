import L from "leaflet"
import { useRuntimeConfig } from "nuxt/app"

const config = useRuntimeConfig()
const localStorageName = "tile-server"

const SERVERS: Server[] = ["osm", "cyclosm", "satellite"]

export default class {
  currentServer: Server;
  tileLayer?: L.TileLayer
    constructor() {
      const storedServer = localStorage.getItem(localStorageName) as Server
      if (SERVERS.includes(storedServer)) {
        this.currentServer = storedServer
      } else {
        this.currentServer = "cyclosm"
      }
    }
    updateMapTiles(server: Server) {
      this.currentServer = server
      localStorage.setItem(localStorageName, server)
      if (this.tileLayer) {
        this.tileLayer.setUrl(this.currentServerUrl)
      } else {
        this.tileLayer = L.tileLayer(this.currentServerUrl, {
          attribution: this.attribution
        });
      }
      return this.tileLayer as L.TileLayer
    }
    get currentServerUrl() {
      switch(this.currentServer) {
        case "cyclosm": return this.cyclosm
        case "satellite": return this.satellite
        default: return this.osm
      }
    }
    get attribution() {
      switch(this.currentServer) {
        case "cyclosm": `&copy; <a href="https://www.cyclosm.org">CyclOSM</a> contributors`
        case "satellite": `&copy; <a href="https://www.mapbox.com">Mapbox</a> contributors`
        default: return `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`
      }
    }
    get servers(): Server[] {return ["cyclosm", "osm", "satellite"]}
    get osm() {return "https://tile.openstreetmap.org/{z}/{x}/{y}.png"}
    get cyclosm() {return `https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png`}
    get satellite() {return `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${config.public.mapboxKey}`}
  }


