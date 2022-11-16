<template>
  <div class="dashboard-view">
    <div class="weighing-item-wrapper">
      <WeighingItem v-if="hasWeighingItemInited" />
    </div>
    <LastDaysWeightBarChart @inited="handleBarChartInited" />
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
      hasFilled: false,
      hasWeighingItemInited: false,
      hasBarChartInited: false,
    }
  },
  methods: {
    handleBarChartInited() {
      this.hasWeighingItemInited = true
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
}

@media (max-width: breakpoints.$small) {
  .dashboard-view {
    // grid-template-rows: minmax(50vmin, 100%) 1fr;
    grid-template-rows: auto 1fr;

    .weighing-item-wrapper {
      width: 100%;
      aspect-ratio: 1/ 1;
    }

    // .weighing-item {
    //   width: 100%;
    //   height: auto;
    // }
  }
}
</style>
