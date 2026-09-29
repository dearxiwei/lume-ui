/**
 * 弹层滚动锁（#4 / #10）——引用计数，支持多弹层叠加。
 * 锁定：html 加 `.lume-scroll-lock`（overflow hidden），并补偿滚动条宽度，避免内容右移/变宽。
 */
let count = 0
let savedPaddingRight = ''

export function lockScroll() {
  if (typeof document === 'undefined') return
  count++
  if (count > 1) return
  const de = document.documentElement
  const sbw = Math.max(0, window.innerWidth - de.clientWidth)
  savedPaddingRight = document.body.style.paddingRight
  if (sbw > 0) document.body.style.paddingRight = `${sbw}px`
  de.style.setProperty('--lume-scrollbar-width', `${sbw}px`)
  de.classList.add('lume-scroll-lock')
}

export function unlockScroll() {
  if (typeof document === 'undefined') return
  if (count === 0) return
  count--
  if (count > 0) return
  document.documentElement.classList.remove('lume-scroll-lock')
  document.body.style.paddingRight = savedPaddingRight
}

/** 当前是否已加锁（调试用） */
export function isScrollLocked() {
  return count > 0
}
