<script setup lang="ts">
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

  const theMap = ref<Map | undefined>()
  const error = ref<string | undefined>()
  const tiles = new Tiles()
  const osrm = new OSRM()
  const route = new Route(osrm)
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
  })
</script>

<template>
  <div class="flex">
    <MapControls :setTool="setTool" :tools="tools"/>
    <div ref="theMapContainer" class="h-[100vh] w-full z-0" :style="tools[<'route'>currentTool].cursor"></div>
    <DeleteModal :route="route"/>
    <SaveModal :route="route"/>
    <UploadModal :route="route" :setError="setError"/>
    <LayersModal :tiles="tiles"/>
    <ErrorModal :error="error"/>
  </div>
</template>

