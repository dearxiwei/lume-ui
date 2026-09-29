<script setup lang="ts">
import { haptic } from '../haptics'

const props = withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false })
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
    role="switch"
    :aria-checked="model"
    :disabled="disabled"
    class="lume-switch"
    :class="{ 'lume-switch--on': model }"
    @click="toggle"
  >
    <span class="lume-switch__dot" />
  </button>
</template>

<style scoped>
.lume-switch {
  width: 46px;
  height: 28px;
  flex: 0 0 auto;
  padding: 3px;
  border: 0;
  border-radius: 999px;
  background: var(--lume-surface-2);
  border: 1px solid var(--lume-border);
  cursor: pointer;
  transition: background var(--lume-dur) var(--lume-ease), border-color var(--lume-dur) var(--lume-ease);
}
.lume-switch--on { background: var(--lume-primary); border-color: var(--lume-primary); }
.lume-switch__dot {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--lume-knob);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transform: translateX(0);
  transition: transform var(--lume-dur) var(--lume-ease);
}
.lume-switch--on .lume-switch__dot { transform: translateX(18px); }
.lume-switch:disabled { opacity: 0.5; }
</style>
