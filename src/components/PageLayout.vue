<template>
  <div class="page-layout">
    <CustomHeader />
    <CustomSidebar />
    <div class="body">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import gsap from 'gsap'

import CustomSidebar from '@/components/CustomSidebar.vue'
import CustomHeader from '@/components/CustomHeader.vue'

export default defineComponent({
  name: 'DashboardView',
  components: {
    CustomSidebar,
    CustomHeader,
  },
  data() {
    return {
    }
  },
  mounted() {
    this.initAnimations()
  },
  methods: {
    initAnimations() {
      const timeline = gsap.timeline()
      timeline.set('.page-layout', {
        backgroundColor: '#e8ecf3',

      })

      timeline.to('.page-layout', {
        backgroundColor: '#e8ecf3',
        duration: 0.25,
      })
    },
  },
})
</script>

<style lang="scss" scoped>
@use "sass:map";
@use "@/style/constants.scss" as constants;
@use "@/style/colors" as colors;

.page-layout {
  box-sizing: border-box;
  display: grid;
  flex-direction: column;
  grid-template-areas:
    "sidebar header"
    "sidebar body";
  grid-template-rows: 90px 1fr;
  grid-template-columns: 120px 1fr;
  width: 100vw;
  min-height: 100vh;
  overflow: hidden;

  .custom-sidebar {
    grid-area: sidebar;
  }

  .custom-header {
    grid-area: header;
  }
}
</style>
