<template>
  <div class="page-layout">
    <CustomHeader
      @menu-click="handleMenuClick"
      @profile-icon-click="handleProfileIconClick"
    />
    <CustomSidebar
      ref="customSidebarRef"
      v-model:show-mobile-sidebar="showMobileSidebar"
    />
    <div class="page-main">
      <router-view />
    </div>
    <InfoPanel
      v-model:value="infoPanelProps"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import CustomSidebar from '@/components/CustomSidebar.vue'
import CustomHeader from '@/components/CustomHeader.vue'
import InfoPanel from '@/components/InfoPanel/InfoPanel.vue'
import { auth, getIsAuthenticated } from '@/firebase/auth'
import { until } from '@open-draft/until'
import { useToast } from 'vue-toastification'
import { useUserStore } from '@/stores'
import { RouterView } from 'vue-router'
import { InfoPanelProps } from '@/components/InfoPanel/types'

export default defineComponent({
  name: 'PageLayout',
  components: {
    CustomSidebar,
    CustomHeader,
    InfoPanel,
  },
  data() {
    return {
      showMobileSidebar: false,
      infoPanelProps: {
        showMobileInfoPanel: false,
      } as InfoPanelProps,
    }
  },
  computed: {
    infoPanel(): string {
      const infoPanel = this.$route.query.infoPanel as string
      return infoPanel
    },
  },
  watch: {
    infoPanel(infoPanel) {
      this.infoPanelProps.showMobileInfoPanel = infoPanel === 'open'
    },
  },
  async mounted() {
    this.setCurrentUser()
  },
  methods: {

    async setCurrentUser() {
      const isAuthenticatedResult = await until(() => getIsAuthenticated())
      if (isAuthenticatedResult.error) {
        const toast = useToast()
        toast.error(isAuthenticatedResult.error.message)
      }

      const userStore = useUserStore()
      userStore.setCurrentUser(auth.currentUser)
    },
    handleMenuClick() {
      this.showMobileSidebar = true
    },
    handleProfileIconClick() {
      this.infoPanelProps.showMobileInfoPanel = true
    },
  },
})
</script>

<style lang="scss" scoped>
@use "@/style/constants.scss" as constants;
@use "@/style/breakpoints.scss" as breakpoints;
@use "@/style/colors" as colors;

.page-layout {
  box-sizing: border-box;
  display: grid;
  flex-direction: column;
  grid-template-areas:
    "sidebar header info-panel"
    "sidebar body info-panel";
  grid-template-rows: auto 1fr;
  grid-template-columns: 120px 1fr 420px;
  width: 100vw;
  height: 100%;
  max-height: 100%;
  overflow: hidden;

  .custom-sidebar {
    grid-area: sidebar;

    @media (max-width: breakpoints.$small) {
      position: fixed;
      top: 0;
      left: 0;
      visibility: hidden;
      z-index: 9999;
      height: 100%;
    }
  }

  .custom-header {
    grid-area: header;
    padding: 40px;
  }

  .info-panel {
    grid-area: info-panel;

    @media (max-width: breakpoints.$small) {
      position: fixed;
      right: 0;
      visibility: hidden;
    }
  }

  .page-main {
    grid-area: body;
    padding: 40px;
  }

  @media (max-width: breakpoints.$small) {
    & {
      grid-template-areas:
        "header"
        "body";
      grid-template-columns: 1fr;

      .custom-header {
        padding: 20px;
      }

      .page-main {
        padding: 20px;
      }
    }
  }
}
</style>
