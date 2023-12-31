<script setup lang="ts">
  import {tools} from "@/components/tools"
  const jsonld = `
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://open-map-maker.vercel.app/"
      },
      "headline": "What is a GPX file?",
      "description": "Simply put, GPX files are ordinary text files that store geographic coordinates in a standardized format. These files can then be uploaded to GPS devices made by the likes of Garmin, Wahoo, Suunto, or Coros to keep you on track while you ride your bike, run, or go for a hike.",
      "image": "https://open-map-maker.vercel.app/handlebars.png",  
      "author": {
        "@type": "Organization",
        "name": "Open Map Maker",
        "url": "https://open-map-maker.vercel.app"
      },  
      "publisher": {
        "@type": "Organization",
        "name": "",
        "logo": {
          "@type": "ImageObject",
          "url": ""
        }
      },
      "datePublished": "2024-01-01",
      "dateModified": "2024-01-01"
    }`

  useHead({
    script: [{type: "application/ld+json", children: jsonld}]
  })
</script>

<template>
  <div>
    <div class="min-h-[calc(100vh-80px)] hero bg-black text-white" :style="{backgroundImage: 'linear-gradient(rgba(50, 50, 190, 0.8), rgba(50, 90, 50, 0.7)), url(/background.png)'}">
      <div class="flex-col hero-content lg:flex-row-reverse">
        <div class="mockup-phone border-primary min-w-[300px] hidden lg:block">
          <div class="camera"></div> 
          <div class="overflow-hidden display">
            <div class="artboard artboard-demo phone-1">
                <img src="/screenshot.png" class="object-cover object-left h-full" />
            </div>
          </div>
        </div>
        <div>
          <h1 class="flex text-5xl font-bold gap-4">
            <span> Open Map Maker </span>
            <img src="/logo.svg" class="w-12 drop-shadow-xl" />
          </h1>
            <p class="py-6 text-lg max-w-[600px]">
              Open Map Maker is a free and open source tool for creating hiking, running, and cycling GPS routes.
              No sign up and no account is necessary. Start <a href="/map" class="link">planning an adventure</a> now.
            </p>
            <div class="flex gap-4">
              <a href="/map" class="text-lg btn btn-primary">MAKE A MAP</a>
              <a href="#learn-more" class="text-lg btn btn-primary">LEARN MORE</a>
            </div>
        </div>
      </div>
    </div>
    <div id="learn-more" class="flex flex-col items-center w-full mt-[44px] gap-2 text-neutral">
      <section class="flex flex-col items-center">
        <h2 class="px-4 text-4xl font-semibold">
          How To Make a Map With Open Map Maker
        </h2>
        <p class="p-6 text-lg max-w-[900px]">
        Open Map Maker allows you to create and edit <a href="#gpx" class="link">GPX files</a> that can then be uploaded to your GPS tracking device.
        If you don't have a GPS device you can use your phone with Open Map Maker in navigation mode. Below is a brief explanation of how to use the toolbar in the map editor.
        <ul class="w-full mt-4 list-inside">
          <div v-for="(obj) in tools">
            <li v-if="!obj.running" class="flex items-center py-2">
              <span class="p-2 rounded shadow-xl material-icons-outlined bg-base-200">{{obj.icon}}</span>
              <span class="ml-2 text-sm">{{obj.explanation}}</span>
            </li>
          </div>
        </ul>
        </p>
      </section>
      <div class="divider"></div> 
      <section class="flex flex-col items-center" id="gpx">
        <h2 class="text-4xl font-semibold">
          What is a GPX file?
        </h2>
        <p class="p-6 text-lg max-w-[900px]">
          Simply put, GPX files are ordinary text files that store geographic coordinates in a standardized format.
          These files can then be uploaded to GPS devices made by the likes of 
          <a href="https://www.garmin.com" class="link" target="_blank">Garmin</a>, 
          <a href="https://www.wahoofitness.com" class="link" target="_blank">Wahoo</a>, 
          <a href="https://www.suunto.com" class="link" target="_blank">Suunto</a>, 
          or 
          <a href="https://coros.com" class="link" target="_blank">Coros</a>
          to keep you on track while you ride your bike, run, or go for a hike. 🚴🏃🥾
        </p>
        

        <div class="drop-shadow-xl carousel rounded-box w-96">
          <div class="w-1/2 carousel-item">
            <img src="/suunto.jpg" class="object-cover w-full" title="Suunto Watch" loading="lazy" alt="A GPS Device"/>
          </div> 
          <div class="w-1/2 carousel-item">
            <img src="/handlebars.png" class="object-cover w-full" title="Garmin Bike GPS" loading="lazy" alt="A GPS Device" />
          </div> 
          <div class="w-1/2 carousel-item" title="Garmin Watch">
            <img src="/garmin.jpg" class="object-cover w-full" loading="lazy" alt="A GPS Device" />
          </div> 
          <div class="w-1/2 carousel-item" title="Wahoo Element Bike Computer">
            <img src="/element.png" class="object-cover w-full" loading="lazy" alt="A GPS Device" />
          </div> 
        </div>
        <p class="mb-4 italic text-small text-[#777]"> A selection of GPS devices</p>

        <p class="px-6 text-lg max-w-[900px]">
          To use a route you created on Open Map Maker simply click on the download button
          <span class="material-icons-outlined">download</span>
          in the toolbar to save the file to your computer or phone.
          You should then be able to send the GPX file to your GPS device through the app
          provider by your device's maker. If you want to edit the file again you can always
          upload the same GPX file back in to Open Map Maker by clicking on the upload button
          <span class="material-icons-outlined">file_open</span>
          in the toolbar.
        </p>

        <p class="p-6 text-lg max-w-[900px]">
        Don't have a dedicated GPS device? No worries! You can use Open Map Maker in navigation mode.
        Simply click the navigation button
        <span class="material-icons-outlined">play_circle</span> in the toolbar and follow your route. For long trecks in remote areas,
        however, it is strongly recommended to use a proper GPS device in order to save your phone's battery and avoid spotty reception.
        </p>
      </section>
      <div class="divider"></div> 
      <section class="flex flex-col items-start">
        <h2 class="w-full text-4xl font-semibold text-center">
          Attribution
        </h2>
        <p class="p-6 text-lg max-w-[900px]">
        Open Map Maker is made possible by a number of different Open Source Projects. If you like Open Map Maker please consider supporting these projects. In no particular order they are:
          <ul class="list-disc list-inside">
            <li class="px-4 py-2"><a href="https://leafletjs.com/" class="link" target="_blank">Leaflet JS</a></li>
            <li class="px-4 py-2"><a href="https://www.cyclosm.org" class="link" target="_blank">CyclOSM</a></li>
            <li class="px-4 py-2"><a href="https://www.openstreetmap.org" class="link" target="_blank">Open Street Map</a></li>
            <li class="px-4 py-2"><a href="https://turfjs.org" class="link" target="_blank">Turf JS</a></li>
            <li class="px-4 py-2"><a href="https://github.com/slutske22/leaflet-topography" class="link" target="_blank">Leaflet Topography</a></li>
          </ul>
        </p>
      </section>
      <footer class="items-center p-4 footer bg-neutral text-neutral-content mt-[64px]">
        <aside class="items-center grid-flow-col">
          <img src="/logo.svg"  class="w-8"/>
          <p>Copyright © 2023-{{new Date().getFullYear() }} - All right reserved</p>
        </aside> 
        <nav class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
          <a href="https://github.com/HatAndBread/open-map-maker" target="_blank">
            <img src="/github.svg" class="w-8"/>
          </a>
        </nav>
      </footer>
    </div>
  </div>
</template>

