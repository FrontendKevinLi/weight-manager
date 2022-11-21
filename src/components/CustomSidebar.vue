<template>
  <div
    ref="sidebarWrapperRef"
    class="sidebar-wrapper"
  >
    <div
      ref="sidebarMaskRef"
      class="sidebar-mask"
      @click="handleMaskClick"
      @keydown="handleMaskClick"
    />
    <div
      ref="customSidebarRef"
      class="custom-sidebar"
    >
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
  </div>
  <ConfirmDialog
    v-model:value="logoutConfirmDialog"
    @cancel="handleLogoutDialogCancel"
    @confirm="handleLogoutDialogConfirm"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import InlineSvg from 'vue-inline-svg'
import gsap, { Expo } from 'gsap'
import { until } from '@open-draft/until'

import RouteItem from '@/types/RouteItem'
import TableSvg from '@/assets/sidebar-icons/table-columns-solid.svg'
import RecordSvg from '@/assets/sidebar-icons/clipboard-regular.svg'
import CalendarSvg from '@/assets/sidebar-icons/calendar-days-solid.svg'
import ChartSvg from '@/assets/sidebar-icons/chart-simple-solid.svg'
import SettingsSvg from '@/assets/sidebar-icons/gear-solid.svg'
import LogoSvg from '@/assets/logo/svg/lightblue/logo-no-background.svg'
import LogoutSvg from '@/assets/info-panel-icons/right-from-bracket-solid.svg'
import { logout } from '@/firebase/auth'
import ConfirmDialog from '@/components/ConfirmDialog/ConfirmDialog.vue'
import { ConfirmDialogProps } from '@/components/ConfirmDialog/types'
import DashboardSvg from '@/assets/sidebar-icons/gauge-solid.svg'
import useWindowSizeStore from '@/stores/windowSize'
import useFadeController from '@/hooks/useFadeController'

