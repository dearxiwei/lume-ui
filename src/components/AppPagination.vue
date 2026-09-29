<script setup lang="ts">
import { computed } from 'vue'
import { haptic } from '../haptics'

const props = withDefaults(
  defineProps<{ total?: number; pageSize?: number; disabled?: boolean }>(),
  { total: 0, pageSize: 10, disabled: false }
)

const page = defineModel<number>({ default: 1 })
const pages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

function go(p: number) {
  if (props.disabled) return
  const n = Math.min(pages.value, Math.max(1, p))
  if (n === page.value) return
  page.value = n
  haptic('select')
}
</script>

<template>
  <div class="lume-pagination">
    <button class="lume-pagination__btn" :disabled="disabled || page <= 1" aria-label="上一页" @click="go(page - 1)">
      ‹
    </button>
    <button
      v-for="p in pages"
      :key="p"
      class="lume-pagination__btn"
      :class="{ 'is-on': p === page }"
      :disabled="disabled"
      @click="go(p)"
    >
      {{ p }}
    </button>
    <button
      class="lume-pagination__btn"
      :disabled="disabled || page >= pages"
      aria-label="下一页"
      @click="go(page + 1)"
    >
      ›
    </button>
  </div>
</template>

<style scoped>
.lume-pagination { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.lume-pagination__btn {
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid var(--lume-border);
  border-radius: var(--lume-radius-sm);
  background: var(--lume-surface);
  color: var(--lume-text);
  font: inherit;
  font-size: var(--lume-font-sm);
  cursor: pointer;
  transition: background var(--lume-dur) var(--lume-ease), color var(--lume-dur) var(--lume-ease);
}
.lume-pagination__btn.is-on {
  background: var(--lume-primary);
  border-color: var(--lume-primary);
  color: var(--lume-on-primary);
}
.lume-pagination__btn:disabled { opacity: 0.45; cursor: default; }
</style>
