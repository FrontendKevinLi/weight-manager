<template>
  <div
    ref="calendarHeaderRef"
    class="calendar-header"
  >
    <div class="calendar-controls">
      <div class="arrow-icon">
        <InlineSvg
          :src="ArrowLeftSvg"
          @keydown="handlePreviousMonthButtonClick"
          @click="handlePreviousMonthButtonClick"
        />
      </div>
      <div class="calendar-date">
        <span class="year">{{ calendarYear }}</span>
        <span class="month">{{ calendarMonth }}</span>
      </div>
      <div class="arrow-icon">
        <InlineSvg
          :src="ArrowRightSvg"
          @click="handleNextMonthButtonClick"
          @keydown="handleNextMonthButtonClick"
        />
      </div>
    </div>
    <div class="records-controls">
      <div class="add-icon">
        <InlineSvg
          :src="AddSvg"
          @click="handleAddButtonClick"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed, defineProps, defineEmits, ref, onMounted,
} from 'vue'
import { DateTime } from 'luxon'
import gsap, { Expo } from 'gsap'
import InlineSvg from 'vue-inline-svg'

import ArrowLeftSvg from '@/assets/calendar/chevron-left-solid.svg'
import ArrowRightSvg from '@/assets/calendar/chevron-right-solid.svg'
import AddSvg from '@/assets/records/plus-solid.svg'
import useWindowSizeStore from '@/stores/windowSize'

const props = defineProps<{
  dateTime: DateTime,
}>()

const windowSizeStore = useWindowSizeStore()
const isMobile = computed(() => windowSizeStore.isMobile)

const calendarHeaderRef = ref<HTMLElement>()
const emit = defineEmits(['previous-month', 'next-month', 'add'])
// const emit = defineEmits<{(e: 'previous-month'): void
// (e: 'next-month'): void
// }>()

const calendarYear = computed(() => props.dateTime.year)
const calendarMonth = computed(() => (isMobile.value ? props.dateTime.monthShort : props.dateTime.monthLong))

const fadeIn = () => {
  if (calendarHeaderRef.value == null) return

  const timeline = gsap.timeline()

  timeline.fromTo(calendarHeaderRef.value, {
    autoAlpha: 0,
    width: 0,
  }, {
    autoAlpha: 1,
    width: 'auto',
    duration: 1,
    ease: Expo.easeInOut,
  })
}

const handlePreviousMonthButtonClick = async () => {
  emit('previous-month')
}

const handleNextMonthButtonClick = async () => {
  emit('next-month')
}

const handleAddButtonClick = () => {
  emit('add')
}

onMounted(() => {
  fadeIn()
})
</script>

<style lang="scss" scoped>
@use "sass:color";
@use "@/style/colors.scss" as colors;
@use "@/style/constants.scss" as constants;
@use "@/style/breakpoints.scss" as breakpoints;
@use "@/style/font-sizes.scss" as font-sizes;

.calendar-header {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  visibility: hidden;
  border-radius: 25px;
  background-color: white;
  padding-top: 20px;
  padding-right: 40px;
  padding-bottom: 20px;
  padding-left: 40px;

  .calendar-controls {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: center;
    width: fit-content;

    .arrow-icon {
      @include constants.icon-button;
    }

    .calendar-date {
      display: flex;
      color: colors.$darkblue-600;
      font-size: font-sizes.$medium;
      user-select: none;

      .month {
        width: 125px;
        text-align: end;
      }
    }
  }

  .records-controls {
    display: grid;
    align-items: center;
    justify-content: end;

    .add-icon {
      @include constants.icon-button;
    }
  }
}

@media (max-width: breakpoints.$small) {
  .calendar-header {
    gap: 0;
    padding-top: 10px;
    padding-right: 20px;
    padding-bottom: 10px;
    padding-left: 20px;

    .calendar-controls {
      gap: 10px;

      .calendar-date {
        display: flex;
        gap: 10px;
        font-size: font-sizes.$small;

        .month {
          width: 30px;
        }
      }
    }
  }
}
</style>
