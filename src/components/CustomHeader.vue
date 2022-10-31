<template>
  <div class="custom-header">
    <span class="page-name">
      {{ routeLabel }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import ProfilePng from '@/assets/header-icons/profile.png'
import BellSvg from '@/assets/header-icons/bell-regular.svg'

export default defineComponent({
  name: 'DashboardView',
  components: {
  },
  data() {
    return {
      ProfilePng,
      BellSvg,
    }
  },
  computed: {
    routeLabel() {
      const routeLabel = this.$route.meta.label
      return routeLabel
    },
  },
})
</script>

<style lang="scss" scoped>
@use "@/style/constants.scss" as constants;
@use "@/style/colors" as colors;

.custom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 40px;
  padding-right: 40px;
  padding-left: 40px;

  .page-name {
    margin-right: 10px;
    margin-left: 10px;
    text-align: center;
    color: colors.$darkblue-600;
    font-size: 34px;
  }
}
</style>
