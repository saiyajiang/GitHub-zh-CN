# GitHub-zh-CN（GitHub 中文化油猴脚本）

🔗 **Greasyfork 安装页：https://greasyfork.org/zh-CN/scripts/596199**

将 GitHub 网页界面的英文文案实时替换为简体中文。纯 DOM 文本替换，不请求网络、不上传数据、不修改页面逻辑。

> 声明：本脚本由 AI 生成。词典与匹配规则仍在持续完善，遇到漏翻欢迎提 Issue 反馈。

## 许可

**MIT** — 宽松许可，几乎无限制。

| | 说明 |
| --- | --- |
| ✅ 可以 | 个人使用、安装、修改、分发、再发布，**包括商业用途** |
| ✅ 可以 | 闭源集成进自有产品 |
| ✅ 可以 | 二次开发后自行选择许可（不必沿用 MIT） |
| 📌 必须 | 保留原作者版权声明与许可声明 |
| ⚠️ 无担保 | 软件按「原样」提供，作者不承担任何责任 |

一句话：**随便用，留个署名就行。**

## 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/)（或 Violentmonkey / Greasemonkey）。
2. 打开 [Greasyfork 安装页](https://greasyfork.org/zh-CN/scripts/596199)，点「安装此脚本」。

也可以从仓库直接安装：打开 `GitHub-zh-CN.user.js` 点击安装（无自动更新，需手动回装新版本）。

| 来源 | 地址 |
| --- | --- |
| Greasyfork（推荐，支持自动更新） | https://greasyfork.org/zh-CN/scripts/596199 |
| GitHub 仓库（源码） | https://github.com/saiyajiang/GitHub-zh-CN |
| 问题反馈 | https://github.com/saiyajiang/GitHub-zh-CN/issues |

## 特性

- **词典可维护**：900+ 条词条，按 19 个场景分组（通用 / 导航 / 个人页 / 仓库 / 代码 / Issue·PR / Actions / 设置 / 探索 / Gist / 安全 / 洞察 / 通知 / 搜索 / Agents / 编辑器 / 分支 / 页脚 / 连接词），加词只需加一行。
- **漏翻可自查**：油猴菜单「🔍 检查未翻译文案」会把当前页面残留的英文列成控制台表格，照着补词典即可。
- **不误伤**：跳过代码块（`<pre>`、`<code>`、`.blob-code`）、用户输入框内容、README 与评论正文（`.markdown-body`、`.comment-body`），只翻译界面文案。
- **仓库名保护**：`saiyajiang/Bilibili-Search-Replace` 里的 `Search`、`Stop-Ask-Questions` 里的 `Stop` 不会被翻——标识符（仓库名 / 分支名 / tag / 文件名）通过三重防线识别并原样保留。
- **覆盖动态内容**：`MutationObserver` 增量翻译 + 监听 `turbo:load` / `pjax:end` / `popstate`，SPA 局部跳转后仍生效。
- **数字与日期**：`1,234 commits` → `1,234 次提交`、`on Jul 5, 2024` → `于 2024 年 7 月 5 日`、`3 days ago` → `3 天前`（含 `<relative-time>` 的 Shadow DOM）。
- **可开关**：油猴菜单里可暂停翻译 / 立即重新翻译，状态持久化。
- 同时匹配 `github.com` 与 `gist.github.com`。

## 发布前必改

编辑 `GitHub-zh-CN.user.js` 顶部的元数据块：

| 字段 | 说明 |
| --- | --- |
| `@namespace` | 换成你的仓库主页，如 `https://github.com/<你的ID>/GitHub-zh-CN`，不要填 greasyfork.org 地址 |
| `@author` | 你的名字 / ID |
| `@homepageURL` | Greasyfork 安装页地址 |
| `@supportURL` | Issues 地址，路径保持首字母大写 |
| `@version` | 每次发布递增，Greasyfork 靠它检测更新 |

仓库名建议直接用 `GitHub-zh-CN`，与脚本文件名保持一致。另外仓库根目录需要一个 `LICENSE`（本项目采用 MIT，已随仓库提供）。

> 安全提醒：脚本里不要写任何令牌 / 密钥。若要本地调试，请用环境变量或 `.gitignore` 掉的配置文件，切勿把 `ghp_` 开头的 Personal Access Token 提交进仓库或贴到对话里。

## 维护词条

在 `1. 词典` 段落中找到对应分组，添加一行：

```js
const DICT_REPO = {
  // ...
  'Your English string': '你的中文',
};
```

匹配规则：

1. **整段精确匹配**（大小写不敏感）优先，例如 `Sign in` → `登录`；
2. 然后是**正则规则**（`PATTERNS`），处理计数、日期、相对时间等带变量的文案；
3. 最后是**长句内短语替换**：文本节点大小写敏感（防误伤用户内容），`aria-label` / `title` / `placeholder` 等属性大小写不敏感（UI 属性常是全小写，如 `Notifications and alerts`）。

带数字/变量的文案请加到 `PATTERNS`，格式 `[正则, 替换字符串或函数]`：

```js
[/\b(\d[\d,]*)\s+issues?\b/gi, '$1 个议题'],
```

⚠️ **`PATTERNS` 的顺序很关键**：数组顶部是「组合优先规则」区块（如 `wants to merge N commits into X from Y`、`N commits ahead of`），必须排在通用计数规则之前，否则 `2 commits ahead of main` 会先被 `N commits` 吃掉，变成「2 次提交 ahead of」。新增组合规则请一律放在这个区块里。

分支名、仓库名、用户名、`Dependabot`、`Copilot`、`HTTPS` 等专有名词不会被翻译，这是刻意保留的。

### 为什么仓库名不会被翻

仓库名经常长得跟界面文案一模一样（`Search`、`Stop`、`Code` 都可能是仓库名的一部分），光靠词典区分不开。脚本用了三重防线：

1. **标识符形态识别**（主力）：不含空格的连续串，只要符合 `kebab-case` / `snake_case` / `owner/repo` / `x.y` 形态（`Bilibili-Search-Replace`、`foo_bar`、`index.js`、`v1.2.3`），就整体保护起来，短语替换跑完再原样还原。含空格的 `Search this repository` 不受影响，照常翻译。
2. **自链接判定**：`<a>` 的可视文本与 `href` 路径完全一致时，判定为仓库名 / 分支名链接，跳过。`/pulls` → "Pull requests" 这种导航项不会被误判。
3. **容器选择器**：侧栏仓库列表、分支选择器、release tag 等容器直接跳过。
4. **形态直判**：整段文本只要符合 `owner/repo` 形态（`saiyajiang/Bilibili-Search-Replace`），无论挂在什么容器下一律跳过。

另外 `.sr-only` / `*VisuallyHidden*` / `[aria-hidden="true"]` 这类读屏专用文本不翻译——翻了也看不见，还会污染「未翻译检测」的结果。

⚠️ 已知边界：单单词仓库名（如仓库就叫 `Search`）无法与界面文案区分，仍会被翻译。这类情况可在词典里删掉对应词条，或用菜单命令暂停翻译。

### 歧义词：只做整段精确匹配

有些英文单词在 GitHub 上有两种词性，翻错一个就会把整句变成半中半英，比不翻更难读：

| 词 | 状态 / 名词 | 动词 | 错误示例 |
| --- | --- | --- | --- |
| `Open` | 待处理 | **打开** | "Open quick search dialog" → ~~待处理 quick search dialog~~ |
| `Type` | 类型 | **输入** | "type / to search" → ~~类型 / to search~~ |
| `No` | 否 | **没有** | "No issues found" → ~~否 issues found~~ |
| `Read` | 已读 | **阅读** | "Read the docs" → ~~已读 the docs~~ |
| `Top` / `Latest` | 顶部 / 最新 | — | "Latest from our changelog" → ~~最新 from our changelog~~ |

这些词统一放进 `DICT_AMBIGUOUS`，**只参与整段精确匹配，不参与长句内的短语替换**（在 `EXACT_ONLY` 里登记，构建 `PHRASE_RE` 时过滤掉）。

所以：节点里单独一个 `Open` → 照常翻成「待处理」；而 `Open quick search dialog` 走组合词条翻成「打开快速搜索对话框」。

⚠️ **不要往词典里加 `and` / `or` / `with` / `from` 这类连接词。** 早期版本加过，结果 `Chat with Copilot` 变成「对话 含 Copilot」——整句半中半英。这类词请一律整句收录（如 `'Chat with Copilot': '与 Copilot 对话'`）。

> 提示：GitHub 的 `Actions`、`Copilot` 等功能名默认保留英文，避免与技术术语混淆；如需翻译，自行在词典里加一行即可。

## 调试

脚本在油猴菜单里提供了三个命令：

| 命令 | 作用 |
| --- | --- |
| ⏸ 暂停翻译（刷新生效） | 关闭翻译，状态持久化 |
| 🔄 立即重新翻译 | 恢复原文后重扫整页 |
| 🔍 检查未翻译文案（看控制台） | **把当前页面仍为英文的文案列成表格**，打开 F12 控制台查看 |

发现漏翻时，用「🔍 检查未翻译文案」拿到 `text` 列，直接加进对应词典分组即可。

## 兼容

- Tampermonkey / Violentmonkey / Greasemonkey（需支持 `GM_registerMenuCommand`、`GM_getValue` / `GM_setValue`；缺失时自动降级为「始终开启」）。
- 脚本运行在 `document-end`，`@noframes` 避免在 iframe 中重复注入。

## License

MIT — 保留署名即可自由使用，含商业用途。详见 [LICENSE](./LICENSE)。
