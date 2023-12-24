<script setup lang="ts">
  import downloadFile from "@/lib/download-file";
  import Route from "@/lib/route"
  const props = defineProps<{
    route: Route
  }>()
  const save = () => {
    downloadFile("openmapmakerroute", props.route.toGPX(), "gpx")
  }

</script>

<template>
  <dialog id="save_modal" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Export as GPX file</h3>
      <p class="mt-4">
        GPX files can be uploaded to your GPS tracking device.
      </p>

      <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button class="mr-4 btn">Cancel</button>
          <button class="btn bg-success" @click="save">Save</button>
        </form>
      </div>
    </div>
  </dialog>
</template>
