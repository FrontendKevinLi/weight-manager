<template>
  <div
    ref="calendarHeaderRef"
    class="calendar-header"
  >
    <div class="calendar-controls">
      <InlineSvg
        class="arrow-icon"
        :src="ArrowLeftSvg"
        @keydown="handlePreviousMonthButtonClick"
        @click="handlePreviousMonthButtonClick"
      />
      <div class="calendar-date">
        <span class="year">{{ calendarYear }}</span>
        <span class="month">{{ calendarMonth }}</span>
      </div>
      <InlineSvg
        class="arrow-icon"
        :src="ArrowRightSvg"
        @click="handleNextMonthButtonClick"
        @keydown="handleNextMonthButtonClick"
      />
    </div>
    <div class="records-controls">
      <InlineSvg
        class="add-icon"
        :src="AddSvg"
        @click="handleAddButtonClick"
      />
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

const props = defineProps<{
  dateTime: DateTime,
}>()

const calendarHeaderRef = ref<HTMLElement>()
const emit = defineEmits(['previous-month', 'next-month', 'add'])
// const emit = defineEmits<{(e: 'previous-month'): void
// (e: 'next-month'): void
// }>()

const calendarYear = computed(() => props.dateTime.year)
const calendarMonth = computed(() => props.dateTime.monthLong)

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
@use "@/style/font-sizes.scss" as font-sizes;

@mixin icon-button {
  display: grid;
  transition: fill 0.2s ease-out;
  border-radius: 50%;
  background-color: colors.$primary-50-variant;
  cursor: pointer;
  padding: 10px;
  width: 30px;
  aspect-ratio: 1 / 1;
  fill: colors.$primary-600;

  &:hover {
    fill: color.adjust(colors.$primary-500, $lightness: 5%);
  }

  &:active {
    fill: color.adjust(colors.$primary-500, $lightness: -5%);
  }
}

.calendar-header {
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
      @include icon-button;
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
      @include icon-button;
    }
  }
}
</style>
