<template>
  <div
    class="weighing-item"
  >
    <div
      ref="weighingItemBodyRef"
      class="weighing-item-body"
    >
      <div
        ref="circleInsideRef"
        class="circle-inside"
      >
        <span class="weighing-text">
          <span class="number">
            {{ weight.displayValue }}
          </span>
          <span class="unit">KG</span>
        </span>
      </div>
      <ProgressCircle2
        ref="outerProgressCircleRef"
        :config="outerProgressCircleConfig"
        class="outer-progress-circle"
      />
      <div
        ref="pointerContainerRef"
        class="pointer-container"
      >
        <InlineSvg
          class="pointer"
          :src="PointerSvg"
        />
      </div>
      <div
        ref="indicatorsRef"
        class="indicators"
      >
        <div
          v-for="i in 19"
          :key="i"
          :class="['indicator',`indicator-${i}`]"
        />
      </div>
    </div>
    <div
      ref="outerAnimationCircleRef"
      class="outer-animation-cicle"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import gsap, { Expo } from 'gsap'
import CustomEase from 'gsap/CustomEase'
import InlineSvg from 'vue-inline-svg'

import { ProgressCircle2Config, AnimationConfig } from '@/types/ProgressCircle2'
import Constants from '@/utils/constant'
import ProgressCircle2 from '@/components/ProgressCircle2.vue'
import { MonthlyRecord } from '@/types/records'
import { until } from '@open-draft/until'
import { getMonthlyRecord } from '@/firebase/firestore'
import { DateTime } from 'luxon'
import { useToast } from 'vue-toastification'
import PointerSvg from '@/assets/weighing-item/location-dot-solid.svg'

gsap.registerPlugin(CustomEase)

export default defineComponent({
  name: 'WeighingItem',
  components: {
    ProgressCircle2,
    InlineSvg,
  },
  data() {
    return {
      weight: {
        displayValue: '0.0',
        tweenValue: 0,
        value: 0.0,
        maxValue: 200,
      },
      animationConfig: {
        enabled: true,
        duration: 1,
        delay: '0.15',
      } as AnimationConfig,
      monthlyRecord: {} as MonthlyRecord,
      initPointerRotateDeg: 315,
      PointerSvg,
    }
  },
  computed: {
    weighingPercentage(): number {
      const weighingPercentage = Math.min(1, this.weight.value / this.weight.maxValue)
      return weighingPercentage
    },
    outerProgressCircleConfig(): ProgressCircle2Config {
      const outerProgressCircleConfig: ProgressCircle2Config = {
        percentage: this.weighingPercentage,
        colorConfig: {
          linearGradient: {
            from: '#314782',
            to: '#7bb1e0',
          },
        },
        animationConfig: this.animationConfig,
        stroke: {
          linecap: 'round',
          width: 6,
        },
      }
      return outerProgressCircleConfig
    },
  },
  async mounted() {
    this.initPointerAnimation()
    await this.fadeInWeighingItem()
    await this.fetchMonthlyRecord()
    const circle = this.$refs.outerProgressCircleRef as InstanceType<typeof ProgressCircle2>
    this.setWeight()
    this.$nextTick(() => {
      circle.fillProgress()
      this.rotatePointer()
      this.animateWeightText()
    })
  },
  methods: {
    async fetchMonthlyRecord() {
      const today = DateTime.now()
      const result = await until(() => getMonthlyRecord(today))
      if (result.error) {
        const toast = useToast()
        toast.error(result.error.message)
        return
      }

      this.monthlyRecord = result.data
    },
    setWeight() {
      const today = DateTime.now()
      const weightForToday = this.monthlyRecord[today.day]?.weight ?? 0.0

      this.weight.value = weightForToday
    },
    initPointerAnimation() {
      const timeline = gsap.timeline()

      timeline.set('.pointer-container', {
        rotate: this.initPointerRotateDeg,
      })
    },
    rotatePointer() {
      const timeline = gsap.timeline()
      const maxRotateDeg = 360 - 90
      const maxKG = this.weight.maxValue
      const currentKG = Math.min(this.weight.value, this.weight.maxValue)

      timeline.to('.pointer-container', {
        rotate: this.initPointerRotateDeg + (maxRotateDeg / maxKG) * currentKG,
        ease: CustomEase.create('custom', Constants.customElasticPath),
        duration: this.animationConfig.duration,
      }, this.animationConfig.delay)
    },
    fadeInWeighingItem(): Promise<void> {
      return new Promise((resolve) => {
        const timeline = gsap.timeline()
        const circleInsideRef = this.$refs.circleInsideRef as HTMLElement | null
        const outerProgressCircleRef = this.$refs.outerProgressCircleRef as (InstanceType<typeof ProgressCircle2>)
        const pointerContainerRef = this.$refs.pointerContainerRef as HTMLElement | null
        const indicatorsRef = this.$refs.indicatorsRef as HTMLElement | null
        const outerAnimationCircleRef = this.$refs.outerAnimationCircleRef as HTMLElement | null
        if (
          circleInsideRef == null
      || outerProgressCircleRef == null
      || pointerContainerRef == null
      || indicatorsRef == null
      || outerAnimationCircleRef == null
        ) return

        timeline.fromTo(outerAnimationCircleRef, {
          autoAlpha: 1,
          scale: 0,
        }, {
          autoAlpha: 0,
          scale: 1.75,
          ease: Expo.easeInOut,
          rotate: 360,
          duration: 1.1,
        })

        timeline.fromTo(indicatorsRef, {
          autoAlpha: 0,
          scale: 0,
        }, {
          autoAlpha: 1,
          scale: 1,
          ease: Expo.easeInOut,
          duration: 1.1,
        }, 0.1)
        timeline.fromTo(pointerContainerRef, {
          autoAlpha: 0,
          scale: 0,
        }, {
          autoAlpha: 1,
          scale: 1,
          ease: Expo.easeInOut,
          duration: 1.1,
        }, 0.1)
        timeline.fromTo(outerProgressCircleRef.$el, {
          autoAlpha: 0,
          scale: 0,
        }, {
          autoAlpha: 1,
          scale: 1,
          duration: 1.1,
          ease: Expo.easeInOut,
          onComplete() {
            resolve()
          },
        }, 0.1)

        timeline.fromTo(circleInsideRef, {
          autoAlpha: 0,
          scale: 0,
        }, {
          autoAlpha: 1,
          scale: 1,
          duration: 1.1,
          ease: Expo.easeOut,
        }, '-=0.6')
      })
    },
    animateWeightText() {
      const timeline = gsap.timeline()
      timeline.to(this.weight, {
        duration: this.animationConfig.duration,
        tweenValue: this.weight.value,
        ease: CustomEase.create('custom', Constants.customElasticPath),
        onUpdate: () => {
          this.weight.displayValue = this.weight.tweenValue.toFixed(1)
        },
      }, this.animationConfig.delay)
    },
  },
})

