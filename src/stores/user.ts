import { defineStore } from 'pinia'

const useUserStore = defineStore('User', {
  state: () => ({
    username: 'Test',
  }),
  actions: {
    setUserName(username: typeof this.username) {
      this.username = username
    },
  },
})

export default useUserStore
