<template>
  <IconButton
    class="close-button"
    :value="{svgSrc: XMarkSvg}"
  />
</template>

<script lang="ts" setup>
import IconButton from '@/components/IconButton.vue'
import XMarkSvg from '@/assets/dialog/xmark-solid.svg'

</script>

<style lang="scss" scoped>
.close-button {
  width: 40px;
}
</style>
