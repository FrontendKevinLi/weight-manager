<template>
  <div class="login">
    <div ref="login-box" class="login-box">
      <!-- <div ref="bottom-left" class="bottom-left"></div>
      <div ref="top-right" class="top-right"></div> -->
      <div ref="white-section" class="white-section">
        <div class="white-section-item title">Weight Manager</div>
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
        <CustomButton :label="'Login'" @click="handleLoginButtonClick" class="white-section-item" />
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
  components: {
    CustomInput,
    CustomButton,
  },
  mounted() {
    this.initAnimation();
  },
  methods: {
    initAnimation() {
      const timeLine = gsap.timeline();

      timeLine.from(this.$refs['white-section'] as gsap.TweenTarget, {
        opacity: 0.001,
        x: 100,
        ease: 'power2',
        duration: 0.75,
      });
      timeLine.from('.white-section-item', {
        y: '-250px',
        ease: 'back',
        opacity: 0,
        stagger: 0.1,
      }, '-=0.5');
      timeLine.from(this.$refs['blue-section'] as gsap.TweenTarget, {
        opacity: 0.001,
        x: -100,
        ease: 'power2',
        duration: 0.75,
      }, '-=0.55');
    },
    handleLoginButtonClick() {
      this.$router.push('/dashboard');
    },
  },
});
</script>

<style lang="scss" scoped>
@use "sass:map";
@import "@/style/colors.scss";
@import "@/style/constants.scss";
@import '@/style/animations.scss';

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
    $loginBoxWidth: 75vw;

    display: flex;
    justify-content: center;
    position: relative;
    flex-direction: row;
    height: 70vh;
    max-height: 700px;
    width: $loginBoxWidth;
    border-radius: $border-radius;
    z-index: 0;
    .white-section {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      row-gap: 50px;
      width: calc($loginBoxWidth / 2.5);
      min-width: 320px;
      height: 100%;
      padding: 20px;
      box-sizing: border-box;
      background-color: white;
      box-shadow: 0px 0px 20px -3px map-get($map: $blue, $key: "200");
      border-radius: 12px;
      .title {
        text-align: center;
        font-family: 'Tomatoes', sans-serif;
        font-size: 34px;
        margin-right: 10px;
        margin-left: 10px;
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
      width: calc($loginBoxWidth / 2);
      background-color: map-get($map: $blue, $key: "700");
      box-shadow: 0px 0px 20px -3px map-get($map: $blue, $key: "200");
      border-radius: 12px;
      transform: scale(1.2);
      z-index: -1;
      row-gap: 30px;
      will-change: opacity;
      @media screen and (max-width: 1024px) {
        display: none;
      }
      .slogan {
        color: white;
        font-size: 26px;
      }
      .picture {
        width: 25vw;
        height: 25vw;
      }
    }
    .circle {
      position: absolute;
      left: 0;
      top: calc(50% - 50px);
      z-index: -1;
      height: 100px;
      width: 100px;
      border-radius: 50%;
      border: 5px dotted map-get($map: $blue, $key: "200");
      animation: spinning 5s linear infinite;
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
