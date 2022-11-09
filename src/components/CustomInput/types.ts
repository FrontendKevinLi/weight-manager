export type ValidateConfig = {
  event: keyof WindowEventMap
  validateFunction: (value: string) => {
    isValid: boolean
    errorMessage: string
  }
}
