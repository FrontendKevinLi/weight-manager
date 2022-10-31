<template>
  <div class="achievement-item">
    <div class="icon" />
    <div
      class="title"
      v-text="config.title"
    />
    <div
      class="date"
      v-text="config.accomplishedDate"
    />
  </div>
</template>

<script setup lang="ts">
import {
  defineProps, computed,
} from 'vue'
import { AchievementItemType } from '@/types/AchievementItem'

const props = defineProps<{config: AchievementItemType}>()

const config = computed(() => props.config)

</script>

<style lang='scss' scoped>
@use "sass:color";
@use "@/style/constants.scss" as constants;
@use "@/style/colors.scss" as colors;
@use "@/style/box-shadows.scss" as box-shadows;

.achievement-item {
  display: grid;
  grid-template-areas:
    "icon title"
    "icon date";
  grid-template-columns: 50px 1fr;
  gap: 10px 20px;
  transition: box-shadow 0.2s ease-in-out;
  border-radius: constants.$border-radius;
  background-color: colors.$primary-50-variant;
  padding: 20px;
  padding-right: 10px;
  padding-left: 10px;

  &:hover {
    cursor: pointer;
  }

  .icon {
    $size: 50px;

    grid-area: icon;
    place-self: center;
    border-radius: constants.$border-radius;
    background-color: colors.$primary-100;
    width: $size;
    height: $size;
  }

  .title {
    grid-area: title;
    color: colors.$darkblue-500;
    font-size: 14px;
    font-weight: bold;
  }

  .date {
    grid-area: date;
    color: colors.$darkblue-200;
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
