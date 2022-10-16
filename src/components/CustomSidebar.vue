<template>
  <div class="custom-sidebar">
    <div
      v-for="sidebarItem in sidebarItems"
      :key="sidebarItem.className"
      :class="[
        'custom-sidebar-item',
        sidebarItem.className,
        sidebarItem.slideIn && 'slide-in',
        sidebarItem.background && 'card-view',
        sidebarItem.clickable && 'clickable',
        sidebarItem.path === currentRoute && 'active'
      ]"
    >
      <InlineSvg
        :src="sidebarItem.icon"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InlineSvg from 'vue-inline-svg'
import gsap from 'gsap'

import CustomSidebarItem from '@/types/CustomSidebarItem'

import LogoSvg from '@/assets/logo/svg/logo-no-background.svg'
import TableSvg from '@/assets/sidebar-icons/table-columns-solid.svg'
import RecordSvg from '@/assets/sidebar-icons/clipboard-regular.svg'
import ChartSvg from '@/assets/sidebar-icons/chart-simple-solid.svg'
import SettingsSvg from '@/assets/sidebar-icons/gear-solid.svg'

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
    sidebarItems() {
      const sidebarItems: CustomSidebarItem[] = [
        new CustomSidebarItem({
          icon: this.LogoSvg,
          className: 'logo',
          path: '',
          slideIn: false,
          background: false,
          clickable: false,
        }),
        new CustomSidebarItem({
          icon: this.TableSvg,
          className: 'dashboard',
          path: '/dashboard',
        }),
        new CustomSidebarItem({
          icon: this.RecordSvg,
          className: 'records',
          path: '/records',
        }),
        new CustomSidebarItem({
          icon: this.ChartSvg,
          className: 'graphs',
          path: '/graphs',
        }),
        new CustomSidebarItem({
          icon: this.SettingsSvg,
          className: 'settings',
          path: '/settings',
        }),
      ]
      return sidebarItems
    },
    currentRoute() {
      const currentRoute = this.$router.currentRoute.value.fullPath
      return currentRoute
    },
  },
  mounted() {
    this.initListeners()
    this.initAnimation()
  },
  methods: {
    initAnimation() {
      const timeline = gsap.timeline()
      timeline.from('.custom-sidebar-item', {
        y: -150,
        opacity: 0,
        stagger: 0.10,
        ease: 'back',
      }, 0)
      timeline.set('.custom-sidebar-item.active', {
        scale: 1.2,
        duration: 0.15,
        ease: 'power4',
        fill: '#0050a4',
        marginBottom: 20,
      }, 0)
    },
    initListeners() {
      const sideBarItems = gsap.utils.toArray('.custom-sidebar-item.slide-in') as HTMLElement[]

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
@use "@/style/constants.scss" as constants;
@use "@/style/colors" as colors;

.custom-sidebar {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  align-items: center;
  width: 120px;

  .logo {
    width: 70px;
    height: 70px;
  }

  .custom-sidebar-item {
    box-sizing: border-box;
    padding: 10px;
    width: 70px;
    height: 70px;

    &.card-view {
      border-radius: constants.$border-radius;
      box-shadow: constants.$card-shadow;
      background-color: white;
    }

    &.clickable {
      cursor: pointer;
    }

    &.logo {
      padding: 0;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
