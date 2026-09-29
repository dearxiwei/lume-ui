<script setup lang="ts">
import { ref } from 'vue'
import {
  AppActionSheet,
  AppAvatar,
  AppBackTop,
  AppBadge,
  AppButton,
  AppCard,
  AppCheckbox,
  AppDialog,
  AppDivider,
  AppInput,
  AppListItem,
  AppPagination,
  AppPopover,
  AppProgress,
  AppRadioGroup,
  AppRate,
  AppResult,
  AppSegmented,
  AppSheet,
  AppSpinner,
  AppSteps,
  AppSwitch,
  AppTabs,
  AppTag,
  AppTimeline,
  AppTooltip,
  canVibrate,
  haptic,
  toast,
  useLume
} from '../index'

const ui = useLume()
const name = ref('')
const on = ref(true)
const remember = ref(true)
const plan = ref<string | number>('pro')
const view = ref<string | number>('a')
const tab = ref<string | number>('x')
const showSheet = ref(false)
const showDialog = ref(false)
const rate = ref(4)
const page = ref(2)
const showActions = ref(false)
const presets = ['#5e72e4', '#7e9cc9', '#5f7f6a', '#c9a06a', '#c24b4b', '#9a8aa6']
function onAction(a: { label: string }) {
  toast('选择了：' + a.label, { type: 'info' })
}
</script>

