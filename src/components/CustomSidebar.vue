<template>
  <div class="custom-sidebar">
    <div class="logo">
      <InlineSvg
        :src="LogoSvg"
      />
    </div>
    <div
      class="route-list-wrapper"
    >
      <div
        class="active-indicator"
      >
        <div class="side-indicator" />
        <div class="background-indicator" />
      </div>
      <div
        ref="routeList"
        class="route-list"
      >
        <div
          v-for="routeItem in routeItemList"
          ref="routeItem"
          :key="routeItem.className"
          :class="[
            'route-item',
            routeItem.className,
            routeItem.slideIn && 'slide-in',
            routeItem.clickable && 'clickable',
            routeItem.path === currentRoute && 'active'
          ]"
          @click.stop="handleRouteItemClick(routeItem)"
          @keydown="handleRouteItemClick(routeItem)"
        >
          <InlineSvg
            :src="routeItem.icon"
          />
        </div>
      </div>
    </div>
    <div
      class="logout-button"
      @click="handleLogoutButtonClick"
      @keydown="handleLogoutButtonClick"
    >
      <InlineSvg
        class="logout-icon"
        :src="LogoutSvg"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InlineSvg from 'vue-inline-svg'
import gsap, { Expo } from 'gsap'

import RouteItem from '@/types/RouteItem'

import TableSvg from '@/assets/sidebar-icons/table-columns-solid.svg'
import RecordSvg from '@/assets/sidebar-icons/clipboard-regular.svg'
import ChartSvg from '@/assets/sidebar-icons/chart-simple-solid.svg'
import SettingsSvg from '@/assets/sidebar-icons/gear-solid.svg'
import LogoSvg from '@/assets/logo/svg/lightblue/logo-no-background.svg'
import LogoutSvg from '@/assets/info-panel-icons/right-from-bracket-solid.svg'
import { until } from '@open-draft/until'
import { logout } from '@/firebase/auth'

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
      LogoutSvg,
      activeItemIndicatorInited: false,
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
          className: 'analytics',
          path: '/analytics',
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
      if (this.activeItemIndicatorInited) {
        this.rePositionActiveIndicator()
      }
      return currentRoute
    },
  },
  mounted() {
    // this.initAnimation()
    this.rePositionActiveIndicator(true)
  },
  methods: {
    initAnimation() {
      const timeline = gsap.timeline()
      timeline.from('.route-item', {
        y: -150,
        opacity: 0,
        stagger: 0.10,
        ease: 'back',
        onComplete: () => {
          // this.rePositionActiveIndicator(true)
        },
      }, 0)
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
    async handleRouteItemClick(routeItem: RouteItem) {
      await this.$router.push(routeItem.path)
      this.rePositionActiveIndicator()
    },
    getActiveRouteItemElement() {
      return document.querySelector('.route-item.active')
    },
    rePositionActiveIndicator(isInit = false) {
      this.$nextTick(() => {
        const timeline = gsap.timeline()
        const routeList = this.$refs.routeList as HTMLElement | undefined
        const activeRouteItemElementTop = this.getActiveRouteItemElement()?.getBoundingClientRect().top ?? 0
        const routeListElementTop = routeList?.getBoundingClientRect().top ?? 0
        const top = activeRouteItemElementTop - routeListElementTop

        if (isInit) {
          timeline.set('.active-indicator', {
            y: top,
          })
          this.activeItemIndicatorInited = true
          return
        }

        timeline.to('.active-indicator', {
          duration: 0.5,
          y: top,
          opacity: 1,
          ease: Expo.easeInOut,
        })
      })
    },
    async handleLogoutButtonClick() {
      const logoutResult = await until(() => logout())
      if (logoutResult.error) {
        console.error(logoutResult.error)
        return
      }

      this.$router.push('/login')
    },
  },
})
</script>

<style lang="scss" scoped>
@use "sass:color";
@use "@/style/constants.scss" as constants;
@use "@/style/colors" as colors;

.custom-sidebar {
  $logo-height: 70px;
  $sidebar-width: 120px;

  display: grid;
  position: relative;
  grid-template-rows: $logo-height 1fr $logo-height;
  grid-template-columns: $sidebar-width;
  place-items: center;
  border-top-right-radius: constants.$border-radius;
  border-bottom-right-radius: constants.$border-radius;
  background-color: colors.$primary-900;
  padding-top: 20px;
  padding-bottom: 20px;

  .logo {
    height: $logo-height;
    aspect-ratio: 1000 / 1125;
  }

  .route-list-wrapper {
    width: 100%;
    height: fit-content;

    .route-list {
      $route-item-size: 30px;

      display: grid;
      position: relative;
      gap: $route-item-size * 0.5;
      place-items: center;
      width: 100%;

      .route-item {
        box-sizing: border-box;
        display: grid;
        position: relative;
        place-items: center;
        transition: fill 0.2s ease-in-out;
        width: 100%;
        aspect-ratio: 5 / 4;
        fill: colors.$primary-100;

        &:is(.clickable) {
          cursor: pointer;
        }

        &:is(.active) {
          fill: white;
        }

        svg {
          width: $route-item-size;
          height: $route-item-size;
        }
      }
    }

    .active-indicator {
      display: grid;
      position: absolute;
      align-items: center;
      width: $sidebar-width;
      aspect-ratio: 5 / 4;

      & > * {
        grid-area: 1 / 1;
      }

      .side-indicator {
        border-top-right-radius: constants.$border-radius;
        border-bottom-right-radius: constants.$border-radius;
        background-color: colors.$primary-200;
        width: 6px;
        height: 100%;
      }

      .background-indicator {
        margin-left: 6px;
        background-color: white;
        height: calc(100% - (constants.$border-radius / 2));
        filter: opacity(0.1);
      }
    }
  }

  .logout-button {
    border-radius: 50%;
    cursor: pointer;
    padding: 15px;
    width: 30px;
    height: 30px;
    aspect-ratio: 1/ 1;

    .logout-icon {
      $size: 30px;

      fill: colors.$primary-100;
    }
  }
}
</style>
