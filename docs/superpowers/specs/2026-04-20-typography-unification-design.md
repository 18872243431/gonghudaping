# 全局字体样式统一重构设计 (方案A)

## 1. 现状问题
目前项目中（如 `/networksecurity` 和各类图表组件）：
- 字体族（Font Family）使用混乱：`YouSheBiaoTiHei`、`SourceHanSansSC`、`PingFang SC`、`sans-serif`、`微软雅黑` 混用。
- ECharts 图表中的 `axisLabel`、`legend`、`tooltip` 甚至 `title` 中都将字体与字号硬编码。
- 部分页面虽然提取了局部 CSS 变量（如 `--font-h1: 38px`），但没有形成工程级别的全局规范，未覆盖全部组件。

## 2. 设计方案：CSS 变量 + ECharts 默认配置抽象

### 2.1 CSS 层面的全局抽象 (Variables & Common)
在 `src/assets/theme/style-vars.scss` 或新建的 `typography.scss` 中统一定义字体变量：

```scss
// 字体族统一
$font-family-title: "YouSheBiaoTiHei", sans-serif; // 一级/二级标题专用
$font-family-body: "PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif; // 正文/卡片/图例默认字体
$font-family-num: "DIN", "SourceHanSansSC", sans-serif; // 数字或图表数值标签专用

// 字号统一 (32:9 基准)
$font-size-h1: 38px;
$font-size-h2: 30px;
$font-size-h3: 24px;
$font-size-body: 20px;
$font-size-small: 18px;
$font-size-mini: 16px;
```

在 `src/assets/css/common.scss` 内声明这些 CSS Variables 映射并建立公共字体 class：

```scss
:root {
  --font-family-title: #{$font-family-title};
  --font-family-body: #{$font-family-body};
  --font-family-num: #{$font-family-num};

  --font-size-h1: #{$font-size-h1};
  --font-size-h2: #{$font-size-h2};
  --font-size-h3: #{$font-size-h3};
  --font-size-body: #{$font-size-body};
  --font-size-small: #{$font-size-small};
}

// 统一类名
.text-h1 { font-family: var(--font-family-title); font-size: var(--font-size-h1); font-weight: bold; }
.text-h2 { font-family: var(--font-family-title); font-size: var(--font-size-h2); }
.text-h3 { font-family: var(--font-family-body); font-size: var(--font-size-h3); font-weight: bold; }
.text-body { font-family: var(--font-family-body); font-size: var(--font-size-body); }
.text-num { font-family: var(--font-family-num); }
```

### 2.2 ECharts 层面的全局抽象
由于 ECharts 是在 Canvas 内部渲染，它无法直接读取外部普通 CSS class 的样式，需要通过配置注入。

项目内目前存在 `src/components/echarts/config/` 目录用于管理 ECharts 默认配置，我们需要在：
- `xAxis.js`
- `yAxis.js`
- `tooltip.js`
- `legend.js`
中统一应用 `textStyle`。**注意：所有的图表字体颜色必须统一收口为白色 `#ffffff`。**

例如在 `xAxis.js` 和 `yAxis.js` 中：
```javascript
export default {
  axisLabel: {
    color: "#ffffff", // 图表文字统一颜色
    fontSize: 18,
    fontFamily: "var(--font-family-body)" // 统一收口在这里
  },
  // ...
};
```
针对每一个独立的 ECharts 组件实例（例如 `TerminalRankBar`、`Pie.vue` 等），如果其配置项 `option` 或者 `series` 中硬编码了原有的颜色值（如 `#C7DDFF` 或 `#D0DEEE`）及字体族（如 `fontFamily: "微软雅黑"` 或 `"SourceHanSansSC"`），一律：
- 将颜色更新为 `#ffffff`。
- 将字体族更新为 `var(--font-family-body)`，如果是刻度/统计数字则使用 `var(--font-family-num)`，如果是标题性质则使用 `var(--font-family-title)`。

