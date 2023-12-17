<script setup lang="ts">
  import Map from "@/components/map.vue"
</script>

<template>
  <ClientOnly fallback-tag="span" fallback="Loading map...">
    <Map/>
  </ClientOnly>
</template>
