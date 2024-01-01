<script setup lang="ts">
  import "regenerator-runtime/runtime";
  import {tools} from "./tools"
  import OSRM from "@/lib/osrm"
  import Route from "@/lib/route";
  import GeoLocation from "@/lib/geolocation"
  import googleMaps from "@/lib/google-maps"
  import downloadFile from "@/lib/download-file"
  import elevation from "@/lib/elevation";
  import Tiles from "@/lib/tiles"
  import L, {type LeafletMouseEvent, Map, Polyline} from "leaflet";
  import 'leaflet/dist/leaflet.css';
  import MapControls from "@/components/map-controls.vue"
  import DeleteModal from "@/components/delete-modal.vue"
  import SaveModal from "@/components/save-modal.vue"
  import UploadModal from "@/components/upload-modal.vue"
  import ErrorModal from "@/components/error-modal.vue"
  import LayersModal from "@/components/layers-modal.vue"
  import ElevationDisplay from "@/components/elevation-display.vue";

  const reactiveStats = ref<ReactiveStats>({totalDistance: "0 km", running: false} as ReactiveStats);
  const theMap = ref<Map | undefined>()
  const error = ref<string | undefined>()
  const directionsProfile = ref<DirectionsProfile>(localStorage.getItem("directions-profile") as DirectionsProfile || "mapbox/walking")
  const tiles = new Tiles()
  const osrm = new OSRM(directionsProfile.value)
  const route = new Route(osrm, reactiveStats)
  let geo: GeoLocation
  const theMapContainer: Ref<HTMLDivElement | undefined> = ref<HTMLDivElement>()
  const theLine = ref<Polyline | undefined>()
  const currentTool = ref("route")

  const setTool = (t: string) => currentTool.value = t
  const setError = (t: string) => error.value = t

  const nonLocationClickFuncs = {
    undo: () => route.undo(),
    redo: () => route.redo(),
    myLocation: () => geo.watchLocation(),
    edit: () => {
      const reply = confirm("Are you sure you want to start editing this route?")
      if (!reply) return
      reactiveStats.value.running = false
      route.resetRunningGeoJSON()
      route.drawRunningLine()
      route.toggleControlPoints()
    },
    run: () => { 
      if (route.canBeDrawn) {
        route.resetRunningGeoJSON()
        reactiveStats.value.running = true
        route.toggleControlPoints()
        geo.watchLocation()
      } else {
        error.value = "You must add a route first."
        window.error_modal.showModal()
      }
    },
    save: () => window.save_modal.showModal(),
    open: () => window.upload_modal.showModal(),
    layers: () => window.layers_modal.showModal(),
    delete: () => window.delete_modal.showModal()
  }

  const locationClickFuncs = {
    route: (e: LeafletMouseEvent) => route.handleClick(e),
    straightLine: (e: LeafletMouseEvent) => route.handleStraightLine(e),
    controlPoint: (e: LeafletMouseEvent) => route.handleControlPoint(e),
    streetView: (e: LeafletMouseEvent) => googleMaps.goto(e),
  }

  watch(currentTool, (newTool, oldTool) => {
    console.log(`${oldTool} --> ${newTool}`)
    if(Object.keys(nonLocationClickFuncs).includes(newTool)) {
      nonLocationClickFuncs[<"undo">newTool]()
      setTool(oldTool);
    }
  })

  watch(directionsProfile, () => {
    osrm.currentProfile = directionsProfile.value
    console.log("Hi!", osrm.currentProfile)
  })

  watch(error, () => {
    window.error_modal.showModal()
  })

  onMounted(() => {
    if (!theMapContainer.value) return;

    const map = L.map(theMapContainer.value).setView(route.startLatLng || GeoLocation.lastKnownLatLng || [51.505, -0.09], 16);
    route.map = map
    theMap.value = map
    route.addPreview()
    route.drawRoute()

    tiles.updateMapTiles(tiles.currentServer).addTo(map)
    map.on("click", (e) => {
      if (Object.keys(locationClickFuncs).includes(currentTool.value)) {
        if (currentTool.value !== "streetView") map.setView(e.latlng.wrap())
        locationClickFuncs[<"route">currentTool.value](e)
      }
    })
    geo = new GeoLocation(route)
    setTimeout(() => {
      theMapContainer.value?.scrollIntoView({ behavior: "smooth"})
    }, 100)
  })
  const handleDirectionsChange = (e: Event) => {
    const target = e.target as HTMLSelectElement
    target.blur()
    const profile = `mapbox/${target.value}` as DirectionsProfile
    osrm.currentProfile = profile
    localStorage.setItem("directions-profile", profile)
  }
</script>

<template>
  <div class="flex">
    <MapControls :setTool="setTool" :tools="tools" :reactive-stats="reactiveStats" :current-tool="currentTool"/>
    <div class="relative z-0 flex flex-col w-full">
      <div ref="theMapContainer" class="h-[calc(100vh_-_80px)] w-full" :style="tools[<'route'>currentTool].cursor"></div>
      <LazyElevationDisplay :route="route"/>
      <div class="absolute mt-2 mr-2 right-0 z-[999999999] bg-[rgba(50,50,50,0.5)] text-white px-2 pb-2 rounded-md flex flex-col">
        <select class="w-full max-w-xs p-0 select select-ghost" @change="handleDirectionsChange">
          <option value="walking" :selected="directionsProfile === 'mapbox/walking'">Walking</option>
          <option value="cycling" :selected="directionsProfile === 'mapbox/cycling'">Cycling</option>
          <option value="driving" :selected="directionsProfile === 'mapbox/driving'">Driving</option>
        </select>
        <span class="underline">Total Distance</span>
        <span>{{reactiveStats.totalDistance}}</span>
        <span v-if="!reactiveStats.running" class="flex flex-col">
          <span class="underline">Current Tool</span>
          <span class="flex">
            <span class="material-icons-outlined">{{tools[<'route'>currentTool].icon}}</span>
            <span class="capitalize">{{currentTool}}</span>
          </span>
        </span>
        <span v-if="reactiveStats.running" class="flex flex-col">
          <span class="underline">Current Elevation</span>
          <span>{{reactiveStats.currentElevation || "-"}}</span>
          <span class="underline">Speed</span>
          <span>{{reactiveStats.speed || "-"}}</span>
          <span class="underline">Deviation From Route</span>
          <span>{{reactiveStats.deviation || "-"}}</span>
        </span>
      </div>
    </div>
    <DeleteModal :route="route"/>
    <SaveModal :route="route"/>
    <UploadModal :route="route" :setError="setError"/>
    <LayersModal :tiles="tiles"/>
    <ErrorModal :error="error"/>
  </div>
</template>

