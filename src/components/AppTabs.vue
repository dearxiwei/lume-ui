<script setup lang="ts">
import { computed } from 'vue'
import { haptic } from '../haptics'

interface Tab {
  key: string | number
  label: string
}

const props = withDefaults(defineProps<{ tabs?: Tab[]; glass?: boolean }>(), { tabs: () => [] })
const model = defineModel<string | number>({ default: '' })

const activeIndex = computed(() => props.tabs.findIndex((t) => t.key === model.value))

function pick(key: string | number) {
  model.value = key
  haptic('select')
}
</script>

<template>
  <div class="lume-tabs" role="tablist">
    <button
      v-for="t in tabs"
      :key="t.key"
      type="button"
      role="tab"
      :aria-selected="model === t.key"
      class="lume-tabs__item"
      :class="{ 'is-on': model === t.key }"
      @click="pick(t.key)"
    >
      {{ t.label }}
    </button>
    <span
      class="lume-tabs__underline"
      :style="{
        width: `calc(100% / ${Math.max(tabs.length, 1)})`,
        transform: `translateX(${Math.max(activeIndex, 0) * 100}%)`
      }"
    />
  </div>
</template>

<style scoped>
.lume-tabs {
  position: relative;
  display: flex;
  border-bottom: 1px solid var(--lume-border);
  overflow-x: auto;
  scrollbar-width: none;
}
.lume-tabs::-webkit-scrollbar { display: none; }
.lume-tabs__item {
  flex: 1 1 0;
  min-width: 72px;
  padding: 10px 12px;
  border: 0;
  background: none;
  color: var(--lume-muted);
  font: inherit;
  font-size: var(--lume-font);
  cursor: pointer;
  white-space: nowrap;
  transition: color var(--lume-dur) var(--lume-ease);
}
.lume-tabs__item.is-on { color: var(--lume-text); font-weight: 600; }
.lume-tabs__underline {
  position: absolute;
  bottom: -1px;
  left: 0;
  height: 2px;
  background: var(--lume-primary);
  border-radius: 2px;
  transition: transform var(--lume-dur) var(--lume-ease);
}
</style>
