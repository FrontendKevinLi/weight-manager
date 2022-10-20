<template>
  <div class="weighting-difference-bar-chart-wrapper">
    <div
      ref="barChartRef"
      class="weighting-difference-bar-chart"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

type WeightingDifference = {
  date: string,
  weight: number
}

type ChartData = {
  xAxisData: WeightingDifference['date'][],
  seriesData: { value: number, itemStyle: { color: string } }[]
}

const barChartRef = ref<HTMLElement>()

// To be requested
const weightingDifferenceList: WeightingDifference[] = [
  {
    date: '2022-10-13',
    weight: 0.5,
  },
  {
    date: '2022-10-14',
    weight: -0.4,
  },
  {
    date: '2022-10-15',
    weight: 0.3,
  },
  {
    date: '2022-10-16',
    weight: 0.9,
  },
  {
    date: '2022-10-17',
    weight: -0.3,
  },
  {
    date: '2022-10-18',
    weight: 0.6,
  },
  {
    date: '2022-10-19',
    weight: -0.2,
  },
]

function getBarColor(weightDifference: number): string {
  if (weightDifference < 0) return '#d86860'
  if (weightDifference > 0) return '#6cca93'
  return '#6d6e6f'
}

function transformToChartData(weightingDifferenceListToTransform: WeightingDifference[]): ChartData {
  const chartData: ChartData = {
    seriesData: [],
    xAxisData: [],
  }
  weightingDifferenceList.forEach((weightingDifference) => {
    chartData.xAxisData.push(weightingDifference.date)
    chartData.seriesData.push({
      value: weightingDifference.weight,
      itemStyle: {
        color: getBarColor(weightingDifference.weight),
      },
    })
  })

  return chartData
}

function initChart(): void {
  if (!barChartRef.value) {
    console.error('Chart init failed. DOM element does not exits.')
    return
  }

  const barChart: echarts.ECharts = echarts.init(barChartRef.value)

  const chartData: ChartData = transformToChartData(weightingDifferenceList)

  barChart.setOption({
    title: {
      show: true,
      text: 'Last Days',
      left: 'center',
    },
    tooltip: {},
    legend: {},
    xAxis: {
      type: 'category',
      data: chartData.xAxisData,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [{
      data: chartData.seriesData,
      itemStyle: {
        borderRadius: 10,
      },
      type: 'bar',
    }],
    grid: {
      // top: '0',
      left: '0',
      right: '0',
    },
  })

  window.addEventListener('resize', () => {
    barChart.resize()
  })
}
onMounted(() => {
  initChart()
})

</script>

<style lang="scss" scoped>
.weighting-difference-bar-chart-wrapper {
  $size: 100%;

  width: $size;
  height: $size;
}

.weighting-difference-bar-chart {
  $size: 100%;

  width: $size;
  height: $size;
}
</style>
