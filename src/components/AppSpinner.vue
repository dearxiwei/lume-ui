<script setup lang="ts">
withDefaults(defineProps<{ size?: number; label?: string }>(), { size: 20 })
</script>

<template>
  <span class="lume-spinner-wrap">
    <span class="lume-spinner" :style="{ width: `${size}px`, height: `${size}px` }" />
    <span v-if="label" class="lume-spinner__label">{{ label }}</span>
  </span>
</template>

<style scoped>
.lume-spinner-wrap { display: inline-flex; align-items: center; gap: 8px; color: var(--lume-muted); }
.lume-spinner {
  display: inline-block;
  border-radius: 50%;
  border: 2px solid color-mix(in srgb, var(--lume-primary) 30%, transparent);
  border-top-color: var(--lume-primary);
  animation: lume-spin 0.8s linear infinite;
}
@keyframes lume-spin { to { transform: rotate(360deg); } }
.lume-spinner__label { font-size: var(--lume-font-sm); }
</style>
