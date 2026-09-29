<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

withDefaults(defineProps<{ placement?: 'bottom' | 'top' }>(), { placement: 'bottom' })

const open = ref(false)
const root = ref<HTMLElement | null>(null)

function toggle() {
  open.value = !open.value
}
function onDoc(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}
onMounted(() => document.addEventListener('click', onDoc, true))
onBeforeUnmount(() => document.removeEventListener('click', onDoc, true))
</script>

<template>
  <span ref="root" class="lume-popover">
    <span class="lume-popover__trigger" @click="toggle"><slot name="trigger" /></span>
    <Transition name="lume-pop">
      <div
        v-if="open"
        class="lume-popover__panel"
        :class="`lume-popover__panel--${placement}`"
        role="dialog"
      >
        <slot />
      </div>
    </Transition>
  </span>
</template>

<style scoped>
.lume-popover { position: relative; display: inline-flex; }
.lume-popover__trigger { display: inline-flex; }
.lume-popover__panel {
  position: absolute;
  left: 0;
  z-index: 900;
  min-width: 140px;
  padding: 10px 12px;
  background: var(--lume-surface);
  color: var(--lume-text);
  border: 1px solid var(--lume-border);
  border-radius: var(--lume-radius-sm);
  box-shadow: var(--lume-shadow);
  font-size: var(--lume-font-sm);
}
.lume-popover__panel--bottom { top: calc(100% + 6px); }
.lume-popover__panel--top { bottom: calc(100% + 6px); }
.lume-pop--enter-active,
.lume-pop--leave-active { transition: opacity var(--lume-dur) var(--lume-ease), transform var(--lume-dur) var(--lume-ease); }
.lume-pop-enter-from,
.lume-pop-leave-to { opacity: 0; transform: translateY(-4px) scale(0.98); }
</style>
