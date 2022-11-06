import { defineStore } from 'pinia'
import { User } from 'firebase/auth'

const useUserStore = defineStore('User', {
  state: () => ({
    currentUser: null as User | null,
  }),
  actions: {
    setCurrentUser(currentUser: User | null) {
      this.currentUser = currentUser
    },
  },
})

export default useUserStore
