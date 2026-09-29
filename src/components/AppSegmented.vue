<script setup lang="ts">
import { computed } from 'vue'
import { haptic } from '../haptics'

interface Option {
  label: string
  value: string | number
}

const props = withDefaults(defineProps<{ options?: Option[]; disabled?: boolean }>(), {
  options: () => [],
  disabled: false
})
const model = defineModel<string | number>({ default: '' })

const activeIndex = computed(() => props.options.findIndex((o) => o.value === model.value))

function pick(v: string | number) {
  if (props.disabled) return
  model.value = v
  haptic('select')
}
</script>

<template>
  <div class="lume-seg" role="tablist">
    <span
      class="lume-seg__thumb"
      :style="{ width: `calc((100% - 6px) / ${Math.max(options.length, 1)})`, transform: `translateX(${Math.max(activeIndex, 0) * 100}%)` }"
    />
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      role="tab"
      :aria-selected="model === opt.value"
      class="lume-seg__item"
      :class="{ 'lume-seg__item--on': model === opt.value }"
      :disabled="disabled"
      @click="pick(opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<style scoped>
.lume-seg {
  position: relative;
  display: flex;
  padding: 3px;
  background: var(--lume-surface-2);
  border: 1px solid var(--lume-border);
  border-radius: 999px;
}
.lume-seg__thumb {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 3px;
  border-radius: 999px;
  background: var(--lume-surface);
  box-shadow: var(--lume-shadow);
  transition: transform var(--lume-dur) var(--lume-ease);
}
.lume-seg__item {
  position: relative;
  z-index: 1;
  flex: 1 1 0;
  min-width: 0;
  padding: 6px 8px;
  border: 0;
  background: none;
  color: var(--lume-muted);
  font: inherit;
  font-size: var(--lume-font-sm);
  border-radius: 999px;
  cursor: pointer;
  transition: color var(--lume-dur) var(--lume-ease);
}
.lume-seg__item--on { color: var(--lume-text); font-weight: 600; }
</style>
