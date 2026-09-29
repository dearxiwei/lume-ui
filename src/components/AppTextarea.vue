<script setup lang="ts">
withDefaults(
  defineProps<{ label?: string; placeholder?: string; rows?: number; disabled?: boolean }>(),
  { rows: 3, disabled: false }
)
const model = defineModel<string>({ default: '' })
</script>

<template>
  <label class="lume-textarea-field">
    <span v-if="label" class="lume-textarea-field__label">{{ label }}</span>
    <textarea
      v-model="model"
      class="lume-textarea"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
    />
  </label>
</template>

<style scoped>
.lume-textarea-field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.lume-textarea-field__label { font-size: var(--lume-font-sm); color: var(--lume-muted); }
.lume-textarea {
  width: 100%;
  resize: vertical;
  padding: 10px 12px;
  font: inherit;
  font-size: var(--lume-font);
  color: var(--lume-text);
  background: var(--lume-surface-2);
  border: 1px solid var(--lume-border);
  border-radius: var(--lume-radius);
  outline: none;
  user-select: text;
  transition: border-color var(--lume-dur) var(--lume-ease);
}
.lume-textarea:focus { border-color: var(--lume-primary); }
.lume-textarea:disabled { opacity: 0.55; }
</style>
