<template>
  <PageLayout>
    <div class="dashboard-view">
      <div class="info-cards">
        <div class="info-card" />
      </div>
    </div>
  </PageLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import gsap from 'gsap'
import PageLayout from '@/components/PageLayout.vue'

export default defineComponent({
  name: 'DashboardView',
  components: { PageLayout },
  data() {
    return {}
  },
  mounted() {
    this.initAnimations()
  },
  methods: {
    initAnimations() {
      const timeline = gsap.timeline()
      timeline.from('.info-card', {
        opacity: 0,
        ease: 'power4',
        stagger: 0.05,
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
  box-sizing: border-box;
  display: grid;
  flex-direction: column;
  grid-template-areas:
    "sidebar header"
    "sidebar body";
  grid-template-rows: 70px 1fr;
  grid-template-columns: 120px 1fr;
  row-gap: 20px;
  width: 100%;
  height: 100%;

  .info-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, 100%);
    gap: 20px;
    height: 100%;

    .info-card {
      border-radius: constants.$border-radius;
      box-shadow: constants.$card-shadow;
      background-color: white;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
