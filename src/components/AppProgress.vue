<script setup lang="ts">
withDefaults(defineProps<{ value?: number; max?: number; indeterminate?: boolean; glass?: boolean }>(), {
  value: 0,
  max: 100,
  indeterminate: false
})
</script>

<template>
  <div class="lume-progress" :class="{ 'lume-progress--indet': indeterminate }" role="progressbar">
    <div
      class="lume-progress__bar"
      :style="indeterminate ? {} : { width: `${Math.min(100, (value / max) * 100)}%` }"
    />
  </div>
</template>

<style scoped>
.lume-progress {
  position: relative;
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: var(--lume-surface-2);
  overflow: hidden;
}
.lume-progress__bar {
  height: 100%;
  border-radius: inherit;
  background: var(--lume-primary);
  transition: width var(--lume-dur-slow) var(--lume-ease);
}
.lume-progress--indet .lume-progress__bar {
  position: absolute;
  width: 40%;
  animation: lume-indet 1.2s var(--lume-ease) infinite;
}
@keyframes lume-indet {
  0% { left: -40%; }
  100% { left: 100%; }
}
</style>
