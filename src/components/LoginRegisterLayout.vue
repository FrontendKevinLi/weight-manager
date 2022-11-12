<template>
  <div class="page-wrapper">
    <div
      ref="formBoxRef"
      class="form-box"
    >
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import gsap, { Expo } from 'gsap'

export default defineComponent({
  name: 'LoginRegisterLayout',
  computed: {
    currentRoute() {
      return this.$route.fullPath
    },
  },
  watch: {
    currentRoute(value) {
      this.fadeInFormBox()
    },
  },
  mounted() {
    this.fadeInFormBox()
  },
  methods: {
    fadeInFormBox() {
      const timeLine = gsap.timeline()
      const formBoxRef = this.$refs.formBoxRef as HTMLElement

      timeLine.fromTo(formBoxRef, {
        autoAlpha: 0,
        y: -100,
      }, {
        autoAlpha: 1,
        y: 0,
        ease: Expo.easeOut,
        duration: 0.75,
      })
    },
  },
})
</script>

<style lang="scss" scoped>
@use "@/style/colors" as colors;
@use "@/style/constants" as constants;
@use "@/style/font-sizes.scss" as font-sizes;
@use "@/style/breakpoints.scss" as breakpoints;
@use "@/style/animations";

.page-wrapper {
  $login-box-width: 75vw;

  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow: hidden;

  &::before {
    position: absolute;
    background-image: url("@/assets/backgrounds/low-poly-grid-haikei2.svg");
    background-repeat: no-repeat;
    background-size: cover;
    width: 108vw;
    height: 115%;
    animation: float 7s infinite alternate ease-in-out;
    content: "";
    filter: brightness(0.8) blur(3px);
  }

  .form-box {
    box-sizing: border-box;
    display: flex;
    position: relative;
    flex-direction: column;
    row-gap: 30px;
    align-items: center;
    visibility: hidden;
    border-radius: 12px;
    background-color: white;
    width: 450px;
    max-height: 100%;
    overflow-y: auto;
  }

  @media (max-width: breakpoints.$small) {
    .form-box {
      width: calc(100% - 40px);
    }
  }
}
</style>
