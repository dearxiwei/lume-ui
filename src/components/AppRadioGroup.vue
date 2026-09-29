<script setup lang="ts">
import { haptic } from '../haptics'

interface Option {
  label: string
  value: string | number
}

withDefaults(defineProps<{ options?: Option[]; disabled?: boolean }>(), { options: () => [] })
const model = defineModel<string | number>({ default: '' })

function pick(v: string | number) {
  model.value = v
  haptic('select')
}
</script>

<template>
  <div class="lume-radio-group" role="radiogroup">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      role="radio"
      :aria-checked="model === opt.value"
      class="lume-radio"
      :disabled="disabled"
      @click="pick(opt.value)"
    >
      <span class="lume-radio__dot" :class="{ 'lume-radio__dot--on': model === opt.value }" />
      <span>{{ opt.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.lume-radio-group { display: flex; flex-direction: column; gap: 4px; }
.lume-radio { display: inline-flex; align-items: center; gap: 8px; background: none; border: 0; color: var(--lume-text); font: inherit; font-size: var(--lume-font); cursor: pointer; padding: 6px 0; text-align: left; }
.lume-radio__dot {
  width: 20px; height: 20px; flex: 0 0 auto; border-radius: 50%; border: 1px solid var(--lume-border);
  background: var(--lume-surface-2); transition: border-color var(--lume-dur) var(--lume-ease);
  position: relative;
}
.lume-radio__dot::after {
  content: ''; position: absolute; inset: 4px; border-radius: 50%; background: var(--lume-primary);
  transform: scale(0); transition: transform var(--lume-dur) var(--lume-ease);
}
.lume-radio__dot--on { border-color: var(--lume-primary); }
.lume-radio__dot--on::after { transform: scale(1); }
.lume-radio:disabled { opacity: 0.5; }
</style>
