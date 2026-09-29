# lume · 问题与修复记录（ISSUES）

> 约定：用户口头提出的问题**先登记在此**，标明解决办法；**未经“一起改”指示不修改代码**。
> 状态：`待修复` / `已修复` / `不修`

## 本次已修复（2026-09-29）

### #1 所有组件点击不要出现蓝色遮罩
- **现象**：点击/长按按钮、列表项等，安卓浏览器出现默认的蓝色点击高亮遮罩。
- **根因**：这是移动端浏览器的 `-webkit-tap-highlight-color` 默认值；目前只有 `.lume-btn`、`.lume-ripple-root` 单独设置了 `transparent`，其余组件未覆盖。
- **解决办法（全局统一，非逐组件）**：
  在 `src/styles/tokens.css` 的 `.lume` 作用域加：
  ```css
  .lume,
  .lume * {
    -webkit-tap-highlight-color: transparent;
  }
  ```
  （保留 `:focus-visible` 的可访问性描边，仅去掉"点击高亮遮罩"，不影响键盘导航。）
- **影响面**：全局，一次修好所有组件；无需改各 SFC。
- **状态**：已修复

### #2 除输入框外，组件内部文本禁止长按选中
- **现象**：长按列表项/按钮/标签等文本会被选中（出现选择手柄），不像原生 App。
- **期望**：仅**输入类组件**内可选中文本；其余一律不可选。
- **解决办法（全局统一）**：
  在 `src/styles/tokens.css` 的 `.lume` 作用域加：
  ```css
  .lume,
  .lume * {
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
  }
  /* 放行输入类 */
  .lume input,
  .lume textarea,
  .lume [contenteditable="true"],
  .lume [contenteditable=""],
  .lume .lume-select {
    -webkit-user-select: text;
    user-select: text;
    -webkit-touch-callout: default;
  }
  ```
  （`AppInput` 已单独设 `user-select:text`，此全局规则一并兜住 `AppSelect`/未来的输入组件。）
- **影响面**：全局；`AppInput`、`AppSelect` 等输入类保持可选，其余自动禁选。
- **状态**：已修复

### #3 彩色底上的文字要“按背景自动算前景色”，明暗切换自动变，除非用户指定
- **现象**：某些组件背景较深/较浅时文字仍是黑（或白）导致看不清，例如**主按钮文本**。
- **期望**：任意"有色背景"的组件，前景色**由背景色自动推导**（黑/白取对比更高者）；**主题色或明暗变化时自动重算**；用户可显式指定覆盖。
- **根因（现状不足）**：现有 `--lume-on-*` 只覆盖 `primary/danger/success/warning` 四个 token，且**只有通过 `createLume({primary})` 传入时才重算**；若用户直接改 CSS 变量 `--lume-primary`、或在明暗里改色，前景色不会同步 → 可能出现"黑字/白字看不见"。
- **解决办法（增强主题管理器，JS 运行时推导 + CSS 变量兜底）**：
  1. `apply()` 时对每个强调色，解析**有效值**（优先 `options.<name>`，否则读根元素计算值 `getComputedStyle(root).getPropertyValue('--lume-<name>')`），再用 `readableOn(hex)` 写入 `--lume-on-<name>`。→ 无论通过 JS 还是 CSS 改色，前景色都跟着变。
  2. **明暗切换**：`apply()` 在 `theme` 变化时重跑（已具备）；`auto` 跟随系统已监听，改为重算前景色。
  3. **用户显式指定优先**：新增 `onPrimary/onDanger/onSuccess/onWarning`（以及组件级 `textColor` prop）——一旦指定则不再自动推导。
  4. **组件侧约定**：有色底一律 `color: var(--lume-on-<语义>)`；表面底一律 `color: var(--lume-text)`；禁止硬编码黑/白。
  5. 备注：CSS 原生 `color-contrast()` 尚未普及，故采用"JS 推导 + CSS 变量"；纯 CSS 无法做亮度对比计算。
- **影响面**：`plugin.ts`（扩展）+ 个别组件补 `textColor` 覆盖；一次性生效于所有用 token 的组件。
- **状态**：已修复

### #4 弹层打开后，背后内容仍能滚动
- **现象**：`AppDialog / AppSheet / AppDrawer` 打开时，手指滑动会滚动弹窗**背后的页面**（滚动穿透）。
- **解决办法**：
  1. 新增 `src/scroll-lock.ts`：**引用计数**的滚动锁。锁定 → 给 `html`/`body` 加 `.lume-scroll-lock`；解锁（计数归零）→ 移除。
  2. `tokens.css/lume.css` 增加：
     ```css
     .lume-scroll-lock { overflow: hidden; overscroll-behavior: none; }
     .lume-overlay { overscroll-behavior: contain; touch-action: none; }
     ```
     （iOS 兼容：锁定可用 `position:fixed; width:100%; top:-<scrollY>` 并记录/恢复滚动位置。）
  3. `AppDialog/AppSheet/AppDrawer` 内 `watch(() => props.show, v => v ? lockScroll() : unlockScroll())`，并在 `onBeforeUnmount` 兜底 `unlockScroll()`（多弹层叠加也正确）。
