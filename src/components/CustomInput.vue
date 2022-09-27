<template>
  <div :class="['custom-input-wrapper', (isInputFocused  || !isInputTextEmpty) && 'focus']">
    <input
      id="input"
      class="input"
      :value="inputText"
      :type="type"
      @input="handleInputChange"
      @mousedown="setInputFocus(true)"
      @focus="setInputFocus(true)"
      @blur="setInputFocus(false)"
    />
    <label
      for="input"
      :class="['placeholder']"
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
    type: {
      type: String,
      default: 'text',
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
  $underlineHeight: 2px;
  position: relative;
  width: 500px;
  height: 35px;
  border-bottom: $underlineHeight solid map-get($map: $black, $key: "500");
  &::after {
    content: '';
    position: absolute;
    bottom: -$underlineHeight;
    left: 0;
    width: 0;
    height: $underlineHeight;
    background-color: map-get($map: $blue, $key: "700");
    transition: width 0.15s ease-in-out;
  }
  .input {
    width: 100%;
    height: 100%;
    outline: none;
    font-size: 24px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 0;
    background: transparent;
    border: none;
    box-sizing: border-box;
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
  }
  &.focus {
    &::after {
      width: 100%;
    }
    .placeholder {
      transform: translate(0, -20px);
      font-size: 16px;
      color: map-get($map: $blue, $key: "500");
    }
  }
}
</style>
