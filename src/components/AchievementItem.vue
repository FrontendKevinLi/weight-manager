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
@use "@/style/constants.scss" as constants;
@use "@/style/colors.scss" as colors;

.achievement-item {
  display: grid;
  grid-template-areas:
    "icon title"
    "icon date";
  grid-template-columns: 50px 1fr;
  gap: 10px 20px;

  .icon {
    $size: 50px;

    grid-area: icon;
    border-radius: constants.$border-radius;
    background-color: colors.$blue-100;
    width: $size;
    height: $size;
  }

  .title {
    grid-area: title;
    color: colors.$h3-color;
    font-size: 14px;
    font-weight: bold;
  }

  .date {
    grid-area: date;
    color: colors.$blue-200;
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
