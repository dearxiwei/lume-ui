<script setup lang="ts">
import { useLume } from '../plugin'

const props = withDefaults(
  defineProps<{ title?: string; glass?: boolean; sticky?: boolean }>(),
  { sticky: true, glass: undefined }
)
const ui = useLume()
</script>

<template>
  <header
    class="lume-bar lume-safe-top"
    :class="{ 'lume-bar--glass': props.glass ?? ui.config.glass, 'lume-bar--sticky': sticky }"
  >
    <div class="lume-bar__inner lume-row">
      <slot name="left" />
      <div class="lume-grow lume-bar__title">{{ title }}<slot name="title" /></div>
      <slot name="right" />
    </div>
  </header>
</template>

<style scoped>
.lume-bar { background: var(--lume-surface); border-bottom: 1px solid var(--lume-border); }
.lume-bar--sticky { position: sticky; top: 0; z-index: 20; }
.lume-bar__inner { padding: 10px var(--lume-pad); gap: var(--lume-gap); min-height: 52px; }
.lume-bar__title { font-size: var(--lume-font-lg); font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lume-glass .lume-bar--glass {
  background: color-mix(in srgb, var(--lume-surface) var(--lume-glass-ratio), transparent);
  -webkit-backdrop-filter: blur(var(--lume-glass-blur-strong)) saturate(180%);
  backdrop-filter: blur(var(--lume-glass-blur-strong)) saturate(180%);
}
</style>
