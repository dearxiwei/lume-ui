<script setup lang="ts">
import { provide } from 'vue'
import { COLLAPSE_KEY } from './collapse'

const props = withDefaults(defineProps<{ accordion?: boolean }>(), { accordion: false })
const open = defineModel<Array<string | number>>({ default: () => [] })

function isOpen(key: string | number) {
  return open.value.includes(key)
}
function toggle(key: string | number) {
  if (isOpen(key)) open.value = open.value.filter((k) => k !== key)
  else open.value = props.accordion ? [key] : [...open.value, key]
}
provide(COLLAPSE_KEY, { toggle, isOpen })
</script>

<template>
  <div class="lume-collapse"><slot /></div>
</template>

<style scoped>
.lume-collapse {
  background: var(--lume-surface);
  border: 1px solid var(--lume-border);
  border-radius: var(--lume-radius);
  overflow: hidden;
}
</style>
