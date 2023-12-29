import type Ref from "vue"
import Route from "./route"
import L from "leaflet"
import round from "lodash.round"
import distance from "@turf/distance"

const html = (strings: TemplateStringsArray, ...values: any) => String.raw({ raw: strings }, ...values);

export default class GeoLocation {
  route: Route
  map: L.Map;
  _icon: L.DivIcon;
  icon: L.Marker;
  id: string;
  iconElement: HTMLSpanElement
  #started = false;

  constructor(route: Route) {
    this.route = route
    this.map = route.map as L.Map;
    this.id = `${Math.floor(Math.random() * 100000)}`
    this._icon = L.divIcon({ className: "", html: this.#iconHTML });
    this.icon = L.marker([0, 0], {
      icon: this._icon,
      interactive: false,
    }).addTo(this.map);
    this.iconElement = document.getElementById(this.id) as HTMLSpanElement;
    this.setIconRotation(0)
  }

  static get lastKnownLatLng() {
    const lastKnown = localStorage.getItem("lastKnownLatLng");
    if (lastKnown) {
      try {
        return JSON.parse(lastKnown);
      } catch {
        return null;
      }
    }
    return null;
  }

  setIconRotation(rotation: number | null) {
    if (!rotation && (typeof rotation !== "number" || isNaN(rotation))) return
    this.iconElement.style.rotate = `${rotation - 90}deg`
    this.iconElement.style.fontSize = "32px"
    this.iconElement.style.color = "purple"
  }

  watchLocation() {
    navigator.geolocation.watchPosition(
      ({ coords }: GeolocationPosition) => {
        const latLng: L.LatLngExpression = [coords.latitude, coords.longitude];
        if (!this.#started) {
          this.#started = true;
          this.map.setView(latLng, 16);
          this.map.addLayer(this.icon);
        }
        if (this.route.reactiveStats.value.running) {
          this.route.map?.setView(latLng);
          this.route.reactiveStats.value.currentElevation = (coords.altitude ? `${round(coords.altitude, 1)} meters` : undefined)
          const lngLat = [latLng[1], latLng[0]]
          const nearestPointOnLine = distance(lngLat, this.route.nearestPoint(lngLat))
          const x = nearestPointOnLine > 1 ? 1 : 1000
          const unit = x === 1 ? "km" : "meters"
          this.route.reactiveStats.value.deviation = `${round(nearestPointOnLine * x, unit === "km" ? 2 : 0)} ${unit}`
          this.route.reactiveStats.value.speed = `${round(coords.speed || 0 / 1000, 1)} kph`
        }
        localStorage.setItem("lastKnownLatLng", JSON.stringify(latLng));
        this.icon.setLatLng(latLng);
        this.setIconRotation(coords.heading)
      },
      (error) => {}
    ),
      { enableHighAccuracy : true };
  }

  get #iconHTML() {
    return html`
      <span class="relative flex w-[22px] h-[22px]" id="${this.id}">
        <span
          >➣
        </span>
      </span>
    `;
  }
}
