<template>
  <div class="mt-[88px] lg:mt-0 lg:min-h-[calc(100vh-80px)] hero bg-base-100">
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
          <img src="/logo.svg" class="w-12" />
        </h1>
          <p class="py-6 text-lg max-w-[600px]">
            Open Map Maker is a free and open source tool for creating GPX files for uploading to your GPS device.
            No sign up and no account necessary. Start making adventures now.
          </p>
        <a href="/map" class="text-lg btn btn-primary">MAKE A MAP</a>
      </div>
    </div>
  </div>
</template>

