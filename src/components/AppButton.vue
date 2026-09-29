<script setup lang="ts">
import { computed } from 'vue'
import { vRipple } from '../directives'
import { haptic, type HapticName } from '../haptics'
import { useLume } from '../plugin'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'default' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    block?: boolean
    disabled?: boolean
    /** auto=按 variant 选语义；none=不震；或指定语义 */
    haptic?: 'auto' | HapticName | 'none'
    /** 毛玻璃按钮；默认跟随全局 */
    glass?: boolean
  }>(),
  { variant: 'default', size: 'md', block: false, disabled: false, haptic: 'auto' }
)

const emit = defineEmits<{ (e: 'click', ev: MouseEvent): void }>()
const ui = useLume()

const AUTO: Record<string, HapticName> = {
  primary: 'confirm',
  default: 'tap',
  danger: 'select',
  ghost: 'tap'
}

const classes = computed(() => [
  'lume-btn',
  `lume-btn--${props.variant}`,
  `lume-btn--${props.size}`,
  {
    'lume-btn--block': props.block,
    'lume-btn--disabled': props.disabled,
    'lume-btn--glass': props.glass ?? ui.config.glass
  }
])

function onClick(ev: MouseEvent) {
  if (props.disabled) return
  if (props.haptic !== 'none') {
    haptic(props.haptic === 'auto' ? AUTO[props.variant] ?? 'tap' : props.haptic)
  }
  emit('click', ev)
}
</script>

<template>
  <button v-ripple type="button" :class="classes" :disabled="disabled" @click="onClick">
    <slot />
  </button>
</template>

<style scoped>
.lume-btn {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid var(--lume-border);
  border-radius: var(--lume-radius);
  background: var(--lume-surface-2);
  color: var(--lume-text);
  font: inherit;
  font-size: var(--lume-font);
  line-height: 1;
  padding: 10px 16px;
  cursor: pointer;
  user-select: none;
  transition: transform var(--lume-dur-fast) var(--lume-ease), background var(--lume-dur) var(--lume-ease),
    border-color var(--lume-dur) var(--lume-ease);
}
.lume-btn:active { transform: scale(0.97); }
.lume-btn--sm { padding: 6px 10px; font-size: var(--lume-font-sm); }
.lume-btn--lg { padding: 12px 20px; }
.lume-btn--block { width: 100%; }
.lume-btn--primary { background: var(--lume-primary); border-color: var(--lume-primary); color: var(--lume-on-primary); }
.lume-btn--danger { background: var(--lume-danger); border-color: var(--lume-danger); color: var(--lume-on-danger); }
.lume-btn--ghost { background: transparent; }
.lume-btn--disabled { opacity: 0.5; pointer-events: none; }
.lume-glass .lume-btn--glass {
  background: color-mix(in srgb, var(--lume-surface-2) var(--lume-glass-ratio), transparent);
  -webkit-backdrop-filter: blur(calc(var(--lume-blur) * 0.5)) saturate(160%);
  backdrop-filter: blur(calc(var(--lume-blur) * 0.5)) saturate(160%);
}
</style>
