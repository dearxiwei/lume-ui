import type { Directive } from 'vue'

interface RippleElement extends HTMLElement {
  _lumeRippleDown?: (event: PointerEvent) => void
  _lumeRippleUp?: () => void
  _lumeWave?: HTMLSpanElement | null
}

/** Material 风格水波：按指针位置扩散、抬起淡出 */
const vRipple: Directive<RippleElement> = {
  mounted(el) {
    el.classList.add('lume-ripple-root')

    const endWave = () => {
      const wave = el._lumeWave
      if (!wave) return
      el._lumeWave = null
      wave.classList.remove('lume-ripple-spread')
      wave.classList.add('lume-ripple-fade')
      window.setTimeout(() => wave.remove(), 320)
    }

    const onDown = (event: PointerEvent) => {
      if (el.hasAttribute('disabled')) return
      // 若点在"内部交互控件"上（开关/按钮/输入等），不触发整行波纹
      const hit = (event.target as HTMLElement | null)?.closest(
        'button, a, input, select, textarea, [data-lume-no-ripple]'
      )
      if (hit && hit !== el) return
      if (el._lumeWave) {
        el._lumeWave.remove()
        el._lumeWave = null
      }
      const rect = el.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const radius = Math.max(
        Math.hypot(x, y),
        Math.hypot(rect.width - x, y),
        Math.hypot(x, rect.height - y),
        Math.hypot(rect.width - x, rect.height - y)
      )
      const size = radius * 2
      const wave = document.createElement('span')
      wave.className = 'lume-ripple-wave'
      wave.style.width = `${size}px`
      wave.style.height = `${size}px`
      wave.style.left = `${x - radius}px`
      wave.style.top = `${y - radius}px`
      el.appendChild(wave)
      el._lumeWave = wave
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (el._lumeWave === wave) wave.classList.add('lume-ripple-spread')
        })
      })
    }

    const onUp = () => endWave()
    el._lumeRippleDown = onDown
    el._lumeRippleUp = onUp
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
  },
  unmounted(el) {
    if (el._lumeRippleDown) el.removeEventListener('pointerdown', el._lumeRippleDown)
    if (el._lumeRippleUp) {
      window.removeEventListener('pointerup', el._lumeRippleUp)
      window.removeEventListener('pointercancel', el._lumeRippleUp)
    }
    el._lumeWave?.remove()
    el._lumeWave = null
  }
}

export default vRipple
