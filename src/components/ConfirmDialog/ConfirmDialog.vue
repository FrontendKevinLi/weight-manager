<template>
  <CustomDialog
    :value="customDialog"
    @update:value="handleUpdateValue"
  >
    <div class="confirm-dialog">
      <span
        class="title"
        v-text="props.value.title"
      />
      <span
        class="content"
        v-text="props.value.content"
      />
      <div class="buttons">
        <CustomButton
          :label="'Cancel'"
          :outlined="true"
          @click="handleCancelButtonClick"
          @keydown="handleCancelButtonClick"
        />
        <CustomButton
          :label="'Confirm'"
          @click="handleConfirmButtonClick"
          @keydown="handleConfirmButtonClick"
        />
      </div>
    </div>
  </CustomDialog>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, computed } from 'vue'
import CustomDialog from '@/components/CustomDialog/CustomDialog.vue'
import { CustomDialogProps } from '@/components/CustomDialog/types'
import CustomButton from '@/components/CustomButton.vue'
import { ConfirmDialogProps } from './types'

const props = defineProps<{
  value: ConfirmDialogProps
}>()

type ConfirmDialogEmits = {
  (e: 'update:value', payload: ConfirmDialogProps): void
  (e: 'cancel'): void
  (e: 'confirm'): void
}

const emit = defineEmits<ConfirmDialogEmits>()

const customDialog = computed(() => ({ show: props.value.show }) as CustomDialogProps)

const handleUpdateValue = (payload: CustomDialogProps) => {
  emit('update:value', {
    ...props.value,
    show: payload.show,
  })
}

const handleCancelButtonClick = () => {
  emit('cancel')
}

const handleConfirmButtonClick = () => {
  emit('confirm')
}

</script>

<style lang="scss" scoped>
@use "@/style/constants.scss" as constants;
@use "@/style/colors.scss" as colors;
@use "@/style/font-sizes.scss" as font-sizes;

.confirm-dialog {
  display: grid;
  gap: 40px;
  border-radius: constants.$border-radius;
  background-color: white;
  padding: 40px;

  .title {
    color: colors.$darkblue-600;
    font-size: font-sizes.$medium;
    font-weight: bold;
  }

  .content {
    color: colors.$darkblue-600;
    font-size: font-sizes.$small;
  }

  .buttons {
    display: flex;
    gap: 20px;
    justify-content: space-between;
  }
}
</style>
