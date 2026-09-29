<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'
import { dialogs, type DialogRequest } from '../dialog'
import { haptic } from '../haptics'
import { lockScroll, unlockScroll } from '../scroll-lock'

const current = computed<DialogRequest | undefined>(() => dialogs[0])

watch(
  () => dialogs.length,
  (n) => (n > 0 ? lockScroll() : unlockScroll())
)
onBeforeUnmount(() => unlockScroll())

const step = computed(() =>
  current.value?.kind === 'confirm' ? current.value.steps[current.value.index] : undefined
)
const total = computed(() => (current.value?.kind === 'confirm' ? current.value.steps.length : 1))
const stepNo = computed(() => (current.value?.kind === 'confirm' ? current.value.index + 1 : 0))

function ok() {
  const d = current.value
  if (!d) return
  haptic('confirm')
  if (d.kind === 'alert') {
    d.resolve()
    dialogs.shift()
    return
  }
  if (d.index < d.steps.length - 1) {
    d.index++
    return
  }
  d.resolve(true)
  dialogs.shift()
}

function cancel() {
  const d = current.value
  if (!d || d.kind !== 'confirm') return
  haptic('tap')
  d.resolve(false)
  dialogs.shift()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="lume-dialog">
      <div v-if="current" class="lume-overlay" @click.self="current.kind === 'confirm' && cancel()">
        <div class="lume-panel" role="alertdialog" aria-modal="true">
          <div class="lume-panel__title">
            {{ current.kind === 'confirm' ? step?.title : current.title }}
          </div>
          <div class="lume-panel__msg">
            {{ current.kind === 'confirm' ? step?.message : current.message }}
          </div>
          <div v-if="current.kind === 'confirm' && total > 1" class="lume-panel__step">
            第 {{ stepNo }} / {{ total }} 次确认
          </div>
          <div class="lume-panel__footer">
            <button v-if="current.kind === 'confirm'" class="lume-dlg__btn" type="button" @click="cancel">
              {{ step?.cancelText || '取消' }}
            </button>
            <button
              class="lume-dlg__btn"
              :class="step?.danger ? 'lume-dlg__btn--danger' : 'lume-dlg__btn--primary'"
              type="button"
              @click="ok"
            >
              {{ current.kind === 'confirm' ? step?.okText || (stepNo < total ? '继续' : '确认') : current.okText || '知道了' }}
            </button>
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
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--lume-mask);
}
.lume-panel {
  width: 100%;
  max-width: 340px;
  background: var(--lume-surface);
  color: var(--lume-text);
  border: 1px solid var(--lume-border);
  border-radius: var(--lume-radius-lg);
  padding: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
}
.lume-glass .lume-panel {
  background: color-mix(in srgb, var(--lume-surface) var(--lume-glass-ratio), transparent);
  -webkit-backdrop-filter: blur(var(--lume-glass-blur-strong)) saturate(180%);
  backdrop-filter: blur(var(--lume-glass-blur-strong)) saturate(180%);
}
.lume-panel__title { text-align: center; font-weight: 600; margin-bottom: 8px; }
.lume-panel__msg {
  text-align: center;
  font-size: var(--lume-font-sm);
  color: var(--lume-muted);
  margin-bottom: 8px;
  white-space: pre-line;
  overflow-wrap: anywhere;
  max-height: 55vh;
  overflow: auto;
}
.lume-panel__step { text-align: center; font-size: var(--lume-font-sm); color: var(--lume-muted); margin-bottom: 4px; }
.lume-panel__footer { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }

.lume-dlg__btn {
  border: 1px solid var(--lume-border);
  border-radius: var(--lume-radius);
  background: var(--lume-surface-2);
  color: var(--lume-text);
  font: inherit;
  font-size: var(--lume-font);
  line-height: 1;
  padding: 10px 16px;
  cursor: pointer;
  transition: transform var(--lume-dur-fast) var(--lume-ease);
}
.lume-dlg__btn:active { transform: scale(0.97); }
.lume-dlg__btn--primary { background: var(--lume-primary); border-color: var(--lume-primary); color: var(--lume-on-primary); }
.lume-dlg__btn--danger { background: var(--lume-danger); border-color: var(--lume-danger); color: var(--lume-on-danger); }

.lume-dialog-enter-active,
.lume-dialog-leave-active { transition: opacity var(--lume-dur) var(--lume-ease); }
.lume-dialog-enter-active .lume-panel,
.lume-dialog-leave-active .lume-panel { transition: transform var(--lume-dur) var(--lume-ease); }
.lume-dialog-enter-from,
.lume-dialog-leave-to { opacity: 0; }
.lume-dialog-enter-from .lume-panel,
.lume-dialog-leave-to .lume-panel { transform: scale(0.94); }
</style>
