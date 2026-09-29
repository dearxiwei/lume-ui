<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{ src?: string; name?: string; size?: number; round?: boolean }>(),
  { size: 40, round: true }
)

const initials = computed(() => (props.name || '').trim().slice(0, 2).toUpperCase())
</script>

<template>
  <span
    class="lume-avatar"
    :class="{ 'lume-avatar--round': round }"
    :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.4)}px` }"
  >
    <img v-if="src" :src="src" alt="" />
    <span v-else>{{ initials }}</span>
  </span>
</template>

<style scoped>
.lume-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  overflow: hidden;
  background: var(--lume-surface-2);
  color: var(--lume-muted);
  border: 1px solid var(--lume-border);
  border-radius: var(--lume-radius-sm);
  font-weight: 600;
}
.lume-avatar--round { border-radius: 50%; }
.lume-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
</style>
