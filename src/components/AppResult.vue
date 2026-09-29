<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    status?: 'info' | 'success' | 'warning' | 'danger'
    title?: string
    description?: string
  }>(),
  { status: 'info' }
)

const ICON: Record<string, string> = { info: 'ℹ', success: '✓', warning: '!', danger: '✕' }
</script>

<template>
  <div class="lume-result">
    <div class="lume-result__icon" :class="`lume-result__icon--${props.status}`">
      {{ ICON[props.status] }}
    </div>
    <div v-if="title" class="lume-result__title">{{ title }}</div>
    <div v-if="description" class="lume-result__desc">{{ description }}</div>
    <div v-if="$slots.default" class="lume-result__extra"><slot /></div>
  </div>
</template>

<style scoped>
.lume-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: calc(var(--lume-pad) * 1.5) var(--lume-pad);
}
.lume-result__icon {
  width: 56px;
  height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 26px;
  background: var(--lume-primary);
  color: var(--lume-on-primary);
}
.lume-result__icon--success { background: var(--lume-success); color: var(--lume-on-success); }
.lume-result__icon--warning { background: var(--lume-warning); color: var(--lume-on-warning); }
.lume-result__icon--danger { background: var(--lume-danger); color: var(--lume-on-danger); }
.lume-result__title { font-size: var(--lume-font-lg); font-weight: 600; color: var(--lume-text); }
.lume-result__desc { font-size: var(--lume-font-sm); color: var(--lume-muted); max-width: 80%; }
.lume-result__extra { margin-top: 8px; }
</style>
