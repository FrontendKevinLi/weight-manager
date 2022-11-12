<template>
  <div class="page-layout">
    <CustomHeader
      @menu-click="handleMenuClick"
    />
    <CustomSidebar
      ref="customSidebarRef"
      v-model:show="showSidebar"
    />
    <div class="page-main">
      <router-view />
    </div>
    <InfoPanel />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import CustomSidebar from '@/components/CustomSidebar.vue'
import CustomHeader from '@/components/CustomHeader.vue'
import InfoPanel from '@/components/InfoPanel.vue'
import { auth, getIsAuthenticated } from '@/firebase/auth'
import { until } from '@open-draft/until'
import { useToast } from 'vue-toastification'
import { useUserStore } from '@/stores'

export default defineComponent({
  name: 'DashboardView',
  components: {
    CustomSidebar,
    CustomHeader,
    InfoPanel,
  },
  data() {
    return {
      showSidebar: false,
    }
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
      this.showSidebar = true
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
  grid-template-rows: 90px 1fr;
  grid-template-columns: 120px 1fr 420px;
  width: 100vw;
  min-height: 100vh;
  max-height: 100vh;
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
  }

  @media (max-width: breakpoints.$small) {
    grid-template-areas:
      "header"
      "body";
    grid-template-columns: 1fr;
  }
}
</style>
