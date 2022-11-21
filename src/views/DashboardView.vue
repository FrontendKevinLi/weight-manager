<template>
  <div class="dashboard-view">
    <div class="weighing-item-wrapper">
      <WeighingItem v-if="showWeighingItem" />
    </div>
    <LastDaysWeightBarChart
      @inited="handleBarChartInited"
      @not-enough-data="handleBarChartNotEnoughData"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'
import LastDaysWeightBarChart from '@/components/LastDaysWeightBarChart.vue'

const WeighingItem = defineAsyncComponent({
  loader: () => import('@/components/WeighingItem.vue'),

})

export default defineComponent({
  name: 'DashboardView',
  components: {
    WeighingItem,
    LastDaysWeightBarChart,
  },
  data() {
    return {
      barChart: {
        inited: false,
        notEnoughData: false,
      },
    }
  },
  computed: {
    showWeighingItem(): boolean {
      const showWeighingItem = this.barChart.inited || this.barChart.notEnoughData
      return showWeighingItem
    },
  },
  methods: {
    handleBarChartInited() {
      this.barChart.inited = true
    },
    handleBarChartNotEnoughData() {
      this.barChart.notEnoughData = true
    },
  },
})
</script>

<style lang="scss" scoped>
@use "@/style/constants.scss" as constants;
@use "@/style/breakpoints.scss" as breakpoints;
@use "@/style/colors" as colors;

.dashboard-view {
  display: grid;
  grid-template-rows: minmax(50vmin, 60vmin) 1fr;
  place-items: center;
  height: 100%;

  .weighing-item-wrapper {
    width: auto;
    height: 100%;
    aspect-ratio: 1/1;
  }
}

@media (max-width: breakpoints.$small) {
  .dashboard-view {
    // grid-template-rows: minmax(50vmin, 100%) 1fr;
    grid-template-rows: auto 1fr;

    .weighing-item-wrapper {
      width: 100%;
      height: auto;
      aspect-ratio: 1/ 1;
    }

    // .weighing-item {
    //   width: 100%;
    //   height: auto;
    // }
  }
}
</style>
