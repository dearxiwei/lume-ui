<script setup lang="ts">
import { ref } from 'vue'
import {
  AppAvatar,
  AppBadge,
  AppButton,
  AppCard,
  AppCellGroup,
  AppCheckbox,
  AppCollapse,
  AppCollapseItem,
  AppDialog,
  AppDivider,
  AppDrawer,
  AppEmpty,
  AppField,
  AppInput,
  AppListItem,
  AppNoticeBar,
  AppProgress,
  AppRadioGroup,
  AppSearchBar,
  AppSegmented,
  AppSelect,
  AppSheet,
  AppSkeleton,
  AppSlider,
  AppSpinner,
  AppStepper,
  AppSwitch,
  AppTag,
  AppTextarea,
  toast,
  useLume
} from '../index'

const ui = useLume()

/* —— 通用 —— */
const search = ref('')
const nickname = ref('admin')
const email = ref('admin@lume.dev')

/* —— 账户 —— */
const twoFA = ref(true)
const bioLogin = ref(false)
const showProfile = ref(false)
const showDevices = ref(false)
const devicesLoading = ref(false)
const devices = ref<{ name: string; meta: string; current?: boolean }[]>([])
const showPassword = ref(false)
const showLogout = ref(false)
const oldPass = ref('')
const newPass = ref('')

function openDevices() {
  showDevices.value = true
  devices.value = []
  devicesLoading.value = true
  setTimeout(() => {
    devices.value = [
      { name: 'iPhone 15 Pro', meta: '中国移动 · 当前设备', current: true },
      { name: 'MacBook Air', meta: 'Chrome · 2 小时前' },
      { name: 'iPad mini', meta: 'Safari · 3 天前' }
    ]
    devicesLoading.value = false
  }, 700)
}

/* —— 外观 —— */
const themeMode = ref(ui.config.theme)
const motion = ref(ui.config.motion)
const ratioPct = ref(Math.round((ui.config.glassRatio ?? 0.9) * 100))
const presets = ['#5e72e4', '#7e9cc9', '#5f7f6a', '#c9a06a', '#c24b4b', '#9a8aa6']
function setTheme(v: string | number) {
  themeMode.value = v as 'light' | 'dark' | 'auto'
  ui.set({ theme: themeMode.value })
}
function setMotion(v: string | number) {
  motion.value = v as 'none' | 'soft' | 'spring'
  ui.set({ motion: motion.value })
}
function setRatio(v: number) {
  ratioPct.value = v
  ui.set({ glassRatio: v / 100 })
}

/* —— 通知 —— */
const push = ref(true)
const sound = ref(true)
const vibrate = ref(true)
const dnd = ref('off')
const showDnd = ref(false)

/* —— 通用 —— */
const language = ref('zh-CN')
const timezone = ref('Asia/Shanghai')
const timeFormat = ref<string | number>('24')
const pageSize = ref(20)

/* —— 存储 —— */
const clearing = ref(false)
const autoClean = ref(true)
const downloadQuality = ref<string | number>('high')
const cacheSize = ref(65)
function clearCache() {
  clearing.value = true
  setTimeout(() => {
    clearing.value = false
    cacheSize.value = 0
    toast('缓存已清理', { type: 'success' })
  }, 900)
}

/* —— 高级 —— */
const openGroups = ref<(string | number)[]>(['net'])

/* —— 关于 —— */
const checking = ref(false)
const hasUpdate = ref(true)
const showLicense = ref(false)
const showPrivacy = ref(false)
function checkUpdate() {
  checking.value = true
  setTimeout(() => {
    checking.value = false
    hasUpdate.value = false
    toast('已是最新版本', { type: 'success' })
  }, 1000)
}

/* —— 危险 —— */
const showHelp = ref(false)
const showReset = ref(false)
const agree = ref(true)
function resetAll() {
  showReset.value = false
  toast('已重置为默认设置', { type: 'warning' })
}
function logout() {
  showLogout.value = false
  toast('已退出登录', { type: 'info' })
}
</script>