- **状态**：已修复

### #5 对话框毛玻璃太透，可读性差
- **现象**：`AppDialog`（及 Sheet 面板）毛玻璃透明度过高，文字发闷/看不清。
- **解决办法**：把"玻璃不透明度"做成 token 并调高默认值：
  ```css
  :root { --lume-glass-ratio: 90%; --lume-glass-blur-strong: 28px; }
  ```
  各玻璃面板改用 `color-mix(in srgb, var(--lume-surface) var(--lume-glass-ratio), transparent)` 与更强 `blur`；
  对话框/面板默认 **≥90% 不透明**（偏"磨砂实底"），仍保留 `glass` 开关。
  可选：`createLume({ glassRatio: 0.9, blurStrong: 28 })` 暴露给用户调。
- **状态**：已修复

### #6 每个组件都要随全局 light/dark 一起切换；组件默认含明暗两套，默认跟随全局变量，保证一致性
- **要求**：组件默认跟随全局主题（`light`/`dark`）一起切换；每个组件天然具备两套配色；默认继承全局变量，可局部覆盖但要保持一致性。
- **现状**：已在 `tokens.css` 用 `:root`(light) + `html.dark`(dark) 定义全部 token，组件只引用 `--lume-*` → 理论上已随全局切换；但存在个别硬编码（如 Toast 固定深底）与"局部无法独立换肤"两点不足。
- **解决办法（统一主题一致性）**：
  1. **强约束**：组件**禁止任何硬编码颜色**，只允许 `--lume-*`；剩余硬编码（Toast 默认底色）改为 token（`--lume-toast-bg/--lume-toast-fg`，并在 dark 下给更亮底色）。
  2. **两套主题集中定义**：light 在 `:root`，dark 在 `html.dark`；组件零改动即随全局切换（一致性由 token 层保证）。
  3. **支持局部/组件级换肤**：新增作用域选择器
     ```css
     .lume[data-theme="light"] { /* light 覆盖 */ }
     .lume[data-theme="dark"]  { /* dark 覆盖 */ }
     ```
     默认不设 `data-theme` → 继承全局；需要局部固定明暗时给某容器加 `data-theme`。（等价于 mdui 的 `mdui-theme`）
  4. **审计**：CI/脚本检查组件内不得出现 `#hex/white/black/rgb()`（例外：阴影/遮罩用 token）。
- **状态**：已修复

---

## 修复方式（已执行）

**改动 1 · 全局交互样式（`src/styles/tokens.css` 顶部）**
```css
.lume, .lume * {
  -webkit-tap-highlight-color: transparent;                 /* #1 */
  -webkit-user-select: none; user-select: none;             /* #2 */
  -webkit-touch-callout: none;
}
.lume input, .lume textarea, .lume [contenteditable="true"],
.lume [contenteditable=""], .lume .lume-select {
  -webkit-user-select: text; user-select: text; -webkit-touch-callout: default;
}
```

**改动 2 · 前景色自动推导（`src/plugin.ts`）**
- `apply(cfg)` 内：对 `primary/danger/success/warning` 逐个：
  - 取有效值 = `cfg[name] ?? getComputedStyle(root).getPropertyValue('--lume-'+name) ?? 默认`；
  - `root.style.setProperty('--lume-on-'+name, readableOn(有效值))`，除非 `cfg['on'+Name]` 已指定。
- 明暗切换/系统变化/`set()` 时都会重跑 `apply()` → 自动重算。

**改动 3 · 组件约定与覆盖**
- 有色底组件统一 `color: var(--lume-on-*)`（已在主/危/成功/警告按钮、标签、角标、复选、Switch、Toast 落实）。
- 新增可选 `textColor` prop（或 `onXxx` 选项）供"用户指定"时覆盖。

> 待你说“一起改”后，我将一次性落地 #1~#3，并重新构建 + 刷新线上 demo。

---

## 后续新增问题（追加在下方）

### #7 前景色算法：改为感知亮度(YIQ)，修正"蓝底黑字"
- **现象**：#3 初版用"对比度最大者"，对中亮度品牌色（如 `#1989fa`/`#5e72e4`）会判成黑字，观感错误（主按钮应是白字）。
- **修复**：`readableOn()` 改用 **YIQ 感知亮度**阈值（偏白字）：`>= 150` 取黑，否则取白（阈值由 128 上调至 150，让保存按钮等中亮度色更明显用白字）。
- **结果**：`#5e72e4`(121)→白、`#1989fa`(116)→白、`#ee0a24`(81)→白、`#07c160`(126)→白；`#ff976a`(177)→黑、`#ffd54f`(210)→黑、`#ffffff`→黑、`#000000`→白。
- **状态**：已修复（2026-09-29）

### #8 列表项底部直角边溢出卡片圆角
- **现象**：卡内列表（demo 用负外边距做"通栏"）时，列表项方形底边/边框盖住卡片圆角，底部直角"溢出来"。
- **修复**：`AppCard` 增加 `clip`（默认 `true`）→ `.lume-card--clip { overflow: hidden; }`，把内部内容裁剪到圆角内；可用 `:clip="false"` 关闭（如需卡内下拉不被裁剪）。
- **状态**：已修复（2026-09-29）

