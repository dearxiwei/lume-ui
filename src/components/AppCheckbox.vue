<script setup lang="ts">
import { haptic } from '../haptics'

const props = withDefaults(defineProps<{ label?: string; disabled?: boolean }>(), { disabled: false })
const model = defineModel<boolean>({ default: false })

function toggle() {
  if (props.disabled) return
  model.value = !model.value
  haptic('select')
}
</script>

<template>
  <button
    type="button"
    role="checkbox"
    :aria-checked="model"
    :disabled="disabled"
    class="lume-check"
    @click="toggle"
  >
    <span class="lume-check__box" :class="{ 'lume-check__box--on': model }">
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
        <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
    <span v-if="label || $slots.default" class="lume-check__label"><slot>{{ label }}</slot></span>
  </button>
</template>

<style scoped>
.lume-check { display: inline-flex; align-items: center; gap: 8px; background: none; border: 0; color: var(--lume-text); font: inherit; font-size: var(--lume-font); cursor: pointer; padding: 4px 0; }
.lume-check__box {
  width: 20px; height: 20px; flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid var(--lume-border); border-radius: 6px; background: var(--lume-surface-2); color: transparent;
  transition: background var(--lume-dur) var(--lume-ease), border-color var(--lume-dur) var(--lume-ease), color var(--lume-dur) var(--lume-ease);
}
.lume-check__box--on { background: var(--lume-primary); border-color: var(--lume-primary); color: var(--lume-on-primary); }
.lume-check:disabled { opacity: 0.5; }
</style>
