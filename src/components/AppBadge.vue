<script setup lang="ts">
withDefaults(defineProps<{ count?: number | string; dot?: boolean; max?: number }>(), { max: 99 })
</script>

<template>
  <span class="lume-badge-wrap">
    <slot />
    <span v-if="dot" class="lume-badge lume-badge--dot" />
    <span v-else-if="count !== undefined && count !== ''" class="lume-badge">
      {{ typeof count === 'number' && count > max ? `${max}+` : count }}
    </span>
  </span>
</template>

<style scoped>
.lume-badge-wrap { position: relative; display: inline-flex; }
.lume-badge {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(45%, -45%);
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--lume-danger);
  color: var(--lume-on-danger);
  font-size: 11px;
  line-height: 16px;
  text-align: center;
  white-space: nowrap;
}
.lume-badge--dot { min-width: 8px; width: 8px; height: 8px; padding: 0; }
</style>
