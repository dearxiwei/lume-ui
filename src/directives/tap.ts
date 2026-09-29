import type { Directive } from 'vue'

interface TapElement extends HTMLElement {
  _lumeTapDown?: (event: PointerEvent) => void
  _lumeTapMove?: (event: PointerEvent) => void
  _lumeTapUp?: (event: PointerEvent) => void
  _lumeTapCancel?: () => void
}

const THRESHOLD = 8

/** 轻点指令：位移超过阈值不算点按；并吞掉紧随 pointerup 的 click 防误触 */
const vTap: Directive<TapElement, (event: PointerEvent | MouseEvent) => void> = {
  mounted(el, binding) {
    let startX = 0
    let startY = 0
    let moved = false
    let tracking = false

    const disabled = () => el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true'

    const onDown = (event: PointerEvent) => {
      if (disabled()) return
      startX = event.clientX
      startY = event.clientY
      moved = false
      tracking = true
    }
    const onMove = (event: PointerEvent) => {
      if (!tracking) return
      if (Math.abs(event.clientX - startX) > THRESHOLD || Math.abs(event.clientY - startY) > THRESHOLD) {
        moved = true
      }
    }
    const onUp = (event: PointerEvent) => {
      if (!tracking) return
      tracking = false
      if (moved || disabled()) return
      const swallow = (e: Event) => {
        e.stopPropagation()
        e.preventDefault()
      }
      window.addEventListener('click', swallow, { capture: true, once: true })
      window.setTimeout(() => window.removeEventListener('click', swallow, true), 350)
      binding.value(event)
    }
    const onCancel = () => {
      tracking = false
    }

    el._lumeTapDown = onDown
    el._lumeTapMove = onMove
    el._lumeTapUp = onUp
    el._lumeTapCancel = onCancel
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onCancel)
    window.addEventListener('pointermove', onMove, { passive: true })
  },
  unmounted(el) {
    if (el._lumeTapDown) el.removeEventListener('pointerdown', el._lumeTapDown)
    if (el._lumeTapUp) el.removeEventListener('pointerup', el._lumeTapUp)
    if (el._lumeTapCancel) el.removeEventListener('pointercancel', el._lumeTapCancel)
    if (el._lumeTapMove) window.removeEventListener('pointermove', el._lumeTapMove)
  }
}

export default vTap
