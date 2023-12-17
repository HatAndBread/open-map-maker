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
    console.log(this.#iconHTML(0))
    this._icon = L.divIcon({ className: "", html: this.#iconHTML(0) });
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
      { enableHightAccuracy: true };
  }

  #iconHTML(degree: number) {
    return html`
      <span class="relative flex w-[22px] h-[22px]" id="${this.id}">
        <span
          class="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary"
        ></span>
        <span
          class="relative inline-flex w-[22px] h-[22px] rounded-full text-3xl justify-center items-center text-neutral"
          >➣
        </span>
      </span>
    `;
  }
}
