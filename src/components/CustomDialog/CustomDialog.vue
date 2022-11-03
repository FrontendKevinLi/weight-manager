<template>
  <div
    class="custom-dialog"
  >
    <div
      ref="backgroundMaskRef"
      class="background-mask"
      @click.self="handleBackgroundMaskClick"
      @keydown.escape.self="handleBackgroundMaskClick"
    >
      <div
        ref="dialogWrapperRef"
        class="dialog-wrapper"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  defineProps, defineExpose, defineEmits, ref, watch,
} from 'vue'
import gsap from 'gsap'
import { until } from '@open-draft/until'

import { Nullable } from '@/types/utils'
import { CustomDialogProps } from './types'

type CustomDialogEmits = {
  (e: 'update:value', payload: CustomDialogProps): void
}

const props = defineProps<{
  value: CustomDialogProps
}>()

const emit = defineEmits<CustomDialogEmits>()

const dialogWrapperRef = ref<HTMLElement>()
const backgroundMaskRef = ref<HTMLElement>()
const fadeAnimationDuration = 0.25
let canCloseDialog = true

const fadeIn = (): Promise<void> => new Promise((resolve) => {
  const el: Nullable<HTMLElement> = dialogWrapperRef.value

  if (backgroundMaskRef.value == null) {
    throw new Error('Element not exist')
  }

  if (el == null) {
    throw new Error('Element not exist')
  }

  const timeline = gsap.timeline()

  timeline.set(backgroundMaskRef.value, {
    autoAlpha: 0,
  })

  timeline.set(el, {
    autoAlpha: 0,
    scale: 0.5,
  })

  timeline.to(el, {
    autoAlpha: 1,
    scale: 1,
    duration: fadeAnimationDuration,
    ease: 'power4.easeOut',
    onComplete() {
      resolve()
    },
  }, 0)

  timeline.to(backgroundMaskRef.value, {
    autoAlpha: 1,
    duration: fadeAnimationDuration,
    ease: 'power4.easeOut',
    onComplete() {
      resolve()
    },
  }, 0)
})

const fadeOut = (): Promise<void> => new Promise((resolve, reject) => {
  const el: Nullable<HTMLElement> = dialogWrapperRef.value

  if (backgroundMaskRef.value == null) {
    reject(new Error('Element not exist'))
    return
  }

  if (el == null) {
    reject(new Error('Element not exist'))
    return
  }

  const timeline = gsap.timeline()

  timeline.set(backgroundMaskRef.value, {
    autoAlpha: 1,
  })

  timeline.set(el, {
    autoAlpha: 1,
    scale: 1,
  })

  timeline.to(el, {
    autoAlpha: 0,
    scale: 0.5,
    duration: fadeAnimationDuration,
    ease: 'power4.easeOut',
    onComplete() {
      resolve()
    },
  }, 0)

  timeline.to(backgroundMaskRef.value, {
    autoAlpha: 0,
    duration: fadeAnimationDuration,
    ease: 'power4.easeOut',
    onComplete() {
      resolve()
    },
  }, 0)
})

const show = async () => {
  const result = await until(() => fadeIn())
  if (result.error) throw result.error
}

const close = async () => {
  if (!canCloseDialog) return

  canCloseDialog = false
  const result = await until(() => fadeOut())
  canCloseDialog = true

  if (result.error != null) throw result.error
}

const handleBackgroundMaskClick = async () => {
  emit('update:value', { show: false })
}

watch(props, async () => {
  if (props.value.show) {
    const result = await until(() => show())
    if (result.error) console.error(result.error)
    return
  }

  const result = await until(() => close())
  if (result.error) console.error(result.error)
})

defineExpose({
  show,
  close,
})

</script>

<style lang="scss" scoped>
@use "@/style/constants.scss" as constants;
@use "@/style/colors.scss" as colors;

.custom-dialog {
  .background-mask {
    display: grid;
    position: fixed;
    top: 0;
    left: 0;
    place-items: center;
    visibility: hidden;
    z-index: 1000;
    background-color: rgb(0 0 0 / 50%);
    width: 100vw;
    height: 100vh;

    .dialog-wrapper {
      visibility: hidden;
      border-radius: constants.$border-radius;
      background-color: white;
      width: 800px;
      height: 700px;
    }
  }
}
</style>
