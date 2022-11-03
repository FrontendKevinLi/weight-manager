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
      <div
        ref="achievementItemListEl"
        class="achievement-list"
      >
        <AchievementItem
          v-for="achievement in achievementList"
          ref="achievementItemList"
          :key="achievement.id"
          :config="achievement"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { v4 as uuid } from 'uuid'
import gsap, { Power1 } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

import ProfilePng from '@/assets/header-icons/profile.png'
import { AchievementItemType } from '@/types/AchievementItem'
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
import AchievementItem from './AchievementItem.vue'

gsap.registerPlugin(ScrollTrigger)

// const username = 'Test user'
const achievementItemList = ref<InstanceType<(typeof AchievementItem)>[]>()
const achievementItemListEl = ref<HTMLElement>()

const userStore = useUserStore()
const username = computed(() => userStore.username)
userStore.setUserName('abc')
// const { username } = storeToRefs(userStore)

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

const achievementItemElList = computed(() => achievementItemList.value?.map((achievementItem) => achievementItem.$el as HTMLElement))

const initAchievementItemElListScrollTrigger = () => {
  achievementItemElList.value?.forEach((achievementItemEl) => {
    gsap.from(achievementItemEl, {
      scrollTrigger: {
        trigger: achievementItemEl,
        scroller: achievementItemListEl.value,
        start: 'top 100%',
        toggleActions: 'play none none reverse',
      },
      x: 150,
      opacity: 0,
      duration: 0.75,
      ease: Power1.easeInOut,
    })
  })
}

const initAnimation = () => {
  initAchievementItemElListScrollTrigger()
}

onMounted(() => {
  initAnimation()
})

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
      border-radius: 50%;
      height: 150px;
    }

    .username {
      text-align: center;
      color: colors.$darkblue-600;
      font-size: 20px;
      font-weight: bold;
    }
  }

  .achievement-section {
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 20px;
    overflow-y: hidden;

    .title {
      margin-left: (constants.$border-radius / 2);
      color: colors.$darkblue-600;
      font-weight: bold;
    }

    .achievement-list {
      @include constants.custom-scrollbar;

      display: grid;
      gap: 15px;
      padding-right: 20px;
      padding-left: 5px;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
}
</style>
