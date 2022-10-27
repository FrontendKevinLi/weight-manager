<template>
  <div class="custom-sidebar">
    <div class="logo">
      <InlineSvg
        :src="LogoSvg"
      />
    </div>
    <div class="route-list">
      <div
        v-for="routeItem in routeItemList"
        :key="routeItem.className"
        :class="[
          'route-item',
          routeItem.className,
          routeItem.slideIn && 'slide-in',
          // routeItem.background && 'card-view',
          routeItem.clickable && 'clickable',
          routeItem.path === currentRoute && 'active'
        ]"
      >
        <div class="active-indicator" />
        <InlineSvg
          :src="routeItem.icon"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InlineSvg from 'vue-inline-svg'
import gsap from 'gsap'

import RouteItem from '@/types/RouteItem'

// import LogoSvg from '@/assets/logo/svg/logo-no-background.svg'
import TableSvg from '@/assets/sidebar-icons/table-columns-solid.svg'
import RecordSvg from '@/assets/sidebar-icons/clipboard-regular.svg'
import ChartSvg from '@/assets/sidebar-icons/chart-simple-solid.svg'
import SettingsSvg from '@/assets/sidebar-icons/gear-solid.svg'
import LogoSvg from '@/assets/logo/svg/lightblue/logo-no-background.svg'

export default defineComponent({
  name: 'CustomSidebar',
  components: {
    InlineSvg,
  },
  data() {
    return {
      TableSvg,
      RecordSvg,
      ChartSvg,
      LogoSvg,
      SettingsSvg,
    }
  },
  computed: {
    routeItemList() {
      const routeItemList: RouteItem[] = [
        new RouteItem({
          icon: this.TableSvg,
          className: 'dashboard',
          path: '/dashboard',
        }),
        new RouteItem({
          icon: this.RecordSvg,
          className: 'records',
          path: '/records',
        }),
        new RouteItem({
          icon: this.ChartSvg,
          className: 'graphs',
          path: '/graphs',
        }),
        new RouteItem({
          icon: this.SettingsSvg,
          className: 'settings',
          path: '/settings',
        }),
      ]
      return routeItemList
    },
    currentRoute() {
      const currentRoute = this.$router.currentRoute.value.fullPath
      return currentRoute
    },
  },
  mounted() {
    // this.initListeners()
    this.initAnimation()
  },
  methods: {
    initAnimation() {
      const timeline = gsap.timeline()
      timeline.from('.route-item', {
        y: -150,
        opacity: 0,
        stagger: 0.10,
        ease: 'back',
      }, 0)
      timeline.set('.route-item.active', {
        duration: 0.15,
        ease: 'power4',
        fill: '#e0ebfc',
      }, 0)
      timeline.from('.route-item.active .active-indicator', {
        duration: 0.5,
        y: -150,
        opacity: 0,
        ease: 'back',
      }, '-=0.50')
    },
    initListeners() {
      const sideBarItems = gsap.utils.toArray('.route-item.slide-in') as HTMLElement[]

      sideBarItems.forEach((sideBarItem) => {
        gsap.set(sideBarItem, {
          transformOrigin: 'center',
          fill: '#99b0d3',
        })
        sideBarItem.addEventListener('mouseenter', () => {
          gsap.to(sideBarItem, {
            scale: 1.2,
            duration: 0.15,
            ease: 'power4',
            fill: '#0050a4',
            marginBottom: 20,
          })
        })
        sideBarItem.addEventListener('mouseleave', () => {
          if (sideBarItem.classList.contains('active')) return
          gsap.to(sideBarItem, {
            scale: 1,
            duration: 0.15,
            ease: 'power2',
            fill: '#99b0d3',
            marginBottom: 0,
          })
        })
      })
    },
  },
})
</script>

<style lang="scss" scoped>
@use "sass:map";
@use "sass:color";
@use "@/style/constants.scss" as constants;
@use "@/style/colors" as colors;

.custom-sidebar {
  $logo-height: 70px;

  display: grid;
  grid-template-rows: $logo-height 1fr $logo-height;
  grid-template-columns: 120px;
  place-items: center;
  border-top-right-radius: constants.$border-radius;
  border-bottom-right-radius: constants.$border-radius;
  background-color: colors.$darkblue-800;
  padding-top: 20px;
  padding-bottom: 20px;

  .logo {
    height: $logo-height;
    aspect-ratio: 1000 / 1125;
  }

  .route-list {
    $route-item-size: 30px;

    display: grid;
    gap: $route-item-size * 0.5;
    place-items: center;
    width: 100%;

    .route-item {
      box-sizing: border-box;
      display: grid;
      position: relative;
      place-items: center;
      width: 100%;
      aspect-ratio: 1 / 1;
      fill: colors.$darkblue-400;

      &:is(.clickable) {
        cursor: pointer;
      }

      &:is(.card-view) {
        border-radius: constants.$border-radius;
        box-shadow: constants.$card-shadow;
        background-color: white;
      }

      &:is(.active) {
        // background-color: color.adjust(colors.$darkblue-800, $lightness: 5%);

        .active-indicator {
          position: absolute;
          left: 0;
          border-top-right-radius: constants.$border-radius;
          border-bottom-right-radius: constants.$border-radius;
          background-color: colors.$black-100;
          width: 6px;
          height: 80%;
          content: "";
        }
      }

      svg {
        width: $route-item-size;
        height: $route-item-size;
      }
    }
  }
}
</style>
