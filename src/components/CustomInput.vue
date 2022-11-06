<template>
  <div :class="['custom-input-wrapper', (isInputFocused || !isInputTextEmpty) && 'focus']">
    <label
      for="input"
      :class="['placeholder']"
    >{{ placeholder }}</label>
    <input
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
</template>

<script lang="ts">
import { defineComponent } from 'vue'

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
  },
  emits: ['update:inputText', 'keyupEnter', 'focus', 'blur'],
  data() {
    return {
      isInputFocused: false,
    }
  },
  computed: {
    isInputTextEmpty() {
      const isInputTextEmpty = this.inputText.length === 0
      return isInputTextEmpty
    },
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
      this.$emit('update:inputText', target.value)
    },
    handleKeyUpEnter() {
      this.$emit('keyupEnter')
    },
    handleFocus() {
      this.setInputFocus(true)
      this.$emit('focus')
    },
    handleBlur() {
      this.setInputFocus(false)
      this.$emit('blur')
    },
  },
})
</script>

<style lang="scss" scoped>
@use "@/style/colors" as colors;
@use "@/style/font-sizes.scss" as font-sizes;

.custom-input-wrapper {
  $underline-height: 2px;
  $input-left-right-indent: 10px;
  $input-font-size: font-sizes.$medium;
  $place-holder-font-size: font-sizes.$medium;
  $place-holder-focus-font-size: font-sizes.$extra-small;
  $gap: 5px;

  display: grid;
  position: relative;
  grid-template-rows: (font-sizes.$extra-small + 2px) 1fr;
  gap: $gap;
  align-items: center;
  border-bottom: $underline-height solid colors.$darkblue-200;
  padding-bottom: 5px;
  width: 500px;

  // colored underline
  &::after {
    position: absolute;
    bottom: -$underline-height;
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
    padding-right: $input-left-right-indent;
    padding-left: $input-left-right-indent;
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
    margin-right: $input-left-right-indent;
    margin-left: $input-left-right-indent;
    cursor: text;
    height: 100%;
    color: colors.$darkblue-200;
    font-size: $place-holder-font-size;
    pointer-events: none;
  }

  &.focus {
    &::after {
      width: 100%;
    }

    .placeholder {
      transform: translateY(-($input-font-size + $gap));
      font-size: $place-holder-focus-font-size;
    }
  }
}
</style>
