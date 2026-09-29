<script setup lang="ts">
import { ref } from 'vue'

withDefaults(defineProps<{ text?: string; placement?: 'top' | 'bottom' }>(), { placement: 'top' })

const show = ref(false)
</script>

<template>
  <span
    class="lume-tip"
    @mouseenter="show = true"
    @mouseleave="show = false"
    @focusin="show = true"
    @focusout="show = false"
    @click="show = !show"
  >
    <slot />
    <Transition name="lume-tip">
      <span
        v-if="show && (text || $slots.content)"
        class="lume-tip__bubble"
        :class="`lume-tip__bubble--${placement}`"
        role="tooltip"
      >
        <slot name="content">{{ text }}</slot>
      </span>
    </Transition>
  </span>
</template>

<style scoped>
.lume-tip { position: relative; display: inline-flex; }
.lume-tip__bubble {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 900;
  max-width: 220px;
  padding: 6px 10px;
  background: var(--lume-toast-bg);
  color: var(--lume-toast-fg);
  border-radius: var(--lume-radius-sm);
  font-size: var(--lume-font-sm);
  white-space: nowrap;
  pointer-events: none;
}
.lume-tip__bubble--top { bottom: calc(100% + 6px); }
.lume-tip__bubble--bottom { top: calc(100% + 6px); }
.lume-tip-enter-active,
.lume-tip-leave-active { transition: opacity var(--lume-dur) var(--lume-ease); }
.lume-tip-enter-from,
.lume-tip-leave-to { opacity: 0; }
</style>
