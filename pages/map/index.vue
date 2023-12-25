<script setup lang="ts">
  import Map from "@/components/map.vue"
</script>

<template>
  <ClientOnly fallback-tag="span" fallback="Loading map...">
    <template #fallback>
      <div class="flex flex-col justify-center w-full h-[300px] items-center">
        <span class="loading loading-bars loading-lg bg-success"></span>
        <span class="mt-8 text-success">Loading Map...</span>
      </div>
    </template>
    <Map/>
  </ClientOnly>
</template>
