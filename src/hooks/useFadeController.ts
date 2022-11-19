import { Nullable } from '@/types/utils'
import gsap, { Expo } from 'gsap'
import { Ref } from 'vue'

type FadeMode = 'fadeIn' | 'fadeOut'

type FadeTo = 'left' | 'right' | 'top' | 'bottom'

type FadeConfig = {
  to?: FadeTo
  tweenVars?: gsap.TweenVars
}

type FadeFromToProperties = {
  from: gsap.TweenVars,
  to: gsap.TweenVars
}

type FadePropertiesRecord = Record<FadeTo, FadeFromToProperties>

const useFadeController = (target: Ref<HTMLElement | undefined>) => {
  const fadeInProperties: FadePropertiesRecord = {
    left: {
      from: {
        x: '100%',
      },
      to: {
        x: 0,
      },
    },
    right: {
      from: {
        x: '-100%',
      },
      to: {
        x: 0,
      },
    },
    top: {
      from: {
        y: '100%',
      },
      to: {
        y: 0,
      },
    },
    bottom: {
      from: {
        y: '-100%',
      },
      to: {
        y: 0,
      },
    },
  }

  const fadeOutProperties: FadePropertiesRecord = {
    left: {
      from: {
        x: 0,
      },
      to: {
        x: '-100%',
      },
    },
    right: {
      from: {
        x: 0,
      },
      to: {
        x: '100%',
      },
    },
    top: {
      from: {
        y: 0,
      },
      to: {
        y: '-100%',
      },
    },
    bottom: {
      from: {
        y: 0,
      },
      to: {
        y: '100%',
      },
    },
  }

  const getFadeProperties = (fadeMode: FadeMode, to: Nullable<FadeTo>): Nullable<FadeFromToProperties> => {
    if (to == null) return null

    return fadeMode === 'fadeIn' ? fadeInProperties[to] : fadeOutProperties[to]
  }

  const fadeIn = (fadeConfig: FadeConfig): Promise<void> => new Promise((resolve) => {
    if (target.value == null) throw new Error('Target not exist')

    const fadeProperties = getFadeProperties('fadeIn', fadeConfig.to)
    const timeline = gsap.timeline()
    timeline.fromTo(target.value, {
      autoAlpha: 0,
      ...fadeProperties?.from,
    }, {
      autoAlpha: 1,
      duration: 0.5,
      ease: Expo.easeOut,
      ...fadeProperties?.to,
      ...fadeConfig.tweenVars,
    })

    timeline.then((() => resolve()))
  })

  const fadeOut = (fadeConfig: FadeConfig): Promise<void> => new Promise((resolve) => {
    if (target.value == null) throw new Error('Target not exist')

    const fadeProperties = getFadeProperties('fadeOut', fadeConfig.to)
    const timeline = gsap.timeline()
    timeline.fromTo(target.value, {
      autoAlpha: 1,
      ...fadeProperties?.from,
    }, {
      autoAlpha: 0,
      duration: 0.5,
      ease: Expo.easeOut,
      ...fadeProperties?.to,
      ...fadeConfig.tweenVars,
    })

    timeline.then(() => resolve())
  })

  const show = () => {
    if (target.value == null) return

    const timeline = gsap.timeline()
    timeline.set(target.value, {
      autoAlpha: 1,
      x: 0,
      y: 0,
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
