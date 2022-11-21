<template>
  <div
    class="labeled-icon-button"
  >
    <span class="label">{{ props.label }}</span>
    <InlineSvg
      :src="props.svgSrc"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import InlineSvg from 'vue-inline-svg'

type LabeledIconButtonProps = {
  label: string
  svgSrc: string
}

const props = defineProps<LabeledIconButtonProps>()

</script>

<style lang="scss" scoped>
@use "sass:color";
@use "@/style/constants.scss" as constants;
@use "@/style/colors.scss" as colors;
@use "@/style/font-sizes.scss" as font-sizes;

.labeled-icon-button {
  display: flex;
  gap: 15px;
  align-items: center;
  transition: color 0.2s ease-out, fill 0.2s ease-out;
  border-radius: constants.$border-radius;
  background-color: colors.$primary-50-variant;
  cursor: pointer;
  padding: 20px;
  color: colors.$primary-600;
  font-size: font-sizes.$small;
  fill: colors.$primary-600;

  &:hover {
    color: color.adjust(colors.$primary-500, $lightness: 5%);
    fill: color.adjust(colors.$primary-500, $lightness: 5%);
  }

  &:active {
    color: color.adjust(colors.$primary-500, $lightness: -5%);
    fill: color.adjust(colors.$primary-500, $lightness: -5%);
  }

  svg {
    width: 20px;
    aspect-ratio: 1 / 1;
  }
}
</style>
