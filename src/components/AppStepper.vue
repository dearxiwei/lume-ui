<script setup lang="ts">
import { haptic } from '../haptics'

const props = withDefaults(
  defineProps<{ min?: number; max?: number; step?: number; disabled?: boolean }>(),
  { min: 0, max: 99, step: 1, disabled: false }
)

const model = defineModel<number>({ default: 0 })

function dec() {
  if (props.disabled || model.value <= props.min) return
  model.value = Math.max(props.min, model.value - props.step)
  haptic('select')
}
function inc() {
  if (props.disabled || model.value >= props.max) return
  model.value = Math.min(props.max, model.value + props.step)
  haptic('select')
}
</script>

<template>
  <div class="lume-stepper" :class="{ 'lume-stepper--disabled': disabled }">
    <button class="lume-stepper__btn" type="button" aria-label="减少" :disabled="disabled || model <= min" @click="dec">
      −
    </button>
    <span class="lume-stepper__val">{{ model }}</span>
    <button class="lume-stepper__btn" type="button" aria-label="增加" :disabled="disabled || model >= max" @click="inc">
      +
    </button>
  </div>
</template>

<style scoped>
.lume-stepper {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--lume-border);
  border-radius: var(--lume-radius-sm);
  overflow: hidden;
}
.lume-stepper__btn {
  width: 34px;
  height: 30px;
  border: 0;
  background: var(--lume-surface-2);
  color: var(--lume-text);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
}
.lume-stepper__btn:disabled { opacity: 0.4; cursor: default; }
.lume-stepper__val {
  min-width: 40px;
  text-align: center;
  font-size: var(--lume-font);
  font-variant-numeric: tabular-nums;
  color: var(--lume-text);
}
.lume-stepper--disabled { opacity: 0.6; }
</style>
