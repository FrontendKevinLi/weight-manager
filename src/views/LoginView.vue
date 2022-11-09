<template>
  <div class="login">
    <div
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
          ref="emailInputRef"
          v-model:inputText="email"
          :validate-config="emailValidateConfig"
          :placeholder="'Email'"
          class="white-section-item input"
        />
        <CustomInput
          ref="passwordInputRef"
          v-model:inputText="password"
          :validate-config="passwordValidateConfig"
          :placeholder="'Password'"
          :type="'password'"
          class="white-section-item input"
        />
        <CustomButton
          :label="'Login'"
          class="white-section-item login-btn"
          @click="handleLoginButtonClick"
        />
        <div class="create-account">
          <span
            class="white-section-item question"
            v-text="createAccountQuestion"
          />
          <span
            class="white-section-item text-button-label"
            @click="handleLinkToCreateAccountButtonClick"
            @keydown="handleLinkToCreateAccountButtonClick"
            v-text="createAccountTextButtonLabel"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import gsap, { Expo } from 'gsap'
import InlineSvg from 'vue-inline-svg'
import { useToast } from 'vue-toastification'

import CustomInput from '@/components/CustomInput/CustomInput.vue'
import CustomButton from '@/components/CustomButton.vue'

import BodyWeightingImg from '@/assets/login-page-pictures/bodyWeighting.png'
import LogoFullSvg from '@/assets/logo-full/svg/primaryblue/logo-no-background.svg'
import { login } from '@/firebase/auth'
import { until } from '@open-draft/until'
import { ValidateConfig } from '@/components/CustomInput/types'

export default defineComponent({
  name: 'LoginView',
  components: {
    CustomInput,
    CustomButton,
    InlineSvg,
  },
  data() {
    return {
      email: '',
      password: '',
      BodyWeightingImg,
      LogoFullSvg,
      createAccountQuestion: 'Don\'t have an account?',
      createAccountTextButtonLabel: 'Create account',
    }
  },
  computed: {
    emailValidateConfig(): ValidateConfig {
      const config: ValidateConfig = {
        event: 'blur',
        validateFunction: (email: string) => {
          const isEmpty = email.length === 0
          if (isEmpty) {
            return {
              isValid: false,
              errorMessage: 'Email cannot be empty',
            }
          }

          const isInValidFormat = !/^\S+@\S+$/.test(email)
          if (isInValidFormat) {
            return {
              isValid: false,
              errorMessage: 'Invalid email format',
            }
          }

          return { isValid: true, errorMessage: '' }
        },
      }
      return config
    },
    passwordValidateConfig(): ValidateConfig {
      const config: ValidateConfig = {
        event: 'blur',
        validateFunction: (email: string) => {
          const isEmpty = email.length === 0
          if (isEmpty) {
            return {
              isValid: false,
              errorMessage: 'Password cannot be empty',
            }
          }

          return { isValid: true, errorMessage: '' }
        },
      }
      return config
    },
  },
  mounted() {
    this.initAnimations()
  },
  methods: {
    initAnimations() {
      const timeLine = gsap.timeline()

      timeLine.from(this.$refs['white-section'] as gsap.TweenTarget, {
        autoAlpha: 0,
        y: -100,
        ease: Expo.easeInOut,
        duration: 0.75,
      })
      timeLine.from('.white-section-item', {
        y: '-250px',
        ease: 'back',
        opacity: 0,
        stagger: {
          amount: 0.25,
        },
      }, '-=0.5')
    },
    validateForm() {
      const emailInputRef = this.$refs.emailInputRef as InstanceType<typeof CustomInput>
      const passwordInputRef = this.$refs.passwordInputRef as InstanceType<typeof CustomInput>

      const validList = [
        emailInputRef.validateInput(),
        passwordInputRef.validateInput(),
      ]

      return !validList.some((isValid) => isValid === false)
    },
    async handleLoginButtonClick() {
      const valid = this.validateForm()
      if (!valid) return

      const loginResult = await until(() => login(this.email, this.password))
      if (loginResult.error) {
        const toast = useToast()
        toast.error(loginResult.error.message)
        return
      }

      const vm = this
      gsap.to(this.$refs['white-section'] as gsap.TweenTarget, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2',
        onComplete() {
          vm.$router.push('/dashboard')
        },
      })
    },
    handleLinkToCreateAccountButtonClick() {
      this.$router.push('/register')
    },
    validateEmail(email: string): boolean {
      const isValid = /^\S+@\S+$/.test(email)
      return isValid
    },
  },
})
</script>

<style lang="scss" scoped>
@use "@/style/colors" as colors;
@use "@/style/constants" as constants;
@use "@/style/font-sizes.scss" as font-sizes;
@use "@/style/animations";

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
      visibility: hidden;
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
        $size: 200px;

        width: $size;
        height: $size;
      }

      .input {
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

      .create-account {
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
