import { inject, reactive, type App, type InjectionKey } from 'vue'
import { setHapticsEnabled } from './haptics'

/** 全局配置项（全部有默认值，均可在运行时覆盖） */
export interface LumeOptions {
  /** 主题：auto 跟随系统 */
  theme?: 'light' | 'dark' | 'auto'
  /** 毛玻璃总开关 */
  glass?: boolean
  /** 毛玻璃模糊强度（px） */
  blur?: number
  /** 毛玻璃不透明度 0~1（默认 0.9，越高越实、越清晰） */
  glassRatio?: number
  /** 玻璃面板强模糊（px），默认 28 */
  blurStrong?: number
  /** 动效档位 */
  motion?: 'none' | 'soft' | 'spring'
  /** 震动：auto=仅安卓 / off / on */
  haptics?: 'auto' | 'off' | 'on'
  /** 基础圆角 */
  radius?: number
  /** 主题色（可选；设置后自动计算前景色，避免看不清） */
  primary?: string
  danger?: string
  success?: string
  warning?: string
  /** 前景色显式覆盖（指定后不再自动推导） */
  onPrimary?: string
  onDanger?: string
  onSuccess?: string
  onWarning?: string
}

export interface LumeConfig {
  theme: 'light' | 'dark' | 'auto'
  glass: boolean
  blur: number
  motion: 'none' | 'soft' | 'spring'
  haptics: 'auto' | 'off' | 'on'
  radius: number
  glassRatio?: number
  blurStrong?: number
  primary?: string
  danger?: string
  success?: string
  warning?: string
  onPrimary?: string
  onDanger?: string
  onSuccess?: string
  onWarning?: string
}

export interface LumeInstance {
  install: (app: App) => void
  config: LumeConfig
  set: (patch: Partial<LumeOptions>) => void
}

const DEFAULTS: LumeConfig = {
  theme: 'auto',
  glass: true,
  blur: 20,
  motion: 'spring',
  haptics: 'auto',
  radius: 14
}

const ACCENTS = ['primary', 'danger', 'success', 'warning'] as const
type Accent = (typeof ACCENTS)[number]

/** 这些强调色填充的组件默认用白字（warning 除外，走算法） */
const WHITE_PREF = new Set<Accent>(['primary', 'danger', 'success'])

const ON_KEY: Record<Accent, keyof LumeOptions> = {
  primary: 'onPrimary',
  danger: 'onDanger',
  success: 'onSuccess',
  warning: 'onWarning'
}

/** YIQ 感知亮度（0~255） */
export function yiq(color: string): number {
  const hex = color.trim().replace('#', '')
  const full =
    hex.length === 3
      ? hex
          .split('')
          .map((c) => c + c)
          .join('')
      : hex
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return 255
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000
}

/**
 * 依据背景色自动选择黑/白前景色。
 * 阈值 150（偏白字：中亮度色一律取白，只有明显浅色才取黑）。
 */
export function readableOn(color: string): string {
  return yiq(color) >= 150 ? '#1a1a1a' : '#ffffff'
}

export const LUME_KEY: InjectionKey<LumeInstance> = Symbol('lume')

let active: LumeConfig | null = null
let autoBound = false

function apply(cfg: LumeConfig) {
  active = cfg
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.add('lume')
  root.classList.toggle('lume-glass', cfg.glass)
  root.classList.toggle('lume-motion', cfg.motion !== 'none')
  root.classList.toggle('lume-motion-soft', cfg.motion === 'soft')
  root.style.setProperty('--lume-blur', `${cfg.blur}px`)
  root.style.setProperty('--lume-radius', `${cfg.radius}px`)
  if (cfg.glassRatio != null) {
    root.style.setProperty('--lume-glass-ratio', `${Math.round(cfg.glassRatio * 100)}%`)
  }
  if (cfg.blurStrong != null) {
    root.style.setProperty('--lume-glass-blur-strong', `${cfg.blurStrong}px`)
  }

  // 先切明暗，再解析主题色（保证按当前模式的 token 计算前景色）
  const dark =
    cfg.theme === 'auto'
      ? !!window.matchMedia?.('(prefers-color-scheme: dark)').matches
      : cfg.theme === 'dark'
  root.classList.toggle('dark', dark)

  const cs = getComputedStyle(root)
  for (const name of ACCENTS) {
    const provided = cfg[name]
    if (provided) root.style.setProperty(`--lume-${name}`, provided)
    else root.style.removeProperty(`--lume-${name}`)

    const override = cfg[ON_KEY[name]] as string | undefined
    if (override) {
      root.style.setProperty(`--lume-on-${name}`, override)
      continue
    }
    const effective = (provided ?? cs.getPropertyValue(`--lume-${name}`)).trim()
    if (effective) {
      // 莫兰迪/主题色填充 → 默认白字；只有"极浅色"(YIQ>=190) 才回落黑字以保证可读
      const on = WHITE_PREF.has(name) && yiq(effective) < 190 ? '#ffffff' : readableOn(effective)
      root.style.setProperty(`--lume-on-${name}`, on)
    }
  }

  setHapticsEnabled(cfg.haptics !== 'off')

  if (cfg.theme === 'auto' && !autoBound && typeof window !== 'undefined' && window.matchMedia) {
    autoBound = true
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (active && active.theme === 'auto') apply(active)
    })
  }
}

function makeInstance(initial: LumeConfig): LumeInstance {
  const cfg = reactive(initial) as LumeConfig
  return {
    install() {
      /* 由 createLume 覆盖 */
    },
    config: cfg,
    set(patch: Partial<LumeOptions>) {
      Object.assign(cfg, patch)
      apply(cfg)
    }
  }
}

const FALLBACK = makeInstance({ ...DEFAULTS })

/** 创建并安装 lume：`app.use(createLume({ theme: 'auto', primary: '#5e72e4' }))` */
export function createLume(options: LumeOptions = {}): LumeInstance {
  const inst = makeInstance({ ...DEFAULTS, ...options })
  apply(inst.config)
  inst.install = (app: App) => {
    app.provide(LUME_KEY, inst)
  }
  return inst
}

/** 组件内读取全局实例（config / set） */
export function useLume(): LumeInstance {
  return inject(LUME_KEY, FALLBACK)
}