</script>

<style lang="scss" scoped>
@use "@/style/constants.scss" as constants;
@use "@/style/colors" as colors;
@use "@/style/font-sizes" as font-sizes;

.weighing-item {
  $inner-circle-size: 65%;
  $outer-circle-size: 440px;

  box-sizing: border-box;
  display: grid;
  position: relative;
  place-items: center;
  height: 100%;
  aspect-ratio: 1 / 1;

  * {
    grid-area: 1 / 1;
  }

  .weighing-item-body {
    display: grid;
    position: relative;
    place-items: center;
    width: 100%;
    height: 100%;

    * {
      grid-area: 1 / 1;
    }

    .circle-inside {
      display: flex;
      align-items: center;
      justify-content: center;
      visibility: hidden;
      z-index: 1;
      border-radius: 50%;
      box-shadow: 0 15px 95px -35px colors.$primary-800;
      background-color: white;
      width: $inner-circle-size;
      height: $inner-circle-size;

      .weighing-text {
        display: flex;
        gap: 10px;
        align-items: baseline;
        color: colors.$darkblue-600;

        .number {
          font-size: max(2vw, font-sizes.$medium);
        }

        .unit {
          font-size: max(2vw, font-sizes.$small);
        }
      }
    }

    .pointer-container {
      $offset: -40px;

      position: relative;
      visibility: hidden;
      z-index: 2;
      width: 80%;
      will-change: opacity, transform;
      aspect-ratio: 1 / 1;

      .pointer {
        position: absolute;
        top: 50%;
        left: -4%;
        transform: translateY(-50%) rotate(90deg);
        fill: white;
        width: 10%;
        aspect-ratio: 384 / 512;
        filter: drop-shadow(0 0 4px colors.$primary-800);
      }
    }

    .indicators {
      $offset: 10px;
      $padding: 50px;

      position: relative;
      visibility: hidden;
      z-index: 1;
      width: 100%;
      aspect-ratio: 1 / 1;
      will-change: opacity, transform;

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
                background: colors.$darkblue-200;
                width: 12px;
                height: 2px;
                content: "";
              }
            }
          }
        }

        &:is(:first-child, :last-child, :nth-child(3n + 4))::before {
          background: colors.$darkblue-600;
          width: 20px;
        }
      }
    }

    .outer-progress-circle {
      $offset: 5px;
      $size: 80%;

      visibility: hidden;
      width: $size;
      height: $size;
      filter: drop-shadow(0 0 4px colors.$primary-800) brightness(1.15);
      will-change: opacity, transform;

      ::v-deep svg {
        transform: rotate(225deg);
      }
    }
  }

  .outer-animation-cicle {
    border: 2px solid colors.$primary-600;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    will-change: opacity, transform;
  }
}
</style>
