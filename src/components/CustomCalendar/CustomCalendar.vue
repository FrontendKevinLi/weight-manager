<template>
  <div class="custom-calendar">
    <CalendarHeader
      :date-time="calendarInfo.dateTime"
      @previous-month="handlePreviousMonthButtonClick"
      @next-month="handleNextMonthButtonClick"
      @add="handleAddButtonClick"
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
          !calendarItem.isTargetMonth && 'not-target',
          calendarItem.isToday && 'today'
        ]"
        @click="handleCalendarDayItemClick(calendarItem)"
        @keydown="handleCalendarDayItemClick(calendarItem)"
      >
        <span class="day">{{ calendarItem.day }}</span>
        <div
          v-show="calendarItem.weight != ''"
          class="weight-wrapper"
        >
          <span class="weight">{{ calendarItem.weight }}</span>
          <span class="unit">KG</span>
        </div>
      </div>
    </div>
    <CalendarItemDialog
      v-model:value="dayItemInfoDialogProps.value"
      @record-updated="handleRecordUpdated"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  nextTick, onMounted, reactive, ref, computed, watch,
} from 'vue'
import { DateTime } from 'luxon'
import gsap, { Expo, Linear, Power2 } from 'gsap'
import { getMonthlyRecord } from '@/firebase/firestore'
import { until } from '@open-draft/until'
import { useToast } from 'vue-toastification'
import { MonthlyRecord } from '@/types/records'
import { CalendarItem, CalendarItemDialogProps } from './types'
import CalendarHeader from './CalendarHeader.vue'
import CalendarItemDialog from './CalendarItemDialog.vue'

const dayItemsFadeInOutDuration = 0.5

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
      weight: '',
      isToday: true,
    },
  },
})
const calendarMonthlyRecord = ref<MonthlyRecord>({})

const fetchCalendarMonthlyRecord = async () => {
  const result = await until(() => getMonthlyRecord(calendarInfo.dateTime))
  if (result.error) {
    const toast = useToast()
    toast.error(result.error.message)
    return
  }

  const monthlyRecord = result.data
  calendarMonthlyRecord.value = monthlyRecord
}

const getWeightFromCalendarMonthlyRecord = (day: number) => calendarMonthlyRecord.value[day]?.weight.toString() ?? ''

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
  const today = DateTime.now()
  for (let i = 0; i < Number(dateTimeParam.daysInMonth); i += 1) {
    const dayInCalendar = firstDay.plus({ day: i })
    const isToday = dayInCalendar.hasSame(today, 'day')
    const calendarItem: CalendarItem = {
      weekdayShort: dayInCalendar.weekdayShort,
      day: dayInCalendar.day,
      dateTime: dayInCalendar,
      isTargetMonth: true,
      weight: getWeightFromCalendarMonthlyRecord(dayInCalendar.day),
      isToday,
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
      isToday: false,
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
      isToday: false,
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

const fadeInHeader = () => {
  if (headerItemRefList.value == null) {
    console.error('Header items not found')
    return
  }

  const timeline = gsap.timeline()
  console.time()
  timeline.from(headerItemRefList.value, {
    autoAlpha: 0,
    ease: Expo.easeInOut,
    stagger: {
      amount: 1,
      from: 'start',
    },
  }, 0).duration(1)
}

const fadeInDayItems = () => new Promise((resolve, reject) => {
  if (dayItemRefList.value == null) {
    reject(Error('Cannot find elements to animation'))
    return
  }
  const timeline = gsap.timeline()
  timeline.set(dayItemRefList.value, {
    autoAlpha: 0,
    scale: 0.75,
  })
  timeline.to(dayItemRefList.value, {
    autoAlpha: 1,
    stagger: {
      amount: dayItemsFadeInOutDuration,
      from: 'start',
      grid: 'auto',
      ease: Linear.easeInOut,
    },
    scale: 1,
    onComplete() {
      resolve(true)
    },
  }).duration(dayItemsFadeInOutDuration)
})

const fadeOutDayItems = () => new Promise((resolve, reject) => {
  if (dayItemRefList.value == null) {
    reject(Error('Cannot find elements to animation'))
    return
  }

  const timeline = gsap.timeline()
  timeline.set(dayItemRefList.value, {
    autoAlpha: 1,
    scale: 1,
  })
  timeline.to(dayItemRefList.value, {
    autoAlpha: 0,
    stagger: {
      amount: dayItemsFadeInOutDuration,
      from: 'end',
      grid: 'auto',
      ease: Linear.easeInOut,
    },
    scale: 0.75,
    onComplete() {
      resolve(true)
    },
  }).duration(dayItemsFadeInOutDuration)
})

watch(() => calendarInfo.dateTime, async () => {
  nextTick(async () => {
    await fetchCalendarMonthlyRecord()
    await fadeInDayItems()
    canChangeMonth.value = true
  })
})

const handlePreviousMonthButtonClick = async () => {
  if (!canChangeMonth.value) return

  canChangeMonth.value = false
  await fadeOutDayItems()
  calendarInfo.dateTime = calendarInfo.dateTime.minus({ month: 1 })
}

const handleNextMonthButtonClick = async () => {
  if (!canChangeMonth.value) return

  canChangeMonth.value = false
  await fadeOutDayItems()
  calendarInfo.dateTime = calendarInfo.dateTime.plus({ month: 1 })
}

const handleCalendarDayItemClick = async (calendarItem: CalendarItem) => {
  if (!calendarItem.isTargetMonth) return

  const result = await until(() => getMonthlyRecord(calendarItem.dateTime))
  if (result.error) {
    const toast = useToast()
    toast.error(result.error.message)
    return
  }

  const monthlyRecord = result.data
  dayItemInfoDialogProps.value.calendarItem = {
    ...calendarItem,
    weight: monthlyRecord[calendarItem.day]?.weight.toString() ?? '',
  }
  dayItemInfoDialogProps.value.show = true
}

const handleAddButtonClick = async () => {
  const today = DateTime.now()
  const calendarItem: CalendarItem = {
    dateTime: today,
    day: today.day,
    isTargetMonth: today.hasSame(calendarInfo.dateTime, 'month'),
    isToday: true,
    weekdayShort: today.weekdayShort,
    weight: '',
  }
  await handleCalendarDayItemClick(calendarItem)
}

const handleRecordUpdated = async (payload: {
    isTargetMonth: boolean;
}) => {
  if (!payload.isTargetMonth) return

  await fetchCalendarMonthlyRecord()
}

onMounted(async () => {
  fadeInHeader()
  await fetchCalendarMonthlyRecord()
  await fadeInDayItems()
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
        background-color: transparent;

        // background-color: colors.$primary-600;
        letter-spacing: 0.125rem;

        .weekday {
          color: colors.$primary-600;
          font-size: font-sizes.$small;
          font-weight: bold;
        }
      }

      &.day-item {
        display: grid;
        grid-template-rows: 1fr 1fr;
        cursor: pointer;

        &:is(.not-target) {
          background-color: colors.$black-100;
          cursor: not-allowed;
          color: colors.$darkblue-100;
        }

        &:is(.today) {
          background-color: colors.$primary-600;
          color: white;
        }

        .weight-wrapper {
          display: flex;
          gap: 5px;
        }
      }
    }
  }
}
</style>
