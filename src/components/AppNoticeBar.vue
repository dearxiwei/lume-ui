<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    type?: 'info' | 'success' | 'warning' | 'danger'
    text?: string
    closable?: boolean
  }>(),
  { type: 'info', closable: false }
)

const ICON: Record<string, string> = { info: 'ℹ', success: '✓', warning: '!', danger: '✕' }
const show = ref(true)
</script>

<template>
  <div v-if="show" class="lume-notice" :class="`lume-notice--${props.type}`" role="alert">
    <span class="lume-notice__icon" aria-hidden="true">{{ ICON[props.type] }}</span>
    <span class="lume-notice__text"><slot>{{ text }}</slot></span>
    <button v-if="closable" class="lume-notice__close" aria-label="关闭" @click="show = false">×</button>
  </div>
</template>

<style scoped>
.lume-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: var(--lume-radius-sm);
  color: var(--lume-text);
  font-size: var(--lume-font-sm);
  background: color-mix(in srgb, var(--lume-primary) 14%, var(--lume-surface));
}
.lume-notice--success { background: color-mix(in srgb, var(--lume-success) 16%, var(--lume-surface)); }
.lume-notice--warning { background: color-mix(in srgb, var(--lume-warning) 20%, var(--lume-surface)); }
.lume-notice--danger { background: color-mix(in srgb, var(--lume-danger) 15%, var(--lume-surface)); }
.lume-notice__icon { flex: 0 0 auto; width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center;
  border-radius: 50%; font-size: 12px; color: var(--lume-on-primary); background: var(--lume-primary); }
.lume-notice--success .lume-notice__icon { background: var(--lume-success); color: var(--lume-on-success); }
.lume-notice--warning .lume-notice__icon { background: var(--lume-warning); color: var(--lume-on-warning); }
.lume-notice--danger .lume-notice__icon { background: var(--lume-danger); color: var(--lume-on-danger); }
.lume-notice__text { flex: 1 1 auto; min-width: 0; }
.lume-notice__close { flex: 0 0 auto; border: 0; background: none; color: var(--lume-muted); font-size: 16px; cursor: pointer; padding: 0 2px; }
</style>
