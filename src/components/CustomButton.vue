<template>
  <div
    ref="custom-btn"
    class="custom-btn"
  >
    {{ label }}
  </div>
</template>

<script lang="ts">
import gsap from 'gsap'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CustomButton',
  props: {
    label: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
    }
  },
  mounted() {
    const a = true
    if (a) {
      console.log('asdf')
    }
    (this.$refs['custom-btn'] as HTMLElement).addEventListener('mouseenter', () => {
      gsap.to(this.$refs['custom-btn'] as gsap.TweenTarget, {
        scale: 1.2,
        boxShadow: '0px 0px 20px -3px map.get($map: colors.$blue, $key: "200")',
        duration: 0.1,
      })
    });
    (this.$refs['custom-btn'] as HTMLElement).addEventListener('mouseleave', () => {
      gsap.to(this.$refs['custom-btn'] as gsap.TweenTarget, {
        scale: 1,
        boxShadow: '0px 0px 10px -3px map.get($map: colors.$blue, $key: "200")',
        duration: 0.1,
      })
    })
  },
  methods: {
    test(a: number) {
      return a
    },
  },
})
</script>

<style lang="scss" scoped>
@use "sass:map";
@use "@/style/colors.scss" as colors;
@use "@/style/constants.scss" as constants;

.custom-btn {
  border-radius: constants.$border-radius;
  box-shadow: 0 0 20px -3px map.get($map: colors.$blue, $key: "200");
  background: map.get($map: colors.$blue, $key: "500");
  cursor: pointer;
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 10px;
  padding-left: 20px;
  width: fit-content;
  color: map.get($map: colors.$black, $key: "100");
  font-size: 20px;
}
</style>