### #9 设置页与演示页拼接（切换失效）
- **现象**：tab 切到「设置」时，设置页没有替换演示页，而是拼接在下方。
- **根因**：`DemoView`/`SettingsView` 为**片段根（多根节点，`<main>` + 多个 `<Teleport>` 弹层）**，`v-show` 不支持片段根，导致两个视图都常驻。
- **修复**：`App.vue` 改用 `v-if`（`<DemoView v-if="tab==='demo'"/><SettingsView v-else/>`）。
- **状态**：已修复（2026-09-29）

### #10 两侧白条 + 开弹窗内容右移变宽
- **现象**：页面左右两侧有两条（浏览器默认背景的）白边；打开任意弹窗/底部弹窗时，主体内容右移、右侧白条被挤掉、内容变宽。
- **根因**：
  1. `body` 无背景（默认白色），而应用壳用 `--lume-bg`（浅灰）→ 两侧露出白条。
  2. 滚动锁隐藏滚动条时未补偿其宽度 → 视口变宽，内容右移。
- **修复**：
  1. `html.lume, html.lume body { margin:0; background:var(--lume-bg); color:var(--lume-text) }`，背景与主题一致。
  2. `scroll-lock.ts` 锁定时按 `innerWidth - clientWidth` 补偿 `body.padding-right`，解锁恢复；去掉会导致宽度跳变的 `position:fixed` 方案。
- **状态**：已修复（2026-09-29）

### #11 点行内控件（开关/±）会触发整行波纹与点击
- **现象**：在可点击的 `AppField`/`AppListItem`（带 `v-ripple`）里点开关、步进 ±、按钮等，会同时触发整行波纹甚至整行点击。
- **根因**：内部控件的 `pointerdown`/`click` 冒泡到整行，行级 `v-ripple` 与 `@click` 未区分来源。
- **修复**：
  1. `v-ripple`：`pointerdown` 若源自内部交互控件（`button/a/input/select/textarea/[data-lume-no-ripple]` 且非自身）则不产生波纹。
  2. `AppField`/`AppListItem` 的 `onClick`：若目标命中内部交互控件则直接返回，不触发行点击/触感。
  3. 约定：内部控件可加 `data-lume-no-ripple` 显式声明不冒泡（预留）。
- **状态**：已修复（2026-09-29）

### #12 语义色改莫兰迪（主题蓝不动，警告色豁免）
- **要求**：除主题色外，组件色不要刺眼高饱和；尽量莫兰迪色系，也不要太淡；警告色例外。
- **调整**：`--lume-danger: #a86060`（莫兰迪砖红）、`--lume-success: #5f7f6a`（莫兰迪灰绿）；`--lume-primary` 保持 `#1989fa`；`--lume-warning` 保持 `#ff976a`（豁免）。
- **前景色**：YIQ 自动 → 主/危/成功=白字，警告=黑字（一致、可读）。
- **状态**：已修复（2026-09-29）

### #13 莫兰迪/主题色填充组件统一白字
- **要求**：莫兰迪色（及主题色）填充的组件文字用白色。
- **修复**：`plugin.apply()` 对 `primary/danger/success` 强制白字（`onPrimary/onDanger/onSuccess` 可覆盖）；仅当该色**极浅**（YIQ ≥ 190）时回落黑字以保证可读。`warning` 仍走算法（黑字）。新增导出 `yiq()`。
- **状态**：已修复（2026-09-29）

### #14 列表条目间有白色缝隙、无波纹
- **现象**：`AppListItem` 列表（项目 B/C）条目之间有一条白色间距，波纹不覆盖该处。
- **根因**：列表容器误用带 `gap` 的 `.lume-col`，条目间出现不属于任何条目的空白缝隙。
- **修复**：新增库类 `.lume-list`（无间距、靠 `border` 分隔）；demo 与设置页列表容器改用 `.lume-list`。
- **状态**：已修复（2026-09-29）

### #15 需要程序化「二次确认」弹窗与卡片说明
- **需求**：危险操作（导入/导出/删除/下载等）需两次确认弹窗；卡片标题旁需要「?」按钮点击弹出说明，风格统一。
- **实现**：新增服务 `dialog.ts`（`alert / confirm / confirm2 / confirmSteps` + `dialogs`），配 `AppDialogHost.vue` 宿主（毛玻璃、滚动锁、危险配色、多步“第 N/M 次确认”）。`AppCard` 新增 `help` 属性：设置后标题右侧出现「?」按钮，点击用 `alert` 弹出说明。
- **状态**：已完成（2026-09-29）

### #16 选择文件/下载不能用库按钮
- **现象**：原生 `<input type="file">` 与 `<a>` 下载链接与库按钮风格不一致。
- **修复**：库按钮 `AppButton` 直接承担；应用侧封装 `FileButton`（`AppButton` + 隐藏 input）与下载触发（`AppButton` + 临时 `<a>`）。库层面 `AppButton` 已可复用，无需跨组件 import。
- **状态**：已完成（2026-09-29）
