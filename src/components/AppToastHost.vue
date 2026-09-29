<script setup lang="ts">
import { toasts } from '../toast'
</script>

<template>
  <Teleport to="body">
    <div class="lume-toasts" aria-live="polite">
      <TransitionGroup name="lume-toast">
        <div v-for="t in toasts" :key="t.id" class="lume-toast" :class="`lume-toast--${t.type}`">
          {{ t.text }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.lume-toasts {
  position: fixed;
  left: 50%;
  bottom: calc(24px + env(safe-area-inset-bottom));
  transform: translateX(-50%);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  pointer-events: none;
}
.lume-toast {
  max-width: 80vw;
  padding: 10px 16px;
  border-radius: 999px;
  background: var(--lume-toast-bg);
  color: var(--lume-toast-fg);
  font-size: var(--lume-font-sm);
  white-space: pre-line;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
}
.lume-toast--success { background: var(--lume-toast-success-bg); }
.lume-toast--warning { background: var(--lume-toast-warning-bg); }
.lume-toast--error { background: var(--lume-toast-error-bg); }

.lume-toast-enter-active,
.lume-toast-leave-active { transition: opacity var(--lume-dur) var(--lume-ease), transform var(--lume-dur) var(--lume-ease); }
.lume-toast-enter-from,
.lume-toast-leave-to { opacity: 0; transform: translateY(10px); }
</style>
