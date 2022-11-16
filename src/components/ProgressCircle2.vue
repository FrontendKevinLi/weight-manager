<template>
  <div class="progress-circle-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 106 106"
      fill="#fff"
      fill-rule="evenodd"
      stroke="#000"
      stroke-linecap="round"
      stroke-linejoin="round"
      filter="url(#shadow)"
    >
      <use
        xlink:href="#A"
        x="3"
        y="3"
      />
      <symbol
        id="A"
        overflow="visible"
      >
        <defs>
          <linearGradient
            :id="id"
            x1="1"
            x2="0"
            y1="1"
            y2="0"
          >
            <stop
              offset="0"
              :style="{
                stopColor: linearGradientFrom
              }"
            />
            <stop
              offset="1"
              :style="{
                stopColor: linearGradientTo
              }"
            />
          </linearGradient>
          <filter
            id="shadow"
            color-interpolation-filters="sRGB"
          >
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="4"
              flood-opacity="1"
              flood-color="#3e63a2"
            />
          </filter>
        </defs>
        <path
          ref="progress-path"
          d="M50 0c27.7 0 50 22.3 50 50s-22.3 50-50 50S0 77.7 0 50 22.3 0 50 0z"
          fill="none"
          :stroke="`url(#${id})`"
          stroke-dasharray="204.17963469846285 314.1592653589793"
          stroke-width="6"
        />
      </symbol>
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { v4 as uuid } from 'uuid'
import gsap from 'gsap'
import CustomEase from 'gsap/CustomEase'

import { ProgressCircle2Config } from '@/types/ProgressCircle2'
import Constants from '@/utils/constant'

gsap.registerPlugin(CustomEase)

export default defineComponent({
  name: 'ProgressCircle2',
  props: {
    config: {
      type: Object as PropType<ProgressCircle2Config>,
      default: () => ({
        colorConfig: {
          linearGradient: {
            from: '#e8ecf3',
            to: '#003584',
          },
        },
        animationConfig: {
          enabled: true,
        },
        percentage: 1,
      } as ProgressCircle2Config),
      required: true,
    },
  },
  data() {
    return {
      strokeDasharray: 314.1592653589793,
      id: `lg-${uuid()}`,
    }
  },
  computed: {
    strokeDashoffset() {
      const strokeDashoffset = this.strokeDasharray * (1 - this.config.percentage)
      return strokeDashoffset
    },
    linearGradientFrom() {
      const linearGradientFrom = this.config.colorConfig?.linearGradient
        ? this.config.colorConfig.linearGradient.from
        : this.config.colorConfig?.color

      return linearGradientFrom
    },
    linearGradientTo() {
      const linearGradientTo = this.config.colorConfig?.linearGradient
        ? this.config.colorConfig?.linearGradient?.to
        : this.config.colorConfig?.color

      return linearGradientTo
    },
  },
  mounted() {
    this.initProgress()
  },
  methods: {
    initProgress() {
      const timeline = gsap.timeline()
      if (!this.config.animationConfig?.enabled) {
        const percentage = this.config.percentage * 0.75
        timeline.set(this.$refs['progress-path'] as string, {
          strokeDasharray: `${this.strokeDasharray * percentage} ${this.strokeDasharray * (1 - percentage)}`,
        })
        return
      }

      timeline.set(this.$refs['progress-path'] as string, {
        strokeDasharray: `0 ${this.strokeDasharray}`,
      })
    },
    fillProgress() {
      const timeline = gsap.timeline()
      const percentage = this.config.percentage * 0.75

      timeline.to(this.$refs['progress-path'] as string, {
        duration: this.config.animationConfig?.enabled ? this.config.animationConfig.duration : 0,
        ease: CustomEase.create('custom', Constants.customElasticPath),
        strokeDasharray: `${this.strokeDasharray * percentage} ${this.strokeDasharray * (1 - percentage)}`,
      }, this.config.animationConfig?.delay ?? 0)
    },
  },
})
</script>

<style lang="scss" scoped>
@use "@/style/colors" as colors;

.progress-circle-2 {
  height: fit-content;
}
</style>
