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
        <div
          ref="usernameRef"
          class="username"
          :contenteditable="true"
          @focus="handleUsernameFocus"
          @blur="handleUsernameBlur"
          @input="handleUsernameInput"
          v-text="username"
        />
        <div class="edit-icon">
          <InlineSvg
            :src="EditSvg"
            @click="handleEditIconClick"
          />
        </div>
      </div>
      <CloseButton
        v-if="isMobile"
        @click="handleCloseButtonClick"
        @keydown="handleCloseButtonClick"
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
import {
  onMounted, ref, computed, watch, defineEmits,
} from 'vue'
import { v4 as uuid } from 'uuid'
import gsap, { Expo } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useToast } from 'vue-toastification'
import InlineSvg from 'vue-inline-svg'
import { useRouter } from 'vue-router'

import ProfilePng from '@/assets/header-icons/profile.png'
import EditSvg from '@/assets/info-panel-icons/pen-to-square-solid.svg'
import { AchievementItemType } from '@/types/AchievementItem'
import { setUsername } from '@/firebase/auth'
import { until } from '@open-draft/until'
import { Nullable } from '@/types/utils'
import useWindowSizeStore from '@/stores/windowSize'
import useUserStore from '@/stores/user'
import useFadeController from '@/hooks/useFadeController'
import CloseButton from '@/components/CloseButton.vue'
import AchievementItem from '../AchievementItem.vue'
import { InfoPanelProps } from './types'

gsap.registerPlugin(ScrollTrigger)

type InfoPanelEmits = {
  (e: 'update:value', payload: InfoPanelProps): void
}

const emit = defineEmits<InfoPanelEmits>()
const props = defineProps<{value: InfoPanelProps}>()

const achievementItemList = ref<InstanceType<(typeof AchievementItem)>[]>()
const achievementItemListEl = ref<HTMLElement>()
const usernameRef = ref<HTMLElement>()
const infoPanelRef = ref<HTMLElement>()

const router = useRouter()

const userStore = useUserStore()
const currentUser = computed(() => userStore.currentUser)
const username = ref(currentUser.value?.displayName ?? '')

const windowSizeStore = useWindowSizeStore()
const isMobile = computed(() => windowSizeStore.isMobile)

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

const infoPanelFadeController = useFadeController(infoPanelRef)

const initAnimation = () => {
  if (!isMobile.value) {
    infoPanelFadeController.fadeIn({ to: 'left' })
  }
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
    const toast = useToast()
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

const closeMobileInfoPanel = () => {
  emit('update:value', {
    showMobileInfoPanel: false,
  })
}

const handleCloseButtonClick = () => {
  closeMobileInfoPanel()
}

watch(currentUser, () => {
  username.value = currentUser.value?.displayName ?? ''
})

watch(isMobile, (isMobile) => {
  if (isMobile) {
    infoPanelFadeController.hide()
    return
  }

  infoPanelFadeController.show()
})

watch(props, (props) => {
  if (!isMobile.value) return

  if (props.value.showMobileInfoPanel) {
    router.push({
      name: router.currentRoute.value.name ?? '',
      query: {
        infoPanel: 'open',
      },
    })
    infoPanelFadeController.fadeIn({ to: 'left' })

    return
  }

  infoPanelFadeController.fadeOut({ to: 'right' })
})

onMounted(() => {
  initAnimation()
  router.beforeEach((to, from) => {
    if (from.name === 'dashboard' && from.query.infoPanel === 'open') {
      if (props.value.showMobileInfoPanel) {
        closeMobileInfoPanel()
        return true
      }
    }
    return true
  })
})

</script>

<style lang="scss" scoped>
@use "sass:color";
@use "@/style/constants.scss" as constants;
@use "@/style/breakpoints.scss" as breakpoints;
@use "@/style/colors.scss" as colors;

.info-panel {
  box-sizing: border-box;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 80px;
  z-index: 2;
  border-top-left-radius: constants.$border-radius;
  border-bottom-left-radius: constants.$border-radius;
  background-color: white;
  padding: 50px;
  height: 100%;
  max-height: 100%;

  .user-info {
    display: grid;
    gap: 20px;
    place-items: center;

    .user-icon {
      border-radius: 50%;
      width: 150px;
      aspect-ratio: 1 / 1;
    }

    .username-wrapper {
      display: grid;
      grid-template-columns: 1fr 20px;
      gap: 15px;
      align-items: center;

      .username {
        outline: none;
        width: 100%;
        min-width: 10px;
        overflow: hidden;
        text-align: center;
        color: colors.$darkblue-600;
        font-size: 22px;
        font-weight: bold;
      }

      .edit-icon {
        transition: opacity 0.1s ease-in-out;
        cursor: pointer;
        width: 100%;
        aspect-ratio: 1 / 1;
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

@media (max-width: breakpoints.$small) {
  .info-panel {
    gap: 40px;
    padding: 20px;
    width: 100%;

    .user-info {
      grid-template-areas:
        "close-button close-button"
        "user-icon username-wrapper";
      grid-template-columns: 100px 1fr;
      row-gap: 0;
      column-gap: 40px;
      justify-items: flex-start;

      .user-icon {
        grid-area: user-icon;
        width: 100%;
      }

      .username-wrapper {
        display: grid;
        grid-area: username-wrapper;
      }

      .close-button {
        grid-area: close-button;
        justify-self: flex-end;
      }
    }
  }
}
</style>
