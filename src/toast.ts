import { reactive } from 'vue'

export type ToastType = 'info' | 'success' | 'warning' | 'error'

export interface ToastItem {
  id: number
  text: string
  type: ToastType
  duration: number
}

export const toasts = reactive<ToastItem[]>([])

let seq = 1

/** 弹出一条轻提示（配合 <AppToastHost/> 使用） */
export function toast(text: string, opts: { type?: ToastType; duration?: number } = {}): number {
  const item: ToastItem = {
    id: seq++,
    text,
    type: opts.type ?? 'info',
    duration: opts.duration ?? 2200
  }
  toasts.push(item)
  if (item.duration > 0) setTimeout(() => dismiss(item.id), item.duration)
  return item.id
}

export function dismiss(id: number) {
  const i = toasts.findIndex((t) => t.id === id)
  if (i >= 0) toasts.splice(i, 1)
}
