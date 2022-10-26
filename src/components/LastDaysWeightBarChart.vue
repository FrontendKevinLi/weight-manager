<template>
  <div class="last-days-weight-bar-chart-wrapper">
    <div
      ref="barChartRef"
      class="last-days-weight-bar-chart-chart"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue'
import * as echarts from 'echarts'

type WeightItem = {
  date: string,
  weight: number
}

type ChartData = {
  xAxisData: WeightItem['date'][],
  seriesData: { value: number, itemStyle: { color: string } }[]
}

function generateWeightList(): WeightItem[] {
  const generatedWeightList: WeightItem[] = []
  for (let i = 7; i > -1; i -= 1) {
    const newDate = new Date()
    newDate.setTime(new Date().getTime() - (1000 * 60 * 60 * 24) * i)

    const generatedWeightItem: WeightItem = {
      date: newDate.toLocaleDateString(),
      weight: parseFloat((Math.random() * 2 + 70).toPrecision(3)),
    }
    generatedWeightList.push(generatedWeightItem)
  }

  return generatedWeightList
}

function getMinAndMaxWeight(weightListParam: WeightItem[]): [number, number] {
  let min = Number.MAX_SAFE_INTEGER
  let max = Number.MIN_SAFE_INTEGER

  weightListParam.forEach((weightItem) => {
    min = Math.min(min, weightItem.weight)
    max = Math.max(max, weightItem.weight)
  })

  return [min, max]
}

function getBarColor(weightParam: number, minWeightParam: number, maxWeightParam: number): string {
  if (weightParam === minWeightParam) return '#c3cfe2'
  if (weightParam === maxWeightParam) return '#003584'
  return '#6a92c8'
}

function transformToChartData(weightListParam: WeightItem[], minWeightParam: number, maxWeightParam: number): ChartData {
  const chartData: ChartData = {
    seriesData: [],
    xAxisData: [],
  }

  weightListParam.forEach((weight) => {
    chartData.xAxisData.push(weight.date)
    chartData.seriesData.push({
      value: weight.weight,
      itemStyle: {
        color: getBarColor(weight.weight, minWeightParam, maxWeightParam),
      },
    })
  })

  return chartData
}

function initChart(barChartRefParam: Ref<HTMLElement | undefined>, weightList: WeightItem[]): void {
  if (!barChartRefParam.value) {
    console.error('Chart init failed. DOM element does not exits.')
    return
  }

  const barChart: echarts.ECharts = echarts.init(barChartRefParam.value)

  const [minWeight, maxWeight] = getMinAndMaxWeight(weightList)

  const chartData: ChartData = transformToChartData(weightList, minWeight, maxWeight)

  barChart.setOption({
    title: {
      show: true,
      text: 'Last Days',
      left: '0',
      textStyle: {
        color: '#1f3c54',
      },
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
      scale: true,
      min: minWeight - 1,
    },
    series: [{
      data: chartData.seriesData,
      itemStyle: {
        borderRadius: 10,
        shadowColor: '#c3cfe2',
        shadowBlur: 4,
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

const barChartRef = ref<HTMLElement>()
let weightList: WeightItem[] = []

onMounted(() => {
  // To be requested
  weightList = generateWeightList()
  initChart(barChartRef, weightList)
})

</script>

<style lang="scss" scoped>
.last-days-weight-bar-chart-wrapper {
  $size: 100%;

  box-sizing: border-box;
  display: grid;
  width: $size;
  height: $size;
}

</style>
