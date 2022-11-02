<template>
  <div class="calendar-header">
    <div
      class="previous-month-button header-button"
      @click="handlePreviousMonthButtonClick"
      @keydown="handlePreviousMonthButtonClick"
    >
      <InlineSvg :src="ArrowLeftSvg" />
    </div>
    <div class="calendar-date">
      <span class="year">{{ calendarYear }}</span>
      <span class="month">{{ calendarMonth }}</span>
    </div>
    <div
      class="next-month-button header-button"
      @click="handleNextMonthButtonClick"
      @keydown="handleNextMonthButtonClick"
    >
      <InlineSvg :src="ArrowRightSvg" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed, defineProps, defineEmits,
} from 'vue'
import { DateTime } from 'luxon'
// import gsap from 'gsap'
import InlineSvg from 'vue-inline-svg'

import ArrowLeftSvg from '@/assets/calendar/chevron-left-solid.svg'
import ArrowRightSvg from '@/assets/calendar/chevron-right-solid.svg'

const props = defineProps<{
  dateTime: DateTime,
}>()

const emit = defineEmits(['previous-month', 'next-month'])
// const emit = defineEmits<{(e: 'previous-month'): void
// (e: 'next-month'): void
// }>()

const calendarYear = computed(() => props.dateTime.year)
const calendarMonth = computed(() => props.dateTime.monthLong)

const handlePreviousMonthButtonClick = async () => {
  emit('previous-month')
}

const handleNextMonthButtonClick = async () => {
  emit('next-month')
}
</script>

<style lang="scss" scoped>
@use "sass:color";
@use "@/style/colors.scss" as colors;
@use "@/style/font-sizes.scss" as font-sizes;

.calendar-header {
  display: flex;
  gap: 30px;
  align-items: center;
  justify-content: center;

  .header-button {
    transition: fill 0.2s ease-out;
    cursor: pointer;
    padding-right: 20px;
    padding-left: 20px;
    width: 30px;
    fill: colors.$primary-600;

    &:hover {
      fill: color.adjust(colors.$primary-500, $lightness: 5%);
    }
  }

  .calendar-date {
    display: flex;
    gap: 20px;
    color: colors.$darkblue-600;
    font-size: font-sizes.$medium;
    user-select: none;

    .month {
      width: 125px;
      text-align: end;
    }
  }
}
</style>
