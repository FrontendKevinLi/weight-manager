import {
  getAuth, connectAuthEmulator, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword,
} from 'firebase/auth'
import firebase from './index'

const auth = getAuth(firebase)
// connectAuthEmulator(auth, 'http://localhost:9099')

const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password)
// const login = () => signInWithEmailAndPassword(auth, 'test1@test.test', '1qaz@WSX')

const logout = () => signOut(auth)

const signUp = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password)

export {
  login,
  logout,
  signUp,
}
