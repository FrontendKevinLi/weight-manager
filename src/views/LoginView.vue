<template>
  <div class="login">
    <div
      ref="login-box"
      class="login-box"
    >
      <div
        ref="white-section"
        class="white-section"
        @keyup.enter="handleLoginButtonClick"
      >
        <InlineSvg
          class="logo"
          :src="LogoFullSvg"
        />
        <CustomInput
          v-model:inputText="username"
          :placeholder="'Username'"
          class="white-section-item username-input"
        />
        <CustomInput
          v-model:inputText="password"
          :placeholder="'Password'"
          :type="'password'"
          class="white-section-item password-input"
        />
        <CustomButton
          :label="'Login'"
          class="white-section-item"
          @click="handleLoginButtonClick"
        />
      </div>
      <div
        ref="blue-section"
        class="blue-section"
      >
        <img
          ref="picture"
          class="picture"
          :src="BodyWeightingImg"
          alt=""
        >
        <!-- <a href="http://www.freepik.com">Designed by vectorjuice / Freepik</a> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import gsap from 'gsap'
import InlineSvg from 'vue-inline-svg'

import CustomInput from '@/components/CustomInput.vue'
import CustomButton from '@/components/CustomButton.vue'

import BodyWeightingImg from '@/assets/login-page-pictures/bodyWeighting.png'
import LogoFullSvg from '@/assets/logo-full/svg/logo-no-background.svg'

export default defineComponent({
  name: 'LoginView',
  components: {
    CustomInput,
    CustomButton,
    InlineSvg,
  },
  data() {
    return {
      username: '',
      password: '',
      BodyWeightingImg,
      LogoFullSvg,
    }
  },
  mounted() {
    this.initAnimations()
  },
  methods: {
    initAnimations() {
      const timeLine = gsap.timeline()

      timeLine.from(this.$refs['white-section'] as gsap.TweenTarget, {
        opacity: 0.001,
        x: 100,
        ease: 'power2',
        delay: 0.1,
        duration: 0.75,
      })
      timeLine.from('.white-section-item', {
        y: '-250px',
        ease: 'back',
        opacity: 0,
        stagger: 0.1,
      }, '-=0.5')
      timeLine.from(this.$refs['blue-section'] as gsap.TweenTarget, {
        opacity: 0.001,
        x: -100,
        ease: 'power2',
        duration: 0.75,
      }, '-=0.55')
    },
    handleLoginButtonClick() {
      const vm = this
      gsap.to('.login-box', {
        opacity: 0,
        duration: 0.25,
        ease: 'power2',
        onComplete() {
          vm.$router.push('/dashboard')
        },
      })
    },
  },
})
</script>

<style lang="scss" scoped>
@use "sass:map";
@use "@/style/colors" as colors;
@use "@/style/constants" as constants;
@use "@/style/animations";

@font-face {
  font-family: Tomatoes;
  src: url("@/fonts/Tomatoes-O8L8.ttf") format("truetype");
}

@mixin decoration-box($color: white, $size: 200px, $border-radius: 10px) {
  position: absolute;
  z-index: -1;
  border-radius: constants.$border-radius;
  background-color: $color;
  width: $size;
  height: $size;
}

.login {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e8ecf3;
  background-blend-mode: screen;
  height: 100vh;
  overflow: hidden;

  .login-box {
    $login-box-width: 75vw;

    display: flex;
    position: relative;
    flex-direction: row;
    justify-content: center;
    z-index: 0;
    border-radius: constants.$border-radius;
    width: $login-box-width;
    height: 70vh;
    max-height: 700px;

    .white-section {
      box-sizing: border-box;
      display: flex;
      position: relative;
      flex-direction: column;
      row-gap: 50px;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      box-shadow: 0 0 20px -3px map.get($map: colors.$blue, $key: "200");
      background-color: white;
      padding: 20px;
      width: calc($login-box-width / 2.5);
      min-width: 320px;
      height: 100%;

      .logo {
        width: 300px;
        height: 300px;
      }

      .username-input {
        width: 80%;
        min-width: 260px;
      }

      .password-input {
        width: 80%;
        min-width: 260px;
      }

      .login-btn {
        border-radius: constants.$border-radius;
        background: map.get($map: colors.$blue, $key: "500");
        cursor: pointer;
        padding-top: 10px;
        padding-right: 20px;
        padding-bottom: 10px;
        padding-left: 20px;
        width: fit-content;
        color: map.get($map: colors.$blue, $key: "50");
        font-size: 20px;
      }
    }

    .blue-section {
      display: none;
      flex-direction: column;
      row-gap: 30px;
      align-items: center;
      justify-content: center;
      transform: scale(1.2);
      z-index: -1;
      border-radius: 12px;
      box-shadow: 0 0 20px -3px map.get($map: colors.$blue, $key: "200");
      background-color: map.get($map: colors.$blue, $key: "500");
      width: calc($login-box-width / 2);
      will-change: opacity;

      .slogan {
        color: white;
        font-size: 26px;
      }

      .picture {
        width: 25vw;
        height: 25vw;
      }

      @media screen and (max-width: 1024px) {
        display: none;
      }
    }

    .circle {
      position: absolute;
      top: calc(50% - 50px);
      left: 0;
      z-index: -1;
      border: 5px dotted map.get($map: colors.$blue, $key: "200");
      border-radius: 50%;
      width: 100px;
      height: 100px;
      animation: spinning 5s linear infinite;
    }

    .bottom-left {
      @include decoration-box(map.get($map: colors.$blue, $key: "700"), 200px, constants.$border-radius);

      bottom: -25px;
      left: -25px;
      box-shadow: 0 0 20px -3px map.get($map: colors.$blue, $key: "200");
    }

    .top-right {
      @include decoration-box(white, 200px, constants.$border-radius);

      top: -25px;
      right: -25px;
      box-shadow: 0 0 20px -3px map.get($map: colors.$blue, $key: "200");
    }
  }
}
</style>
