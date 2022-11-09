<template>
  <CustomDialog
    :value="props.value"
    @update:value="handleUpdateShow"
  >
    <div
      v-if="props.value.show"
      class="calendar-item-dialog"
    >
      <span
        class="title"
        v-text="dialogTitle"
      />
      <CustomInput
        ref="weightInput"
        :input-text="weight"
        class="weight-input"
        :validate-config="weightValidateConfig"
        placeholder="Weight"
        @update:input-text="handleUpdateInputText"
        @focus="handleInputFocus"
        @blur="handleInputBlur"
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
import CustomInput from '@/components/CustomInput/CustomInput.vue'
import { updateDailyRecord } from '@/firebase/firestore'
import { until } from '@open-draft/until'
import { useToast } from 'vue-toastification'
import { ValidateConfig } from '@/components/CustomInput/types'
import { CalendarItemDialogProps } from './types'

type CalendarItemDialogEmits = {
  (e: 'update:value', payload: CalendarItemDialogProps): void
  (e: 'record-updated', payload: {isTargetMonth: boolean}): void
}
const props = defineProps<{
  value: CalendarItemDialogProps
}>()

const weightValidateConfig: ValidateConfig = {
  event: 'input',
  validateFunction: (weight: string) => {
    const isEmpty = weight.length === 0
    if (isEmpty) {
      return {
        isValid: true,
        errorMessage: '',
      }
    }

    const isInvalidFormat = !/^\d+(.\d+)*$/.test(weight)
    if (isInvalidFormat) {
      return {
        isValid: false,
        errorMessage: 'Please input numbers only',
      }
    }

    return {
      isValid: true,
      errorMessage: '',
    }
  },
}

const weightBefore = ref('')
const weightInput = ref<InstanceType<typeof CustomInput>>()
const weight = computed(() => props.value.calendarItem.weight)
const dialogTitle = computed(() => props.value.calendarItem.dateTime.setLocale('en-GB').toLocaleString(DateTime.DATE_FULL))

const emit = defineEmits<CalendarItemDialogEmits>()
const handleUpdateShow = (payload: CustomDialogProps) => {
  emit('update:value', {
    ...props.value,
    show: payload.show,
  })
}
const handleUpdateInputText = (payload: string) => {
  emit('update:value', {
    ...props.value,
    calendarItem: {
      ...props.value.calendarItem,
      weight: payload,
    },
  })
}

const handleInputFocus = () => {
  weightBefore.value = props.value.calendarItem.weight
}

const validateForm = () => {
  const validList = [
    weightInput.value?.validateInput(),
  ]

  return !validList.some((isValid) => isValid === false)
}

const handleInputBlur = async () => {
  if (weightBefore.value === props.value.calendarItem.weight) return

  const isValid = validateForm()
  if (!isValid) return

  const result = await until(() => updateDailyRecord(props.value.calendarItem.dateTime, {
    date: props.value.calendarItem.dateTime.toISODate(),
    weight: Number(props.value.calendarItem.weight),
  }))
  if (result.error) {
    const toast = useToast()
    toast.error(result.error.message)
    return
  }

  emit('record-updated', { isTargetMonth: props.value.calendarItem.isTargetMonth })
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
