<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { haptic } from '../haptics'

interface Option {
  label: string
  value: string | number
}

const props = withDefaults(defineProps<{ options?: Option[]; disabled?: boolean }>(), {
  options: () => [],
  disabled: false
})
const model = defineModel<string | number>({ default: '' })

const itemEls = ref<HTMLElement[]>([])
const thumb = ref({ left: 0, width: 0 })

function setItem(el: unknown, i: number) {
  if (el instanceof HTMLElement) itemEls.value[i] = el
}
function measure() {
  const i = props.options.findIndex((o) => o.value === model.value)
  const el = itemEls.value[i]
  thumb.value = el ? { left: el.offsetLeft, width: el.offsetWidth } : { left: 0, width: 0 }
}
onMounted(async () => {
  await nextTick()
  measure()
  window.addEventListener('resize', measure)
})
onBeforeUnmount(() => window.removeEventListener('resize', measure))
watch(
  [() => model.value, () => props.options],
  async () => {
    await nextTick()
    measure()
  },
  { deep: true }
)

function pick(v: string | number) {
  if (props.disabled) return
  model.value = v
  haptic('select')
}
</script>

<template>
  <div class="lume-seg" role="tablist">
    <span
      class="lume-seg__thumb"
      :style="{ transform: `translateX(${thumb.left}px)`, width: `${thumb.width}px` }"
    />
    <button
      v-for="(o, i) in options"
      :key="o.value"
      :ref="(el) => setItem(el, i)"
      type="button"
      role="tab"
      :aria-selected="model === o.value"
      class="lume-seg__item"
      :class="{ 'lume-seg__item--on': model === o.value }"
      :disabled="disabled"
      @click="pick(o.value)"
    >
      {{ o.label }}
    </button>
  </div>
</template>

<style scoped>
.lume-seg {
  position: relative;
  display: flex;
  padding: 3px;
  background: var(--lume-surface-2);
  border: 1px solid var(--lume-border);
  border-radius: 999px;
  width: 100%;
  box-sizing: border-box;
}
.lume-seg__thumb {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 0;
  border-radius: 999px;
  background: var(--lume-surface);
  box-shadow: var(--lume-shadow);
  transition: transform var(--lume-dur) var(--lume-ease), width var(--lume-dur) var(--lume-ease);
}
.lume-seg__item {
  position: relative;
  z-index: 1;
  flex: 1 1 0;
  min-width: 0;
  padding: 6px 10px;
  border: 0;
  background: none;
  color: var(--lume-muted);
  font: inherit;
  font-size: var(--lume-font-sm);
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color var(--lume-dur) var(--lume-ease);
}
.lume-seg__item--on { color: var(--lume-text); font-weight: 600; }
.lume-seg__item:disabled { opacity: 0.55; }
</style>
