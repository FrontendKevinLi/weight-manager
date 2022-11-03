import { DateTime } from 'luxon'
import { CustomDialogProps } from '@/components/CustomDialog/types'

export type CalendarItem = {
  weekdayShort: string,
  day: number,
  dateTime: DateTime,
  isTargetMonth: boolean
}

export type CalendarItemDialogProps = {
  calendarItem: CalendarItem
} & CustomDialogProps
