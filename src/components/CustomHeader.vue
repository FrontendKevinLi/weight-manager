<template>
  <div class="custom-header">
    <div class="product-name">
      Weight Manager
    </div>
    <div class="user-info">
      <InlineSvg
        :src="BellSvg"
        class="notification"
      />
      <img
        :src="ProfilePng"
        class="user-icon"
        alt="icon"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InlineSvg from 'vue-inline-svg'
import gsap from 'gsap'

import ProfilePng from '@/assets/header-icons/profile.png'
import BellSvg from '@/assets/header-icons/bell-regular.svg'

export default defineComponent({
  name: 'DashboardView',
  components: {
    InlineSvg,
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
      timeline.from('.product-name', {
        x: 150,
        opacity: 0,
        ease: 'back',
        duration: 0.5,
      }, 0)
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

.custom-header {
  display: flex;
  grid-area: header;
  justify-content: space-between;
  width: 100%;

  .product-name {
    margin-right: 10px;
    margin-left: 10px;
    text-align: center;
    font-family: Tomatoes, sans-serif;
    font-size: 34px;
  }

  .user-info {
    display: flex;
    column-gap: 20px;
    align-items: center;
    justify-content: center;
    border-radius: constants.$border-radius;
    box-shadow: constants.$card-shadow;
    background-color: white;
    padding-top: 10px;
    padding-right: 20px;
    padding-bottom: 10px;
    padding-left: 20px;

    .notification {
      width: 25px;
      height: 25px;
      fill: map.get(colors.$blue, "700");
    }

    .user-icon {
      border-radius: 50%;
      width: 50px;
      height: 50px;
    }
  }
}
</style>
