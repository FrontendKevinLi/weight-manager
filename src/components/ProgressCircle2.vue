<template>
  <div class="progress-circle-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="90 90 220 220"
      class="circle-container"
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
      </defs>

      <path
        ref="progress-path"
        d="M 300 200 A 100 100 0 1 1 200 100"
        fill="none"
        :stroke="`url(#${id})`"
        :stroke-width="config.stroke.width"
        class="circle-path"
        :stroke-linecap="config.stroke.linecap"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { v4 as uuid } from 'uuid'
import gsap from 'gsap'

import { CustomEase } from '@/utils/gsap/CustomEase'
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
      strokeDasharray: 472,
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
    this.initAnimation()
  },
  methods: {
    initAnimation() {
      const timeline = gsap.timeline()

      if (!this.config.animationConfig?.enabled) {
        timeline.set(this.$refs['progress-path'] as string, {
          strokeDasharray: `${this.strokeDasharray * this.config.percentage} ${this.strokeDasharray * (1 - this.config.percentage)}`,
        })
        return
      }

      timeline.set(this.$refs['progress-path'] as string, {
        strokeDasharray: `0 ${this.strokeDasharray}`,
      })

      timeline.to(this.$refs['progress-path'] as string, {
        duration: this.config.animationConfig?.enabled ? this.config.animationConfig.duration : 0,
        ease: CustomEase.create('custom', Constants.customElasticPath),
        strokeDasharray: `${this.strokeDasharray * this.config.percentage} ${this.strokeDasharray * (1 - this.config.percentage)}`,
      }, this.config.animationConfig.delay)
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
