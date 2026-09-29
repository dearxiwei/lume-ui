<script setup lang="ts">
import { useLume } from '../plugin'

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    glass?: boolean
    pad?: boolean
    /** 是否裁剪内部内容到圆角内（防止列表/图片直角溢出圆角），默认开 */
    clip?: boolean
  }>(),
  { pad: true, glass: undefined, clip: true }
)
const ui = useLume()
</script>

<template>
  <section
    class="lume-card"
    :class="{
      'lume-card--glass': props.glass ?? ui.config.glass,
      'lume-card--pad': pad,
      'lume-card--clip': clip
    }"
  >
    <header v-if="title || subtitle || $slots.header" class="lume-card__head">
      <slot name="header">
        <div>
          <div v-if="title" class="lume-card__title">{{ title }}</div>
          <div v-if="subtitle" class="lume-card__subtitle">{{ subtitle }}</div>
        </div>
      </slot>
    </header>
    <slot />
  </section>
</template>

<style scoped>
.lume-card {
  background: var(--lume-surface);
  border: 1px solid var(--lume-border);
  border-radius: var(--lume-radius);
}
.lume-card--clip { overflow: hidden; }
.lume-card--pad { padding: var(--lume-pad); }
.lume-card__head { margin-bottom: 10px; }
.lume-card__title { font-size: var(--lume-font); font-weight: 600; }
.lume-card__subtitle { font-size: var(--lume-font-sm); color: var(--lume-muted); margin-top: 2px; }
.lume-glass .lume-card--glass {
  background: color-mix(in srgb, var(--lume-surface) var(--lume-glass-ratio), transparent);
  -webkit-backdrop-filter: blur(var(--lume-glass-blur-strong)) saturate(180%);
  backdrop-filter: blur(var(--lume-glass-blur-strong)) saturate(180%);
}
</style>
