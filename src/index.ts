import './styles/tokens.css'
import './styles/lume.css'

export { createLume, useLume, LUME_KEY, readableOn } from './plugin'
export type { LumeOptions, LumeConfig, LumeInstance } from './plugin'

export { lockScroll, unlockScroll, isScrollLocked } from './scroll-lock'

export { haptic, setHapticsEnabled, canVibrate, isAndroid } from './haptics'
export type { HapticName } from './haptics'

export { vRipple, vTap } from './directives'

export { toast, dismiss, toasts } from './toast'
export type { ToastType, ToastItem } from './toast'

export * from './components'
