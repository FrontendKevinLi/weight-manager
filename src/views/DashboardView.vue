<template>
  <div class="dashboard-view">
    <div class="header">
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
    <div class="body">
      <div class="side-bar">
        <div
          v-for="sidebarItem in sidebarItems"
          :key="sidebarItem.class"
          :class="['side-bar-item', sidebarItem.class]"
        >
          <InlineSvg
            :src="sidebarItem.icon"
          />
        </div>
      </div>
      <div class="content" />
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

type SidebarItem = {
  icon: any,
  class: string,
  path: string
}

export default defineComponent({
  name: 'DashboardView',
  components: {
    InlineSvg,
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
    const timeline = gsap.timeline()

    timeline.from('.side-bar-item', {
      y: -150,
      opacity: 0,
      stagger: 0.15,
      ease: 'back',
    })
    timeline.from('.user-info', {
      x: -150,
      opacity: 0,
      ease: 'back',
      duration: 0.5,
    }, '-=0.45')
  },
})
</script>

<style lang="scss" scoped>
@use "sass:map";
@use "@/style/constants.scss" as constants;
@use "@/style/colors" as colors;

.dashboard-view {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  row-gap: 40px;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  background-blend-mode: screen;
  padding-top: 20px;
  padding-right: 40px;
  padding-bottom: 20px;
  padding-left: 40px;
  width: 100vw;
  height: 100vh;

  .header {
    display: flex;
    justify-content: flex-end;
    width: 100%;

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
        fill: map.get(colors.$blue, "300");
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
    height: 100%;

    .side-bar {
      display: flex;
      flex-direction: column;
      row-gap: 30px;

      .side-bar-item {
        box-sizing: border-box;
        border-radius: constants.$border-radius;
        box-shadow: constants.$card-shadow;
        background-color: white;
        cursor: pointer;
        padding: 10px;
        width: 70px;
        height: 70px;
        fill: map.get(colors.$blue, "300");

        svg {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
