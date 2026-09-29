<script setup lang="ts">
withDefaults(defineProps<{ title?: string; description?: string }>(), { title: '暂无数据' })
</script>

<template>
  <div class="lume-empty">
    <div class="lume-empty__icon" aria-hidden="true">
      <slot name="icon">◍</slot>
    </div>
    <div class="lume-empty__title">{{ title }}</div>
    <div v-if="description" class="lume-empty__desc">{{ description }}</div>
    <div v-if="$slots.default" class="lume-empty__action"><slot /></div>
  </div>
</template>

<style scoped>
.lume-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: calc(var(--lume-pad) * 2) var(--lume-pad);
  color: var(--lume-muted);
  text-align: center;
}
.lume-empty__icon { font-size: 40px; opacity: 0.5; line-height: 1; }
.lume-empty__title { font-size: var(--lume-font); color: var(--lume-text); }
.lume-empty__desc { font-size: var(--lume-font-sm); }
.lume-empty__action { margin-top: 8px; }
</style>
