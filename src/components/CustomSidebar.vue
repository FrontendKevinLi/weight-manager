<template>
  <div class="custom-sidebar">
    <div
      v-for="sidebarItem in sidebarItems"
      :key="sidebarItem.class"
      :class="['custom-sidebar-item', sidebarItem.class]"
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

import TableSvg from '@/assets/table-columns-solid.svg'
import RecordSvg from '@/assets/clipboard-regular.svg'
import ChartSvg from '@/assets/chart-simple-solid.svg'

type SidebarItem = {
  icon: string,
  class: string,
  path: string
}

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
    }
  },
  computed: {
    sidebarItems() {
      const sidebarItems: SidebarItem[] = [
        {
          icon: this.TableSvg,
          class: 'dashboard',
          path: '/dashboard',
        },
        {
          icon: this.RecordSvg,
          class: 'records',
          path: '/records',
        },
        {
          icon: this.ChartSvg,
          class: 'graphs',
          path: '/graphs',
        },
      ]
      return sidebarItems
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
        stagger: 0.15,
        ease: 'back',
      }, 0)
    },
    initListeners() {
      const sideBarItems = gsap.utils.toArray('.custom-sidebar-item') as HTMLElement[]

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
  row-gap: 30px;
  align-items: center;
  width: 120px;

  .custom-sidebar-item {
    box-sizing: border-box;
    border-radius: constants.$border-radius;
    box-shadow: constants.$card-shadow;
    background-color: white;
    cursor: pointer;
    padding: 10px;
    width: 70px;
    height: 70px;

    svg {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
