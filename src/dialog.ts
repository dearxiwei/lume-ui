import { reactive } from 'vue'

/** 一个确认步骤（多步确认时按顺序展示） */
export interface DialogStep {
  title?: string
  message?: string
  okText?: string
  cancelText?: string
  /** 危险操作：确认按钮使用危险配色 */
  danger?: boolean
}

export type AlertRequest = {
  kind: 'alert'
  title?: string
  message?: string
  okText?: string
  resolve: () => void
}

export type ConfirmRequest = {
  kind: 'confirm'
  steps: DialogStep[]
  index: number
  resolve: (ok: boolean) => void
}

export type DialogRequest = AlertRequest | ConfirmRequest

/** 当前待处理的弹窗队列（配合 <AppDialogHost/> 使用） */
export const dialogs = reactive<DialogRequest[]>([])

/** 信息提示弹窗（单按钮） */
export function alert(opts: { title?: string; message?: string; okText?: string } = {}): Promise<void> {
  return new Promise((resolve) => {
    dialogs.push({ kind: 'alert', title: opts.title, message: opts.message, okText: opts.okText, resolve })
  })
}

/** 单次确认弹窗 */
export function confirm(opts: DialogStep): Promise<boolean> {
  return new Promise((resolve) => {
    dialogs.push({ kind: 'confirm', steps: [opts], index: 0, resolve })
  })
}

/** 两次确认弹窗（危险操作）：两步都确认才返回 true */
export function confirm2(first: DialogStep, second: DialogStep): Promise<boolean> {
  return new Promise((resolve) => {
    dialogs.push({ kind: 'confirm', steps: [first, second], index: 0, resolve })
  })
}

/** 连续 N 次确认弹窗 */
export function confirmSteps(steps: DialogStep[]): Promise<boolean> {
  return new Promise((resolve) => {
    dialogs.push({ kind: 'confirm', steps: steps.slice(), index: 0, resolve })
  })
}
