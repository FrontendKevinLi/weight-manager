<template>
  <div class="custom-header">
    <InlineSvg
      class="menu-icon"
      :src="MenuSvg"
      @click="handleMenuClick"
    />
    <span class="page-name">
      {{ routeLabel }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InlineSvg from 'vue-inline-svg'

import ProfilePng from '@/assets/header-icons/profile.png'
import BellSvg from '@/assets/header-icons/bell-regular.svg'
import MenuSvg from '@/assets/header-icons/bars-solid.svg'

export default defineComponent({
  name: 'CustomHeader',
  components: {
    InlineSvg,
  },
  emits: ['menu-click'],
  data() {
    return {
      ProfilePng,
      BellSvg,
      MenuSvg,
    }
  },
  computed: {
    routeLabel() {
      const routeLabel = this.$route.meta.label
      return routeLabel
    },
  },
  methods: {
    handleMenuClick() {
      this.$emit('menu-click')
    },
  },
})
</script>

<style lang="scss" scoped>
@use "@/style/constants.scss" as constants;
@use "@/style/breakpoints.scss" as breakpoints;
@use "@/style/colors" as colors;

.custom-header {
  display: flex;
  gap: 20px;
  align-items: center;
  padding-top: 40px;
  padding-right: 40px;
  padding-left: 40px;

  .menu-icon {
    display: none;
    width: 30px;
    aspect-ratio: 1 / 1;
    fill: colors.$darkblue-600;

    @media (max-width: breakpoints.$small) {
      display: inline;
    }
  }

  .page-name {
    color: #2d4e69;
    font-size: 34px;
  }

  @media (max-width: breakpoints.$small) {
    padding-top: 0;
    padding-right: 20px;
    padding-left: 20px;
  }
}
</style>
