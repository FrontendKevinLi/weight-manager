<template>
  <CustomDialog
    :value="props.value"
    class="day-item-info-dialog"
    @update:value="handleUpdateShow"
  >
    TEST
  </CustomDialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

import CustomDialog from '@/components/CustomDialog/CustomDialog.vue'
import { CustomDialogProps } from '@/components/CustomDialog/types'

type DayItemInfoDialogEmits = {
  (e: 'update:value', payload: CustomDialogProps): void
}

const props = defineProps<{
  value: CustomDialogProps
}>()
const emit = defineEmits<DayItemInfoDialogEmits>()

const handleUpdateShow = (payload: CustomDialogProps) => {
  emit('update:value', payload)
}

</script>

<style lang="scss" scoped>
.day-item-info-dialog {
  padding: 40px;
}
</style>
