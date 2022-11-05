import {
  getAuth, connectAuthEmulator, signInWithEmailAndPassword, signOut,
} from 'firebase/auth'
import firebase from './index'

const auth = getAuth(firebase)
// connectAuthEmulator(auth, 'http://localhost:9099')

const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password)
// const login = () => signInWithEmailAndPassword(auth, 'test1@test.test', '1qaz@WSX')

const logout = () => signOut(auth)

export {
  login,
  logout,
}
