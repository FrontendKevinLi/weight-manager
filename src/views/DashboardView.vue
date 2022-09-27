<template>
  <div class="dashboard-view">
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import gsap from 'gsap';

export default defineComponent({
  name: 'DashboardView',
  mounted() {
    const timeline = gsap.timeline();

    timeline.to('.box', {
      y: 100,
      ease: 'back.in',
      stagger: 0.1,
    });
  },
});
</script>

<style lang="scss" scoped>
@import '@/style/colors.scss';
.dashboard-view {
  display: flex;
  gap: 20px;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  background-blend-mode: screen;
  height: 100vh;
  overflow: hidden;
  .box {
    height: 100px;
    width: 100px;
    background-color: map-get($map: $blue, $key: "200");
  }
}
</style>
