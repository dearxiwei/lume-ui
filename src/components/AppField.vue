<script setup lang="ts">
import { vRipple } from '../directives'
import { haptic } from '../haptics'

const props = withDefaults(
  defineProps<{
    label?: string
    description?: string
    clickable?: boolean
    arrow?: boolean
    haptic?: boolean
    stack?: boolean
    /** 表单内联用法：去掉左右内边距与分隔线，背景透明，与输入控件对齐 */
    flush?: boolean
  }>(),
  { clickable: false, arrow: true, haptic: true, stack: false, flush: false }
)

const emit = defineEmits<{ (e: 'click'): void }>()

function onClick(ev: MouseEvent) {
  if (!props.clickable) return
  // 忽略来自内部交互控件的点击（开关/按钮/输入等自行处理）
  const hit = (ev.target as HTMLElement | null)?.closest(
    'button, a, input, select, textarea, [data-lume-no-ripple]'
  )
  if (hit) return
  if (props.haptic) haptic('tap')
  emit('click')
}
</script>

<template>
  <div
    v-ripple
    class="lume-field"
    :class="{
      'lume-field--clickable': clickable,
      'lume-field--stack': stack,
      'lume-field--flush': flush
    }"
    @click="onClick"
  >
    <div v-if="$slots.leading" class="lume-field__leading"><slot name="leading" /></div>
    <div class="lume-field__main lume-grow">
      <div class="lume-field__label"><slot name="label">{{ label }}</slot></div>
      <div v-if="description || $slots.description" class="lume-field__desc">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
    <div class="lume-field__value"><slot /></div>
    <span v-if="clickable && arrow" class="lume-field__arrow" aria-hidden="true">›</span>
  </div>
</template>

<style scoped>
.lume-field {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 10px var(--lume-pad);
  border-bottom: 1px solid var(--lume-border);
  background: transparent;
  transition: background var(--lume-dur) var(--lume-ease);
}
.lume-field:last-child { border-bottom: 0; }
.lume-field--clickable { cursor: pointer; }
.lume-field--clickable:active { background: var(--lume-surface-2); }
.lume-field--stack { flex-direction: column; align-items: stretch; gap: 8px; }
.lume-field--flush { padding: 0; min-height: 0; border-bottom: 0; }
.lume-field__label { font-size: var(--lume-font); }
.lume-field__desc { font-size: var(--lume-font-sm); color: var(--lume-muted); margin-top: 2px; }
.lume-field__value {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
  color: var(--lume-muted);
  font-size: var(--lume-font-sm);
}
.lume-field--stack .lume-field__value { width: 100%; flex: 1 1 auto; }
.lume-field__leading { display: flex; align-items: center; flex: 0 0 auto; }
.lume-field__arrow { flex: 0 0 auto; color: var(--lume-muted); font-size: 18px; }
</style>
