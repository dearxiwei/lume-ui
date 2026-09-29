<script setup lang="ts">
import { useLume } from '../plugin'

const props = withDefaults(defineProps<{ title?: string; glass?: boolean }>(), { glass: undefined })
const ui = useLume()
</script>

<template>
  <section class="lume-group">
    <div v-if="title" class="lume-group__title">{{ title }}</div>
    <div class="lume-group__body" :class="{ 'lume-group__body--glass': props.glass ?? ui.config.glass }">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.lume-group { margin-bottom: var(--lume-gap); }
.lume-group__title { font-size: var(--lume-font-sm); color: var(--lume-muted); margin: 0 4px 6px; }
.lume-group__body {
  background: var(--lume-surface);
  border: 1px solid var(--lume-border);
  border-radius: var(--lume-radius);
  overflow: hidden;
}
.lume-glass .lume-group__body--glass {
  background: color-mix(in srgb, var(--lume-surface) var(--lume-glass-ratio), transparent);
  -webkit-backdrop-filter: blur(var(--lume-glass-blur-strong)) saturate(180%);
  backdrop-filter: blur(var(--lume-glass-blur-strong)) saturate(180%);
}
</style>
