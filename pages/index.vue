<template>
  <div>
    <div class="min-h-[calc(100vh-80px)] hero bg-black text-white" :style="{backgroundImage: 'linear-gradient(rgba(103, 232, 249, 0.9), rgba(216, 180, 254, 0.7)), url(/background.png)'}">
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
              Open Map Maker is a free and open source tool for creating GPX files.
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
            <img src="/suunto.jpg" class="object-cover w-full" title="Suunto Watch"/>
          </div> 
          <div class="w-1/2 carousel-item">
            <img src="/handlebars.webp" class="object-cover w-full" title="Garmin Bike GPS" />
          </div> 
          <div class="w-1/2 carousel-item" title="Garmin Watch">
            <img src="/garmin.jpg" class="object-cover w-full" />
          </div> 
          <div class="w-1/2 carousel-item" title="Wahoo Element Bike Computer">
            <img src="/element.webp" class="object-cover w-full" />
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
            <li class="px-4 py-2"><a href="https://leafletjs.com/" class="link">Leaflet JS</a></li>
            <li class="px-4 py-2"><a href="https://www.openstreetmap.org" class="link">Open Street Map</a></li>
            <li class="px-4 py-2"><a href="https://turfjs.org" class="link">Turf JS</a></li>
            <li class="px-4 py-2"><a href="https://github.com/slutske22/leaflet-topography" class="link">Leaflet Topography</a></li>
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

