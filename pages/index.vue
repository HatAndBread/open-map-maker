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
    <div id="learn-more" class="flex flex-col items-center w-full mt-[44px] gap-2">
      <section class="flex flex-col items-center">
        <h2 class="text-4xl font-semibold">
          What is a GPX file?
        </h2>
      </section>
      <div class="divider"></div> 
      <section class="flex flex-col items-center">
        <h2 class="text-4xl font-semibold">
          Attribution
        </h2>
        <p class="p-6 text-lg max-w-[900px]">
          A number of different open source software projects make Open Map Maker possible.
        </p>
      </section>
    </div>
  </div>
</template>

