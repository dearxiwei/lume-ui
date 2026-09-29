<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = withDefaults(defineProps<{ text?: string; dashed?: boolean }>(), { dashed: false })
const slots = useSlots()
const hasText = computed(() => !!props.text || !!slots.default)
</script>

<template>
  <div
    class="lume-divider"
    :class="{ 'lume-divider--plain': !hasText, 'lume-divider--dashed': dashed }"
    role="separator"
  >
    <span v-if="hasText" class="lume-divider__text"><slot>{{ text }}</slot></span>
  </div>
</template>

<style scoped>
.lume-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px 0;
  color: var(--lume-muted);
  font-size: var(--lume-font-sm);
}
.lume-divider::before,
.lume-divider::after {
  content: '';
  flex: 1 1 auto;
  height: 1px;
  background: var(--lume-border);
}
/* 无文字：整条单线 */
.lume-divider--plain::after { display: none; }
.lume-divider--dashed::before,
.lume-divider--dashed::after {
  background: repeating-linear-gradient(90deg, var(--lume-border) 0 4px, transparent 4px 8px);
}
/* 文字不设背景，随所在容器背景自然融合 */
.lume-divider__text { flex: 0 0 auto; }
</style>
