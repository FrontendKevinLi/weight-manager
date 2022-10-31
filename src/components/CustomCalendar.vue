<template>
  <div class="custom-calendar">
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
</template>

<script lang="ts" setup>
import {
  nextTick, onMounted, reactive, ref,
} from 'vue'
import { DateTime } from 'luxon'
import gsap from 'gsap'

type CalendarItem = {
  weekdayShort: string,
  day: number,
  isTargetMonth: boolean
}
const timeline = gsap.timeline()
const calendar: CalendarItem[] = reactive([])
const weekdayList: string[] = reactive([])
const dayItemRefList = ref<HTMLElement[]>()
const headerItemRefList = ref<HTMLElement[]>()

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
  console.log(daysToAppend)

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
  // generate days for target month
  const calendarForTargetMonth: CalendarItem[] = generateCalendarListForTargetMonth(dateTimeParam)

  // generate days for prepend (previous) month
  const calendarForPrepend: CalendarItem[] = generateCalendarListForPrepend(dateTimeParam)

  // generate days for append (next) month
  const calendarForAppend: CalendarItem[] = generateCalendarListForAppend(dateTimeParam)

  return [...calendarForPrepend, ...calendarForTargetMonth, ...calendarForAppend]
}

const generateWeekdayList = (): string[] => {
  const dateTime = DateTime.now().setLocale('en-GB')
  const list: string[] = [dateTime.set({ weekday: 7 }).weekdayLong.toString()]
  for (let i = 1; i <= 6; i += 1) {
    const weekday = dateTime.set({ weekday: i }).weekdayLong.toString()
    list.push(weekday)
  }
  return list
}

const initHeaderAnimation = () => {
  if (headerItemRefList.value == null) return

  timeline.from(headerItemRefList.value, {
    opacity: 0,
    ease: 'power2.inOut',
    stagger: {
      amount: 0.5,
      from: 'center',
      grid: 'auto',
    },
  }, 0)
}

const initDayItemListAnimation = () => {
  if (dayItemRefList.value == null) return

  timeline.from(dayItemRefList.value, {
    opacity: 0,
    stagger: {
      amount: 0.5,
      from: 'center',
      grid: 'auto',
      ease: 'power2.inOut',
    },
    scale: 0.5,
  }, 0)
}

const initAnimation = () => {
  // initHeaderAnimation()
  initDayItemListAnimation()
}

onMounted(() => {
  const dateTime = DateTime.now().setLocale('en-us')
  calendar.push(...generateCalendarList(dateTime))
  weekdayList.push(...generateWeekdayList())
  nextTick(() => {
    console.log(headerItemRefList.value)
    initAnimation()
  })
})

</script>

<style lang="scss" scoped>
@use "@/style/colors.scss" as colors;
@use "@/style/constants.scss" as constants;
@use "@/style/font-sizes.scss" as font-sizes;

.custom-calendar {
  box-sizing: border-box;
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr;
  gap: 20px;
  padding: 40px;
  width: 100%;
  height: 100%;

  .calendar-item {
    box-sizing: border-box;
    display: grid;
    place-items: center;
    border-radius: constants.$border-radius;
    background-color: white;
    padding: 10px;
    color: colors.$darkblue-400;

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
      &:is(.not-target) {
        background-color: colors.$primary-50-variant;
        color: colors.$darkblue-100;
      }
    }
  }
}
</style>
