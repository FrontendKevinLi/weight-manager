<template>
  <div class="custom-header">
    <span class="page-name">
      Dashboard
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import gsap from 'gsap'

import ProfilePng from '@/assets/header-icons/profile.png'
import BellSvg from '@/assets/header-icons/bell-regular.svg'

export default defineComponent({
  name: 'DashboardView',
  components: {
  },
  data() {
    return {
      ProfilePng,
      BellSvg,
    }
  },
  mounted() {
    this.initAnimations()
  },
  methods: {
    initAnimations() {
      const timeline = gsap.timeline()

      timeline.from('.user-info', {
        x: -150,
        opacity: 0,
        ease: 'back',
        duration: 0.5,
      }, 0)
      timeline.from('.page-name', {
        x: 150,
        opacity: 0,
        ease: 'back',
        duration: 0.5,
      }, 0)
    },
  },
})
</script>

<style lang="scss" scoped>
@use "@/style/constants.scss" as constants;
@use "@/style/colors" as colors;

.custom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 40px;
  padding-right: 40px;
  padding-left: 40px;

  .page-name {
    margin-right: 10px;
    margin-left: 10px;
    text-align: center;
    color: colors.$darkblue-600;
    font-size: 34px;
  }
}
</style>
