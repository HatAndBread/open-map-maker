<script setup lang="ts">
  import { Chart } from 'chart.js/auto';
  import Route from "@/lib/route"

  const props = defineProps<{
    route: Route
  }>()
  const canvasRef: Ref<undefined | HTMLCanvasElement> = ref()
  onMounted(() => {
    if (!canvasRef.value) return
    Chart.defaults.backgroundColor = "#22c55e"
    Chart.defaults.color = "#aaa"
    props.route.chart = new Chart(canvasRef.value, {
      type: 'line',
      data: {
        labels: props.route.elevationLabels,
        datasets: [{
          data: props.route.elevations,
          borderWidth: 1,
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

