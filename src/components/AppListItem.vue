<script setup lang="ts">
import { vRipple } from '../directives'
import { haptic, type HapticName } from '../haptics'

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    clickable?: boolean
    haptic?: 'auto' | HapticName | 'none'
  }>(),
  { clickable: false, haptic: 'tap' }
)

const emit = defineEmits<{ (e: 'click', ev: MouseEvent): void }>()

function onClick(ev: MouseEvent) {
  if (!props.clickable) return
  // 忽略来自内部交互控件的点击
  const hit = (ev.target as HTMLElement | null)?.closest(
    'button, a, input, select, textarea, [data-lume-no-ripple]'
  )
  if (hit) return
  if (props.haptic !== 'none') haptic(props.haptic === 'auto' ? 'tap' : props.haptic)
  emit('click', ev)
}
</script>

<template>
  <div
    v-ripple
    class="lume-item"
    :class="{ 'lume-item--clickable': clickable }"
    role="button"
    :tabindex="clickable ? 0 : -1"
    @click="onClick"
  >
    <div v-if="$slots.leading" class="lume-item__leading"><slot name="leading" /></div>
    <div class="lume-item__body lume-grow">
      <div class="lume-item__title"><slot>{{ title }}</slot></div>
      <div v-if="subtitle || $slots.subtitle" class="lume-item__subtitle">
        <slot name="subtitle">{{ subtitle }}</slot>
      </div>
    </div>
    <div v-if="$slots.trailing" class="lume-item__trailing"><slot name="trailing" /></div>
  </div>
</template>

<style scoped>
.lume-item {
  display: flex;
  align-items: center;
  gap: var(--lume-gap);
  padding: 12px var(--lume-pad);
  border-bottom: 1px solid var(--lume-border);
  background: var(--lume-surface);
  transition: background var(--lume-dur) var(--lume-ease);
}
.lume-item:last-child { border-bottom: 0; }
.lume-item--clickable { cursor: pointer; }
.lume-item--clickable:active { background: var(--lume-surface-2); }
.lume-item__title { font-size: var(--lume-font); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lume-item__subtitle { font-size: var(--lume-font-sm); color: var(--lume-muted); margin-top: 2px; }
.lume-item__leading, .lume-item__trailing { display: flex; align-items: center; flex: 0 0 auto; }
</style>
