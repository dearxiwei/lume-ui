<script setup lang="ts">
import { ref } from 'vue'
import { AppBar, AppTabs, AppToastHost, canVibrate } from '../index'
import DemoView from './DemoView.vue'
import SettingsView from './SettingsView.vue'

const tab = ref<string | number>('demo')
</script>

<template>
  <div class="lume-shell lume-root">
    <AppBar :title="tab === 'demo' ? 'lume · 组件演示' : 'lume · 设置'">
      <template #right>
        <span class="lume-muted" style="font-size: var(--lume-font-sm)">
          {{ canVibrate() ? '震动可用' : '' }}
        </span>
      </template>
    </AppBar>
    <AppTabs
      v-model="tab"
      :tabs="[
        { key: 'demo', label: '组件演示' },
        { key: 'settings', label: '设置' }
      ]"
    />
    <DemoView v-if="tab === 'demo'" />
    <SettingsView v-else />
  </div>
  <AppToastHost />
</template>
