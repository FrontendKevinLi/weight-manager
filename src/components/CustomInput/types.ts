export type ValidateConfig = {
  errorMessage: string
  event: keyof WindowEventMap
  validateFunction: (value: string) => boolean
}
