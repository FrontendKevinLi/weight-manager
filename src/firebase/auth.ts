import {
  // connectAuthEmulator,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
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

const signUp = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password)

export {
  auth, login, logout, signUp, getIsAuthenticated,
}
