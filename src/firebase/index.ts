import { initializeApp, FirebaseOptions } from 'firebase/app'

const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyAv4bepYQGhN9TM79TXSsAVQntao4T4A98',
  authDomain: 'weight-manager-3b2e7.firebaseapp.com',
  projectId: 'weight-manager-3b2e7',
  storageBucket: 'weight-manager-3b2e7.appspot.com',
  messagingSenderId: '1049126594722',
  appId: '1:1049126594722:web:304f7874290101f6b30ffb',
  measurementId: 'G-HWPY23YVP2',
}

const firebase = initializeApp(firebaseConfig)
export default firebase
