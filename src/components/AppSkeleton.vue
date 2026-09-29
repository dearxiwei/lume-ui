<script setup lang="ts">
withDefaults(defineProps<{ width?: string; height?: string; radius?: string }>(), {
  width: '100%',
  height: '1em',
  radius: '6px'
})
</script>

<template>
  <span class="lume-skeleton" :style="{ width, height, borderRadius: radius }" />
</template>

<style scoped>
.lume-skeleton {
  display: block;
  background: linear-gradient(
    90deg,
    var(--lume-surface-2) 25%,
    color-mix(in srgb, var(--lume-surface-2) 60%, var(--lume-border)) 37%,
    var(--lume-surface-2) 63%
  );
  background-size: 400% 100%;
  animation: lume-shimmer 1.4s ease infinite;
}
@keyframes lume-shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
}
@media (prefers-reduced-motion: reduce) {
  .lume-skeleton { animation: none; }
}
</style>
