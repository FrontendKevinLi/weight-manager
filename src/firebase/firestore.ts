import ApiError from '@/utils/Errors'
import { until } from '@open-draft/until'
import {
  getFirestore, doc, setDoc, getDoc,
} from 'firebase/firestore'
import { DateTime } from 'luxon'
import { getIsAuthenticated, auth } from './auth'

const db = getFirestore()

type DailyRecord = {
  date: string
  weight: number
}

type MonthlyRecord = Record<number, DailyRecord>

const getMonthlyRecords = async (dateTime: DateTime): Promise<MonthlyRecord> => {
  const isAuthenticatedResult = await until(() => getIsAuthenticated())
  if (isAuthenticatedResult.error) throw isAuthenticatedResult.error
  if (auth.currentUser == null) throw new Error('User not logged in or not exist')

  const year = dateTime.year.toString()
  const month = dateTime.month.toString()

  const docRef = doc(db, 'users', auth.currentUser.uid, year, month)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) throw new Error(ApiError.DataNotExist)

  return docSnap.data()
}

const updateDailyRecord = async (dateTime: DateTime, dailyRecord: DailyRecord) => {
  const isAuthenticatedResult = await until(() => getIsAuthenticated())
  if (isAuthenticatedResult.error) throw isAuthenticatedResult.error
  if (auth.currentUser == null) throw new Error('User not logged in or not exist')

  const year = dateTime.year.toString()
  const month = dateTime.month.toString()
  const day = dateTime.day.toString()

  const docRef = doc(db, 'users', auth.currentUser.uid, year, month)
  const result = await until(() => setDoc(docRef, { [day]: dailyRecord }, { merge: true }))
  if (result.error) throw result.error
}

const getDailyRecords = (dateTime: DateTime) => {
  console.log('')
}
export {
  getMonthlyRecords,
  getDailyRecords,
  updateDailyRecord,
}
