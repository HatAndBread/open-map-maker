<script setup lang="ts">
  import downloadFile from "@/lib/download-file";
  import Route from "@/lib/route"
  const props = defineProps<{
    route: Route
  }>()
  const defaultFileName = "open-map-maker-route"
  const fileName = ref(defaultFileName)
  const shouldRemoveControlPoints = ref(false)
  const save = () => {
    downloadFile(fileName.value || defaultFileName, props.route.toGPX(shouldRemoveControlPoints.value), "gpx")
  }
  const changeFileName = (e: Event) => {
    const target = e.target as HTMLInputElement
    fileName.value = target.value
  }

  const handleControlPointChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    shouldRemoveControlPoints.value = target.checked
  }
</script>

<template>
  <dialog id="save_modal" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Export as GPX file</h3>
      <input type="text" placeholder="Enter a file name" class="w-full max-w-xs mt-4 input input-bordered input-secondary" @change="changeFileName"/>
      <div class="form-control w-fit">
        <label class="mt-4 cursor-pointer label">
          <span class="mr-4 label-text">Remove Control Points</span> 
          <input type="checkbox" class="checkbox checkbox-primary" @change="handleControlPointChange"/>
        </label>
      </div>

      <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button class="mr-4 btn">Cancel</button>
          <button class="btn bg-primary" @click="save">Save</button>
        </form>
      </div>
    </div>
  </dialog>
</template>
