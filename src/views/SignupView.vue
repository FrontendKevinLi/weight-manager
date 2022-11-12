<template>
  <div class="register-form">
    <!-- <InlineSvg
      class="logo"
      :src="LogoFullSvg"
    /> -->
    <span class="title">Create Account</span>
    <CustomInput
      ref="emailInputRef"
      v-model:inputText="email"
      :validate-config="emailValidateConfig"
      :placeholder="'Email'"
      :type="'text'"
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
    <CustomInput
      ref="confirmPasswordInputRef"
      v-model:inputText="confirmPassword"
      :validate-config="confirmPasswordValidateConfig"
      :placeholder="'Confirm Password'"
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
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { useToast } from 'vue-toastification'
import CustomButton from '@/components/CustomButton.vue'
import CustomInput from '@/components/CustomInput/CustomInput.vue'

import { signUp } from '@/firebase/auth'
import { until } from '@open-draft/until'
import { ValidateConfig } from '@/components/CustomInput/types'

const router = useRouter()
const toast = useToast()

const alreadyHaveAnAccountQuestion = 'Already have an account?'
const loginTextButtonLabel = 'Login'

const whiteSectionRef = ref<HTMLElement>()
const emailInputRef = ref<InstanceType<typeof CustomInput>>()
const passwordInputRef = ref<InstanceType<typeof CustomInput>>()
const confirmPasswordInputRef = ref<InstanceType<typeof CustomInput>>()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const emailValidateConfig = ref<ValidateConfig>({
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
})

const passwordValidateConfig = computed(() => ({
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
}) as ValidateConfig)

const confirmPasswordValidateConfig = computed(() => ({
  event: 'blur',
  validateFunction: (confirmPassword: string) => {
    const isEmpty = confirmPassword.length === 0
    if (isEmpty) {
      return {
        isValid: false,
        errorMessage: 'Password cannot be empty',
      }
    }

    const isDifferent = computed(() => confirmPassword !== password.value)
    if (isDifferent.value) {
      return {
        isValid: false,
        errorMessage: 'Password should be the same',
      }
    }

    return { isValid: true, errorMessage: '' }
  },
}) as ValidateConfig)

const fadeInFormItems = () => {
  const timeLine = gsap.timeline()

  timeLine.from('.white-section-item', {
    y: '-250px',
    ease: 'back',
    opacity: 0,
    stagger: {
      amount: 0.25,
    },
  }, 0.15)
}

const validateForm = () => {
  const validList = [
    emailInputRef.value?.validateInput(),
    passwordInputRef.value?.validateInput(),
    confirmPasswordInputRef.value?.validateInput(),
  ]

  return !validList.some((isValid) => isValid === false)
}

const handleRegisterButtonClick = async () => {
  const valid = validateForm()
  if (!valid) return

  const signUpResult = await until(() => signUp(email.value, password.value))
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

.register-form {
  display: grid;
  gap: 15px;
  place-items: center;
  width: 100%;

  .logo {
    $size: 200px;

    width: $size;
    height: $size;
  }

  .title {
    margin-bottom: 20px;
    color: colors.$darkblue-600;
    font-size: font-sizes.$medium;
  }

  .input {
    width: 100%;
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
</style>
