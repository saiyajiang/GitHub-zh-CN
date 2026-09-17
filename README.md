# GitHub-zh-CN（GitHub 中文化油猴脚本）

将 GitHub 网页界面的英文文案实时替换为简体中文。纯 DOM 文本替换，不请求网络、不上传数据、不修改页面逻辑。

## 特性

- **词典可维护**：词条按「通用 / 导航 / 个人页 / 仓库 / 代码 / Issue·PR / Actions / 设置 / 探索 / Gist」分组，加词只需加一行。
- **不误伤**：跳过代码块（`<pre>`、`<code>`、`.blob-code`）、用户输入框内容、README 与评论正文（`.markdown-body`、`.comment-body`），只翻译界面文案。
- **覆盖动态内容**：`MutationObserver` 增量翻译 + 监听 `turbo:load` / `pjax:end` / `popstate`，SPA 局部跳转后仍生效。
- **数字与日期**：`1,234 commits` → `1,234 次提交`、`on Jul 5, 2024` → `于 2024 年 7 月 5 日`、`3 days ago` → `3 天前`（含 `<relative-time>` 的 Shadow DOM）。
- **可开关**：油猴菜单里可暂停翻译 / 立即重新翻译，状态持久化。
- 同时匹配 `github.com` 与 `gist.github.com`。

## 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/)（或 Violentmonkey / Greasemonkey）。
2. 打开 `GitHub-zh-CN.user.js`，点击安装；或直接从 Greasyfork 安装。

## 发布前必改

编辑 `GitHub-zh-CN.user.js` 顶部的元数据块：

| 字段 | 说明 |
| --- | --- |
| `@namespace` | 换成你的仓库主页，如 `https://github.com/<你的ID>/GitHub-zh-CN`，不要填 greasyfork.org 地址 |
| `@author` | 你的名字 / ID |
| `@homepageURL` `@supportURL` | 换成你的仓库与 Issues 地址，路径保持首字母大写 |
| `@version` | 每次发布递增，Greasyfork 靠它检测更新 |

仓库名建议直接用 `GitHub-zh-CN`，与脚本文件名保持一致。另外仓库根目录补一个 `LICENSE`（脚本声明为 MIT）。

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
3. 最后才是**长句内短语替换**（大小写敏感），所以新增普通词不会误伤用户内容。

带数字/变量的文案请加到 `PATTERNS`，格式 `[正则, 替换字符串或函数]`：

```js
[/\b(\d[\d,]*)\s+issues?\b/gi, '$1 个议题'],
```

> 提示：GitHub 的 `Actions`、`Copilot` 等功能名默认保留英文，避免与技术术语混淆；如需翻译，自行在词典里加一行即可。

## 调试

在浏览器控制台执行：

```js
// 查看某条文案的翻译结果（需脚本已运行）
```

或直接在 Tampermonkey 面板中打开脚本编辑器，用「立即重新翻译」菜单命令刷新当前页。

## 兼容

- Tampermonkey / Violentmonkey / Greasemonkey（需支持 `GM_registerMenuCommand`、`GM_getValue` / `GM_setValue`；缺失时自动降级为「始终开启」）。
- 脚本运行在 `document-end`，`@noframes` 避免在 iframe 中重复注入。

## License

MIT
