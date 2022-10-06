<template>
  <div class="weighing-item">
    <div class="circle-inside">
      <div class="weighing-number">
        50 KG
      </div>
    </div>
    <div class="circle-outside">
      <div class="triangle-mask" />
    </div>
    <div class="pointer-container">
      <div class="pointer">
        <div class="triangle-mask" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import gsap from 'gsap'

export default defineComponent({
  name: 'WeighingItem',
  mounted() {
    this.initAnimation()
  },
  methods: {
    initAnimation() {
      const timeline = gsap.timeline()
      const initRotateDeg = 315
      const maxRotateDeg = 360 - 90
      const maxKG = 200
      const currentKG = 50
      timeline.set('.pointer-container', {
        rotate: initRotateDeg,
      })

      timeline.to('.pointer-container', {
        rotate: initRotateDeg + (maxRotateDeg / maxKG) * currentKG,
        ease: 'back',
        duration: 0.75,
      })
    },
  },
})

</script>

<style lang="scss" scoped>
@use "sass:map";
@use "@/style/constants.scss" as constants;
@use "@/style/colors" as colors;

.weighing-item {
  display: grid;
  position: relative;
  place-items: center;
  padding: 20px;
  width: fit-content;
  height: fit-content;

  * {
    grid-area: 1 / 1;
  }

  .circle-inside {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    border-radius: 50%;
    box-shadow: 5px 5px 30px 5px map.get($map: colors.$blue, $key: "100");
    background-color: map.get($map: colors.$blue, $key: "50");
    width: 300px;
    height: 300px;

    .weighing-number {
      color: map.get($map: colors.$blue, $key: "500");
      font-size: 56px;
    }
  }

  .circle-outside {
    z-index: 0;
    border-radius: 50%;
    box-shadow: 0 20px 60px 5px map.get($map: colors.$blue, $key: "200");
    background-color: map.get($map: colors.$blue, $key: "100");
    width: 400px;
    height: 400px;
    overflow: hidden;
  }

  .triangle-mask {
    z-index: 0;
    border-top: 200px solid transparent;
    border-right: 200px solid transparent;
    border-bottom: 200px solid map.get($map: colors.$black, $key: "200");
    border-left: 200px solid transparent;
  }

  .pointer-container {
    width: 100%;
    height: 100%;

    .pointer {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      z-index: 1;
      border-radius: 50%;
      background-color: white;
      width: 30px;
      height: 30px;
      filter: drop-shadow(0 0 10px map.get($map: colors.$blue, $key: "200"));

      .triangle-mask {
        position: absolute;
        left: -40px;
        z-index: 0;
        border-top: 15px solid transparent;
        border-right: 40px solid white;
        border-bottom: 15px solid transparent;
        border-left: 15px solid transparent;
      }
    }
  }
}
</style>
