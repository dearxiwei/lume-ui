<script setup lang="ts">
interface Step {
  title: string
  description?: string
}

withDefaults(
  defineProps<{ steps?: Step[]; active?: number; direction?: 'horizontal' | 'vertical' }>(),
  { steps: () => [], active: 0, direction: 'horizontal' }
)
</script>

<template>
  <ol class="lume-steps" :class="`lume-steps--${direction}`">
    <li
      v-for="(s, i) in steps"
      :key="i"
      class="lume-step"
      :class="{ 'is-done': i < active, 'is-active': i === active }"
    >
      <span class="lume-step__dot">{{ i < active ? '✓' : i + 1 }}</span>
      <span class="lume-step__body">
        <span class="lume-step__title">{{ s.title }}</span>
        <span v-if="s.description" class="lume-step__desc">{{ s.description }}</span>
      </span>
    </li>
  </ol>
</template>

<style scoped>
.lume-steps { list-style: none; margin: 0; padding: 0; display: flex; gap: 8px; }
.lume-steps--vertical { flex-direction: column; }
.lume-step { display: flex; align-items: flex-start; gap: 8px; flex: 1 1 0; min-width: 0; }
.lume-steps--vertical .lume-step { flex: 0 0 auto; }
.lume-step__dot {
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: var(--lume-font-sm);
  background: var(--lume-surface-2);
  color: var(--lume-muted);
  border: 1px solid var(--lume-border);
}
.lume-step.is-active .lume-step__dot,
.lume-step.is-done .lume-step__dot {
  background: var(--lume-primary);
  border-color: var(--lume-primary);
  color: var(--lume-on-primary);
}
.lume-step__body { display: flex; flex-direction: column; min-width: 0; }
.lume-step__title { font-size: var(--lume-font-sm); color: var(--lume-text); }
.lume-step__desc { font-size: var(--lume-font-sm); color: var(--lume-muted); }
.lume-step:not(.is-active):not(.is-done) .lume-step__title { color: var(--lume-muted); }
</style>
