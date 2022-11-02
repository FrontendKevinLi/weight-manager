<template>
  <div class="custom-calendar">
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
    <div class="calendar-main">
      <div
        v-for="(weekday, index) in weekdayList"
        :key="index"
        ref="headerItemRefList"
        :class="[
          'calendar-item header-item',
        ]"
      >
        <span class="weekday">{{ weekday }}</span>
      </div>
      <div
        v-for="(calendarItem, index) in calendar"
        :key="index"
        ref="dayItemRefList"
        :class="[
          'calendar-item day-item',
          !calendarItem.isTargetMonth && 'not-target'
        ]"
      >
        {{ calendarItem.day }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  nextTick, onMounted, reactive, ref, computed, watch,
} from 'vue'
import { DateTime } from 'luxon'
import gsap from 'gsap'
import InlineSvg from 'vue-inline-svg'

import ArrowLeftSvg from '@/assets/calendar/chevron-left-solid.svg'
import ArrowRightSvg from '@/assets/calendar/chevron-right-solid.svg'

type CalendarItem = {
  weekdayShort: string,
  day: number,
  isTargetMonth: boolean
}

const dayItemRefList = ref<HTMLElement[]>()
const headerItemRefList = ref<HTMLElement[]>()

const calendarInfo = reactive({
  dateTime: DateTime.now().setLocale('en-GB'),
})
const canChangeMonth = ref(true)

const calendarYear = computed(() => calendarInfo.dateTime.year)
const calendarMonth = computed(() => calendarInfo.dateTime.monthLong)

const getFirstDayInMonth = (dateTimeParam: DateTime): DateTime => {
  const firstDay = dateTimeParam.set({
    day: 1,
  })

  return firstDay
}

const getLastDayInMonth = (dateTimeParam: DateTime): DateTime => {
  const lastDay = dateTimeParam.set({
    day: dateTimeParam.daysInMonth,
  })

  return lastDay
}

const generateCalendarListForTargetMonth = (dateTimeParam: DateTime) => {
  const firstDay = getFirstDayInMonth(dateTimeParam)
  const generatedCalendar: CalendarItem[] = []
  for (let i = 0; i < Number(dateTimeParam.daysInMonth); i += 1) {
    const dayInCalendar = firstDay.plus({ day: i })
    const calendarItem: CalendarItem = {
      weekdayShort: dayInCalendar.weekdayShort,
      day: dayInCalendar.day,
      isTargetMonth: true,
    }
    generatedCalendar.push(calendarItem)
  }

  return generatedCalendar
}

const generateCalendarListForPrepend = (dateTimeParam: DateTime) => {
  const firstDay = getFirstDayInMonth(dateTimeParam)
  const firstWeekDayNumber = Number(firstDay.weekday)
  const daysToPrepend = firstWeekDayNumber

  const calendarListForPrepend: CalendarItem[] = []

  for (let i = 1; i <= daysToPrepend; i += 1) {
    const dayToPrepend = firstDay.minus({ day: i })
    const calendarItem: CalendarItem = {
      weekdayShort: dayToPrepend.weekdayShort,
      day: dayToPrepend.day,
      isTargetMonth: false,
    }
    calendarListForPrepend.unshift(calendarItem)
  }

  return calendarListForPrepend
}

const generateCalendarListForAppend = (dateTimeParam: DateTime) => {
  const lastDay = getLastDayInMonth(dateTimeParam)
  const lastWeekDayNumber = Number(lastDay.weekday)
  const daysToAppend = Math.abs((lastWeekDayNumber % 7) - 6)

  const calendarListForAppend: CalendarItem[] = []

  for (let i = 1; i <= daysToAppend; i += 1) {
    const dayToAppend = lastDay.plus({ day: i })
    const calendarItem: CalendarItem = {
      weekdayShort: dayToAppend.weekdayShort,
      day: dayToAppend.day,
      isTargetMonth: false,
    }
    calendarListForAppend.push(calendarItem)
  }

  return calendarListForAppend
}

const generateCalendarList = (dateTimeParam: DateTime): CalendarItem[] => {
  const calendarForTargetMonth: CalendarItem[] = generateCalendarListForTargetMonth(dateTimeParam)
  const calendarForPrepend: CalendarItem[] = generateCalendarListForPrepend(dateTimeParam)
  const calendarForAppend: CalendarItem[] = generateCalendarListForAppend(dateTimeParam)

  return [...calendarForPrepend, ...calendarForTargetMonth, ...calendarForAppend]
}

