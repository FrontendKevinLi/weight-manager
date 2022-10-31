// Ensure this file is parsed as a module regardless of dependencies.
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    label: string,
  }
}
