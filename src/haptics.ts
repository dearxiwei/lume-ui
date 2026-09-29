/**
 * 触感（震动）——**仅面向安卓**。
 *
 * Web 端只能通过 `navigator.vibrate` 触发；安卓 Chrome / WebView 支持，
 * iOS Safari 不支持（本库不做 iOS 兜底，按需求只考虑安卓）。
 */

export type HapticName = 'select' | 'tap' | 'confirm' | 'long' | 'success' | 'warning' | 'error'

/** 语义 → 震动时长(ms)/节奏序列 */
const PATTERN: Record<HapticName, number | number[]> = {
  select: 8,
  tap: 15,
  confirm: 25,
  long: 10,
  success: [10, 40, 20],
  warning: [20, 60, 20],
  error: [30, 50, 30, 50, 30]
}

let enabled = true

export function setHapticsEnabled(value: boolean) {
  enabled = value
}

export function isAndroid(): boolean {
  return typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)
}

export function canVibrate(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.vibrate === 'function' &&
    isAndroid()
  )
}

/** 触发一次语义震动；非安卓/未开启/不支持时静默忽略 */
export function haptic(name: HapticName = 'tap') {
  if (!enabled || !canVibrate()) return
  try {
    navigator.vibrate(PATTERN[name])
  } catch {
    /* ignore */
  }
}
