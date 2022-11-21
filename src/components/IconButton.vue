<template>
  <button class="icon-button">
    <InlineSvg
      class="inline-svg"
      :src="props.value.svgSrc"
    />
  </button>
</template>

<script lang="ts" setup>
import InlineSvg from 'vue-inline-svg'
import { defineProps } from 'vue'

type IconButtonProps = {
  svgSrc: string
}

const props = defineProps<{
  value: IconButtonProps
}>()
</script>

<style lang="scss" scoped>
@use "sass:color";
@use "@/style/colors.scss" as colors;

.icon-button {
  box-sizing: border-box;
  display: grid;
  transition: fill 0.2s ease-out;
  border: none;
  border-radius: 50%;
  background-color: colors.$primary-50-variant;
  cursor: pointer;
  padding: 10px;
  width: 50px;
  aspect-ratio: 1 / 1;
  fill: colors.$primary-600;

  &:hover {
    fill: color.adjust(colors.$primary-500, $lightness: 5%);
  }

  .inline-svg {
    width: 100%;
    aspect-ratio: 1 / 1;
  }
}

</style>
