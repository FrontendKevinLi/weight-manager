<template>
  <div class="weighing-item">
    <div class="circle-inside">
      <span class="weighing-text">
        <span class="number">
          {{ weight.displayValue }}
        </span>
        <span class="unit">KG</span>
      </span>
    </div>
    <ProgressCircle2
      :config="outerProgressCircleConfig"
      class="outer-progress-circle"
    />
    <div class="pointer-container">
      <div class="pointer">
        <div class="triangle-mask" />
      </div>
    </div>
    <div class="indicators">
      <div
        v-for="i in 19"
        :key="i"
        :class="['indicator',`indicator-${i}`]"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import gsap, { Back } from 'gsap'
import { ProgressCircle2Config } from '@/types/ProgressCircle2'
import ProgressCircle2 from './ProgressCircle2.vue'

export default defineComponent({
  name: 'WeighingItem',
  components: {
    ProgressCircle2,
  },
  data() {
    return {
      weight: {
        displayValue: '',
        tweenValue: 0,
        value: 114.5,
        maxValue: 200,
      },
    }
  },
  computed: {
    weighingPercentage() {
      const weighingPercentage = Math.min(1, this.weight.value / this.weight.maxValue)
      return weighingPercentage
    },
    outerProgressCircleConfig() {
      const outerProgressCircleConfig: ProgressCircle2Config = {
        percentage: this.weighingPercentage,
        colorConfig: {
          linearGradient: {
            from: '#003584',
            to: '#c3cfe2',
          },
        },
        animationConfig: {
          enabled: true,
        },
        stroke: {
          linecap: 'round',
          width: 6,
        },
      }
      return outerProgressCircleConfig
    },
  },
  mounted() {
    this.initAnimation()
  },
  methods: {
    initAnimation() {
      const timeline = gsap.timeline()
      const initRotateDeg = 315
      const maxRotateDeg = 360 - 90
      const maxKG = this.weight.maxValue
      const currentKG = Math.min(this.weight.value, this.weight.maxValue)
      timeline.set('.pointer-container', {
        rotate: initRotateDeg,
      })
      timeline.to('.pointer-container', {
        rotate: initRotateDeg + (maxRotateDeg / maxKG) * currentKG,
        ease: Back.easeOut,
        duration: 0.75,
      }, 0)
      timeline.to(this.weight, {
        duration: 0.75,
        tweenValue: this.weight.value,
        ease: Back.easeOut,
        onUpdate: () => {
          this.weight.displayValue = this.weight.tweenValue.toFixed(1)
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
  $inner-circle-size: 325px;
  $outer-circle-size: 440px;

  display: grid;
  position: relative;
  place-items: center;
  margin: 30px;
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
    box-shadow: 0 15px 95px -35px map.get($map: colors.$blue, $key: "300");
    background-color: map.get($map: colors.$blue, $key: "50");
    width: $inner-circle-size;
    height: $inner-circle-size;

    .weighing-text {
      display: flex;
      gap: 10px;
      align-items: baseline;

      .number {
        color: map.get($map: colors.$blue, $key: "900");
        font-family: sans-serif;
        font-size: 72px;
      }

      .unit {
        color: map.get(colors.$blue, "900");
        font-family: sans-serif;
        font-size: 36px;
      }
    }
  }

  .circle-outside {
    position: relative;
    opacity: 0;
    z-index: 0;
    border-radius: 50%;
    background-color: map.get($map: colors.$blue, $key: "100");
    width: $outer-circle-size;
    height: $outer-circle-size;

    &::before {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      box-shadow: 0 20px 115px -10px map.get($map: colors.$blue, $key: "300");
      width: $inner-circle-size;
      height: $inner-circle-size;
      content: "";
    }

    // overflow: hidden;
    .triangle-mask {
      $triangle-mask-size: $outer-circle-size / 2;

      z-index: 0;
      border-top: $triangle-mask-size solid transparent;
      border-right: $triangle-mask-size solid transparent;
      border-bottom: $triangle-mask-size solid map.get($map: colors.$blue, $key: "50");
      border-left: $triangle-mask-size solid transparent;
    }
  }

  .pointer-container {
    $offset: -40px;
    $pointer-wrapper-size: $outer-circle-size + $offset;

    position: relative;
    z-index: 2;
    width: $pointer-wrapper-size;
    height: $pointer-wrapper-size;

    .pointer {
      $circle-size: 40px;

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
        width: 12px;
        height: 12px;
        content: "";
      }

      .triangle-mask {
        position: absolute;
        left: -$circle-size;
        z-index: 0;
        border-top: $circle-size / 2 solid transparent;
        border-right: $circle-size solid white;
        border-bottom: $circle-size / 2  solid transparent;
        border-left: $circle-size / 2 solid transparent;
      }
    }
  }

  .indicators {
    $offset: 10px;
    $padding: 50px;
    $indicator-wrapper-size: $outer-circle-size + $offset + $padding;

    position: relative;
    z-index: 1;
    width: $indicator-wrapper-size;
    height: $indicator-wrapper-size;

    .indicator {
      @for $i from 1 through 19 {
        &.indicator {
          &-#{$i} {
            position: absolute;
            left: 0;
            transform: rotate(calc((#{$i} - 1) * 15deg - 45deg));
            z-index: 0;
            width: 100%;
            height: 100%;
            translate: 0 0;

            &::before {
              position: absolute;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
              background: map.get(colors.$blue, "200");
              width: 12px;
              height: 1px;
              content: "";
            }
          }
        }
      }

      &:is(:first-child, :last-child, :nth-child(3n + 4))::before {
        background: map.get(colors.$blue, "900");
        width: 20px;
      }
    }
  }

  .outer-progress-circle {
    $offset: 5px;
    $size: $outer-circle-size - $offset;

    position: absolute;
    transform: translate(-10px, -10px);
    width: $size;
    height: $size;
    filter: drop-shadow(0 0 8px map.get(colors.$blue, "200")) brightness(1.15);

    ::v-deep svg {
      transform: rotate(135deg);
    }
  }

  .inner-progress-circle {
    $size: $outer-circle-size + 50px;

    filter: brightness(1.1);
    position: absolute;
    transform: translate(-10px, -10px);
    width: $size;
    height: $size;

    &::before {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      box-shadow: 0 20px 115px -10px map.get($map: colors.$blue, $key: "300");
      width: $inner-circle-size;
      height: $inner-circle-size;
      content: "";
    }

    ::v-deep svg {
      transform: rotate(135deg);
    }
  }
}
</style>
