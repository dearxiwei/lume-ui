<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { haptic } from '../haptics'

const props = withDefaults(defineProps<{ threshold?: number; target?: string }>(), {
  threshold: 300
})

const visible = ref(false)

function getTarget(): HTMLElement | Window {
  return props.target ? (document.querySelector(props.target) as HTMLElement) : window
}
function onScroll() {
  const t = getTarget()
  const y = t === window ? window.scrollY || document.documentElement.scrollTop : (t as HTMLElement).scrollTop
  visible.value = y > props.threshold
}
function toTop() {
  const t = getTarget()
  if (t === window) window.scrollTo({ top: 0, behavior: 'smooth' })
  else (t as HTMLElement).scrollTo({ top: 0, behavior: 'smooth' })
  haptic('tap')
}
onMounted(() => {
  const t = getTarget()
  if (t === window) window.addEventListener('scroll', onScroll, { passive: true })
  else (t as HTMLElement).addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => {
  const t = getTarget()
  if (t === window) window.removeEventListener('scroll', onScroll)
  else (t as HTMLElement).removeEventListener('scroll', onScroll)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="lume-fab">
      <button v-if="visible" class="lume-backtop" aria-label="回到顶部" @click="toTop">↑</button>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lume-backtop {
  position: fixed;
  right: 16px;
  bottom: calc(16px + env(safe-area-inset-bottom));
  z-index: 800;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--lume-border);
  background: var(--lume-surface);
  color: var(--lume-text);
  font-size: 18px;
  cursor: pointer;
  box-shadow: var(--lume-shadow);
  transition: transform var(--lume-dur-fast) var(--lume-ease);
}
.lume-backtop:active { transform: scale(0.94); }
.lume-fab-enter-active,
.lume-fab-leave-active { transition: opacity var(--lume-dur) var(--lume-ease), transform var(--lume-dur) var(--lume-ease); }
.lume-fab-enter-from,
.lume-fab-leave-to { opacity: 0; transform: translateY(8px) scale(0.9); }
</style>
