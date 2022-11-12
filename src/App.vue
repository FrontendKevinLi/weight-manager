<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import useWindowSizeStore from '@/stores/windowSize'

const setCurrentWidth = () => {
  const windowSizeStore = useWindowSizeStore()
  windowSizeStore.setCurrentWidth(window.innerWidth)
}

const initResizeListener = () => {
  window.addEventListener('resize', setCurrentWidth)
}

const cleanUpResizeListener = () => {
  window.removeEventListener('resize', setCurrentWidth)
}

onMounted(() => {
  const windowSizeStore = useWindowSizeStore()
  windowSizeStore.setCurrentWidth(window.innerWidth)
  initResizeListener()
})

onUnmounted(() => {
  cleanUpResizeListener()
})

</script>
