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
      <CustomInput
        v-model:input-text="weight"
        class="weight-input"
        placeholder="Weight"
      />
    </div>
  </CustomDialog>
</template>

<script lang="ts" setup>
import {
  defineProps, defineEmits, computed, ref,
} from 'vue'
import { DateTime } from 'luxon'

import CustomDialog from '@/components/CustomDialog/CustomDialog.vue'
import { CustomDialogProps } from '@/components/CustomDialog/types'
import CustomInput from '@/components/CustomInput.vue'
import { CalendarItemDialogProps } from './types'

type DayItemInfoDialogEmits = {
  (e: 'update:value', payload: CustomDialogProps): void
}
const props = defineProps<{
  value: CalendarItemDialogProps
}>()

const weight = ref('121.5')

const dialogTitle = computed(() => props.value.calendarItem.dateTime.setLocale('en-GB').toLocaleString(DateTime.DATE_FULL))

const emit = defineEmits<DayItemInfoDialogEmits>()
const handleUpdateShow = (payload: CustomDialogProps) => {
  emit('update:value', payload)
}

</script>

<style lang="scss" scoped>
@use "@/style/colors.scss" as colors;
@use "@/style/font-sizes.scss" as font-sizes;
@use "@/style/constants.scss" as constants;

.calendar-item-dialog {
  display: grid;
  gap: 20px;
  justify-items: center;
  border-radius: constants.$border-radius;
  background-color: white;
  padding: 40px;

  .title {
    color: colors.$darkblue-600;
    font-size: font-sizes.$medium;
  }

  .weight-input {
    width: 100%;
  }
}
</style>
