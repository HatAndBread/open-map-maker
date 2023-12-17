<script setup lang="ts">
  const {fontSize} = defineProps(["fontSize"])
  const isDark = ref(JSON.parse(localStorage.getItem("isdark") as string))

  const handleChange = () => {
    if (isDark.value) {
      //@ts-ignore
      localStorage.removeItem("isdark")
      isDark.value = null
    } else {
      localStorage.setItem("isdark", "1")
      isDark.value = "1"
    }
  }
</script>

<template>
  

<label class="justify-start swap swap-rotate">
  <input type="checkbox" class="theme-controller" value="myDark" :checked="isDark" @change="handleChange"/>
  <span class="justify-start material-icons-outlined swap-off" :style="fontSize">dark_mode</span>
  <span class="justify-start material-icons-outlined swap-on" :style="fontSize">light_mode</span>
</label>
</template>
