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
          :placeholder="'Email'"
          class="white-section-item input"
        />
        <CustomInput
          v-model:inputText="password"
          :placeholder="'Password'"
          :type="'password'"
          class="white-section-item password-input"
        />
        <CustomButton
          :label="'Login'"
          class="white-section-item login-btn"
          @click="handleLoginButtonClick"
        />
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
import LogoFullSvg from '@/assets/logo-full/svg/primaryblue/logo-no-background.svg'
import { login } from '@/firebase/auth'
import { until } from '@open-draft/until'

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
        y: -100,
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
    },
    validateForm() {
      return true
    },
    async handleLoginButtonClick() {
      const valid = this.validateForm()
      if (!valid) return

      const loginResult = await until(() => login(this.username, this.password))
      if (loginResult.error) {
        console.error(loginResult.error)
        return
      }
      console.log(loginResult.data.user)
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
@use "@/style/colors" as colors;
@use "@/style/constants" as constants;
@use "@/style/font-sizes.scss" as font-sizes;
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

@keyframes float {
  from {
    transform: translate(-2%, -5%);
  }

  to {
    transform: translate(3%, 5%);
  }
}

.login {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: hidden;

  &::before {
    position: absolute;
    background-image: url("@/assets/backgrounds/low-poly-grid-haikei2.svg");
    background-repeat: no-repeat;
    background-size: cover;
    width: 108vw;
    height: 115vh;
    animation: float 7s infinite alternate ease-in-out;
    content: "";
    filter: brightness(0.8) blur(3px);
  }

  .login-box {
    $login-box-width: 75vw;

    display: flex;
    position: relative;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    z-index: 0;
    border-radius: constants.$border-radius;
    height: 70vh;
    max-height: 700px;

    .white-section {
      box-sizing: border-box;
      display: flex;
      position: relative;
      flex-direction: column;
      row-gap: 30px;
      align-items: center;
      border-radius: 12px;

      // box-shadow: 0 3px 5px 0 colors.$black-700;
      // box-shadow: 0 3px 8px -1px colors.$black-900;
      background-color: white;
      padding-top: 40px;
      padding-right: 80px;
      padding-bottom: 40px;
      padding-left: 80px;
      width: calc($login-box-width / 2.5);

      .logo {
        width: 300px;
        height: 300px;
      }

      .username-input {
        width: 100%;
        min-width: 260px;
        letter-spacing: 0.1rem;
      }

      .password-input {
        width: 100%;
        min-width: 260px;
        letter-spacing: 0.1rem;
      }

      .login-btn {
        box-sizing: border-box;
        margin-top: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
        width: 100%;
        text-align: center;
        letter-spacing: 0.15rem;
        font-size: font-sizes.$small;
        font-weight: bold;
      }
    }
  }
}
</style>
