import { until } from '@open-draft/until'
import {
  // connectAuthEmulator,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import firebase from './index'

const auth = getAuth(firebase)
// connectAuthEmulator(auth, 'http://localhost:9099')

async function getIsAuthenticated(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user != null) {
        resolve(true)
        return
      }

      reject(new Error('no user'))
    })
  })
}

// Apis
const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password)

const logout = () => signOut(auth)

const signUp = async (email: string, password: string) => {
  const createUserResult = await until(() => createUserWithEmailAndPassword(auth, email, password))
  if (createUserResult.error) throw createUserResult.error

  const userCredential = createUserResult.data
  const updateProfileResult = await until(() => updateProfile(userCredential.user, {
    displayName: userCredential.user.email,
  }))
  if (updateProfileResult.error) throw updateProfileResult.error
}

const setUsername = async (username: string) => {
  if (auth.currentUser == null) {
    throw new Error('user not logged in or not exist')
  }
  await updateProfile(auth.currentUser, {
    displayName: username,
  })
}

export {
  auth, login, logout, signUp, getIsAuthenticated, setUsername,
}
