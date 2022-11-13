<template>
  <div class="dashboard-view">
    <WeighingItem />
    <LastDaysWeightBarChart />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import WeighingItem from '@/components/WeighingItem.vue'
import LastDaysWeightBarChart from '@/components/LastDaysWeightBarChart.vue'

export default defineComponent({
  name: 'DashboardView',
  components: {
    WeighingItem,
    LastDaysWeightBarChart,
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

  .weighing-item {
    padding: 40px;
  }

  .last-days-weight-bar-chart-wrapper {
    padding: 40px;
  }
}

@media (max-width: breakpoints.$small) {
  .dashboard-view {
    grid-template-rows: minmax(50vmin, 90vmin) 1fr;

    .weighing-item {
      padding: 20px;
    }

    .last-days-weight-bar-chart-wrapper {
      padding: 20px;
    }
  }
}
</style>
