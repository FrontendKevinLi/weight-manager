export type ColorConfig = {
  linearGradient?: {
    from: string,
    to: string
  },
  color?: string,
}

export type AnimationConfig = {
  enabled: boolean
}

export type ProgressCircle2Config = {
  colorConfig?: ColorConfig,
  animationConfig?: AnimationConfig,
  /** @description Number is between 0 to 1; Floating point */
  percentage: number,
  stroke: {
    linecap: 'round' | 'square',
    width: number
  },
}
