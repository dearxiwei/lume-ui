<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    min?: number
    max?: number
    step?: number
    showValue?: boolean
    disabled?: boolean
  }>(),
  { min: 0, max: 100, step: 1, showValue: true, disabled: false }
)

const model = defineModel<number>({ default: 0 })
const pct = computed(() =>
  Math.max(0, Math.min(100, ((model.value - props.min) / (props.max - props.min || 1)) * 100))
)
</script>

<template>
  <div class="lume-slider" :class="{ 'lume-slider--disabled': disabled }">
    <input
      v-model.number="model"
      class="lume-slider__input"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :style="{ '--lume-slider-pct': `${pct}%` }"
    />
    <span v-if="showValue" class="lume-slider__value">{{ model }}</span>
  </div>
</template>

<style scoped>
.lume-slider { display: flex; align-items: center; gap: 12px; width: 100%; }
.lume-slider__input {
  flex: 1 1 auto;
  min-width: 0;
  height: 6px;
  border-radius: 999px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(
    to right,
    var(--lume-primary) var(--lume-slider-pct),
    var(--lume-surface-2) var(--lume-slider-pct)
  );
}
.lume-slider__input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--lume-knob);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
  cursor: pointer;
}
.lume-slider__input::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border: 0;
  border-radius: 50%;
  background: var(--lume-knob);
}
.lume-slider__value {
  flex: 0 0 auto;
  min-width: 2.5em;
  text-align: right;
  color: var(--lume-muted);
  font-size: var(--lume-font-sm);
  font-variant-numeric: tabular-nums;
}
.lume-slider--disabled { opacity: 0.5; }
</style>
