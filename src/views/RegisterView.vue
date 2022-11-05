<template>
  <div class="register">
    <div
      class="box"
    >
      <div
        ref="whiteSectionRef"
        class="white-section"
        @keyup.enter="handleRegisterButtonClick"
      >
        <InlineSvg
          class="logo"
          :src="LogoFullSvg"
        />
        <CustomInput
          v-model:inputText="emailInput"
          :placeholder="'Email'"
          :type="'text'"
          class="white-section-item input"
        />
        <CustomInput
          v-model:inputText="passwordInput"
          :placeholder="'Password'"
          :type="'password'"
          class="white-section-item input"
        />
        <CustomButton
          :label="'Sign up'"
          class="white-section-item register-btn"
          @click="handleRegisterButtonClick"
        />
        <div class="already-have-an-account">
          <span
            class="white-section-item question"
            v-text="alreadyHaveAnAccountQuestion"
          />
          <span
            class="white-section-item text-button-label"
            @click="handleLinkToLoginButtonClick"
            @keydown="handleLinkToLoginButtonClick"
            v-text="loginTextButtonLabel"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import InlineSvg from 'vue-inline-svg'
import { POSITION, useToast } from 'vue-toastification'
import CustomButton from '@/components/CustomButton.vue'
import CustomInput from '@/components/CustomInput.vue'

import LogoFullSvg from '@/assets/logo-full/svg/primaryblue/logo-no-background.svg'
import { signUp } from '@/firebase/auth'
import { until } from '@open-draft/until'

const whiteSectionRef = ref<HTMLElement>()

const emailInput = ref('')
const passwordInput = ref('')
const router = useRouter()
const toast = useToast()

const alreadyHaveAnAccountQuestion = 'Already have an account?'
const loginTextButtonLabel = 'Login'

const fadeInFormItems = () => {
  const timeLine = gsap.timeline()

  if (whiteSectionRef.value != null) {
    timeLine.from(whiteSectionRef.value, {
      opacity: 0.001,
      y: -100,
      ease: 'power2',
      delay: 0.1,
      duration: 0.75,
    })
  }

  timeLine.from('.white-section-item', {
    y: '-250px',
    ease: 'back',
    opacity: 0,
    stagger: {
      amount: 0.25,
    },
  }, '-=0.5')
}

const validateForm = () => true

const handleRegisterButtonClick = async () => {
  const valid = validateForm()
  if (!valid) {
    toast.error('error')
    return
  }

  const signUpResult = await until(() => signUp(emailInput.value, passwordInput.value))
  if (signUpResult.error) {
    toast.error(signUpResult.error.message)
    return
  }

  router.push('/')
}

const handleLinkToLoginButtonClick = () => {
  router.push('/login')
}

onMounted(() => {
  fadeInFormItems()
})

</script>

<style lang="scss" scoped>
@use "@/style/constants.scss" as constants;
@use "@/style/colors.scss" as colors;
@use "@/style/font-sizes.scss" as font-sizes;
@use "@/style/animations.scss";

.register {
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

  .box {
    $box-width: 75vw;

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
      background-color: white;
      padding-top: 40px;
      padding-right: 80px;
      padding-bottom: 40px;
      padding-left: 80px;
      width: calc($box-width / 2.5);

      .logo {
        $size: 200px;

        width: $size;
        height: $size;
      }

      .input {
        width: 100%;
        min-width: 260px;
        letter-spacing: 0.1rem;
      }

      .register-btn {
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

      .already-have-an-account {
        display: grid;
        gap: 10px;
        margin-top: 20px;
        text-align: center;

        .question {
          color: colors.$darkblue-600;
        }

        .text-button-label {
          cursor: pointer;
          color: colors.$primary-600;
        }
      }
    }
  }
}
</style>
