<script setup lang="ts">
  import { Chart } from 'chart.js/auto';
  import Route from "@/lib/route"

  const props = defineProps<{
    route: Route
  }>()
  const canvasRef: Ref<undefined | HTMLCanvasElement> = ref()
  onMounted(() => {
    if (!canvasRef.value) return
    const ctx = canvasRef.value.getContext("2d");
    const gradient = ctx?.createLinearGradient(0, 0, 0, 100);
    Chart.defaults.color = "#aaa"
    Chart.defaults.backgroundColor = gradient || "#22c55e"
    gradient?.addColorStop(0.1, "#f43f5e");
    gradient?.addColorStop(0.7, "#22c55e");
    gradient?.addColorStop(1, "#22d3ee");
    const route =   (props.route.length > 5000) ? props.route.filter((_, idx) => idx % 1000 === 0)
                  : (props.route.length > 1000) ? props.route.filter((_, idx) => idx % 100 === 0)
                  : (props.route.length > 200)  ? props.route.filter((_, idx) => idx % 10 === 0)
                  : props.route;
    props.route.chart = new Chart(canvasRef.value, {
      type: 'line',
      data: {
        labels: route.elevationLabels,
        datasets: [{
          data: route.elevations,
          borderWidth: 1,
          tension: 0.3,
          fill: true,
          borderColor: "#d8b4fe",
          pointBorderColor: "rgba(0,0,0,0)",
          pointBackgroundColor: "rgba(0,0,0,0)",
          pointHitRadius: 60
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            displayColors: false,
            callbacks: {
              label: (context) => `${context.formattedValue} meters`
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              display: false
            }
          },
          y: {
            beginAtZero: false,
            ticks: {
              callback: (v) => v + " m"
            },
            grid: {
            }
          }
        }
      }
    });
  })
</script>

<template>
  <div class="h-[80px] w-full bg-base-100 shadow-xl">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

