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
    <img
      class="profile-icon"
      :src="ProfilePng"
      alt="profile"
    >
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
@use "@/style/font-sizes.scss" as font-sizes;
@use "@/style/colors" as colors;

.custom-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 20px;
  align-items: center;
  padding-right: 40px;
  padding-left: 40px;

  .menu-icon {
    @include constants.icon-button;

    display: none;

    // fill: colors.$darkblue-600;
  }

  .page-name {
    color: #2d4e69;
    font-size: font-sizes.$large;
  }

  .profile-icon {
    display: none;
    width: 50px;
    aspect-ratio: 1 / 1;
  }
}

@media (max-width: breakpoints.$small) {
  .custom-header {
    padding-right: 20px;
    padding-left: 20px;

    .menu-icon {
      display: inline;
    }

    .page-name {
      color: #2d4e69;
      font-size: font-sizes.$medium;
    }

    .profile-icon {
      display: inline;
    }
  }
}
</style>