## 3. 执行与过渡步骤
1. **基础定义阶段**：在 `common.scss` 的 `:root` 下注册字体族的 CSS Variables，覆盖标题、正文和数字。
2. **ECharts 全局与组件改造**：
   - 梳理 `config/*.js`，强制应用纯白颜色 `#ffffff` 以及对应的字体族变量。
   - 深入所有 `Bar`、`Line`、`Pie` 等组件内，移除或修改原有的硬编码颜色（如浅蓝、暗蓝）及固化的字体族属性，全量更新为 `color: "#ffffff"`。
   - **⚠️ 避坑指南 (ECharts Canvas 渲染局限)**：Canvas 的 `ctx.font` 无法解析原生的 `var(--font-*)` 变量，如果在 ECharts 配置中强行使用 CSS 变量，会导致引擎将其判定为无效字体并回退至 10px 或 12px 默认极小字号。因此，**在 ECharts 的 js/vue 配置文件中，严禁使用 `var(--font-family-body)`**，必须直接使用对应的真实字符串字面量（如 `'"PingFang SC", "Microsoft YaHei", "SourceHanSansSC", sans-serif'`）。
   - **字号统一规范**：为适配大屏（如 32:9），ECharts 组件中 `axisLabel`、`legend`、`tooltip` 等基础正文文本大小统一上调至 `20px`，图表高亮/总计数值上调至 `24px`。对于组件内模块级别的切换标签（Tabs）及次级标题，统一采用 `22px`。
3. **页面与 DOM 级重构**：逐个业务页面（如 `/networksecurity`、`/architecture` 等），找到那些写死在 CSS 块里的字体，将其替换为 `font-family: var(--font-family-body)` 等对应变量；页面卡片及模块原有的渐变颜色效果保持原样，仅替换字体族和字号。
   - **⚠️ 避坑指南 (Sass 变量编译)**：在 `common.scss` 引用 `$font-family-*` Sass 变量注册 CSS 自定义变量时，必须在文件顶部 `@import "../theme/style-vars.scss";`，否则会导致 `SassError: Undefined variable`。
   - **⚠️ 避坑指南 (Vue Template 解析)**：当在 Vue 模板的标签内联属性中（如 `:option="{ xAxis: { axisLabel: { fontFamily: ... } } }"` 或 `formatter: () => { return \`<p style='font-family: ...'>...</p>\` }`）传递包含样式的字符串或模板字符串时，注意避免双引号嵌套导致 HTML 解析闭合错误，引发 `VueCompilerError: Attribute name cannot contain U+0022 ("), U+0027 ('), and U+003C (<)`。应该使用单引号和转义字符（如 `fontFamily: '\'PingFang SC\', \'Microsoft YaHei\', sans-serif'` 或 `<p style=\'font-family: ...\'></p>`）。
   - **⚠️ 避坑指南 (样式穿透与局部覆盖)**：如果在特定的模块中（如 `networksecurity` 的图表切换 tab）字体太小，需要同时在常规类 `.tab-item` 和激活类 `&.active` 中覆盖字体大小，例如提升至 `22px`。
   - **⚠️ 避坑指南 (el-table 样式穿透)**：业务页面大量使用了二次封装的 `act-table` 组件，其底层依赖于 `el-table` 并在 `elementui-custom.scss` 中硬编码了表头和正文字号（`18px`）。必须全局重构该公共样式表（例如放大至 `20px` 并解除字体族硬编码），才能保证表格文本与 ECharts 图表、页面其他文本的视觉对齐。
   - **⚠️ 避坑指南 (严格圈定修改范围)**：当用户明确要求仅修改特定文件（例如 `index.vue`、`index.scss`）时，**绝对禁止**修改同目录或项目中的其他文件（例如 `enterpriseRisk.html`），即便这些文件使用了相似的硬编码样式。过度修改会导致未知的副作用，必须通过 Git 或工具严格检查受影响的文件列表。

## 4. 总结与成果
- **范围**：本项目排查了 `src/components/echarts` 下所有的图表组件以及 `src/views` 目录下的业务模块（已严格过滤 `16:9` 即 `*16.vue` 文件，以及 HTML 测试/备份文件），同时重构了 `elementui-custom.scss` 等公共基础样式。
- **内容**：将散落的字体声明（`YouSheBiaoTiHei`, `SourceHanSansSC` 等）收口至 CSS 变量和全局 ECharts Config 中；统一了图表与表格文字的白色主题（`#ffffff`），将大屏组件的基准字号拉平至 `20px`，并解决了 Canvas 字体降级、Sass 编译报错、Vue 属性及模板字符串引号转义冲突等多项开发中遇到的坑。