<template>
  <main class="lume-col" style="padding: var(--lume-pad)">
    <AppSearchBar v-model="search" placeholder="搜索设置项" />

    <AppNoticeBar type="info" closable text="部分设置需重新打开应用后生效。" />

    <!-- 账户卡片 -->
    <AppCard>
      <div class="lume-row">
        <AppAvatar name="AD" :size="52" />
        <div class="lume-grow" style="min-width: 0">
          <div class="lume-row" style="gap: 6px">
            <strong>{{ nickname }}</strong>
            <AppTag variant="success">Pro</AppTag>
          </div>
          <div class="lume-muted" style="font-size: var(--lume-font-sm)">{{ email }}</div>
        </div>
        <AppButton size="sm" @click="showProfile = true">编辑</AppButton>
      </div>
    </AppCard>

    <!-- 账户与安全 -->
    <AppCellGroup title="账户与安全">
      <AppField label="昵称" clickable :description="nickname" @click="showProfile = true" />
      <AppField label="邮箱" clickable :description="email" @click="showProfile = true" />
      <AppField label="修改密码" clickable @click="showPassword = true" />
      <AppField label="两步验证" description="登录时校验动态码">
        <AppSwitch v-model="twoFA" />
      </AppField>
      <AppField label="生物识别登录" description="指纹 / 面容">
        <AppSwitch v-model="bioLogin" />
      </AppField>
      <AppField label="登录设备管理" clickable @click="openDevices">
        <AppTag>{{ 3 }} 台</AppTag>
      </AppField>
    </AppCellGroup>

    <AppButton block variant="danger" @click="showLogout = true">退出登录</AppButton>

    <!-- 外观 -->
    <AppCellGroup title="外观">
      <AppField label="主题模式" stack>
        <AppSegmented
          :model-value="themeMode"
          :options="[
            { label: '亮色', value: 'light' },
            { label: '暗色', value: 'dark' },
            { label: '跟随系统', value: 'auto' }
          ]"
          @update:model-value="setTheme"
        />
      </AppField>
      <AppField label="主题色" stack>
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
      </AppField>
      <AppField label="毛玻璃" description="半透明磨砂质感">
        <AppSwitch :model-value="ui.config.glass" @update:model-value="ui.set({ glass: $event })" />
      </AppField>
      <AppField label="玻璃不透明度" stack>
        <AppSlider :min="60" :max="100" v-model="ratioPct" @update:model-value="setRatio" />
      </AppField>
      <AppField label="模糊强度" stack>
        <AppSlider
          :min="8"
          :max="40"
          :model-value="ui.config.blur"
          @update:model-value="ui.set({ blur: $event })"
        />
      </AppField>
      <AppField label="圆角大小" stack>
        <AppSlider
          :min="0"
          :max="28"
          :model-value="ui.config.radius"
          @update:model-value="ui.set({ radius: $event })"
        />
      </AppField>
      <AppField label="动效" stack>
        <AppSegmented
          :model-value="motion"
          :options="[
            { label: '关闭', value: 'none' },
            { label: '柔和', value: 'soft' },
            { label: '弹性', value: 'spring' }
          ]"
          @update:model-value="setMotion"
        />
      </AppField>
    </AppCellGroup>

    <!-- 通知 -->
    <AppCellGroup title="通知">
      <AppField label="推送通知"><AppSwitch v-model="push" /></AppField>
      <AppField label="提示音"><AppSwitch v-model="sound" /></AppField>
      <AppField label="震动（安卓）"><AppSwitch v-model="vibrate" /></AppField>
      <AppField label="免打扰" clickable @click="showDnd = true">
        <AppTag :variant="dnd === 'off' ? 'default' : 'primary'">{{ dnd === 'off' ? '关闭' : dnd }}</AppTag>
      </AppField>
      <AppField label="接收营销邮件"><AppSwitch :model-value="false" /></AppField>
    </AppCellGroup>

    <!-- 通用 -->
    <AppCellGroup title="通用">
      <AppField label="语言">
        <AppSelect
          v-model="language"
          :options="[
            { label: '简体中文', value: 'zh-CN' },
            { label: 'English', value: 'en' },
            { label: '日本語', value: 'ja' }
          ]"
        />
      </AppField>
      <AppField label="时区">
        <AppSelect
          v-model="timezone"
          :options="[
            { label: 'Asia/Shanghai', value: 'Asia/Shanghai' },
            { label: 'UTC', value: 'UTC' },
            { label: 'America/New_York', value: 'America/New_York' }
          ]"
        />
      </AppField>
      <AppField label="时间格式" stack>
        <AppRadioGroup
          v-model="timeFormat"
          :options="[
            { label: '24 小时制', value: '24' },
            { label: '12 小时制', value: '12' }
          ]"
        />
      </AppField>
      <AppField label="每页条数" stack>
        <AppStepper v-model="pageSize" :min="10" :max="100" :step="10" />
      </AppField>
    </AppCellGroup>

    <!-- 存储 -->
    <AppCellGroup title="存储与数据">
      <AppField label="缓存占用">
        <span>{{ cacheSize }} MB</span>
        <AppButton size="sm" :disabled="clearing" @click="clearCache">
          <AppSpinner v-if="clearing" :size="14" />
          <span v-else>清理</span>
        </AppButton>
      </AppField>
      <AppField label="存储使用" stack>
        <AppProgress :value="cacheSize" />
      </AppField>
      <AppField label="自动清理缓存"><AppSwitch v-model="autoClean" /></AppField>
      <AppField label="下载质量" stack>
        <AppSegmented
          v-model="downloadQuality"
          :options="[
            { label: '省流', value: 'low' },
            { label: '标准', value: 'mid' },
            { label: '高清', value: 'high' }
          ]"
        />
      </AppField>
    </AppCellGroup>

    <!-- 高级（折叠） -->
    <div class="lume-group__title" style="margin: 0 4px 6px">高级</div>
    <AppCollapse v-model="openGroups" accordion>
      <AppCollapseItem name="net" title="网络">
        <AppField label="使用代理"><AppSwitch /></AppField>
        <AppField label="连接超时（秒）">
          <AppStepper :model-value="15" :min="5" :max="60" />
        </AppField>
      </AppCollapseItem>
      <AppCollapseItem name="debug" title="调试">
        <AppField label="记录日志"><AppSwitch /></AppField>
        <AppField label="详细日志" description="可能影响性能"><AppSwitch /></AppField>
      </AppCollapseItem>
      <AppCollapseItem name="feedback" title="帮助与反馈">
        <AppEmpty description="没有待处理反馈">
          <AppButton size="sm" @click="showHelp = true">提交反馈</AppButton>
        </AppEmpty>
      </AppCollapseItem>
    </AppCollapse>

    <AppDivider text="关于" />

    <!-- 关于 -->
    <AppCard>
      <AppField label="版本">
        <AppTag>v0.1.0</AppTag>
      </AppField>
      <AppField label="检查更新" clickable @click="checkUpdate">
        <AppSpinner v-if="checking" :size="16" />
        <AppBadge v-else-if="hasUpdate" dot><span class="lume-muted">有新版本</span></AppBadge>
        <span v-else class="lume-muted">已是最新</span>
      </AppField>
      <AppField label="开源许可" clickable @click="showLicense = true" />
      <AppField label="隐私政策" clickable @click="showPrivacy = true" />
    </AppCard>

    <!-- 危险区 -->
    <AppCard title="危险操作">
      <AppCheckbox v-model="agree" label="我已知晓重置将清除全部本地数据" />
      <div style="height: 10px" />
      <AppButton block variant="danger" :disabled="!agree" @click="showReset = true">重置全部设置</AppButton>
    </AppCard>
  </main>

  <!-- 资料编辑 -->
  <AppSheet v-model:show="showProfile" title="编辑资料" position="auto">
    <div class="lume-col">
      <AppInput v-model="nickname" label="昵称" />
      <AppInput v-model="email" label="邮箱" type="email" />
      <div class="lume-row">
        <AppButton block variant="primary" @click="showProfile = false">保存</AppButton>
        <AppButton block @click="showProfile = false">取消</AppButton>
      </div>
    </div>
  </AppSheet>

  <!-- 修改密码 -->
  <AppDialog v-model:show="showPassword" title="修改密码">
    <div class="lume-col">
      <AppInput v-model="oldPass" label="当前密码" type="password" />
      <AppInput v-model="newPass" label="新密码" type="password" />
    </div>
    <template #footer>
      <AppButton @click="showPassword = false">取消</AppButton>
      <AppButton variant="primary" @click="showPassword = false; toast('密码已更新', { type: 'success' })">确认</AppButton>
    </template>
  </AppDialog>

  <!-- 登录设备 -->
  <AppSheet v-model:show="showDevices" title="登录设备" position="auto">
    <div v-if="devicesLoading" class="lume-col">
      <AppSkeleton height="40px" v-for="i in 3" :key="i" />
    </div>
    <div v-else class="lume-list" style="margin: calc(var(--lume-pad) * -1)">
      <AppListItem v-for="d in devices" :key="d.name" :title="d.name" :subtitle="d.meta">
        <template #leading><AppAvatar :name="d.name" :size="34" /></template>
        <template #trailing>
          <AppTag v-if="d.current" variant="success">当前</AppTag>
          <AppButton v-else size="sm" variant="danger" @click="toast('已下线该设备', { type: 'warning' })">下线</AppButton>
        </template>
      </AppListItem>
      <AppEmpty v-if="!devices.length" title="暂无设备" />
    </div>
  </AppSheet>

  <!-- 免打扰 -->
  <AppSheet v-model:show="showDnd" title="免打扰时间" position="auto">
    <div class="lume-col">
      <AppSelect
        v-model="dnd"
        :options="[
          { label: '关闭', value: 'off' },
          { label: '22:00 - 07:00', value: '22-07' },
          { label: '00:00 - 08:00', value: '00-08' }
        ]"
      />
      <AppButton block variant="primary" @click="showDnd = false">确定</AppButton>
    </div>
  </AppSheet>

  <!-- 许可 / 隐私 -->
  <AppSheet v-model:show="showLicense" title="开源许可" position="auto">
    <p class="lume-muted">本项目基于 MIT 许可发布，使用的开源组件版权归各自作者所有。</p>
  </AppSheet>
  <AppSheet v-model:show="showPrivacy" title="隐私政策" position="auto">
    <p class="lume-muted">我们仅在本地存储必要设置，不上传任何个人数据。</p>
  </AppSheet>

  <!-- 帮助抽屉（桌面右侧 / 手机底部） -->
  <AppDrawer v-model:show="showHelp">
    <div class="lume-col">
      <strong>帮助与反馈</strong>
      <AppTextarea :rows="3" placeholder="描述你遇到的问题…" />
      <AppButton block variant="primary" @click="showHelp = false; toast('反馈已提交', { type: 'success' })">提交</AppButton>
    </div>
  </AppDrawer>

  <!-- 退出 / 重置确认 -->
  <AppDialog v-model:show="showLogout" title="退出登录" message="确定要退出当前账号吗？">
    <template #footer>
      <AppButton @click="showLogout = false">取消</AppButton>
      <AppButton variant="danger" @click="logout">退出</AppButton>
    </template>
  </AppDialog>
  <AppDialog v-model:show="showReset" title="重置全部设置" message="此操作不可撤销，将清除所有本地数据。">
    <template #footer>
      <AppButton @click="showReset = false">取消</AppButton>
      <AppButton variant="danger" @click="resetAll">重置</AppButton>
    </template>
  </AppDialog>
</template>

<style scoped>
.swatch {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--lume-border);
  cursor: pointer;
}
</style>
