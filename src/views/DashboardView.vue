<template>
  <PageLayout>
    <div class="dashboard-view">
      <WeighingItem />
    </div>
  </PageLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import gsap from 'gsap'
import PageLayout from '@/components/PageLayout.vue'
import WeighingItem from '@/components/WeighingItem.vue'

export default defineComponent({
  name: 'DashboardView',
  components: {
    PageLayout,
    WeighingItem,
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
        ease: 'power4',
      }, 0)
    },
  },
})
</script>

<style lang="scss" scoped>
@use "sass:map";
@use "@/style/constants.scss" as constants;
@use "@/style/colors" as colors;

.dashboard-view {
  display: flex;
  justify-content: center;
  height: 100%;
}
</style>
