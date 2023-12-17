<script setup lang="ts">
  import {tools} from "./tools"
  import OSRM from "@/lib/osrm"
  import Route from "@/lib/route";
  import GeoLocation from "@/lib/geolocation"
  import googleMaps from "@/lib/google-maps"
  import elevation from "~/lib/elevation";
  import L, {type LeafletMouseEvent, Map, Polyline} from "leaflet";
  import 'leaflet/dist/leaflet.css';
  import MapControls from "@/components/map-controls.vue"

  const theMap = ref<Map | undefined>()
  const route = new Route()
  let geo: GeoLocation
  const theMapContainer: Ref<HTMLDivElement | undefined> = ref<HTMLDivElement>()
  const theLine = ref<Polyline | undefined>()
  const currentTool = ref("route")
  const osrm = ref(new OSRM())

  const setTool = (t: string) => currentTool.value = t

  const nonLocationClickFuncs = {
    undo: () => route.undo(),
    redo: () => route.redo(),
    open: () => {},
    save: () => {}
  }

  const locationClickFuncs = {
    route: async (e: LeafletMouseEvent) => {
      const newPoint = [e.latlng.lng, e.latlng.lat];
      route.addControlPoint(newPoint)
      const l = route.controlPointCoordinates.length
      if (l > 1) {
        const lastPoint = route.controlPoints.geometry.coordinates[l - 2]
        const result = await osrm.value.routeBetweenPoints([lastPoint, newPoint])
        if (result) {
          //const els = await elevation.fetch(result)
          //for (let i = 0; i < els.length; i++) {
          //  result[i][2] = els[i].elevation
          //}

          route.addCoordinates(result)

          route.drawRoute()
        }
      } else {
        route.addControlPointMarkers()
      }
    },
    controlPoint: (e: LeafletMouseEvent) => {},
    streetView: (e: LeafletMouseEvent) => {
      googleMaps.goto(e)
    },
    weather: (e: LeafletMouseEvent) => {}
  }

  watch(currentTool, (newTool, oldTool) => {
    console.log(`${oldTool} --> ${newTool}`)
    if(Object.keys(nonLocationClickFuncs).includes(newTool)) {
      nonLocationClickFuncs[<"undo">newTool]()
      setTool(oldTool);
    }
  })

  onMounted(() => {
    if (!theMapContainer.value) return;

    const map = L.map(theMapContainer.value).setView(GeoLocation.lastKnownLatLng || [51.505, -0.09], 16);
    route.map = map
    theMap.value = map;

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    map.on("click", (e) => {
      if (Object.keys(locationClickFuncs).includes(currentTool.value)) {
        locationClickFuncs[<"route">currentTool.value](e)
      }
    })
    geo = new GeoLocation(map)
    geo.watchLocation()
  })
</script>

<template>
  <div class="flex">
    <MapControls :setTool="setTool" :tools="tools"/>
    <div ref="theMapContainer" class="h-[90vh] w-full z-0" :style="tools[<'route'>currentTool].cursor"></div>
  </div>
</template>

