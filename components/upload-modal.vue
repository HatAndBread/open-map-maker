<script setup lang="ts">
  import type { FeatureCollection } from "geojson";
  import Route from "@/lib/route"
  import toGeoJSON from "~/lib/to-geojson";
  const props = defineProps<{
    route: Route
    setError: (t: string) => void
  }>()
  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader()
    reader.onload = function(e) {
      const contents = e.target?.result;
      try {
        const xml = new DOMParser().parseFromString(contents as string, "text/xml")
        const geojson = toGeoJSON(xml) as FeatureCollection
        props.route.geoJSON = geojson
        props.route.drawRoute()
        props.route.goToStart()
        window.upload_modal.close()
      } catch {
          props.setError("There was a problem importing this file. Please make sure it is a valid GPX file.")
          window.error_modal.showModal()
      }
    };
    reader.readAsText(file)
  }

</script>

<template>
  <dialog id="upload_modal" class="modal">
    <div class="modal-box w-fit">
      <p class="pt-4">Select a GPX file to import.</p>
      <form method="dialog">
        <button class="absolute btn btn-sm btn-circle btn-ghost right-2 top-2">✕</button>
      </form>
      <div class="flex justify-start w-full modal-action">
        <input type="file" class="w-full max-w-xs file-input file-input-bordered file-input-primary" :multiple="false" @change="handleChange" accept=".gpx"/>
      </div>
    </div>
  </dialog>
</template>
