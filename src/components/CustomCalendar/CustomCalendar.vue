<template>
  <div class="custom-calendar">
    <CalendarHeader
      :date-time="calendarInfo.dateTime"
      @previous-month="handlePreviousMonthButtonClick"
      @next-month="handleNextMonthButtonClick"
    />
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
        v-for="(calendarItem, index) in calendarList"
        :key="index"
        ref="dayItemRefList"
        :class="[
          'calendar-item day-item',
          !calendarItem.isTargetMonth && 'not-target'
        ]"
        @click="handleCalendarDayItemClick(calendarItem)"
        @keydown="handleCalendarDayItemClick(calendarItem)"
      >
        {{ calendarItem.day }}
      </div>
    </div>
    <CalendarItemDialog
      v-model:value="dayItemInfoDialogProps.value"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  nextTick, onMounted, reactive, ref, computed, watch,
} from 'vue'
import { DateTime } from 'luxon'
import gsap from 'gsap'
import { getMonthlyRecords } from '@/firebase/firestore'
import { until } from '@open-draft/until'
import { useToast } from 'vue-toastification'
import ApiError from '@/utils/Errors'
import { CalendarItem, CalendarItemDialogProps } from './types'
import CalendarHeader from './CalendarHeader.vue'
import CalendarItemDialog from './CalendarItemDialog.vue'

const dayItemRefList = ref<HTMLElement[]>()
const headerItemRefList = ref<HTMLElement[]>()
const calendarInfo = reactive({
  dateTime: DateTime.now().setLocale('en-GB').set({
    hour: 0, minute: 0, second: 0, millisecond: 0,
  }),
})
const canChangeMonth = ref(true)
const dayItemInfoDialogProps = reactive<{
  value: CalendarItemDialogProps
}>({
  value: {
    show: false,
    calendarItem: {
      dateTime: DateTime.now(),
      day: DateTime.now().day,
      isTargetMonth: false,
      weekdayShort: DateTime.now().weekdayShort,
      weight: '0.0',
    },
  },
})

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
      dateTime: dayInCalendar,
      isTargetMonth: true,
      weight: '',
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
      dateTime: dayToPrepend,
      isTargetMonth: false,
      weight: '',
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
      dateTime: dayToAppend,
      isTargetMonth: false,
      weight: '',
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
const calendarList = computed(() => generateCalendarList(calendarInfo.dateTime))
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

const handleCalendarDayItemClick = async (calendarItem: CalendarItem) => {
  if (!calendarItem.isTargetMonth) return

  const result = await until(() => getMonthlyRecords(calendarInfo.dateTime))
  if (result.error) {
    if (result.error?.message === ApiError.DataNotExist) {
      dayItemInfoDialogProps.value.calendarItem = {
        ...calendarItem,
        weight: '',
      }
      dayItemInfoDialogProps.value.show = true
      return
    }
    const toast = useToast()
    toast.error(result.error.message)
    return
  }

  const monthlyRecord = result.data
  dayItemInfoDialogProps.value.calendarItem = {
    ...calendarItem,
    weight: monthlyRecord[calendarItem.day]?.weight.toString(),
  }
  dayItemInfoDialogProps.value.show = true
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
