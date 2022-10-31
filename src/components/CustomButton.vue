<template>
  <div
    ref="custom-btn"
    class="custom-btn"
  >
    {{ label }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CustomButton',
  props: {
    label: {
      type: String,
      default: '',
    },
  },
})
</script>

<style lang="scss" scoped>
@use "sass:color";
@use "@/style/colors.scss" as colors;
@use "@/style/box-shadows.scss" as box-shadows;
@use "@/style/font-sizes.scss" as font-sizes;
@use "@/style/constants.scss" as constants;

.custom-btn {
  $background-color: colors.$primary-600;

  user-select: none;
  transition: box-shadow 0.1s ease-in-out, background-color 0.1s ease-in-out;
  border-radius: constants.$border-radius - 2px;
  background-color: $background-color;
  cursor: pointer;
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 10px;
  padding-left: 20px;
  width: fit-content;
  color: white;
  font-size: font-sizes.$small;

  &:hover {
    background-color: color.adjust($background-color, $lightness: 5%);
  }

  &:active {
    background-color: color.adjust($background-color, $lightness: -5%);
  }
}
</style>
