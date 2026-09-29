# @lume/ui

从 `jellyfin_lume_manager` 的 UI 质感层**单独移植**出来的组件库：

- **纯 Vue 3**，**不依赖 Vant 等第三方 UI 库**（低耦合、高内聚；每个组件自包含）
- **flex 自适应宽**：不做全局 `px→vw` 等比缩放；用 `flex/grid` + `clamp()` 流式尺寸 + 断点，手机/电脑通吃
- **默认参数 + 可自定义**：所有能力都有默认值，可用 `createLume()` 全局覆盖，或组件 prop 单点覆盖
- **毛玻璃可选**：`glass / blur` 运行时开关，带 `@supports` 降级
- **默认动画曲线**：`--lume-ease: cubic-bezier(.22,1,.36,1)`，`motion: none|soft|spring`
- **震动（仅安卓）**：`navigator.vibrate`，语义预设（tap/confirm/success…），非安卓自动忽略

## 安装 / 引入

作为库（构建产物在 `dist/`）：

```ts
import { createApp } from 'vue'
import Lume, { createLume } from '@lume/ui'
import '@lume/ui/style.css'

createApp(App).use(createLume({ theme: 'auto', glass: true, motion: 'spring', haptics: 'auto' }))
```

> 也可以直接把 `src/` 拷进你的项目（零构建依赖，仅需 Vue）。

## 快速开始

```vue
<script setup lang="ts">
import { AppButton, AppInput, AppSwitch, AppCard, AppBar, AppListItem, AppSheet, AppDialog, useLume } from '@lume/ui'
const ui = useLume()          // { config, set }
</script>

<template>
  <AppBar title="标题" />
  <div class="lume-split">        <!-- 窄屏堆叠 / 宽屏并排 -->
    <AppCard title="表单">
      <AppInput v-model="name" label="名称" />
      <AppButton variant="primary" @click="open = true">确定</AppButton>
    </AppCard>
  </div>
  <AppSheet v-model:show="open" title="面板" position="auto">…</AppSheet>
</template>
```

## 全局配置（默认值）

| 选项 | 默认 | 说明 |
|---|---|---|
| `theme` | `'auto'` | `light` / `dark` / `auto`（跟随系统） |
| `glass` | `true` | 毛玻璃总开关 |
| `blur` | `20` | 毛玻璃强度(px) |
| `motion` | `'spring'` | `none` / `soft` / `spring`（默认曲线） |
| `haptics` | `'auto'` | `auto`(仅安卓) / `off` / `on` |
| `radius` | `14` | 基础圆角(px) |

运行时改：`ui.set({ glass: false, motion: 'none' })`。

## 组件

| 分类 | 组件 |
|---|---|
| 基础 | `AppButton`、`AppInput`、`AppSwitch`、`AppCheckbox`、`AppRadioGroup` |
| 选择/导航 | `AppSegmented`、`AppSelect`、`AppTabs` |
| 容器/浮层 | `AppCard`、`AppBar`、`AppListItem`、`AppSheet`、`AppDialog`、`AppDrawer` |
| 状态/展示 | `AppSpinner`、`AppSkeleton`、`AppProgress`、`AppAvatar`、`AppBadge`、`AppTag`、`AppEmpty`、`AppToastHost`(+`toast()`) |

关键 props（均有默认值）：

| 组件 | props |
|---|---|
| `AppButton` | `variant(primary/default/danger/ghost)`、`size(sm/md/lg)`、`block`、`haptic(auto/none/语义)`、`glass` |
| `AppInput` / `AppSelect` | `v-model`、`label`、`type`/`options`、`placeholder`、`disabled` |
| `AppSwitch` / `AppCheckbox` | `v-model:boolean`、`label`、`disabled`（自带震动） |
| `AppRadioGroup` | `v-model`、`options[{label,value}]`、`disabled` |
| `AppSegmented` | `v-model`、`options`（滑块动画） |
| `AppTabs` | `v-model`、`tabs[{key,label}]`（下划线动画） |
| `AppCard` | `title`、`subtitle`、`glass`、`pad` |
| `AppBar` | `title`、`glass`、`sticky`；插槽 `left/title/right` |
| `AppListItem` | `title`、`subtitle`、`clickable`、`haptic`；插槽 `leading/trailing` |
| `AppSheet` | `v-model:show`、`title`、`position(auto/bottom/center)`、`closeOnOverlay`、`glass`、`maxWidth` |
| `AppDialog` | `v-model:show`、`title`、`message`、`width`、`glass`；插槽 `footer` |
| `AppDrawer` | `v-model:show`、`position(auto/left/right/bottom)`、`size`、`glass` |
| `AppProgress` | `value`、`max`、`indeterminate` |
| `AppAvatar` | `src`、`name`（首字母回退）、`size`、`round` |
| `AppBadge` | `count`、`dot`、`max`（包裹插槽） |
| `AppTag` | `variant(default/primary/success/warning/danger)` |
| `AppEmpty` | `title`、`description`、`icon` 插槽 |

轻提示（命令式）：

```ts
import { toast } from '@lume/ui'
toast('已保存', { type: 'success', duration: 2000 })
```
配合在根挂一次 `<AppToastHost />`。

指令：`v-ripple`（水波）、`v-tap`（阈值点按）。工具：`haptic(name)`、`canVibrate()`、`isAndroid()`。

## 主题 / Token

- 颜色/表面：`--lume-bg/-surface/-surface-2/-border/-text/-muted/-primary...`（`html.dark` 切换）
- 尺寸：`--lume-font/-gap/-pad` 用 `clamp()` 流式
- 质感：`--lume-blur`、`--lume-radius`、`--lume-ease`、`--lume-dur*`

布局工具类：`.lume-shell`（限宽应用壳）、`.lume-split`（宽屏并排/窄屏堆叠）、`.lume-grid`（自适应卡片）、`.lume-row/.lume-col`。

> **自适应说明**：本库刻意**不**做 `postcss-px-to-viewport` 全局 vw 缩放（那是手机稿等比方案，桌面会失真）；改用 flex/grid + 流式 token + 断点。Vant 版原项目的桌面弱点即在此被规避。

## 开发与构建

```sh
npm install          # 若在受限文件系统上，加 --maxsockets 1
npm run dev          # 演示 playground（index.html + src/dev）
npm run build        # 产出 dist/lume.js + lume.umd.cjs + lume.css
npx vue-tsc --noEmit # 类型检查
```

> 在 Android FUSE 上，`node_modules`/npm 缓存建议放在真实文件系统（如 `/tmp`）并 `--maxsockets 1`。

## 与主项目集成

构建产物是**纯静态 JS+CSS**，可被任意宿主使用，包括 Go `embed` 的服务（`secure-gateway/web/`）：
把 `dist/` 作为静态资源挂载或内嵌即可，无需 Node 运行时。
