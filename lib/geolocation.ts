import L from "leaflet"

const html = (strings: TemplateStringsArray, ...values: any) => String.raw({ raw: strings }, ...values);

export default class GeoLocation {
  map: L.Map;
  _icon: L.DivIcon;
  icon: L.Marker;
  id: string;
  iconElement: HTMLSpanElement
  #started = false;

  constructor(map: L.Map) {
    this.map = map;
    this.id = `${Math.floor(Math.random() * 100000)}`
    this._icon = L.divIcon({ className: "", html: this.#iconHTML });
    this.icon = L.marker([0, 0], {
      icon: this._icon,
      interactive: false,
    }).addTo(map);
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
