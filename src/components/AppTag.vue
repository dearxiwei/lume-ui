<script setup lang="ts">
withDefaults(
  defineProps<{ variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' }>(),
  { variant: 'default' }
)
</script>

<template>
  <span class="lume-tag" :class="`lume-tag--${variant}`"><slot /></span>
</template>

<style scoped>
.lume-tag {
  display: inline-flex;
  align-items: center;
  padding: 1px 8px;
  border-radius: 999px;
  font-size: var(--lume-font-sm);
  line-height: 1.6;
  border: 1px solid var(--lume-border);
  background: var(--lume-surface-2);
  color: var(--lume-text);
}
.lume-tag--primary { border-color: var(--lume-primary); color: var(--lume-primary); background: transparent; }
.lume-tag--success { border-color: var(--lume-success); color: var(--lume-success); background: transparent; }
.lume-tag--warning { border-color: var(--lume-warning); color: var(--lume-warning); background: transparent; }
.lume-tag--danger { border-color: var(--lume-danger); color: var(--lume-danger); background: transparent; }
</style>
