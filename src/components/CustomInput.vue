<template>
  <div class="custom-input-wrapper">
    <input id="input" class="input" :value="inputText" @input="handleInputChange"
      @mousedown="setInputFocus(true)"
      @focus="setInputFocus(true)"
      @blur="setInputFocus(false)"
    />
    <label
      for="input"
      :class="{'placeholder': true, 'focus': isInputFocused || !isInputTextEmpty}"
    >{{ placeholder }}</label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
  },
  data() {
    return {
      isInputFocused: false,
    };
  },
  computed: {
    isInputTextEmpty() {
      const isInputTextEmpty = this.inputText.length === 0;
      return isInputTextEmpty;
    },
  },
  methods: {
    setInputFocus(shouldFocus: boolean) {
      this.isInputFocused = shouldFocus;
    },
    handleInputFocus() {
      this.isInputFocused = true;
    },
    handleInputChange(e: Event) {
      const target = e.target as HTMLInputElement;
      this.$emit('update:inputText', target.value);
    },
  },
});
</script>

<style lang="scss" scoped>
@use "sass:map";

@import "@/style/colors.scss";

.custom-input-wrapper {
  position: relative;
  width: 500px;
  height: 35px;
  .input {
    width: 100%;
    height: 100%;
    outline: none;
    font-size: 24px;
    padding-left: 10px;
    padding-right: 10px;
    border: none;
    border-bottom: 2px solid map-get($map: $blue, $key: "700");
  }
  .placeholder {
    position: absolute;
    font-size: 24px;
    color: map-get($map: $black, $key: "500");
    transform: translateY(0);
    top: 0;
    left: 10px;
    transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1),
      font-size 0.15s cubic-bezier(0.4, 0, 0.2, 1),
      color 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: text;
    pointer-events: none;
    &.focus {
        transform: translate(0, -20px);
        font-size: 16px;
        color: map-get($map: $blue, $key: "500");
    }
  }
}
</style>
