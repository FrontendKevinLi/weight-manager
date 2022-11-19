import { Nullable } from '@/types/utils'
import gsap, { Expo } from 'gsap'
import { Ref } from 'vue'

type FadeMode = 'fadeIn' | 'fadeOut'

type FadeTo = 'left' | 'right' | 'top' | 'bottom'

type FadeConfig = {
  to?: FadeTo
  tweenVars?: gsap.TweenVars
}

type Direction = {
  axis: 'x' | 'y',
  value: string
}

type FadeDirectionRecord = Record<FadeTo, Direction>

const useFadeController = (target: Ref<HTMLElement | undefined>) => {
  const fadeInDirectionRecord: FadeDirectionRecord = {
    left: {
      axis: 'x',
      value: '100%',
    },
    right: {
      axis: 'x',
      value: '-100%',
    },
    top: {
      axis: 'y',
      value: '100%',
    },
    bottom: {
      axis: 'y',
      value: '-100%',
    },
  }

  const fadeOutDirectionRecord: FadeDirectionRecord = {
    left: {
      axis: 'x',
      value: '-100%',
    },
    right: {
      axis: 'x',
      value: '100%',
    },
    top: {
      axis: 'y',
      value: '-100%',
    },
    bottom: {
      axis: 'y',
      value: '100%',
    },
  }

  const getDirection = (fadeMode: FadeMode, to: Nullable<FadeTo>): Direction => {
    if (to == null) return { axis: 'x', value: '0' }

    return fadeMode === 'fadeIn' ? fadeInDirectionRecord[to] : fadeOutDirectionRecord[to]
  }

  const fadeIn = (fadeConfig: FadeConfig) => {
    if (target.value == null) return

    const direction = getDirection('fadeIn', fadeConfig.to)
    const timeline = gsap.timeline()
    timeline.fromTo(target.value, {
      autoAlpha: 0,
      [direction.axis]: direction.value,
    }, {
      autoAlpha: 1,
      [direction.axis]: 0,
      duration: 0.5,
      ease: Expo.easeOut,
      ...fadeConfig.tweenVars,
    })
  }

  const fadeOut = (fadeConfig: FadeConfig) => {
    if (target.value == null) return

    const direction = getDirection('fadeOut', fadeConfig.to)
    const timeline = gsap.timeline()
    timeline.fromTo(target.value, {
      autoAlpha: 1,
      [direction.axis]: 0,
    }, {
      autoAlpha: 0,
      [direction.axis]: direction.value,
      duration: 0.5,
      ease: Expo.easeOut,
      ...fadeConfig.tweenVars,
    })
  }

  const show = () => {
    if (target.value == null) return

    const timeline = gsap.timeline()
    timeline.set(target.value, {
      autoAlpha: 1,
      x: 0,
    })
  }

  const hide = () => {
    if (target.value == null) return

    const timeline = gsap.timeline()
    timeline.set(target.value, {
      autoAlpha: 0,
    })
  }

  return {
    fadeIn,
    fadeOut,
    show,
    hide,
  }
}

export default useFadeController
