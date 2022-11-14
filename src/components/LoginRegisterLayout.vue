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
    currentRoute() {
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
@use "@/style/animations.scss";

.page-wrapper {
  $login-box-width: 75vw;

  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  background-image: url("@/assets/backgrounds/low-poly-grid-haikei2.svg");
  background-position: left top;
  background-size: auto 120%;
  height: 100%;
  overflow: hidden;
  animation: background-float 7s infinite alternate ease-in-out;

  &::before {
    position: absolute;
    width: 100%;
    height: 100%;
    content: "";
    backdrop-filter: blur(2px) brightness(0.8);
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
    padding: 40px;
    width: 450px;
    max-height: 100%;
    overflow-y: auto;
    will-change: opacity, transform;
  }
}

@media (max-width: breakpoints.$small) {
  .page-wrapper {
    background-size: cover;
    animation: none;

    &::before {
      position: absolute;
      width: 100%;
      height: 100%;
      content: "";
      backdrop-filter: unset;
    }

    .form-box {
      width: calc(100% - 40px);
    }
  }
}
</style>
