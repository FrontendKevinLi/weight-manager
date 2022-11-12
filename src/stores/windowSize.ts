import { defineStore } from 'pinia'

const useWindowSizeStore = defineStore('windowSizeStore', {
  state: () => ({
    currentWith: 0,
  }),
  getters: {
    isMobile(): boolean {
      return this.currentWith <= 600
    },
  },
  actions: {
    setCurrentWidth(width: number) {
      this.currentWith = width
    },
  },
})

export default useWindowSizeStore
