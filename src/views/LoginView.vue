<template>
  <div class="login">
    <div ref="login-box" class="login-box">
      <div ref="bottom-left" class="bottom-left"></div>
      <div ref="top-right" class="top-right"></div>
      <div class="white-section">
        <div class="title">Weight Manager</div>
        <CustomInput v-model:inputText="username" :placeholder="'Username'" />
        <CustomInput v-model:inputText="password" :placeholder="'Password'" :type="'password'"/>
        <CustomButton :label="'Login'" />
      </div>
      <div ref="blue-section" class="blue-section">
        <img ref="picture" class="picture" :src="BodyWeightingImg" alt=""/>
        <div ref="slogan" class="slogan">Start Record Yourself Today!</div>
        <!-- <a href="http://www.freepik.com">Designed by vectorjuice / Freepik</a> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BodyWeightingImg from '@/assets/bodyWeighting.png';
import gsap from 'gsap';
import CustomInput from '@/components/CustomInput.vue';
import CustomButton from '@/components/CustomButton.vue';

export default defineComponent({
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
      BodyWeightingImg,
    };
  },
  mounted() {
    this.initAnimation();
  },
  methods: {
    initAnimation() {
      const timeLine = gsap.timeline();
      timeLine.set(this.$refs['top-right'] as gsap.TweenTarget, {
        transformOrigin: 'center',
      });

      timeLine.from(this.$refs['login-box'] as gsap.TweenTarget, {
        opacity: 0,
        ease: 'power4',
        duration: 0.5,
      });
      timeLine.to(this.$refs['top-right'] as gsap.TweenTarget, {
        rotate: '360deg',
        ease: 'power3',
        duration: 1.5,
      }, '-=0.5');
      timeLine.to(this.$refs['bottom-left'] as gsap.TweenTarget, {
        rotate: '-360deg',
        ease: 'power3',
        duration: 1.5,
      }, '-=1.5');
      timeLine.from(this.$refs.picture as gsap.TweenTarget, {
        opacity: 0,
        scale: 0.5,
        ease: 'power2',
        duration: 0.75,
      }, '-=1.5');
      timeLine.from(this.$refs.slogan as gsap.TweenTarget, {
        opacity: 0,
        translateX: '-200px',
        ease: 'back',
        duration: 0.5,
      }, '-=0.75');
    },
  },
  components: { CustomInput, CustomButton },
});
</script>

<style lang="scss" scoped>
@use "sass:map";
@import "@/style/colors.scss";
@import "@/style/constants.scss";

@font-face {
    font-family: 'Tomatoes';
    src: url('@/fonts/Tomatoes-O8L8.ttf') format('truetype');
}

@mixin decoration-box($color: white, $size: 200px, $border-radius: 10px) {
  position: absolute;
  width: $size;
  height: $size;
  background-color: $color;
  border-radius: $border-radius;
  z-index: -1;
}

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  background-blend-mode: screen;
  overflow: hidden;
  .login-box {
    position: relative;
    display: flex;
    flex-direction: row;
    height: 700px;
    width: 80vw;
    border-radius: $border-radius;
    box-shadow: 0px 0px 20px -3px map-get($map: $blue, $key: "200");
    z-index: 0;
    .white-section {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      row-gap: 50px;
      width: 50%;
      height: 100%;
      background-color: white;
      border-top-left-radius: $border-radius;
      border-bottom-left-radius: $border-radius;
      .title {
        font-family: 'Tomatoes', sans-serif;
        font-size: 34px;
      }
      .login-btn {
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
      }
    }
    .blue-section {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 50%;
      height: 100%;
      background-color: map-get($map: $blue, $key: "700");
      border-top-right-radius: $border-radius;
      border-bottom-right-radius: $border-radius;
      row-gap: 30px;
      .slogan {
        color: white;
        font-size: 26px;
      }
      .picture {
        width: 25vw;
        height: 25vw;
      }
    }
    .bottom-left {
      @include decoration-box(map-get($map: $blue, $key: "700"), 200px, $border-radius);
      box-shadow: 0px 0px 20px -3px map-get($map: $blue, $key: "200");
      left: -25px;
      bottom: -25px;
    }
    .top-right {
      @include decoration-box(white, 200px, $border-radius);
      box-shadow: 0px 0px 20px -3px map-get($map: $blue, $key: "200");
      right: -25px;
      top: -25px;

    }
  }
}
</style>
