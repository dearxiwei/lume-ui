<script setup lang="ts">
import { haptic } from '../haptics'

const props = withDefaults(
  defineProps<{ count?: number; disabled?: boolean; allowClear?: boolean }>(),
  { count: 5, disabled: false, allowClear: true }
)

const model = defineModel<number>({ default: 0 })

function pick(i: number) {
  if (props.disabled) return
  model.value = props.allowClear && model.value === i ? 0 : i
  haptic('select')
}
</script>

<template>
  <div class="lume-rate" :class="{ 'lume-rate--disabled': disabled }" role="slider" :aria-valuenow="model">
    <button
      v-for="i in count"
      :key="i"
      type="button"
      class="lume-rate__item"
      :class="{ 'is-on': i <= model }"
      :aria-label="`${i}`"
      :disabled="disabled"
      @click="pick(i)"
    >
      ★
    </button>
  </div>
</template>

<style scoped>
.lume-rate { display: inline-flex; gap: 2px; }
.lume-rate__item {
  border: 0;
  background: none;
  padding: 0 2px;
  font-size: 22px;
  line-height: 1;
  color: var(--lume-border);
  cursor: pointer;
  transition: color var(--lume-dur) var(--lume-ease), transform var(--lume-dur-fast) var(--lume-ease);
}
.lume-rate__item.is-on { color: var(--lume-warning); }
.lume-rate__item:active { transform: scale(1.15); }
.lume-rate--disabled { opacity: 0.6; }
</style>
