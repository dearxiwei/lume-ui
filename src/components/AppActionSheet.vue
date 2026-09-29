<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { useLume } from '../plugin'
import { lockScroll, unlockScroll } from '../scroll-lock'
import { haptic } from '../haptics'

interface Action {
  name?: string
  label: string
  danger?: boolean
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    show: boolean
    title?: string
    actions?: Action[]
    cancelText?: string
    closeOnOverlay?: boolean
    glass?: boolean
  }>(),
  { actions: () => [], cancelText: '取消', closeOnOverlay: true, glass: undefined }
)

const emit = defineEmits<{
  (e: 'update:show', v: boolean): void
  (e: 'select', action: Action, index: number): void
}>()

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
function pick(a: Action, i: number) {
  if (a.disabled) return
  haptic(a.danger ? 'warning' : 'tap')
  emit('select', a, i)
  close()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="lume-as">
      <div v-if="show" class="lume-overlay" @click.self="closeOnOverlay && close()">
        <div class="lume-panel" :class="{ 'lume-panel--glass': glass ?? ui.config.glass }" role="dialog">
          <div v-if="title" class="lume-panel__title">{{ title }}</div>
          <button
            v-for="(a, i) in actions"
            :key="i"
            type="button"
            class="lume-action"
            :class="{ 'lume-action--danger': a.danger }"
            :disabled="a.disabled"
            @click="pick(a, i)"
          >
            {{ a.label }}
          </button>
          <div class="lume-action__gap" />
          <button type="button" class="lume-action lume-action--cancel" @click="close">
            {{ cancelText }}
          </button>
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
  overscroll-behavior: contain;
}
.lume-panel {
  width: 100%;
  max-width: var(--lume-panel-max);
  background: var(--lume-surface);
  color: var(--lume-text);
  border: 1px solid var(--lume-border);
  border-radius: var(--lume-radius-lg) var(--lume-radius-lg) 0 0;
  padding: var(--lume-pad);
  padding-bottom: calc(var(--lume-pad) + env(safe-area-inset-bottom));
}
.lume-glass .lume-panel--glass {
  background: color-mix(in srgb, var(--lume-surface) var(--lume-glass-ratio), transparent);
  -webkit-backdrop-filter: blur(var(--lume-glass-blur-strong)) saturate(180%);
  backdrop-filter: blur(var(--lume-glass-blur-strong)) saturate(180%);
}
.lume-panel__title { text-align: center; font-weight: 600; margin-bottom: 10px; }
.lume-action {
  display: block;
  width: 100%;
  padding: 13px;
  border: 0;
  background: var(--lume-surface-2);
  color: var(--lume-text);
  font: inherit;
  font-size: var(--lume-font);
  border-radius: var(--lume-radius-sm);
  cursor: pointer;
  transition: background var(--lume-dur) var(--lume-ease);
}
.lume-action + .lume-action { margin-top: 8px; }
.lume-action:active { background: var(--lume-border); }
.lume-action--danger { color: var(--lume-danger); }
.lume-action--cancel { background: transparent; color: var(--lume-muted); }
.lume-action__gap { height: 8px; }
.lume-action:disabled { opacity: 0.5; }
@media (min-width: 768px) {
  .lume-overlay { align-items: center; }
  .lume-panel { border-radius: var(--lume-radius-lg); }
}
.lume-as-enter-active,
.lume-as-leave-active { transition: opacity var(--lume-dur) var(--lume-ease); }
.lume-as-enter-active .lume-panel,
.lume-as-leave-active .lume-panel { transition: transform var(--lume-dur-slow) var(--lume-ease); }
.lume-as-enter-from,
.lume-as-leave-to { opacity: 0; }
.lume-as-enter-from .lume-panel,
.lume-as-leave-to .lume-panel { transform: translateY(18px); }
</style>