export default defineComponent({
  name: 'CustomSidebar',
  components: {
    InlineSvg,
    ConfirmDialog,
  },
  props: {
    showMobileSidebar: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:show-mobile-sidebar'],
  setup() {
    const sidebarWrapperRef = ref<HTMLElement>()
    const customSidebarRef = ref<HTMLElement>()
    const sidebarMaskRef = ref<HTMLElement>()

    const sidebarWrapperFadeController = useFadeController(sidebarWrapperRef)
    const customSidebarRefFadeController = useFadeController(customSidebarRef)
    const sidebarMaskRefFadeController = useFadeController(sidebarMaskRef)

    const fadeInSidebar = async () => {
      await Promise.allSettled([
        sidebarMaskRefFadeController.fadeIn({ to: 'none' }),
        sidebarWrapperFadeController.fadeIn({ to: 'none' }),
        customSidebarRefFadeController.fadeIn({ to: 'right' }),
      ])
    }

    const fadeOutSidebar = async () => {
      await Promise.allSettled([
        sidebarMaskRefFadeController.fadeOut({ to: 'none' }),
        sidebarWrapperFadeController.fadeOut({ to: 'none' }),
        customSidebarRefFadeController.fadeOut({ to: 'left' }),
      ])
    }

    const showDesktopSidebar = async () => {
      sidebarMaskRefFadeController.hide()
      sidebarWrapperFadeController.show()
      customSidebarRefFadeController.show({ tweenVars: { x: 0 } })
    }

    return {
      sidebarWrapperRef,
      customSidebarRef,
      sidebarMaskRef,
      sidebarWrapperFadeController,
      customSidebarRefFadeController,
      sidebarMaskRefFadeController,
      fadeInSidebar,
      fadeOutSidebar,
      showDesktopSidebar,
    }
  },
  data() {
    return {
      TableSvg,
      RecordSvg,
      ChartSvg,
      LogoSvg,
      SettingsSvg,
      LogoutSvg,
      CalendarSvg,
      DashboardSvg,
      activeItemIndicatorInited: false,
      logoutConfirmDialog: {
        title: 'Log out',
        content: 'Are you sure you want to log out?',
        show: false,
      } as ConfirmDialogProps,
    }
  },
  computed: {
    routeItemList(): RouteItem[] {
      const routeItemList: RouteItem[] = [
        new RouteItem({
          icon: this.DashboardSvg,
          className: 'dashboard',
          path: '/dashboard',
        }),
        new RouteItem({
          icon: this.CalendarSvg,
          className: 'records',
          path: '/records',
        }),
        // new RouteItem({
        //   icon: this.ChartSvg,
        //   className: 'analytics',
        //   path: '/analytics',
        // }),
        // new RouteItem({
        //   icon: this.SettingsSvg,
        //   className: 'settings',
        //   path: '/settings',
        // }),
      ]
      return routeItemList
    },
    isMobile(): boolean {
      const windowSizeStore = useWindowSizeStore()
      return windowSizeStore.isMobile
    },
    currentRoute(): string {
      const currentRoute = this.$route.path
      if (this.activeItemIndicatorInited) {
        this.rePositionActiveIndicator()
      }
      return currentRoute
    },
  },
  watch: {
    showMobileSidebar(showMobileSidebar: boolean) {
      if (!this.isMobile) return

      if (showMobileSidebar) {
        this.fadeInSidebar()
        return
      }

      this.fadeOutSidebar()
    },
    isMobile(isMobile: boolean) {
      if (isMobile) {
        this.sidebarWrapperFadeController.hide()
        return
      }

      this.closeMobileSidebar()
      this.showDesktopSidebar()
    },
  },
  mounted() {
    this.rePositionActiveIndicator(true)
  },
  methods: {
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
      this.closeMobileSidebar()
      await this.$router.push(routeItem.path)
      await this.rePositionActiveIndicator()
    },
    getActiveRouteItemElement() {
      return document.querySelector('.route-item.active')
    },
    rePositionActiveIndicator(isInit = false): Promise<void> {
      return new Promise((resolve) => {
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
            duration: 0.75,
            y: top,
            ease: Expo.easeOut,
            onComplete: () => {
              resolve()
            },
          })
        })
      })
    },
    handleLogoutDialogCancel() {
      this.logoutConfirmDialog.show = false
    },
    async handleLogoutDialogConfirm() {
      const logoutResult = await until(() => logout())
      if (logoutResult.error) {
        console.error(logoutResult.error)
        return
      }

      this.$router.push('/login')
    },
    async handleLogoutButtonClick() {
      this.logoutConfirmDialog.show = true
    },
    closeMobileSidebar() {
      this.$emit('update:show-mobile-sidebar', false)
    },
    handleMaskClick() {
      this.closeMobileSidebar()
    },
  },
})
</script>

<style lang="scss" scoped>
@use "sass:color";
@use "@/style/constants.scss" as constants;
@use "@/style/breakpoints.scss" as breakpoints;
@use "@/style/colors" as colors;

.sidebar-wrapper {
  position: fixed;
  z-index: 10;
  height: 100%;

  .sidebar-mask {
    position: fixed;
    visibility: hidden;
    background-color: rgb(0 0 0 / 50%);
    width: 100vw;
    height: 100%;
  }

  .custom-sidebar {
    $logo-height: 70px;
    $sidebar-width: 120px;

    box-sizing: border-box;
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
    height: 100%;
    overflow-x: hidden;

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

        @media (max-width: breakpoints.$small) {
          gap: 0;
        }
      }

      .active-indicator {
        display: grid;
        position: absolute;
        align-items: center;
        width: 100%;
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
      display: grid;
      place-items: center;
      cursor: pointer;
      width: 100%;
      aspect-ratio: 5/4;

      .logout-icon {
        $size: 30px;

        width: $size;
        height: $size;
        fill: colors.$primary-100;
      }
    }

    @media (max-width: breakpoints.$small) {
      visibility: hidden;
    }

    @media (max-width: breakpoints.$small) {
      transform: translate(-100%);
    }
  }

  @media (max-width: breakpoints.$small) {
    visibility: hidden;
  }
}
</style>
