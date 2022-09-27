<template>
  <div ref="custom-btn" class="custom-btn">{{ label }}</div>
</template>

<script lang="ts">
import gsap from 'gsap';
import { defineComponent } from 'vue';

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
    };
  },
  mounted() {
    (this.$refs['custom-btn'] as HTMLElement).addEventListener('mouseenter', () => {
      gsap.to(this.$refs['custom-btn'] as gsap.TweenTarget, {
        scale: 1.2,
        boxShadow: '0px 0px 20px -3px map-get($map: $blue, $key: "200")',
        duration: 0.1,
      });
    });
    (this.$refs['custom-btn'] as HTMLElement).addEventListener('mouseleave', () => {
      gsap.to(this.$refs['custom-btn'] as gsap.TweenTarget, {
        scale: 1,
        boxShadow: '0px 0px 10px -3px map-get($map: $blue, $key: "200")',
        duration: 0.1,
      });
    });
  },
  methods: {

  },
});
</script>

<style lang="scss" scoped>
@use "sass:map";
@import "@/style/colors.scss";
@import "@/style/constants.scss";

.custom-btn {
  width: fit-content;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  color: map-get($map: $blue, $key: "50");
  background: map-get($map: $blue, $key: "500");
  border-radius: $border-radius;
  cursor: pointer;
  font-size: 20px;
  // transition: transform 0.1s ease-in-out, box-shadow 0.15s ease-in-out;
  // transition: transform 0.1s ease-in-out, box-shadow 0.15s ease-in-out;
  box-shadow: 0px 0px 20px -3px map-get($map: $blue, $key: "200");
  // &:hover {
  //   transform: scale(1.2);
  //   box-shadow: 0px 0px 30px -3px map-get($map: $blue, $key: "200");
  // }
}
</style>
