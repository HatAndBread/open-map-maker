<script setup lang="ts">
  import ThemeToggle from "./theme-toggle.vue";

  const fontSize = {fontSize: '40px'}
</script>

<template>
  <div class="navbar bg-base-100">
    <div class="flex-1">
    <a class="text-xl btn btn-ghost" href="/">
      <span> Open Map Maker </span>
      <div class="w-8 h-8">
        <img src="@/public/logo.svg"/>
      </div>
    </a>
  </div>

  <div class="flex-none">
    <ul class="px-1 menu menu-horizontal">
      <div class="dropdown dropdown-end z-[1000]">
        <div tabindex="0" role="button" class="btn btn-ghost rounded-btn">
          <span class="material-icons-outlined">menu</span>
        </div>
        <ul tabindex="0" class="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
          <li><a href="/"><span class="material-icons-outlined" :style="fontSize">home</span></a></li> 
          <li><a href="/map"><span class="text-xl material-icons-outlined" :style="fontSize">map</span></a></li> 
          <li><a href="/about"><span class="text-xl material-icons-outlined" :style="fontSize">help</span></a></li> 
          <li>
            <ClientOnly>
              <ThemeToggle :font-size="fontSize" />
            </ClientOnly>
          </li>
        </ul>
      </div>
    </ul>
  </div>
</div>
</template>
