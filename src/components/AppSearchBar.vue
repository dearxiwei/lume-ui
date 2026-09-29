<script setup lang="ts">
withDefaults(defineProps<{ placeholder?: string; disabled?: boolean }>(), {
  placeholder: '搜索',
  disabled: false
})
const model = defineModel<string>({ default: '' })
</script>

<template>
  <label class="lume-search">
    <span class="lume-search__icon" aria-hidden="true">⌕</span>
    <input
      v-model="model"
      class="lume-search__input"
      type="search"
      :placeholder="placeholder"
      :disabled="disabled"
    />
    <button v-if="model" class="lume-search__clear" aria-label="清除" @click.prevent="model = ''">×</button>
  </label>
</template>

<style scoped>
.lume-search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  background: var(--lume-surface-2);
  border: 1px solid var(--lume-border);
}
.lume-search__icon { flex: 0 0 auto; color: var(--lume-muted); font-size: 16px; }
.lume-search__input {
  flex: 1 1 auto;
  min-width: 0;
  border: 0;
  outline: none;
  background: none;
  color: var(--lume-text);
  font: inherit;
  font-size: var(--lume-font);
}
.lume-search__input::placeholder { color: var(--lume-muted); }
.lume-search__clear { flex: 0 0 auto; border: 0; background: none; color: var(--lume-muted); font-size: 16px; cursor: pointer; }
</style>
