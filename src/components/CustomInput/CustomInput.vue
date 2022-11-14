<template>
  <div
    :class="[
      'custom-input',
      (isInputFocused || !isInputTextEmpty) && 'focus',
      !isValid && 'invalid'
    ]"
  >
    <div class="input-wrapper">
      <label
        for="input"
        class="placeholder"
      >{{ placeholder }}</label>
      <input
        ref="inputRef"
        class="input"
        :value="inputText"
        :type="type"
        @input="handleInputChange"
        @mousedown="setInputFocus(true)"
        @focus="handleFocus"
        @blur="handleBlur"
        @keyup.enter="handleKeyUpEnter"
      >
    </div>
    <span
      v-show="!isValid"
      class="error-message"
    >{{ errorMessage }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ValidateConfig } from './types'

export default defineComponent({
  name: 'CustomInput',
  props: {
    placeholder: {
      type: String,
      default: '',
    },
    inputText: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    validateConfig: {
      type: Object as PropType<ValidateConfig>,
      default: null,
    },
  },
  emits: ['update:inputText', 'keyupEnter', 'focus', 'blur'],
  data() {
    return {
      isInputFocused: false,
      isValid: true,
      errorMessage: '',
    }
  },
  computed: {
    isInputTextEmpty() {
      const isInputTextEmpty = this.inputText.length === 0
      return isInputTextEmpty
    },
  },
  mounted() {
    this.initValidationListener()
    this.focusAtEnd()
  },
  methods: {
    setInputFocus(shouldFocus: boolean) {
      this.isInputFocused = shouldFocus
    },
    handleInputFocus() {
      this.isInputFocused = true
    },
    handleInputChange(e: Event) {
      const target = e.target as HTMLInputElement
      this.$emit('update:inputText', target.value.trim())
    },
    handleKeyUpEnter() {
      this.$emit('keyupEnter')
    },
    handleFocus() {
      const el = this.$refs.inputRef as HTMLInputElement
      el.scrollIntoView()
      this.setInputFocus(true)
      this.$emit('focus')
    },
    handleBlur() {
      this.setInputFocus(false)
      this.$emit('blur')
    },
    initValidationListener() {
      if (this.validateConfig == null) return

      const inputRef = this.$refs.inputRef as HTMLInputElement
      inputRef.addEventListener(this.validateConfig.event, this.validateInput)
    },
    validateInput() {
      const { isValid, errorMessage } = this.validateConfig.validateFunction(this.inputText)
      this.isValid = isValid
      this.errorMessage = errorMessage
      return isValid
    },
    focusAtEnd() {
      const inputRef = this.$refs.inputRef as HTMLInputElement
      const index = this.inputText.length
      inputRef.setSelectionRange(index, index)
      inputRef.focus()
    },
  },
})
</script>

<style lang="scss" scoped>
@use "@/style/colors" as colors;
@use "@/style/font-sizes.scss" as font-sizes;

.custom-input {
  $underline-height: 2px;
  $input-left-right-indent: 10px;
  $input-font-size: font-sizes.$small;
  $place-holder-font-size: font-sizes.$small;
  $place-holder-focus-font-size: 12px;
  $gap: 5px;

  display: grid;
  position: relative;
  grid-template-rows: auto 16px;
  gap: $gap;

  .input-wrapper {
    display: grid;
    position: relative;
    grid-template-rows: (font-sizes.$extra-small + 2px) 1fr;
    gap: $gap;
    padding-bottom: 5px;

    &::before {
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: colors.$darkblue-200;
      width: 100%;
      height: $underline-height;
      content: "";
    }

    &::after {
      position: absolute;
      bottom: 0;
      left: 0;
      transition: width 0.15s ease-in-out;
      background-color: colors.$darkblue-700;
      width: 0;
      height: $underline-height;
      content: "";
    }

    .input {
      box-sizing: border-box;
      grid-row: 2 / 3;
      grid-column: 1 / 2;
      outline: none;
      border: none;
      background: transparent;
      padding-right: 0;
      padding-left: 0;

      // padding-right: $input-left-right-indent;
      // padding-left: $input-left-right-indent;
      width: 100%;
      height: 100%;
      color: colors.$darkblue-700;
      font-size: $input-font-size;
    }

    .placeholder {
      $time-function: cubic-bezier(0.4, 0, 0.2, 1);

      display: grid;
      grid-row: 2 / 3;
      grid-column: 1 / 2;
      align-items: center;
      transition:
        transform 0.15s $time-function,
        font-size 0.15s $time-function,
        color 0.15s $time-function;

      // margin-right: $input-left-right-indent;
      // margin-left: $input-left-right-indent;
      cursor: text;
      height: 100%;
      color: colors.$darkblue-200;
      font-size: $place-holder-font-size;
      pointer-events: none;
    }
  }

  .error-message {
    // padding-right: $input-left-right-indent;
    // padding-left: $input-left-right-indent;
    color: colors.$red-600;
    font-size: font-sizes.$extra-small;
  }

  &.invalid {
    .input-wrapper {
      &::after {
        background-color: colors.$red-600;
        width: 100%;
      }
    }
  }

  &.focus {
    .input-wrapper {
      &::after {
        width: 100%;
      }

      .placeholder {
        transform: translateY(-($input-font-size + $gap));
        font-size: $place-holder-focus-font-size;
      }
    }

    &.invalid {
      .input-wrapper {
        .placeholder {
          color: colors.$red-600;
        }
      }
    }
  }
}
</style>
