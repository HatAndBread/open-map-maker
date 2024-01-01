<script setup lang="ts">
  import Tiles from "@/lib/tiles"
  const props = defineProps<{tiles: Tiles}>()
  const color = ["radio checked:bg-primary", "radio checked:bg-secondary", "radio checked:bg-accent", "radio checked:bg-success", "radio checked:bg-warning", "radio checked:bg-error"]
  const formChange = (e: Event) => {
    const target = e.srcElement as HTMLInputElement
    const server = target.value as Server
    props.tiles.updateMapTiles(server)
  }
</script>

<template>
  <dialog id="layers_modal" class="modal">
    <div class="modal-box max-w-[300px]">
      <h2 class="text-xl font-bold">Select A Map Style</h2>
      <div class="flex flex-col modal-action">
        <form @change="formChange">
          <div class="form-control" v-for="(server, i) in tiles.servers">
            <label class="cursor-pointer label">
              <span class="capitalize label-text">{{server}}</span> 
              <input type="radio" name="radio-10" :class="color[i]" :checked="tiles.currentServer === server" :value="server"/>
            </label>
          </div>
        </form>
        <form method="dialog">
          <button class="w-full mt-8 btn btn-primary">OK</button>
        </form>
      </div>
    </div>
  </dialog>
</template>
