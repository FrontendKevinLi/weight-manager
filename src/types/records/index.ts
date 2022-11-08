export type DailyRecord = {
  date: string
  weight: number
}

export type MonthlyRecord = Record<number, DailyRecord>
