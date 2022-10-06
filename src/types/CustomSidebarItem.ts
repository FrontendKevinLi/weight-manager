export default class CustomSidebarItem {
  icon: string

  className: string

  path: string

  slideIn?: boolean

  background?: boolean

  clickable?: boolean

  constructor({
    icon,
    className,
    path,
    slideIn = true,
    background = true,
    clickable = true,
  }: {
    icon: string,
    className: string,
    path: string,
    slideIn?: boolean,
    background?: boolean
    clickable?: boolean
  }) {
    this.icon = icon
    this.className = className
    this.path = path
    this.slideIn = slideIn
    this.background = background
    this.clickable = clickable
  }
}
