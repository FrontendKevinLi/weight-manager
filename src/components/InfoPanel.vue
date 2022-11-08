<template>
  <div
    ref="infoPanelRef"
    class="info-panel"
  >
    <div class="user-info">
      <img
        :src="ProfilePng"
        class="user-icon"
        alt="icon"
      >
      <div class="username-wrapper">
        <span
          ref="usernameRef"
          class="username"
          :contenteditable="true"
          @focus="handleUsernameFocus"
          @blur="handleUsernameBlur"
          @input="handleUsernameInput"
          v-text="username"
        />
        <InlineSvg
          class="edit-icon"
          :src="EditSvg"
          @click="handleEditIconClick"
        />
      </div>
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
import {
  onMounted, ref, computed, watch,
} from 'vue'
import { v4 as uuid } from 'uuid'
import gsap, { Expo } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useToast } from 'vue-toastification'
import InlineSvg from 'vue-inline-svg'

import ProfilePng from '@/assets/header-icons/profile.png'
import EditSvg from '@/assets/info-panel-icons/pen-to-square-solid.svg'
import { AchievementItemType } from '@/types/AchievementItem'
import { useUserStore } from '@/stores'
import { setUsername } from '@/firebase/auth'
import { until } from '@open-draft/until'
import { Nullable } from '@/types/utils'
import AchievementItem from './AchievementItem.vue'

gsap.registerPlugin(ScrollTrigger)

const achievementItemList = ref<InstanceType<(typeof AchievementItem)>[]>()
const achievementItemListEl = ref<HTMLElement>()
const usernameRef = ref<HTMLElement>()
const infoPanelRef = ref<HTMLElement>()

const userStore = useUserStore()
const toast = useToast()
const currentUser = computed(() => userStore.currentUser)
const username = ref(currentUser.value?.displayName ?? '')
const usernameBefore = ref<Nullable<string>>('')

const achievementList: AchievementItemType[] = [
  {
    id: uuid(),
    title: 'First record',
    accomplished: true,
    accomplishedDate: '2022-10-01',
  },
  {
    id: uuid(),
    title: 'Record everyday this week',
    accomplished: true,
    accomplishedDate: '2022-10-09',
  },
  {
    id: uuid(),
    title: 'Record everyday this month',
    accomplished: true,
    accomplishedDate: '2022-10-30',
  },
  {
    id: uuid(),
    title: 'Record 2 months in a row',
    accomplished: true,
    accomplishedDate: '2022-11-01',
  },
  {
    id: uuid(),
    title: 'Hundreds of records',
    accomplished: true,
    accomplishedDate: '2022-10-24',
  },
  {
    id: uuid(),
    title: 'Record 3 months in a row',
    accomplished: true,
    accomplishedDate: '2022-10-24',
  },
  {
    id: uuid(),
    title: 'Record 4 months in a row',
    accomplished: true,
    accomplishedDate: '2022-10-24',
  },
  {
    id: uuid(),
    title: 'Record 5 months in a row',
    accomplished: true,
    accomplishedDate: '2022-10-24',
  },
  {
    id: uuid(),
    title: 'Record 6 months in a row',
    accomplished: true,
    accomplishedDate: '2022-10-24',
  },
  {
    id: uuid(),
    title: 'Record 7 months in a row',
    accomplished: true,
    accomplishedDate: '2022-10-24',
  },
]

const achievementItemElList = computed(() => achievementItemList.value?.map((achievementItem) => achievementItem.$el as HTMLElement))

const initAchievementItemElListScrollTrigger = () => {
  achievementItemElList.value?.forEach((achievementItemEl) => {
    gsap.set(achievementItemEl, {
      x: 150,
      autoAlpha: 0,
    })

    gsap.to(achievementItemEl, {
      scrollTrigger: {
        trigger: achievementItemEl,
        scroller: achievementItemListEl.value,
        start: 'top 95%',
        toggleActions: 'play none none reset',
      },
      x: 0,
      autoAlpha: 1,
      duration: 0.75,
      ease: Expo.easeOut,
    })
  })
}

const fadeInInfoPanel = () => {
  if (infoPanelRef.value == null) return

  const timeline = gsap.timeline()
  timeline.set(infoPanelRef.value, {
    autoAlpha: 0,
    x: '100%',
  })
  timeline.to(infoPanelRef.value, {
    autoAlpha: 1,
    x: 0,
    duration: 1,
    ease: Expo.easeInOut,
  })
}

const initAnimation = () => {
  fadeInInfoPanel()
  initAchievementItemElListScrollTrigger()
}

const handleUsernameFocus = () => {
  usernameBefore.value = userStore.currentUser?.displayName
}

const handleUsernameBlur = async () => {
  // prevent api request if updated username is the same as before
  if (usernameBefore.value === username.value) return

  const result = await until(() => setUsername(username.value))
  if (result.error) {
    toast.error(result.error.message)
  }
}

const handleUsernameInput = (e: Event) => {
  const target = e.target as HTMLElement
  const newUsername = target.innerText
  username.value = newUsername
}

const handleEditIconClick = () => {
  usernameRef.value?.focus()
}

watch(currentUser, () => {
  username.value = currentUser.value?.displayName ?? ''
})

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
    place-items: center;

    .user-icon {
      border-radius: 50%;
      height: 150px;
    }

    .username-wrapper {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 15px;

      .username {
        grid-column: 2;
        outline: none;
        width: 100%;
        min-width: 10px;
        overflow: hidden;
        text-align: center;
        color: colors.$darkblue-600;
        font-size: 20px;
        font-weight: bold;
      }

      .edit-icon {
        $size: 20px;
        $gap: 20px;

        grid-column: 3;
        transition: opacity 0.1s ease-in-out;
        visibility: visible;
        cursor: pointer;
        width: $size;
        height: $size;
        fill: colors.$primary-600;
      }

      .username:focus + .edit-icon {
        opacity: 0;
      }
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

      .achievement-item {
        visibility: hidden;
      }
    }
  }
}
</style>
