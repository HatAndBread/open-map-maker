<script setup lang="ts">
  import Route from "@/lib/route"
  const props = defineProps<{
    route: Route
  }>()
  const clearRoute = () => props.route.clear()

</script>

<template>
  <dialog id="delete_modal" class="modal">
    <div class="modal-box">
      <div role="alert" class="alert alert-warning">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <span>Warning: Are you sure you want to clear this map?</span>
      </div>
      <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button class="mr-4 btn">Cancel</button>
          <button class="btn" @click="clearRoute">Delete
          </button>
        </form>
      </div>
    </div>
  </dialog>
</template>
