<template>
  <CustomDialog
    :value="customDialog"
    @update:value="handleUpdateValue"
  >
    <div class="confirm-dialog">
      <header class="confirm-dialog-header">
        <span
          class="title"
          v-text="props.value.title"
        />
        <CloseButton
          class="close-button"
          @click="handleCloseButtonClick"
          @keydown="handleCloseButtonClick"
        />
      </header>
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
import CloseButton from '@/components/CloseButton.vue'
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

const cancel = () => {
  emit('cancel')
}

const handleUpdateValue = (payload: CustomDialogProps) => {
  emit('update:value', {
    ...props.value,
    show: payload.show,
  })
}

const handleCancelButtonClick = () => {
  cancel()
}

const handleConfirmButtonClick = () => {
  emit('confirm')
}

const handleCloseButtonClick = () => {
  cancel()
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

  .confirm-dialog-header {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 30px;
    align-items: center;

    .title {
      color: colors.$darkblue-600;
      font-size: font-sizes.$medium;
      font-weight: bold;
    }
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