const generateWeekdayList = (): string[] => {
  const { dateTime } = calendarInfo
  const list: string[] = [dateTime.set({ weekday: 7 }).weekdayLong.toString()]
  for (let i = 1; i <= 6; i += 1) {
    const weekday = dateTime.set({ weekday: i }).weekdayLong.toString()
    list.push(weekday)
  }
  return list
}
const calendar = computed(() => generateCalendarList(calendarInfo.dateTime))
const weekdayList: string[] = generateWeekdayList()

const timeline = gsap.timeline()

const fadeInHeader = () => {
  if (headerItemRefList.value == null) {
    console.error('Header items not found')
    return
  }

  gsap.from(headerItemRefList.value, {
    autoAlpha: 0,
    ease: 'power2.inOut',
    stagger: {
      amount: 0.5,
      from: 'center',
    },
  })
}

const fadeInDayItems = () => new Promise((resolve, reject) => {
  if (dayItemRefList.value == null) {
    reject(Error('Cannot find elements to animation'))
    return
  }

  timeline.set(dayItemRefList.value, {
    autoAlpha: 0,
  })
  timeline.to(dayItemRefList.value, {
    autoAlpha: 1,
    stagger: {
      amount: 0.125,
      from: 'center',
      grid: 'auto',
      ease: 'power2.inOut',
    },
    scale: 1,
    onComplete() {
      resolve(true)
    },
  })
})

const fadeOutDayItems = () => new Promise((resolve, reject) => {
  if (dayItemRefList.value == null) {
    reject(Error('Cannot find elements to animation'))
    return
  }

  timeline.to(dayItemRefList.value, {
    autoAlpha: 0,
    stagger: {
      amount: 0.125,
      from: 'edges',
      grid: 'auto',
      ease: 'power2.inOut',
    },
    scale: 0.5,
    onComplete() {
      resolve(true)
    },
  })
})

watch(() => calendarInfo.dateTime, async () => {
  nextTick(async () => {
    await fadeInDayItems()
    canChangeMonth.value = true
  })
})

const initAnimation = () => {
  fadeInHeader()
  fadeInDayItems()
}

const handlePreviousMonthButtonClick = async () => {
  if (!canChangeMonth.value) return

  timeline.clear()
  canChangeMonth.value = false
  await fadeOutDayItems()
  calendarInfo.dateTime = calendarInfo.dateTime.minus({ month: 1 })
}

const handleNextMonthButtonClick = async () => {
  if (!canChangeMonth.value) return
  timeline.clear()
  canChangeMonth.value = false
  await fadeOutDayItems()
  calendarInfo.dateTime = calendarInfo.dateTime.plus({ month: 1 })
}

onMounted(() => {
  initAnimation()
})

</script>

<style lang="scss" scoped>
@use "sass:color";
@use "@/style/colors.scss" as colors;
@use "@/style/constants.scss" as constants;
@use "@/style/font-sizes.scss" as font-sizes;

.custom-calendar {
  box-sizing: border-box;
  display: grid;
  flex-direction: column;
  grid-template-rows: auto 1fr;
  gap: 20px;
  width: 100%;
  height: 100%;

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

  .calendar-main {
    display: grid;

    // grid-auto-rows: 1fr;
    grid-template-rows: auto repeat(6, minmax(auto, 1fr));

    // grid-template-rows: auto;
    grid-template-columns: repeat(7, 1fr);
    gap: 20px;
    width: 100%;

    .calendar-item {
      box-sizing: border-box;
      display: grid;
      place-items: center;
      visibility: hidden;
      border-radius: constants.$border-radius;
      background-color: white;
      padding: 10px;
      color: colors.$darkblue-400;
      will-change: transform, opacity;

      &.header-item {
        display: grid;
        place-items: center;
        align-self: center;
        background-color: colors.$primary-600;
        letter-spacing: 0.125rem;

        .weekday {
          color: white;
          font-size: font-sizes.$small;
          font-weight: bold;
        }
      }

      &.day-item {
        cursor: pointer;

        &:is(.not-target) {
          background-color: colors.$primary-50-variant;
          cursor: not-allowed;
          color: colors.$darkblue-100;
        }
      }
    }
  }
}
</style>
