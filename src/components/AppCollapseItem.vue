<script setup lang="ts">
import { computed, inject } from 'vue'
import { COLLAPSE_KEY } from './collapse'
import { haptic } from '../haptics'

const props = withDefaults(defineProps<{ name: string | number; title?: string }>(), {})
const ctx = inject(COLLAPSE_KEY, null)
const open = computed(() => (ctx ? ctx.isOpen(props.name) : false))

function toggle() {
  ctx?.toggle(props.name)
  haptic('select')
}
</script>

<template>
  <div class="lume-collapse-item" :class="{ 'is-open': open }">
    <button type="button" class="lume-collapse-item__head" :aria-expanded="open" @click="toggle">
      <span class="lume-collapse-item__title"><slot name="title">{{ title }}</slot></span>
      <span class="lume-collapse-item__arrow" aria-hidden="true">›</span>
    </button>
    <div class="lume-collapse-item__body">
      <div class="lume-collapse-item__inner"><slot /></div>
    </div>
  </div>
</template>

<style scoped>
.lume-collapse-item { border-bottom: 1px solid var(--lume-border); }
.lume-collapse-item:last-child { border-bottom: 0; }
.lume-collapse-item__head {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px var(--lume-pad);
  border: 0;
  background: none;
  color: var(--lume-text);
  font: inherit;
  font-size: var(--lume-font);
  cursor: pointer;
  text-align: left;
  transition: background var(--lume-dur) var(--lume-ease);
}
.lume-collapse-item__head:active { background: var(--lume-surface-2); }
.lume-collapse-item__title { flex: 1 1 auto; min-width: 0; font-weight: 500; }
.lume-collapse-item__arrow {
  flex: 0 0 auto;
  color: var(--lume-muted);
  font-size: 18px;
  transition: transform var(--lume-dur) var(--lume-ease);
}
.lume-collapse-item.is-open .lume-collapse-item__arrow { transform: rotate(90deg); }
.lume-collapse-item__body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--lume-dur) var(--lume-ease);
}
.lume-collapse-item.is-open .lume-collapse-item__body { grid-template-rows: 1fr; }
.lume-collapse-item__inner { overflow: hidden; padding: 0 var(--lume-pad); }
.lume-collapse-item.is-open .lume-collapse-item__inner { padding-bottom: var(--lume-pad); }
</style>