<template>
  <main class="lume-col" style="padding: var(--lume-pad)">
    <AppCard title="主题 / 明暗管理" subtitle="统一主题色 + 明暗，自动计算前景色防看不清">
      <div class="lume-col">
        <AppSegmented
          :model-value="ui.config.theme"
          :options="[
            { label: '亮色', value: 'light' },
            { label: '暗色', value: 'dark' },
            { label: '跟随系统', value: 'auto' }
          ]"
          @update:model-value="ui.set({ theme: $event as 'light' | 'dark' | 'auto' })"
        />
        <div class="lume-row lume-between">
          <span>主题色</span>
          <div class="lume-row lume-wrap">
            <button
              v-for="c in presets"
              :key="c"
              class="swatch"
              :style="{ background: c }"
              :aria-label="c"
              @click="ui.set({ primary: c })"
            />
          </div>
        </div>
        <div class="lume-row lume-wrap">
          <AppButton variant="primary">主色按钮</AppButton>
          <AppButton variant="danger">危险按钮</AppButton>
          <AppTag variant="primary">主色标签</AppTag>
          <AppTag variant="warning">警告标签</AppTag>
          <AppTag variant="success">成功标签</AppTag>
        </div>
      </div>
    </AppCard>

    <AppCard title="质感与偏好" subtitle="全局默认 / 运行时覆盖">
      <div class="lume-col">
        <div class="lume-row lume-between">
          <span>毛玻璃</span>
          <AppSwitch :model-value="ui.config.glass" @update:model-value="ui.set({ glass: $event })" />
        </div>
        <div class="lume-row lume-between">
          <span>曲线动效</span>
          <AppSwitch
            :model-value="ui.config.motion !== 'none'"
            @update:model-value="ui.set({ motion: $event ? 'spring' : 'none' })"
          />
        </div>
        <div class="lume-row lume-between">
          <span>震动（安卓）</span>
          <span class="lume-muted" style="font-size: var(--lume-font-sm)">
            {{ canVibrate() ? '可用' : '当前不可用' }}
          </span>
        </div>
      </div>
    </AppCard>

    <AppCard title="分段 / 标签页">
      <div class="lume-col">
        <AppSegmented
          v-model="view"
          :options="[
            { label: '全部', value: 'a' },
            { label: '进行中', value: 'b' },
            { label: '已完成', value: 'c' }
          ]"
        />
        <AppTabs
          v-model="tab"
          :tabs="[
            { key: 'x', label: '概览' },
            { key: 'y', label: '配置' },
            { key: 'z', label: '日志' }
          ]"
        />
      </div>
    </AppCard>

    <div class="lume-split">
      <AppCard title="表单">
        <div class="lume-col">
          <AppInput v-model="name" label="名称" placeholder="输入点东西" />
          <AppCheckbox v-model="remember" label="记住我" />
          <AppRadioGroup
            v-model="plan"
            :options="[
              { label: '基础版', value: 'free' },
              { label: '专业版', value: 'pro' }
            ]"
          />
          <AppProgress :value="65" />
          <div class="lume-row">
            <AppButton variant="primary" @click="showDialog = true">主按钮</AppButton>
            <AppButton variant="danger">危险</AppButton>
            <AppButton variant="ghost" @click="toast('幽灵按钮', { type: 'info' })">幽灵</AppButton>
          </div>
        </div>
      </AppCard>

      <AppCard title="列表 / 展示">
        <div class="lume-list" style="margin: calc(var(--lume-pad) * -1)">
          <AppListItem title="项目 A" subtitle="副标题" clickable @click="showSheet = true">
            <template #leading><AppAvatar name="LA" :size="32" /></template>
            <template #trailing><AppSwitch v-model="on" /></template>
          </AppListItem>
          <AppListItem title="项目 B" clickable>
            <template #trailing><AppBadge count="5"><AppAvatar name="B" :size="28" /></AppBadge></template>
          </AppListItem>
          <AppListItem title="项目 C" clickable>
            <template #trailing>
              <AppTag variant="success">正常</AppTag>
              <AppSpinner :size="16" />
            </template>
          </AppListItem>
        </div>
      </AppCard>
    </div>

    <AppButton block variant="primary" @click="showSheet = true">打开底部弹层（桌面自动居中）</AppButton>

    <AppCard title="更多组件">
      <div class="lume-col">
        <AppSteps
          :active="1"
          :steps="[
            { title: '已下单', description: '10:00' },
            { title: '已支付', description: '10:02' },
            { title: '已发货' }
          ]"
        />
        <AppDivider />
        <div class="lume-row lume-between">
          <span>评分</span>
          <AppRate v-model="rate" />
        </div>
        <div class="lume-row lume-between">
          <span>气泡 / 提示</span>
          <div class="lume-row">
            <AppPopover>
              <template #trigger><AppButton size="sm">Popover</AppButton></template>
              这是气泡内容
            </AppPopover>
            <AppTooltip text="这是一个提示">
              <AppButton size="sm" variant="ghost">Tooltip</AppButton>
            </AppTooltip>
          </div>
        </div>
        <AppDivider />
        <AppTimeline
          :items="[
            { title: '创建任务', time: '09:00', type: 'success' },
            { title: '执行中', content: '处理第 2/5 步', time: '09:03', type: 'info' },
            { title: '等待资源', time: '09:05', type: 'warning' }
          ]"
        />
        <AppDivider />
        <AppPagination v-model="page" :total="120" :page-size="10" />
        <AppDivider />
        <AppResult status="success" title="操作成功" description="数据已保存" />
        <AppButton block @click="showActions = true">打开动作面板</AppButton>
      </div>
    </AppCard>

    <AppBackTop />
  </main>

  <AppSheet v-model:show="showSheet" title="操作面板" position="auto">
    <div class="lume-col">
      <AppInput v-model="name" placeholder="重命名…" />
      <div class="lume-row">
        <AppButton block variant="primary" @click="showSheet = false">确定</AppButton>
        <AppButton block @click="showSheet = false">取消</AppButton>
      </div>
    </div>
  </AppSheet>

  <AppDialog v-model:show="showDialog" title="确认操作" message="这是一个对话框示例。">
    <template #footer>
      <AppButton variant="danger" @click="showDialog = false">删除</AppButton>
      <AppButton variant="primary" @click="showDialog = false">确认</AppButton>
    </template>
  </AppDialog>

  <AppActionSheet
    v-model:show="showActions"
    title="请选择操作"
    :actions="[
      { label: '分享' },
      { label: '复制链接' },
      { label: '删除', danger: true }
    ]"
    @select="onAction"
  />
</template>

<style scoped>
.swatch {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid var(--lume-border);
  cursor: pointer;
}
</style>
