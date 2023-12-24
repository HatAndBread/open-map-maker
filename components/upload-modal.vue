<script setup lang="ts">
  import type { FeatureCollection } from "geojson";
  import Route from "@/lib/route"
  import toGeoJSON from "~/lib/to-geojson";
  const props = defineProps<{
    route: Route
  }>()
  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader()
    reader.onload = function(e) {
      const contents = e.target?.result;
      if (contents) {
        const xml = new DOMParser().parseFromString(contents as string, "text/xml")
        const geojson = toGeoJSON(xml) as FeatureCollection
        props.route.geoJSON = geojson
        props.route.drawRoute()
        window.upload_modal.close()
      }
    };
    reader.readAsText(file)
  }

</script>

<template>
  <dialog id="upload_modal" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="absolute btn btn-sm btn-circle btn-ghost right-2 top-2">✕</button>
      </form>
      <div class="modal-action">
        <input type="file" class="w-full max-w-xs file-input file-input-bordered file-input-primary" @change="handleChange" accept=".gpx"/>
      </div>
    </div>
  </dialog>
</template>
