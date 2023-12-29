<script setup lang="ts">
  import {type Tools} from "./tools"
  const props = defineProps<{
    tools: Tools
    setTool: (t: string) => void
    reactiveStats: ReactiveStats
  }>()
</script>

<template>
  <div class="drawer md:drawer-open w-fit">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="flex flex-col items-center justify-center drawer-content">
      <label for="my-drawer-2" class="relative h-full p-0 rounded-none btn drawer-button md:hidden">
        <div class="relative w-full p-0 tooltip tooltip-right">
          <span class="material-icons-outlined">
            keyboard_double_arrow_right
        </span>
        </div>
      </label>
    </div> 
    <div class="overflow-visible drawer-side z-[99999]">
      <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label> 
      <ul class="min-h-full p-4 menu w-[80px] bg-base-200 text-base-content">
        <div v-for="(v, k, i) in tools">
          <li class="" v-if="reactiveStats.running ? v.running : !v.running">
            <div class="relative w-full p-0 tooltip tooltip-right" :data-tip="v.tip">
              <button @click="setTool(k)" class="w-full">
                <span class="material-icons-outlined" :style="{fontSize: '40px'}">
                  {{v.icon}}
                </span>
              </button>
            </div>
          </li>
        </div>
      </ul>
    </div>
  </div>
</template>
