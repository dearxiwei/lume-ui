<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { haptic } from '../haptics'

interface Tab {
  key: string | number
  label: string
}

const props = withDefaults(defineProps<{ tabs?: Tab[]; glass?: boolean }>(), { tabs: () => [] })
const model = defineModel<string | number>({ default: '' })

const activeIndex = computed(() => props.tabs.findIndex((t) => t.key === model.value))

const itemEls = ref<HTMLElement[]>([])
const bar = ref({ left: 0, width: 0 })

function setItem(el: unknown, i: number) {
  if (el instanceof HTMLElement) itemEls.value[i] = el
}
function measure() {
  const el = itemEls.value[activeIndex.value]
  bar.value = el ? { left: el.offsetLeft, width: el.offsetWidth } : { left: 0, width: 0 }
}
onMounted(async () => {
  await nextTick()
  measure()
  window.addEventListener('resize', measure)
})
onBeforeUnmount(() => window.removeEventListener('resize', measure))
watch(
  [activeIndex, () => props.tabs],
  async () => {
    await nextTick()
    measure()
  },
  { deep: true }
)

function pick(key: string | number) {
  model.value = key
  haptic('select')
}
</script>

<template>
  <div class="lume-tabs" role="tablist">
    <button
      v-for="(t, i) in tabs"
      :key="t.key"
      :ref="(el) => setItem(el, i)"
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
      :style="{ transform: `translateX(${bar.left}px)`, width: `${bar.width}px` }"
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
  min-width: 0;
  padding: 10px 12px;
  border: 0;
  background: none;
  color: var(--lume-muted);
  font: inherit;
  font-size: var(--lume-font);
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  transition: transform var(--lume-dur) var(--lume-ease), width var(--lume-dur) var(--lume-ease);
}
</style>
