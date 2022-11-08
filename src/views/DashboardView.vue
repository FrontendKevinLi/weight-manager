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
@use "@/style/colors" as colors;

.dashboard-view {
  display: grid;
  grid-template-rows: 432px 1fr;
  place-items: center;
  height: 100%;

  .weighing-item {
    transform: scale(0.8);
  }

  .last-days-weight-bar-chart-wrapper {
    padding: 40px;
  }
}
</style>
