<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    type?: string
    placeholder?: string
    disabled?: boolean
  }>(),
  { type: 'text', disabled: false }
)

const model = defineModel<string | number>({ default: '' })
</script>

<template>
  <label class="lume-field">
    <span v-if="label" class="lume-field__label">{{ label }}</span>
    <input
      v-model="model"
      class="lume-field__input"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
    />
  </label>
</template>

<style scoped>
.lume-field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.lume-field__label { font-size: var(--lume-font-sm); color: var(--lume-muted); }
.lume-field__input {
  width: 100%;
  padding: 10px 12px;
  font: inherit;
  font-size: var(--lume-font);
  color: var(--lume-text);
  background: var(--lume-surface-2);
  border: 1px solid var(--lume-border);
  border-radius: var(--lume-radius);
  outline: none;
  user-select: text;
  transition: border-color var(--lume-dur) var(--lume-ease), background var(--lume-dur) var(--lume-ease);
}
.lume-field__input:focus { border-color: var(--lume-primary); }
.lume-field__input:disabled { opacity: 0.55; }
</style>
