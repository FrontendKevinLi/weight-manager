<template>
  <div class="dashboard-view">
    <WeighingItem />
    <LastDaysWeightBarChart />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import gsap from 'gsap'
// import PageLayout from '@/components/PageLayout.vue'
import WeighingItem from '@/components/WeighingItem.vue'
import LastDaysWeightBarChart from '@/components/LastDaysWeightBarChart.vue'

export default defineComponent({
  name: 'DashboardView',
  components: {
    // PageLayout,
    WeighingItem,
    LastDaysWeightBarChart,
  },
  data() {
    return {}
  },
  mounted() {
    this.initAnimations()
  },
  methods: {
    initAnimations() {
      const timeline = gsap.timeline()
      timeline.from('.weighing-item', {
        opacity: 0,
        ease: 'power1',
      }, 0)
    },
  },
})
</script>

<style lang="scss" scoped>
@use "@/style/constants.scss" as constants;
@use "@/style/colors" as colors;

.dashboard-view {
  display: grid;
  grid-template-rows: auto 1fr;
  place-items: center;
  height: 100%;

  .weighing-item {
    transform: scale(0.9);
  }

  .last-days-weight-bar-chart-wrapper {
    padding: 40px;
  }
}
</style>
