<template>
  <div class="dashboard-view">
    <div class="header">
      <div class="product-name">
        Weight Manager
      </div>
      <div class="user-info">
        <InlineSvg
          :src="BellSvg"
          class="notification"
        />
        <img
          :src="ProfilePng"
          class="user-icon"
          alt="icon"
        >
      </div>
    </div>
    <CustomSidebar />
    <div class="body">
      <div class="content">
        <div class="info-cards">
          <div class="info-card" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InlineSvg from 'vue-inline-svg'
import gsap from 'gsap'

import UserSvg from '@/assets/user-regular.svg'
import ProfilePng from '@/assets/profile.png'
import BellSvg from '@/assets/bell-regular.svg'
import TableSvg from '@/assets/table-columns-solid.svg'
import RecordSvg from '@/assets/clipboard-regular.svg'
import ChartSvg from '@/assets/chart-simple-solid.svg'
import CustomSidebar from '@/components/CustomSidebar.vue'

type SidebarItem = {
  icon: string,
  class: string,
  path: string
}

export default defineComponent({
  name: 'DashboardView',
  components: {
    InlineSvg,
    CustomSidebar,
  },
  data() {
    return {
      UserSvg,
      ProfilePng,
      BellSvg,
      TableSvg,
      RecordSvg,
      ChartSvg,
    }
  },
  computed: {
    sidebarItems() {
      const sidebarItems: SidebarItem[] = [
        {
          icon: this.TableSvg,
          class: 'dashboard',
          path: '/dashboard',
        },
        {
          icon: this.RecordSvg,
          class: 'records',
          path: '/records',
        },
        {
          icon: this.ChartSvg,
          class: 'graphs',
          path: '/graphs',
        },
      ]
      return sidebarItems
    },
  },
  mounted() {
    this.initAnimations()
  },
  methods: {
    initAnimations() {
      const timeline = gsap.timeline()
      timeline.set('.dashboard-view', {
        backgroundImage: 'linear-gradient(135deg, #fff 0%, #fff 100%)',
      })

      timeline.to('.dashboard-view', {
        backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        duration: 0.25,
      })

      timeline.from('.side-bar-item', {
        y: -150,
        opacity: 0,
        stagger: 0.15,
        ease: 'back',
      }, 0)
      timeline.from('.user-info', {
        x: -150,
        opacity: 0,
        ease: 'back',
        duration: 0.5,
      }, 0)
      timeline.from('.product-name', {
        x: 150,
        opacity: 0,
        ease: 'back',
        duration: 0.5,
      }, 0)
      timeline.from('.info-card', {
        opacity: 0,
        ease: 'power4',
        stagger: 0.05,
      }, 0)
    },
  },
})
</script>

<style lang="scss" scoped>
@use "sass:map";
@use "@/style/constants.scss" as constants;
@use "@/style/colors" as colors;

.dashboard-view {
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

  .header {
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

  .body {
    display: flex;
    grid-area: body;
    column-gap: 20px;

    .content {
      width: 100%;

      .info-cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, 100%);
        gap: 20px;
        height: 100%;

        .info-card {
          border-radius: constants.$border-radius;
          box-shadow: constants.$card-shadow;
          background-color: white;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
