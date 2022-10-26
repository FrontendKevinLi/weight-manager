<template>
  <div :class="['custom-input-wrapper', (isInputFocused || !isInputTextEmpty) && 'focus']">
    <input
      class="input"
      :value="inputText"
      :type="type"
      @input="handleInputChange"
      @mousedown="setInputFocus(true)"
      @focus="setInputFocus(true)"
      @blur="setInputFocus(false)"
      @keyup.enter="handleKeyUpEnter"
    >
    <label
      for="input"
      :class="['placeholder']"
    >{{ placeholder }}</label>
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
  emits: ['update:inputText', 'keyupEnter'],
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
  },
})
</script>

<style lang="scss" scoped>
@use "sass:map";
@use "@/style/colors" as colors;
@use "@/style/font-sizes.scss" as font-sizes;

.custom-input-wrapper {
  $underline-height: 2px;
  $input-indent: 10px;

  display: grid;
  position: relative;
  align-items: center;
  border-bottom: $underline-height solid map.get($map: colors.$black, $key: "500");
  width: 500px;
  height: 35px;

  &::after {
    position: absolute;
    bottom: -$underline-height;
    left: 0;
    transition: width 0.15s ease-in-out;
    background-color: map.get($map: colors.$blue, $key: "700");
    width: 0;
    height: $underline-height;
    content: "";
  }

  & > * {
    grid-area: 1 / 1;
  }

  .input {
    box-sizing: border-box;
    outline: none;
    border: none;
    background: transparent;
    padding-right: $input-indent;
    padding-left: $input-indent;
    width: 100%;
    height: 100%;
    font-size: font-sizes.$medium;
  }

  .placeholder {
    transform: translateY(0);
    transition:
      transform 0.15s cubic-bezier(0.4, 0, 0.2, 1),
      font-size 0.15s cubic-bezier(0.4, 0, 0.2, 1),
      color 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    margin-right: $input-indent;
    margin-left: $input-indent;
    cursor: text;
    color: map.get($map: colors.$black, $key: "500");
    font-size: font-sizes.$medium;
    pointer-events: none;
  }

  &.focus {
    &::after {
      width: 100%;
    }

    .placeholder {
      transform: translate(0, -20px);
      color: map.get($map: colors.$blue, $key: "500");
      font-size: font-sizes.$small;
    }
  }
}
</style>
