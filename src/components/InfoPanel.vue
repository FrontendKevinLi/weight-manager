<template>
  <div class="info-panel">
    <div class="user-info">
      <img
        :src="ProfilePng"
        class="icon"
        alt="icon"
      >
      <span
        class="username"
        v-text="username"
      />
    </div>
    <div class="achievement-section">
      <span class="title">Achievements</span>
      <div class="achievement-list">
        <AchievementItem
          v-for="achievement in achievementList"
          :key="achievement.id"
          :config="achievement"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProfilePng from '@/assets/header-icons/profile.png'
import { AchievementItemType } from '@/types/AchievementItem'
import { v4 as uuid } from 'uuid'
import AchievementItem from './AchievementItem.vue'

const username = 'Test user'

const achievementList: AchievementItemType[] = [
  {
    id: uuid(),
    title: 'Record everyday this week',
    accomplished: true,
    accomplishedDate: '2022-10-24',
  },
  {
    id: uuid(),
    title: 'Record everyday this month',
    accomplished: true,
    accomplishedDate: '2022-10-24',
  },
  {
    id: uuid(),
    title: 'Record everyday this month',
    accomplished: true,
    accomplishedDate: '2022-10-24',
  },
  {
    id: uuid(),
    title: 'Record everyday this month',
    accomplished: true,
    accomplishedDate: '2022-10-24',
  },
  {
    id: uuid(),
    title: 'Record everyday this month',
    accomplished: true,
    accomplishedDate: '2022-10-24',
  },
  {
    id: uuid(),
    title: 'Record everyday this month',
    accomplished: true,
    accomplishedDate: '2022-10-24',
  },
  {
    id: uuid(),
    title: 'Record everyday this month',
    accomplished: true,
    accomplishedDate: '2022-10-24',
  },
  {
    id: uuid(),
    title: 'Record everyday this month',
    accomplished: true,
    accomplishedDate: '2022-10-24',
  },
  {
    id: uuid(),
    title: 'Record everyday this month',
    accomplished: true,
    accomplishedDate: '2022-10-24',
  },
  {
    id: uuid(),
    title: 'Record everyday this month',
    accomplished: true,
    accomplishedDate: '2022-10-24',
  },
]

</script>

<style lang="scss" scoped>
@use "sass:color";
@use "@/style/constants.scss" as constants;
@use "@/style/colors.scss" as colors;

.info-panel {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 80px;
  border-top-left-radius: constants.$border-radius;
  border-bottom-left-radius: constants.$border-radius;
  background-color: white;
  padding: 50px;

  .user-info {
    display: grid;
    gap: 20px;
    place-content: center;

    .icon {
      height: 150px;
    }

    .username {
      text-align: center;
      color: color.adjust(colors.$blue-900, $lightness: -10%);
      font-size: 20px;
      font-weight: bold;
    }
  }

  .achievement-section {
    display: grid;

    // grid-template-rows: auto minmax(0, 1fr);
    grid-template-rows: auto 1fr;
    gap: 40px;
    overflow-y: hidden;

    &::-webkit-scrollbar {
      border-radius: 12px;
      background-color: colors.$black-400; /* or add it to the track */
      width: 5px;
      height: 8px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 12px;
      background: colors.$black-900;
    }

    .title {
      color: colors.$h2-color;
      font-weight: bold;
    }

    .achievement-list {
      @include constants.custom-scrollbar($track-color: colors.$blue-50, $thumb-color: colors.$blue-900);

      display: grid;
      gap: 20px;
      overflow: auto;
    }
  }
}
</style>
