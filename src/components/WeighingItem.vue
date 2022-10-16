<template>
  <div class="weighing-item">
    <div class="circle-inside">
      <div class="weighing-number">
        {{ weight.displayValue }}
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
    <!-- <div v-for="i in " class="indicator"></div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import gsap, { Back } from 'gsap'

export default defineComponent({
  name: 'WeighingItem',
  data() {
    return {
      weight: {
        displayValue: 0,
        tweenValue: 0,
        value: 150,
      },
    }
  },
  mounted() {
    this.initAnimation()
  },
  methods: {
    initAnimation() {
      const timeline = gsap.timeline()
      const initRotateDeg = 315
      const maxRotateDeg = 360 - 90
      const maxKG = 200
      const currentKG = this.weight.value
      timeline.set('.pointer-container', {
        rotate: initRotateDeg,
      })

      timeline.to('.pointer-container', {
        rotate: initRotateDeg + (maxRotateDeg / maxKG) * currentKG,
        ease: Back.easeOut,
        duration: 0.5,
      })

      timeline.to(this.weight, {
        duration: 0.5,
        tweenValue: this.weight.value,
        ease: Back.easeOut,
        onUpdate: () => {
          this.weight.displayValue = Math.ceil(this.weight.tweenValue)
        },
      }, 0)
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
  margin: 20px;
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
    box-shadow: 0 15px 35px -20px map.get($map: colors.$blue, $key: "300");
    background-color: map.get($map: colors.$blue, $key: "50");
    width: 325px;
    height: 325px;

    .weighing-number {
      color: map.get($map: colors.$blue, $key: "900");
      font-family: sans-serif;
      font-size: 72px;
    }
  }

  .circle-outside {
    position: relative;
    z-index: 0;
    border-radius: 50%;

    // box-shadow: 0 20px 40px -10px map.get($map: colors.$blue, $key: "50");
    background-color: map.get($map: colors.$blue, $key: "100");
    width: 400px;
    height: 400px;

    &::before {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      box-shadow: 0 20px 115px -10px map.get($map: colors.$blue, $key: "300");
      width: 325px;
      height: 325px;
      content: "";
    }

    // overflow: hidden;
    .triangle-mask {
      z-index: 0;
      border-top: 200px solid transparent;
      border-right: 200px solid transparent;
      border-bottom: 200px solid map.get($map: colors.$blue, $key: "50");
      border-left: 200px solid transparent;
    }
  }

  .pointer-container {
    width: 100%;
    height: 100%;

    .pointer {
      $circle-size: 30px;

      position: absolute;
      top: 50%;
      left: -($circle-size / 2);
      transform: translateY(-50%);
      z-index: 1;
      border-radius: 50%;
      background-color: white;
      width: $circle-size;
      height: $circle-size;
      filter: drop-shadow(0 0 5px map.get($map: colors.$blue, $key: "200"));

      &::before {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        border-radius: 50%;
        background-color: map.get($map: colors.$blue, $key: "500");
        width: 20%;
        height: 20%;
        content: "";
      }

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
