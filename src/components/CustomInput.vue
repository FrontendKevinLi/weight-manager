<template>
  <div class="custom-input-wrapper">
    <input id="input" class="input" @input="handleInputChange"
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
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'LoginView',
  props: {
    placeholder: {
      type: String,
      default: '',
    },

  },
  data() {
    return {
      inputText: '',
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
      this.inputText = target.value;
    },
  },
});
</script>

<style lang="scss" scoped>
@use "sass:map";

@import "@/style/colors.scss";

.username {
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
    border-bottom: 1px solid map-get($map: $blue, $key: "700");
  }
  .placeholder {
    position: absolute;
    font-size: 24px;
    color: map-get($map: $black, $key: "500");
    transform: translateY(0);
    top: 0;
    left: 10px;
    transition: transform 0.1s ease-in-out,
      font-size 0.1s ease-in-out,
      color 0.1s ease-in-out;
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
