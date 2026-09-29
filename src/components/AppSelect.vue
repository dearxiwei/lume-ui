<script setup lang="ts">
interface Option {
  label: string
  value: string | number
}

withDefaults(
  defineProps<{ label?: string; options?: Option[]; placeholder?: string; disabled?: boolean }>(),
  { options: () => [], placeholder: '请选择', disabled: false }
)
const model = defineModel<string | number>({ default: '' })
</script>

<template>
  <label class="lume-select-field">
    <span v-if="label" class="lume-select-field__label">{{ label }}</span>
    <select v-model="model" class="lume-select" :disabled="disabled">
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
  </label>
</template>

<style scoped>
.lume-select-field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.lume-select-field__label { font-size: var(--lume-font-sm); color: var(--lume-muted); }
.lume-select {
  width: 100%;
  padding: 10px 12px;
  font: inherit;
  font-size: var(--lume-font);
  color: var(--lume-text);
  background: var(--lume-surface-2);
  border: 1px solid var(--lume-border);
  border-radius: var(--lume-radius);
  outline: none;
  appearance: none;
}
.lume-select:focus { border-color: var(--lume-primary); }
.lume-select:disabled { opacity: 0.55; }
</style>
