import type { InjectionKey } from 'vue'

export interface CollapseCtx {
  toggle: (key: string | number) => void
  isOpen: (key: string | number) => boolean
}

export const COLLAPSE_KEY: InjectionKey<CollapseCtx> = Symbol('lume-collapse')
