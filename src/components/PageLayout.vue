<template>
  <div class="page-layout">
    <CustomHeader />
    <CustomSidebar />
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
  },
})
</script>

<style lang="scss" scoped>
@use "@/style/constants.scss" as constants;
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
  }

  .custom-header {
    grid-area: header;
  }

  .info-panel {
    grid-area: info-panel;
  }
}
</style>
