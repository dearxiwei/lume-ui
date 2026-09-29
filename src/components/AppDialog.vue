<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { useLume } from '../plugin'
import { lockScroll, unlockScroll } from '../scroll-lock'

const props = withDefaults(
  defineProps<{
    show: boolean
    title?: string
    message?: string
    closeOnOverlay?: boolean
    glass?: boolean
    width?: string
  }>(),
  { closeOnOverlay: true, glass: undefined, width: '340px' }
)

const emit = defineEmits<{ (e: 'update:show', v: boolean): void }>()
const ui = useLume()

watch(
  () => props.show,
  (v) => (v ? lockScroll() : unlockScroll()),
  { immediate: true }
)
onBeforeUnmount(() => {
  if (props.show) unlockScroll()
})

function close() {
  emit('update:show', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="lume-dialog">
      <div v-if="show" class="lume-overlay" @click.self="closeOnOverlay && close()">
        <div
          class="lume-panel"
          :class="{ 'lume-panel--glass': glass ?? ui.config.glass }"
          :style="{ maxWidth: width }"
          role="alertdialog"
          aria-modal="true"
        >
          <div v-if="title" class="lume-panel__title">{{ title }}</div>
          <div v-if="message" class="lume-panel__msg">{{ message }}</div>
          <slot />
          <div v-if="$slots.footer" class="lume-panel__footer lume-row">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lume-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--lume-mask);
}
.lume-panel {
  width: 100%;
  background: var(--lume-surface);
  color: var(--lume-text);
  border: 1px solid var(--lume-border);
  border-radius: var(--lume-radius-lg);
  padding: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
}
.lume-glass .lume-panel--glass {
  background: color-mix(in srgb, var(--lume-surface) var(--lume-glass-ratio), transparent);
  -webkit-backdrop-filter: blur(var(--lume-glass-blur-strong)) saturate(180%);
  backdrop-filter: blur(var(--lume-glass-blur-strong)) saturate(180%);
}
.lume-panel__title { text-align: center; font-weight: 600; margin-bottom: 8px; }
.lume-panel__msg { text-align: center; font-size: var(--lume-font-sm); color: var(--lume-muted); margin-bottom: 8px; overflow-wrap: anywhere; }
.lume-panel__footer { margin-top: 16px; justify-content: flex-end; }

.lume-dialog-enter-active,
.lume-dialog-leave-active { transition: opacity var(--lume-dur) var(--lume-ease); }
.lume-dialog-enter-active .lume-panel,
.lume-dialog-leave-active .lume-panel { transition: transform var(--lume-dur) var(--lume-ease); }
.lume-dialog-enter-from,
.lume-dialog-leave-to { opacity: 0; }
.lume-dialog-enter-from .lume-panel,
.lume-dialog-leave-to .lume-panel { transform: scale(0.94); }
</style>
