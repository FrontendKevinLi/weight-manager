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
        backgroundImage: 'linear-gradient(135deg, #fff 0%, #fff 100%)',
      })

      timeline.to('.page-layout', {
        backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
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
  grid-template-rows: 70px 1fr;
  grid-template-columns: 120px 1fr;
  row-gap: 20px;
  padding-top: 20px;
  padding-right: 40px;
  padding-bottom: 20px;
  width: 100vw;
  height: 100vh;

  .custom-sidebar {
    grid-area: sidebar;
  }

  .custom-header {
    display: flex;
    grid-area: header;
    justify-content: space-between;
    width: 100%;

    .product-name {
      margin-right: 10px;
      margin-left: 10px;
      text-align: center;
      font-family: Tomatoes, sans-serif;
      font-size: 34px;
    }

    .user-info {
      display: flex;
      column-gap: 20px;
      align-items: center;
      justify-content: center;
      border-radius: constants.$border-radius;
      box-shadow: constants.$card-shadow;
      background-color: white;
      padding-top: 10px;
      padding-right: 20px;
      padding-bottom: 10px;
      padding-left: 20px;

      .notification {
        width: 25px;
        height: 25px;
        fill: map.get(colors.$blue, "700");
      }

      .user-icon {
        border-radius: 50%;
        width: 50px;
        height: 50px;
      }
    }
  }
}
</style>
