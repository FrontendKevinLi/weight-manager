import { defineStore } from 'pinia'
import { ref } from 'vue'

const useRecordsStore = defineStore('records', () => {
  const records = ref<string[]>([])

  return {
    records,
  }
})

export default useRecordsStore
