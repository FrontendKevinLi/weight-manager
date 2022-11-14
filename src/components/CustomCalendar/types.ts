import { DateTime } from 'luxon'
import { CustomDialogProps } from '@/components/CustomDialog/types'
import { IntRange } from '@/types/utils'

export type CalendarItem = {
  weekdayShort: string
  day: number
  dateTime: DateTime
  weight: string
  isTargetMonth: boolean
  isToday: boolean
}

export type CalendarItemDialogProps = {
  calendarItem: CalendarItem
} & CustomDialogProps

export type WeekdayNameVersion = 'weekdayLong' | 'weekdayShort' extends keyof DateTime ? 'weekdayLong' | 'weekdayShort' : never

export type WeekdayRange = IntRange<1, 8>
