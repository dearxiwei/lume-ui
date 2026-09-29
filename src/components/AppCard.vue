<script setup lang="ts">
import { alert } from '../dialog'
import { useLume } from '../plugin'

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    /** 说明文字：设置后标题旁出现「?」按钮，点击弹出说明 */
    help?: string
    glass?: boolean
    pad?: boolean
    /** 是否裁剪内部内容到圆角内（防止列表/图片直角溢出圆角），默认开 */
    clip?: boolean
  }>(),
  { pad: true, glass: undefined, clip: true }
)
const ui = useLume()

function showHelp() {
  if (!props.help) return
  void alert({ title: props.title || '说明', message: props.help })
}
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
    <header v-if="title || subtitle || help || $slots.header || $slots.extra" class="lume-card__head">
      <slot name="header">
        <div class="lume-card__titles">
          <div v-if="title" class="lume-card__title">{{ title }}</div>
          <div v-if="subtitle" class="lume-card__subtitle">{{ subtitle }}</div>
        </div>
      </slot>
      <div class="lume-card__tools">
        <button v-if="help" class="lume-card__help" type="button" aria-label="说明" @click="showHelp">?</button>
        <slot name="extra" />
      </div>
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
.lume-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}
.lume-card__titles { min-width: 0; }
.lume-card__title { font-size: var(--lume-font); font-weight: 600; }
.lume-card__subtitle { font-size: var(--lume-font-sm); color: var(--lume-muted); margin-top: 2px; }
.lume-card__tools { display: flex; align-items: center; gap: 8px; flex: 0 0 auto; }
.lume-card__help {
  width: 22px;
  height: 22px;
  padding: 0;
  border-radius: 999px;
  border: 1px solid var(--lume-border);
  background: var(--lume-surface-2);
  color: var(--lume-muted);
  font: inherit;
  font-size: var(--lume-font-sm);
  line-height: 1;
  cursor: pointer;
  transition: transform var(--lume-dur-fast) var(--lume-ease), color var(--lume-dur) var(--lume-ease);
}
.lume-card__help:active { transform: scale(0.9); }
.lume-card__help:hover { color: var(--lume-text); }
.lume-glass .lume-card--glass {
  background: color-mix(in srgb, var(--lume-surface) var(--lume-glass-ratio), transparent);
  -webkit-backdrop-filter: blur(var(--lume-glass-blur-strong)) saturate(180%);
  backdrop-filter: blur(var(--lume-glass-blur-strong)) saturate(180%);
}
</style>
