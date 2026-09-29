<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { useLume } from '../plugin'
import { lockScroll, unlockScroll } from '../scroll-lock'

const props = withDefaults(
  defineProps<{
    show: boolean
    title?: string
    /** auto: 手机底部弹 / 桌面居中弹；bottom: 始终底部；center: 始终居中 */
    position?: 'auto' | 'bottom' | 'center'
    closeOnOverlay?: boolean
    glass?: boolean
    maxWidth?: string
  }>(),
  { position: 'auto', closeOnOverlay: true, glass: undefined, maxWidth: '520px' }
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
    <Transition name="lume-sheet">
      <div v-if="show" class="lume-overlay" @click.self="closeOnOverlay && close()">
        <div
          class="lume-panel"
          :class="[`lume-panel--${position}`, { 'lume-panel--glass': glass ?? ui.config.glass }]"
          :style="{ maxWidth }"
          role="dialog"
          aria-modal="true"
        >
          <div v-if="title" class="lume-panel__title">{{ title }}</div>
          <slot />
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
  align-items: flex-end;
  justify-content: center;
  background: var(--lume-mask);
}
.lume-panel {
  width: 100%;
  background: var(--lume-surface);
  color: var(--lume-text);
  border: 1px solid var(--lume-border);
  border-radius: var(--lume-radius-lg) var(--lume-radius-lg) 0 0;
  padding: var(--lume-pad);
  padding-bottom: calc(var(--lume-pad) + env(safe-area-inset-bottom));
  box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.3);
}
.lume-glass .lume-panel--glass {
  background: color-mix(in srgb, var(--lume-surface) var(--lume-glass-ratio), transparent);
  -webkit-backdrop-filter: blur(var(--lume-glass-blur-strong)) saturate(180%);
  backdrop-filter: blur(var(--lume-glass-blur-strong)) saturate(180%);
}
.lume-panel__title { text-align: center; font-weight: 600; margin-bottom: 10px; }

/* 桌面：auto / center 变居中弹窗 */
@media (min-width: 768px) {
  .lume-overlay { align-items: center; }
  .lume-panel--auto,
  .lume-panel--center {
    border-radius: var(--lume-radius-lg);
  }
}

.lume-sheet-enter-active,
.lume-sheet-leave-active { transition: opacity var(--lume-dur) var(--lume-ease); }
.lume-sheet-enter-active .lume-panel,
.lume-sheet-leave-active .lume-panel { transition: transform var(--lume-dur-slow) var(--lume-ease); }
.lume-sheet-enter-from,
.lume-sheet-leave-to { opacity: 0; }
.lume-sheet-enter-from .lume-panel,
.lume-sheet-leave-to .lume-panel { transform: translateY(18px) scale(0.98); }
</style>
