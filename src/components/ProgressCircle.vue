<template>
  <div class="progress-circle">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      fill="none"
      color="#3f51b5"
      class="circle-container"
    >
      <defs>
        <linearGradient id="spinner-secondHalf">
          <stop
            offset="0%"
            stop-opacity="0"
            stop-color="currentColor"
          />
          <stop
            offset="100%"
            stop-opacity="0.5"
            stop-color="currentColor"
          />
        </linearGradient>
        <linearGradient id="spinner-firstHalf">
          <stop
            offset="0%"
            stop-opacity="1"
            stop-color="currentColor"
          />
          <stop
            offset="100%"
            stop-opacity="0.5"
            stop-color="currentColor"
          />
        </linearGradient>
      </defs>

      <g stroke-width="8">
        <path
          class="first-half-path"
          stroke="url(#spinner-secondHalf)"
          d="M 4 100 A 96 96 0 0 1 196 100"
        />
        <path
          class="second-half-path"
          stroke="url(#spinner-firstHalf)"
          d="M 196 100 A 96 96 0 0 1 4 100"
        />
        <!-- <path
          stroke="currentColor"
          stroke-linecap="round"
          d="M 4 100 A 96 96 0 0 1 4 98"
        /> -->
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import gsap, { Linear } from 'gsap'

export default defineComponent({
  name: 'ProgressCircle',
  props: {
    percentage: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      strokeDashArray: 302,
      firstHalfPathProportion: 1 / 3,
      secondHalfPathProportion: 2 / 3,
    }
  },
  computed: {
    firstHalfPathStrokeDashOffset() {
      const firstHalfPathStrokeDashOffsetMin = this.strokeDashArray / 2
      const pathStrokeDashOffsetMax = this.strokeDashArray

      const firstHalfPathStrokeDashOffset = this.percentage >= this.firstHalfPathProportion
        ? pathStrokeDashOffsetMax
        : (this.percentage / this.firstHalfPathProportion) * (pathStrokeDashOffsetMax - firstHalfPathStrokeDashOffsetMin) + firstHalfPathStrokeDashOffsetMin

      // number is in reverse; 0 means max length
      return pathStrokeDashOffsetMax - firstHalfPathStrokeDashOffset
    },
    secondHalfPathStrokeDashOffset() {
      const pathStrokeDashOffsetMax = this.strokeDashArray

      const secondHalfPathStrokeDashOffset = this.percentage < this.firstHalfPathProportion
        ? 0
        : ((this.percentage - this.firstHalfPathProportion) / this.secondHalfPathProportion) * pathStrokeDashOffsetMax

      // number is in reverse; 0 means max length
      return pathStrokeDashOffsetMax - secondHalfPathStrokeDashOffset
    },
  },
  mounted() {
    this.initAnimations()
  },
  methods: {
    initAnimations() {
      const timeline = gsap.timeline()

      timeline.to('.first-half-path', {
        duration: 0.5,
        ease: Linear.easeNone,
        strokeDashoffset: this.firstHalfPathStrokeDashOffset,
      }, 0.5)
      timeline.to('.second-half-path', {
        duration: 0.5,
        ease: Linear.easeNone,
        strokeDashoffset: this.secondHalfPathStrokeDashOffset,
      })
    },
  },
})

</script>

<style lang="scss">
@use "sass:map";
@use "@/style/colors" as colors;

.progress-circle {
  width: 325px;
  height: 325px;

  // stroke-dasharray: 302;
  filter: drop-shadow(0 0 3px map.get(colors.$blue, "900"));

  .circle-container {
    transform: rotate(225deg);

    .first-half-path {
      stroke-dashoffset: 302;
      stroke-dasharray: 302;
    }

    .second-half-path {
      stroke-dashoffset: 302;
      stroke-dasharray: 302;
    }
  }
}

</style>
