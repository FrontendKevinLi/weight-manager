<template>
  <CustomDialog
    :value="props.value"
    @update:value="handleUpdateShow"
  >
    <div class="calendar-item-dialog">
      <span
        class="title"
        v-text="dialogTitle"
      />
    </div>
  </CustomDialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, computed } from 'vue'
import { DateTime } from 'luxon'

import CustomDialog from '@/components/CustomDialog/CustomDialog.vue'
import { CustomDialogProps } from '@/components/CustomDialog/types'
import { CalendarItemDialogProps } from './types'

type DayItemInfoDialogEmits = {
  (e: 'update:value', payload: CustomDialogProps): void
}
const props = defineProps<{
  value: CalendarItemDialogProps
}>()

const dialogTitle = computed(() => props.value.calendarItem.dateTime.setLocale('en-GB').toLocaleString(DateTime.DATE_FULL))

const emit = defineEmits<DayItemInfoDialogEmits>()
const handleUpdateShow = (payload: CustomDialogProps) => {
  emit('update:value', payload)
}

</script>

<style lang="scss" scoped>
@use "@/style/colors.scss" as colors;
@use "@/style/font-sizes.scss" as font-sizes;

.calendar-item-dialog {
  display: grid;
  justify-content: center;
  padding: 40px;

  .title {
    color: colors.$darkblue-600;
    font-size: font-sizes.$medium;
  }
}
</style>
