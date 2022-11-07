<template>
  <div class="last-days-weight-bar-chart-wrapper">
    <div
      ref="barChartRef"
      class="bar-chart"
    />
    <div
      v-if="!shouldShowChart && afterFetchRecord"
      class="hint-wrapper"
    >
      <span class="hint">{{ hint }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref, onMounted, Ref, reactive, computed,
} from 'vue'
import * as echarts from 'echarts'
import { DateTime } from 'luxon'
import { getMonthlyRecord } from '@/firebase/firestore'
import { until } from '@open-draft/until'
import { useToast } from 'vue-toastification'
import { MonthlyRecord } from '@/types/records'

type WeightItem = {
  date: string,
  weight: number
}

type ChartData = {
  xAxisData: WeightItem['date'][],
  seriesData: { value: number, itemStyle: { color: string } }[]
}

const shouldFetchLastMonthRecord = DateTime.now().day <= 7
const hint = 'Complete weekly records to show charts!'
const weightList = ref<WeightItem[]>([])

const monthlyRecord = reactive({
  currentMonthRecord: {} as MonthlyRecord,
  lastMonthRecord: {} as MonthlyRecord,
})

const afterFetchRecord = ref(false)

const shouldShowChart = computed(() => weightList.value.length >= 8)

const fetchCurrentMonthRecord = async () => {
  const currentMonth = DateTime.now()
  const result = await until(() => getMonthlyRecord(currentMonth))
  if (result.error) {
    const toast = useToast()
    toast.error(result.error.message)
    return
  }

  monthlyRecord.currentMonthRecord = result.data
}

const fetchLastMonthRecord = async () => {
  const lastMonth = DateTime.now().minus({ month: 1 })
  const result = await until(() => getMonthlyRecord(lastMonth))
  if (result.error) {
    const toast = useToast()
    toast.error(result.error.message)
    return
  }

  monthlyRecord.lastMonthRecord = result.data
}

async function fetchRecords() {
  await fetchCurrentMonthRecord()
  if (shouldFetchLastMonthRecord) {
    await fetchLastMonthRecord()
  }
  afterFetchRecord.value = true
}

function getWeight(dateTime: DateTime) {
  const isCurrentMonth = dateTime.hasSame(DateTime.now(), 'month')

  if (isCurrentMonth) {
    return monthlyRecord.currentMonthRecord[dateTime.day]?.weight ?? 0
  }

  return monthlyRecord.lastMonthRecord[dateTime.day]?.weight ?? 0
}

function generateWeightList(): WeightItem[] {
  const generatedWeightList: WeightItem[] = []
  for (let i = 7; i > -1; i -= 1) {
    const newDay = DateTime.now().minus({ day: i })
    const weight = getWeight(newDay)
    if (weight === 0) break
    const generatedWeightItem: WeightItem = {
      date: newDay.toISODate(),
      weight,
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
  if (weightParam === minWeightParam) return '#9cc7ea'
  if (weightParam === maxWeightParam) return '#314782'
  return '#4f85c7'
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
        color: '#2d4e69',
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
        // shadowColor: '#c3cfe2',
        // shadowBlur: 4,
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

onMounted(async () => {
  await fetchRecords()
  weightList.value = generateWeightList()
  if (!shouldShowChart.value) return

  initChart(barChartRef, weightList.value)
})

</script>

<style lang="scss" scoped>
@use "@/style/colors.scss" as colors;
@use "@/style/font-sizes.scss" as font-sizes;

.last-days-weight-bar-chart-wrapper {
  $size: 100%;

  box-sizing: border-box;
  display: grid;
  grid-template-rows: 1fr;
  place-items: center;
  width: $size;
  height: $size;

  .bar-chart {
    grid-area: 1 / 1;
    width: 100%;
    height: 100%;
  }

  .hint-wrapper {
    grid-area: 1 / 1;

    .hint {
      color: colors.$darkblue-600;
      font-size: font-sizes.$medium;
    }
  }
}

</style>
