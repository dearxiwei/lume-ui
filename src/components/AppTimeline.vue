<script setup lang="ts">
interface Item {
  title: string
  content?: string
  time?: string
  type?: 'info' | 'success' | 'warning' | 'danger'
}

withDefaults(defineProps<{ items?: Item[] }>(), { items: () => [] })
</script>

<template>
  <ul class="lume-timeline">
    <li v-for="(it, i) in items" :key="i" class="lume-tl-item" :class="`lume-tl-item--${it.type || 'info'}`">
      <span class="lume-tl-item__dot" aria-hidden="true" />
      <div class="lume-tl-item__body">
        <div class="lume-tl-item__head">
          <span class="lume-tl-item__title">{{ it.title }}</span>
          <span v-if="it.time" class="lume-tl-item__time">{{ it.time }}</span>
        </div>
        <div v-if="it.content" class="lume-tl-item__content">{{ it.content }}</div>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.lume-timeline { list-style: none; margin: 0; padding: 0; }
.lume-tl-item { position: relative; padding: 0 0 16px 20px; border-left: 1px solid var(--lume-border); }
.lume-tl-item:last-child { border-left-color: transparent; padding-bottom: 0; }
.lume-tl-item__dot {
  position: absolute;
  left: -5px;
  top: 2px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--lume-primary);
}
.lume-tl-item--success .lume-tl-item__dot { background: var(--lume-success); }
.lume-tl-item--warning .lume-tl-item__dot { background: var(--lume-warning); }
.lume-tl-item--danger .lume-tl-item__dot { background: var(--lume-danger); }
.lume-tl-item__head { display: flex; align-items: baseline; gap: 8px; }
.lume-tl-item__title { font-size: var(--lume-font); color: var(--lume-text); }
.lume-tl-item__time { font-size: var(--lume-font-sm); color: var(--lume-muted); }
.lume-tl-item__content { font-size: var(--lume-font-sm); color: var(--lume-muted); margin-top: 2px; }
</style>
