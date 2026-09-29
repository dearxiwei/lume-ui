<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { useLume } from '../plugin'
import { lockScroll, unlockScroll } from '../scroll-lock'

const props = withDefaults(
  defineProps<{
    show: boolean
    /** auto: 手机底部抽 / 桌面右侧抽 */
    position?: 'auto' | 'left' | 'right' | 'bottom'
    size?: string
    closeOnOverlay?: boolean
    glass?: boolean
  }>(),
  { position: 'auto', size: '80%', closeOnOverlay: true }
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
    <Transition name="lume-drawer">
      <div v-if="show" class="lume-overlay" @click.self="closeOnOverlay && close()">
        <div
          class="lume-drawer"
          :class="[`lume-drawer--${position}`, { 'lume-drawer--glass': glass ?? ui.config.glass }]"
          :style="position === 'bottom' || position === 'auto' ? { maxHeight: size } : { maxWidth: size }"
          role="dialog"
          aria-modal="true"
        >
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
  background: var(--lume-mask);
}
.lume-drawer {
  background: var(--lume-surface);
  color: var(--lume-text);
  overflow: auto;
  padding: var(--lume-pad);
  transition: transform var(--lume-dur) var(--lume-ease);
}
.lume-glass .lume-drawer--glass {
  background: color-mix(in srgb, var(--lume-surface) var(--lume-glass-ratio), transparent);
  -webkit-backdrop-filter: blur(var(--lume-glass-blur-strong)) saturate(180%);
  backdrop-filter: blur(var(--lume-glass-blur-strong)) saturate(180%);
}

/* 默认（手机）：底部抽屉 */
.lume-drawer--auto,
.lume-drawer--bottom {
  margin-top: auto;
  width: 100%;
  border-radius: var(--lume-radius-lg) var(--lume-radius-lg) 0 0;
  padding-bottom: calc(var(--lume-pad) + env(safe-area-inset-bottom));
}
.lume-drawer--left { height: 100%; border-radius: 0 var(--lume-radius-lg) var(--lume-radius-lg) 0; }
.lume-drawer--right { height: 100%; margin-left: auto; border-radius: var(--lume-radius-lg) 0 0 var(--lume-radius-lg); }

/* 桌面（auto 变右侧抽屉） */
@media (min-width: 768px) {
  .lume-drawer--auto {
    margin: 0 0 0 auto;
    width: auto;
    height: 100%;
    border-radius: var(--lume-radius-lg) 0 0 var(--lume-radius-lg);
  }
}

.lume-drawer-enter-active,
.lume-drawer-leave-active { transition: opacity var(--lume-dur) var(--lume-ease); }
.lume-drawer-enter-from,
.lume-drawer-leave-to { opacity: 0; }
.lume-drawer-enter-from .lume-drawer,
.lume-drawer-leave-to .lume-drawer { transform: translateX(100%); }
.lume-drawer-enter-from .lume-drawer--auto,
.lume-drawer-enter-from .lume-drawer--bottom,
.lume-drawer-leave-to .lume-drawer--auto,
.lume-drawer-leave-to .lume-drawer--bottom { transform: translateY(100%); }
</style>
