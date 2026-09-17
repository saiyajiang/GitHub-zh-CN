// ==UserScript==
// @name         GitHub 中文化
// @name:zh-CN   GitHub 中文化
// @name:en      GitHub Chinese Localization
// @namespace    https://github.com/saiyajiang/GitHub-zh-CN
// @version      1.0.0
// @description  将 GitHub 网页界面的英文文案实时替换为简体中文（不翻译代码与用户内容）
// @description:zh-CN 将 GitHub 网页界面的英文文案实时替换为简体中文（不翻译代码与用户内容）
// @description:en  Translate GitHub's web UI into Simplified Chinese on the fly (code and user content untouched).
// @author       saiyajiang
// @license      MIT
// @match        https://github.com/*
// @match        https://gist.github.com/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @homepageURL  https://github.com/saiyajiang/GitHub-zh-CN
// @supportURL   https://github.com/saiyajiang/GitHub-zh-CN/issues
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @noframes
// ==/UserScript==

(function () {
  'use strict';

  /* =========================================================================
   * 1. 词典
   *    新增词条：只需要在下面对应的分组里加一行 "英文": "中文" 即可。
   *    - 精确匹配（整段文本就是一个词条）时大小写不敏感；
   *    - 长句内替换（短语替换）时大小写敏感，避免误伤用户内容。
   * ========================================================================= */

  // 1.1 通用动作与按钮
  const DICT_COMMON = {
    'OK': '确定',
    'Apply': '应用',
    'Cancel': '取消',
    'Save': '保存',
    'Save changes': '保存更改',
    'Submit': '提交',
    'Delete': '删除',
    'Edit': '编辑',
    'Create': '创建',
    'Add': '添加',
    'Remove': '移除',
    'Copy': '复制',
    'Copied!': '已复制！',
    'Close': '关闭',
    'Back': '返回',
    'Next': '下一页',
    'Previous': '上一页',
    'More': '更多',
    'Less': '更少',
    'Show more': '显示更多',
    'Show less': '显示更少',
    'See all': '查看全部',
    'View all': '查看全部',
    'Load more': '加载更多',
    'Learn more': '了解更多',
    'Read more': '阅读更多',
    'Get started': '开始使用',
    'Go to': '前往',
    'Jump to': '跳转到',
    'Search': '搜索',
    'Filter': '筛选',
    'Filters': '筛选条件',
    'Sort': '排序',
    'Sort by': '排序方式',
    'Clear': '清空',
    'Clear filters': '清除筛选',
    'Refresh': '刷新',
    'Retry': '重试',
    'Loading': '加载中',
    'Expand': '展开',
    'Collapse': '折叠',
    'Hide': '隐藏',
    'Show': '显示',
    'Enable': '启用',
    'Disable': '停用',
    'Enabled': '已启用',
    'Disabled': '已停用',
    'Update': '更新',
    'Upgrade': '升级',
    'Download': '下载',
    'Upload': '上传',
    'Share': '分享',
    'Embed': '嵌入',
    'Preview': '预览',
    'Write': '撰写',
    'Comment': '评论',
    'Comments': '评论',
    'Status': '状态',
    'Results': '结果',
    'No results': '无结果',
    'Nothing to show': '没有可显示的内容',
    'No description provided': '未提供描述',
    'Page not found': '页面不存在',
    'Something went wrong': '出错了',
    'Sign in': '登录',
    'Sign up': '注册',
    'Sign out': '退出登录',
    'Signed in as': '已登录为',
    'Sign in to GitHub': '登录 GitHub',
    'Create an account': '创建账号',
    'Join GitHub': '加入 GitHub',
    'Forgot password?': '忘记密码？',
    'Username or email address': '用户名或邮箱地址',
    'Password': '密码',
    'Two-factor authentication': '双重身份验证',
    'Help': '帮助',
    'Feedback': '反馈',
    'Contact': '联系我们',
    'Report': '举报',
    'Block or report': '屏蔽或举报',
    'Language': '语言',
    'Any': '任意',
    'All': '全部',
    'None': '无',
    'Public': '公开',
    'Private': '私有',
    'Internal': '内部',
    'Draft': '草稿',
    'Archived': '已归档',
    'Active': '活跃',
    'Inactive': '非活跃',
    'Default': '默认',
    'Custom': '自定义',
    'Latest': '最新',
    'Newest': '最新',
    'Oldest': '最早',
    'Recently updated': '最近更新',
    'Best match': '最佳匹配',
    'Most stars': '星标最多',
    'Most forks': '派生最多',
    'Recently indexed': '最近收录',
    'Today': '今天',
    'This week': '本周',
    'This month': '本月',
    'This year': '今年',
    'Yesterday': '昨天',
    'Created': '创建时间',
    'Updated': '更新时间',
    'Last updated': '最后更新',
    'Website': '网站',
    'Topics': '话题',
    'Description': '描述',
    'Optional': '可选',
    'Required': '必填',
    'Unread': '未读',
    'Mark as read': '标记为已读',
    'Mark all as read': '全部标记为已读',
    'Owner': '所有者',
    'Owners': '所有者',
    'Members': '成员',
    'Invite': '邀请',
    'Leave': '离开',
    'Join': '加入',
    'Confirm': '确认',
    'Continue': '继续',
    'Skip': '跳过',
    'Dismiss': '忽略',
    'Undo': '撤销',
    'Restore': '恢复',
    'Rename': '重命名',
    'Archive': '归档',
    'Unarchive': '取消归档',
    'Transfer': '转移',
    'Visibility': '可见性'
  };

  // 1.2 顶部导航与全局菜单
  const DICT_NAV = {
    'Home': '首页',
    'Dashboard': '仪表盘',
    'Pull requests': '拉取请求',
    'Pull request': '拉取请求',
    'Issues': '议题',
    'Issue': '议题',
    'Marketplace': '市场',
    'Explore': '探索',
    'Codespaces': '代码空间',
    'Code space': '代码空间',
    'Notifications': '通知',
    'Notification': '通知',
    'Create new...': '新建…',
    'New repository': '新建仓库',
    'Import repository': '导入仓库',
    'New codespace': '新建代码空间',
    'New gist': '新建代码片段',
    'New organization': '新建组织',
    'New project': '新建项目',
    'Your profile': '你的个人主页',
    'Your repositories': '你的仓库',
    'Your projects': '你的项目',
    'Your codespaces': '你的代码空间',
    'Your stars': '你的星标',
    'Your gists': '你的代码片段',
    'Your organizations': '你的组织',
    'Your enterprises': '你的企业',
    'Your sponsors': '你的赞助者',
    'Settings': '设置',
    'Profile': '个人资料',
    'Account': '账号',
    'Appearance': '外观',
    'Accessibility': '无障碍',
    'Repositories': '仓库',
    'Organizations': '组织',
    'Enterprises': '企业',
    'Try the new experience': '体验新版界面',
    'Switch to the old experience': '切回旧版界面',
    'Keyboard shortcuts': '键盘快捷键'
  };

  // 1.3 个人主页 / 组织页
  const DICT_PROFILE = {
    'Overview': '概览',
    'Stars': '星标',
    'Followers': '关注者',
    'Following': '关注中',
    'Follow': '关注',
    'Unfollow': '取消关注',
    'Sponsor': '赞助',
    'Sponsors': '赞助者',
    'Sponsoring': '赞助中',
    'Popular repositories': '热门仓库',
    'Pinned': '已置顶',
    'Customize your pins': '自定义置顶内容',
    'Contribution activity': '贡献活动',
    'Contribution settings': '贡献设置',
    'Contributions': '贡献',
    'People': '用户',
    'Teams': '团队',
    'Projects': '项目',
    'Discussions': '讨论',
    'Packages': '软件包',
    'Public contributions': '公开贡献',
    'Private contributions': '私人贡献',
    'Blocked users': '已屏蔽的用户'
  };

  // 1.4 仓库页
  const DICT_REPO = {
    'Code': '代码',
    'Security': '安全',
    'Insights': '洞察',
    'Wiki': '维基',
    'Wikis': '维基',
    'Pulse': '动态',
    'Contribute': '贡献',
    'Contributors': '贡献者',
    'Releases': '发布',
    'Release': '发布',
    'Tags': '标签',
    'Branches': '分支',
    'Branch': '分支',
    'Commits': '提交',
    'Commit': '提交',
    'Deployments': '部署',
    'Environments': '环境',
    'Watch': '关注',
    'Unwatch': '取消关注',
    'Watching': '正在关注',
    'Ignored': '已忽略',
    'Star': '星标',
    'Unstar': '取消星标',
    'Starred': '已星标',
    'Fork': '派生',
    'Forks': '派生',
    'Fork this repository': '派生此仓库',
    'Participating and @mentions': '参与和 @提及',
    'All Activity': '全部活动',
    'Include forks': '包含派生仓库',
    'About': '关于',
    'Readme': '自述文件',
    'License': '许可证',
    'Activity': '动态',
    'Used by': '被使用于',
    'Report repository': '举报仓库',
    'Create a new repository': '创建新仓库',
    'Repository': '仓库',
    'New release': '新建发布',
    'Draft a new release': '起草新发布',
    'Create a release': '创建发布',
    'Choose a tag': '选择标签',
    'Release title': '发布标题',
    'Describe this release': '描述本次发布',
    'Publish release': '发布',
    'Pre-release': '预发布',
    'Set as latest release': '设为最新发布',
    'Latest release': '最新发布',
    'Compare': '对比',
    'Conversation': '讨论',
    'Overview of this repository': '本仓库概览',
    'Go to repository': '前往仓库',
    'This repository': '此仓库',
    'No releases published': '尚未发布任何版本',
    'No packages published': '尚未发布任何软件包',
    'Releases and tags': '发布与标签'
  };

  // 1.5 代码浏览
  const DICT_CODE = {
    'Go to file': '跳转到文件',
    'Find file': '查找文件',
    'Add file': '添加文件',
    'Create new file': '创建新文件',
    'Upload files': '上传文件',
    'Clone': '克隆',
    'Download ZIP': '下载 ZIP 压缩包',
    'Open with GitHub Desktop': '用 GitHub Desktop 打开',
    'GitHub CLI': 'GitHub CLI',
    'Use Git or checkout with SVN using the web URL': '使用 Git 或通过网页 URL 用 SVN 检出',
    'Raw': '原始文件',
    'Blame': '逐行追溯',
    'History': '历史',
    'Permalink': '永久链接',
    'Copy raw file': '复制原始文件内容',
    'Download raw file': '下载原始文件',
    'Copy path': '复制路径',
    'Copy permalink': '复制永久链接',
    'Copy contents': '复制内容',
    'View git blame': '查看 git 逐行追溯',
    'Open in new window': '在新窗口打开',
    'Wrap lines': '自动换行',
    'No wrap': '不换行',
    'Soft wrap': '软换行',
    'Line wrap mode': '换行模式',
    'Edit this file': '编辑此文件',
    'Delete this file': '删除此文件',
    'This file has been truncated': '此文件已被截断',
    'File too large': '文件过大',
    'Search this repository': '搜索本仓库',
    'Search all of GitHub': '搜索整个 GitHub',
    'Search or jump to…': '搜索或跳转到…',
    'Search or jump to': '搜索或跳转到',
    'Search code': '搜索代码',
    'Search commits': '搜索提交',
    'Repository is empty': '仓库为空',
    'No files here': '这里没有文件',
    'This repository is empty': '此仓库为空',
    'Create your first file': '创建你的第一个文件'
  };

  // 1.6 Issues / Pull requests
  const DICT_ISSUE_PR = {
    'New issue': '新建议题',
    'New pull request': '新建拉取请求',
    'Open': '待处理',
    'Closed': '已关闭',
    'Close issue': '关闭议题',
    'Reopen issue': '重新开启议题',
    'Close pull request': '关闭拉取请求',
    'Reopen pull request': '重新开启拉取请求',
    'Labels': '标签',
    'Label': '标签',
    'Milestone': '里程碑',
    'Milestones': '里程碑',
    'Assignee': '指派人',
    'Assignees': '指派人',
    'Assign yourself': '指派给自己',
    'Assign to': '指派给',
    'Author': '作者',
    'Type': '类型',
    'Add labels': '添加标签',
    'Set milestone': '设置里程碑',
    'No label': '无标签',
    'No milestone': '无里程碑',
    'No assignee': '无指派人',
    'Leave a comment': '发表评论',
    'Add a comment': '添加评论',
    'Edit comment': '编辑评论',
    'Delete comment': '删除评论',
    'Add your reaction': '添加你的表情回应',
    'Subscribe': '订阅',
    'Unsubscribe': '取消订阅',
    'Participants': '参与者',
    'Linked issues': '关联议题',
    'Link issues': '关联议题',
    'Reviewers': '审阅者',
    'Reviewer': '审阅者',
    'Review': '审阅',
    'Reviews': '审阅',
    'Review changes': '审阅更改',
    'Add your review': '添加你的审阅意见',
    'Approve': '批准',
    'Approved': '已批准',
    'Request changes': '请求修改',
    'Requested changes': '请求了修改',
    'Ready for review': '标记为待审阅',
    'Convert to draft': '转为草稿',
    'Merge pull request': '合并拉取请求',
    'Confirm merge': '确认合并',
    'Create a merge commit': '创建合并提交',
    'Squash and merge': '压缩并合并',
    'Rebase and merge': '变基并合并',
    'Merge commit': '合并提交',
    'Merge branch': '合并分支',
    'Auto-merge': '自动合并',
    'Files changed': '文件更改',
    'Checks': '检查',
    'Diff': '差异',
    'Unified': '统一视图',
    'Split': '分栏视图',
    'Rich diff': '富文本差异',
    'Hide whitespace changes': '忽略空白字符改动',
    'Whitespace': '空白字符',
    'Resolve conversation': '标记为已解决',
    'Unresolve conversation': '标记为未解决',
    'Resolved': '已解决',
    'base': '基准分支',
    'head': '来源分支',
    'base repository': '基准仓库',
    'head repository': '来源仓库',
    'Add a suggestion': '添加建议',
    'Compare changes': '对比更改',
    'Able to merge': '可以合并',
    'Merge conflict': '合并冲突',
    'This branch has conflicts': '此分支存在冲突',
    'Draft pull request': '草稿拉取请求',
    'Open pull request': '开启中的拉取请求',
    'Create pull request': '创建拉取请求',
    'Create issue': '创建议题',
    'Create repository': '创建仓库',
    'Compare & pull request': '对比并创建拉取请求',
    'Open a pull request': '开启拉取请求',
    'Submit new issue': '提交新议题',
    'Submit pull request': '提交拉取请求',
    'Contribute to': '贡献到',
    'View code': '查看代码',
    'Add a title': '添加标题',
    'Add a description': '添加描述',
    'Write a comment': '撰写评论',
    'Filter by': '按…筛选',
    'No one assigned': '未指派任何人',
    'All checks have passed': '所有检查均已通过',
    'Some checks were not successful': '部分检查未通过',
    'Merging can be performed automatically.': '可以自动合并。',
    'This branch has conflicts that must be resolved': '此分支存在必须解决的冲突',
    'No commits yet': '尚无提交',
    'Styling with Markdown is supported': '支持 Markdown 语法',
    'Attach files by dragging & dropping, selecting or pasting them.': '通过拖拽、选择或粘贴来附加文件。',
    'Jump to bottom': '跳到底部',
    'Bottom': '底部',
    'Top': '顶部',
    'Now': '现在'
  };

  // 1.7 Actions / 工作流
  const DICT_ACTIONS = {
    'All workflows': '全部工作流',
    'Workflows': '工作流',
    'Workflow': '工作流',
    'Run workflow': '运行工作流',
    'Re-run': '重新运行',
    'Re-run all jobs': '重新运行所有作业',
    'Re-run failed jobs': '重新运行失败的作业',
    'Jobs': '作业',
    'Job': '作业',
    'Annotations': '批注',
    'Artifacts': '产物',
    'Logs': '日志',
    'Duration': '耗时',
    'Success': '成功',
    'Failure': '失败',
    'Cancelled': '已取消',
    'Skipped': '已跳过',
    'In progress': '进行中',
    'Queued': '排队中',
    'Conclusion': '结论',
    'Event': '事件',
    'Branch': '分支',
    'Actor': '触发者',
    'Workflow file': '工作流文件',
    'Download log archive': '下载日志归档'
  };

  // 1.8 设置页
  const DICT_SETTINGS = {
    'General': '常规',
    'Access': '访问权限',
    'Collaborators': '协作者',
    'Collaborator': '协作者',
    'Webhooks': '网络钩子',
    'Billing': '账单',
    'Integrations': '集成',
    'Applications': '应用',
    'Developer settings': '开发者设置',
    'Developer': '开发者',
    'Personal access tokens': '个人访问令牌',
    'Tokens (classic)': '令牌（经典）',
    'Fine-grained tokens': '细粒度令牌',
    'Secrets and variables': '密钥与变量',
    'Secrets': '密钥',
    'Variables': '变量',
    'Pages': '页面',
    'Danger Zone': '危险区域',
    'Change repository visibility': '更改仓库可见性',
    'Change visibility': '更改可见性',
    'Delete this repository': '删除此仓库',
    'Transfer ownership': '转移所有权',
    'Archive this repository': '归档此仓库',
    'Features': '功能',
    'Preserve this repository': '保留此仓库',
    'Default branch': '默认分支',
    'Generate new token': '生成新令牌',
    'Generate token': '生成令牌',
    'Regenerate token': '重新生成令牌',
    'Delete token': '删除令牌',
    'Expiration': '有效期',
    'Scopes': '权限范围',
    'Repository permissions': '仓库权限',
    'Account permissions': '账号权限',
    'Add a webhook': '添加网络钩子',
    'Payload URL': 'Payload URL',
    'Content type': '内容类型',
    'Secret': '密钥',
    'SSL verification': 'SSL 校验',
    'Which events would you like to trigger this webhook?': '你希望哪些事件触发此网络钩子？',
    'Notifications': '通知',
    'Emails': '电子邮件',
    'SSH and GPG keys': 'SSH 与 GPG 密钥',
    'New SSH key': '新增 SSH 密钥',
    'New GPG key': '新增 GPG 密钥',
    'Key': '密钥',
    'Title': '标题',
    'Add new key': '添加新密钥',
    'Moderation': '内容管理',
    'Saved replies': '快捷回复',
    'Blocked': '已屏蔽'
  };

  // 1.9 探索 / 搜索 / 通知
  const DICT_EXPLORE = {
    'Trending': '趋势榜',
    'Trending repositories': '趋势仓库',
    'Trending developers': '趋势开发者',
    'Collections': '合集',
    'Events': '活动',
    'Spoken language': '使用语言',
    'Date range': '时间范围',
    'Advanced search': '高级搜索',
    'Search issues and pull requests': '搜索议题和拉取请求',
    'in:this repository': '在本仓库内',
    'Participating': '我参与的',
    'No notifications': '暂无通知',
    "You're all caught up": '你已读完所有通知',
    'Unsubscribe from all': '全部取消订阅',
    'Created by': '创建者',
    'Written by': '作者为',
    'Sort options': '排序选项',
    'Search syntax tips': '搜索语法提示',
    'Sign up for GitHub': '注册 GitHub 账号'
  };

  // 1.10 Gist
  const DICT_GIST = {
    'All gists': '全部代码片段',
    'Secret gist': '私密代码片段',
    'Public gist': '公开代码片段',
    'Create secret gist': '创建私密代码片段',
    'Create public gist': '创建公开代码片段',
    'Revisions': '修订版本',
    'Revision': '修订版本',
    'Forks': '派生',
    'Embed this gist': '嵌入此代码片段',
    'Clone this repository': '克隆此仓库',
    'Filename including extension': '含扩展名的文件名',
    'Add file to gist': '向代码片段添加文件'
  };

  const DICT = Object.assign(
    {},
    DICT_COMMON,
    DICT_NAV,
    DICT_PROFILE,
    DICT_REPO,
    DICT_CODE,
    DICT_ISSUE_PR,
    DICT_ACTIONS,
    DICT_SETTINGS,
    DICT_EXPLORE,
    DICT_GIST
  );

  /* =========================================================================
   * 2. 正则规则：处理带数字 / 日期 / 单复数变化的文案
   *    每条为 [正则, 替换值或函数]
   * ========================================================================= */

  const MONTHS = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
    Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
  };
  const UNITS = {
    second: '秒', minute: '分钟', hour: '小时',
    day: '天', week: '周', month: '个月', year: '年'
  };

  const PATTERNS = [
    // 计数 + 名词（含单复数）
    [/\b(\d[\d,]*)\s+commits?\b/gi, '$1 次提交'],
    [/\b(\d[\d,]*)\s+branches?\b/gi, '$1 个分支'],
    [/\b(\d[\d,]*)\s+tags?\b/gi, '$1 个标签'],
    [/\b(\d[\d,]*)\s+contributors?\b/gi, '$1 位贡献者'],
    [/\b(\d[\d,]*)\s+issues?\b/gi, '$1 个议题'],
    [/\b(\d[\d,]*)\s+pull requests?\b/gi, '$1 个拉取请求'],
    [/\b(\d[\d,]*)\s+releases?\b/gi, '$1 个发布'],
    [/\b(\d[\d,]*)\s+stars?\b/gi, '$1 个星标'],
    [/\b(\d[\d,]*)\s+forks?\b/gi, '$1 个派生'],
    [/\b(\d[\d,]*)\s+watchers?\b/gi, '$1 人关注'],
    [/\b(\d[\d,]*)\s+followers?\b/gi, '$1 位关注者'],
    [/\b(\d[\d,]*)\s+comments?\b/gi, '$1 条评论'],
    [/\b(\d[\d,]*)\s+repositories\b/gi, '$1 个仓库'],
    [/\b(\d[\d,]*)\s+repositor(?:y|ies)\b/gi, '$1 个仓库'],
    [/\b(\d[\d,]*)\s+files? changed\b/gi, '$1 个文件已更改'],
    [/\b(\d[\d,]*)\s+changes?\b/gi, '$1 处更改'],
    [/\b(\d[\d,]*)\s+Open\b/g, '$1 个待处理'],
    [/\b(\d[\d,]*)\s+Closed\b/g, '$1 个已关闭'],
    [/\b(\d[\d,]*)\s+deployments?\b/gi, '$1 次部署'],
    [/\b(\d[\d,]*)\s+environments?\b/gi, '$1 个环境'],

    // 相对时间
    [/\b(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago\b/gi,
      (m, n, unit) => `${n} ${UNITS[unit.toLowerCase()]}前`],
    [/\b(?:an|a)\s+(hour|day|week|month|year)\s+ago\b/gi,
      (m, unit) => `1 ${UNITS[unit.toLowerCase()]}前`],
    [/\bjust now\b/gi, '刚刚'],
    [/\bin\s+(\d+)\s+(second|minute|hour|day|week|month|year)s?\b/gi,
      (m, n, unit) => `${n} ${UNITS[unit.toLowerCase()]}后`],
    [/\blast\s+(week|month|year)\b/gi,
      (m, unit) => `上${UNITS[unit.toLowerCase()] === '个月' ? '个月' : UNITS[unit.toLowerCase()]}`],
    [/\bnext\s+(week|month|year)\b/gi,
      (m, unit) => `下${UNITS[unit.toLowerCase()] === '个月' ? '个月' : UNITS[unit.toLowerCase()]}`],

    // 日期：Jul 5, 2024 / on Jul 5, 2024
    [/\b(?:(on|at)\s+)?(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})\b/g,
      (m, pre, mon, day, year) => `${pre ? '于 ' : ''}${year} 年 ${MONTHS[mon]} 月 ${day} 日`],

    // 其他常见短语
    [/\bSigned in as\b/g, '已登录为'],
    [/\bPage\s+(\d+)\s+of\s+(\d+)\b/gi, '第 $1 / $2 页'],
    [/\bAdd(?:ed)?\s+by\b/gi, '添加者'],
    [/\bOpened\s+by\b/gi, '创建者'],
    [/\bCreated\s+by\b/gi, '创建者'],
    [/\bCommited?\s+by\b/gi, '提交者']
  ];

  /* =========================================================================
   * 3. 翻译引擎
   * ========================================================================= */

  const TRANSLATE_ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];

  // 文本节点：整块跳过（含输入框内容、代码、用户生成内容）
  const SKIP_SELECTOR = [
    'script', 'style', 'noscript', 'template', 'svg', 'math',
    'textarea', 'input', 'select', 'option', 'button[data-clipboard-text]',
    'code', 'pre', 'kbd', 'samp', 'var', 'tt',
    '[translate="no"]', '[contenteditable=""]', '[contenteditable="true"]',
    '.markdown-body', '.comment-body', '.js-comment-body',
    '.blob-code', '.blob-code-inner', '.file-content', '.highlight',
    '[data-testid="comment-body"]'
  ].join(',');

  // 属性（placeholder / aria-label / title）：输入框本身要放行，否则搜不到框的提示文案
  const ATTR_SKIP_SELECTOR = [
    'script', 'style', 'noscript', 'template', 'svg', 'math',
    'code', 'pre', 'kbd', 'samp', 'var', 'tt',
    '[translate="no"]',
    '.markdown-body', '.comment-body', '.js-comment-body',
    '.blob-code', '.blob-code-inner', '.file-content', '.highlight',
    '[data-testid="comment-body"]'
  ].join(',');

  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // 精确匹配索引：先原文，再小写（不敏感）
  const EXACT = new Map();
  const EXACT_LOWER = new Map();
  Object.keys(DICT).forEach((key) => {
    const value = DICT[key];
    if (!EXACT.has(key)) EXACT.set(key, value);
    const lower = key.toLowerCase();
    if (!EXACT_LOWER.has(lower)) EXACT_LOWER.set(lower, value);
  });

  // 短语替换用的大正则：长词优先，边界按首尾字符是否单词字符决定
  const PHRASE_RE = new RegExp(
    Object.keys(DICT)
      .sort((a, b) => b.length - a.length)
      .map((key) => {
        const body = escapeRegExp(key);
        const left = /^[A-Za-z0-9]/.test(key) ? '\\b' : '';
        const right = /[A-Za-z0-9]$/.test(key) ? '\\b' : '';
        return left + body + right;
      })
      .join('|'),
    'g'
  );

  function applyPatterns(text) {
    let out = text;
    for (let i = 0; i < PATTERNS.length; i++) {
      const [re, rep] = PATTERNS[i];
      re.lastIndex = 0;
      if (typeof rep === 'function') {
        out = out.replace(re, rep);
      } else {
        out = out.replace(re, rep);
      }
    }
    return out;
  }

  function translateString(text) {
    if (!text || !text.trim()) return text;

    const trimmed = text.trim();

    // 1) 整段精确命中（大小写不敏感）
    let hit = EXACT.get(trimmed);
    if (hit == null) hit = EXACT_LOWER.get(trimmed.toLowerCase());
    if (hit != null) {
      const lead = /^\s*/.exec(text)[0];
      const tail = /\s*$/.exec(text)[0];
      return lead + hit + tail;
    }

    // 2) 正则规则（数字、日期等）先跑，避免 "12 Open" 被短语替换抢先成 "12 待处理"
    let out = applyPatterns(text);

    // 3) 长句内的短语替换（大小写敏感，避免误伤用户内容）
    if (out.length <= 400) {
      PHRASE_RE.lastIndex = 0;
      out = out.replace(PHRASE_RE, (m) => {
        const v = DICT[m];
        return v == null ? m : v;
      });
    }

    return out;
  }

  /* =========================================================================
   * 4. DOM 扫描与记录
   * ========================================================================= */

  const textRecords = [];   // 用于「暂停翻译」后恢复原文
  const attrRecords = [];
  const seenText = new WeakSet();
  const seenAttr = new WeakMap();

  function shouldSkip(el, forAttr) {
    if (!el || el.nodeType !== 1) return true;
    const selector = forAttr ? ATTR_SKIP_SELECTOR : SKIP_SELECTOR;
    if (el.matches(selector)) return true;
    if (el.closest(selector)) return true;
    return false;
  }

  function recordText(node, original) {
    if (!seenText.has(node)) {
      seenText.add(node);
      textRecords.push({ node: node, value: original });
    }
  }

  function recordAttr(el, name, original) {
    let bag = seenAttr.get(el);
    if (!bag) {
      bag = new Set();
      seenAttr.set(el, bag);
    }
    if (!bag.has(name)) {
      bag.add(name);
      attrRecords.push({ el: el, name: name, value: original });
    }
  }

  function collectTextNodes(root, out) {
    if (root.nodeType === 3) {
      out.push(root);
      return out;
    }
    if (root.nodeType !== 1 || shouldSkip(root)) return out;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.nodeValue || !node.nodeValue.trim()) continue;
      const parent = node.parentElement;
      if (!parent || shouldSkip(parent)) continue;
      out.push(node);
    }
    return out;
  }

  function translateRoot(root, deep) {
    if (!root) return;

    // 文本节点
    const nodes = [];
    collectTextNodes(root, nodes);
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const old = node.nodeValue;
      const now = translateString(old);
      if (now !== old) {
        recordText(node, old);
        node.nodeValue = now;
      }
    }

    // 元素属性
    let elements;
    if (root.nodeType === 1) {
      elements = deep === false ? [root] : [root].concat(Array.prototype.slice.call(root.querySelectorAll('*')));
    } else if (root.nodeType === 11 || root.nodeType === 9) {
      elements = Array.prototype.slice.call(root.querySelectorAll('*'));
    } else {
      elements = [];
    }

    for (let j = 0; j < elements.length; j++) {
      const el = elements[j];
      if (shouldSkip(el, true)) continue;
      for (let k = 0; k < TRANSLATE_ATTRS.length; k++) {
        const name = TRANSLATE_ATTRS[k];
        if (!el.hasAttribute(name)) continue;
        const old = el.getAttribute(name);
        if (!old || !old.trim()) continue;
        const now = translateString(old);
        if (now !== old) {
          recordAttr(el, name, old);
          el.setAttribute(name, now);
        }
      }
      // <input type="submit" value="..."> 上的可见文案
      if (el.tagName === 'INPUT') {
        const type = (el.getAttribute('type') || '').toLowerCase();
        if (type === 'submit' || type === 'button' || type === 'reset') {
          const old = el.getAttribute('value');
          if (old && old.trim()) {
            const now = translateString(old);
            if (now !== old) {
              recordAttr(el, 'value', old);
              el.setAttribute('value', now);
            }
          }
        }
      }
    }
  }

  // GitHub 的 <relative-time> 把时间文本放在 Shadow DOM 里
  const shadowWatched = new WeakSet();
  function translateRelativeTimes() {
    const hosts = document.querySelectorAll('relative-time');
    for (let i = 0; i < hosts.length; i++) {
      const host = hosts[i];
      if (!host.shadowRoot) continue;
      if (!shadowWatched.has(host)) {
        shadowWatched.add(host);
        const mo = new MutationObserver(() => translateRoot(host.shadowRoot));
        mo.observe(host.shadowRoot, { childList: true, subtree: true, characterData: true });
      }
      translateRoot(host.shadowRoot);
    }
  }

  function restoreAll() {
    for (let i = textRecords.length - 1; i >= 0; i--) {
      const r = textRecords[i];
      r.node.nodeValue = r.value;
    }
    for (let i = attrRecords.length - 1; i >= 0; i--) {
      const r = attrRecords[i];
      r.el.setAttribute(r.name, r.value);
    }
    textRecords.length = 0;
    attrRecords.length = 0;
  }

  /* =========================================================================
   * 5. 调度：首次全量 + MutationObserver 增量 + SPA 导航
   * ========================================================================= */

  let pendingRoots = [];
  let scheduled = false;

  function schedule(root) {
    if (root) pendingRoots.push(root);
    if (scheduled) return;
    scheduled = true;
    setTimeout(flush, 60);
  }

  function flush() {
    scheduled = false;
    const roots = pendingRoots;
    pendingRoots = [];
    for (let i = 0; i < roots.length; i++) {
      const root = roots[i];
      if (root.nodeType === 3) {
        if (!root.isConnected) continue;
      } else if (root.nodeType === 1 && !root.isConnected) {
        continue;
      }
      try {
        translateRoot(root);
      } catch (e) {
        /* 单个节点出错不影响整体 */
      }
    }
    translateRelativeTimes();
  }

  function runFull() {
    translateRoot(document.body);
    translateRelativeTimes();
  }

  function startObserver() {
    const observer = new MutationObserver((mutations) => {
      for (let i = 0; i < mutations.length; i++) {
        const m = mutations[i];
        if (m.type === 'childList') {
          for (let j = 0; j < m.addedNodes.length; j++) {
            const n = m.addedNodes[j];
            if (n.nodeType === 1 || n.nodeType === 3) schedule(n);
          }
        } else if (m.type === 'characterData') {
          if (m.target && m.target.nodeType === 3) schedule(m.target);
        } else if (m.type === 'attributes') {
          const el = m.target;
          if (el && el.nodeType === 1) {
            // 只在新增/修改的属性是英文时才处理，翻译后不会再命中，不会循环
            for (let k = 0; k < TRANSLATE_ATTRS.length; k++) {
              if (el.hasAttribute(TRANSLATE_ATTRS[k])) {
                schedule(el);
                break;
              }
            }
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: TRANSLATE_ATTRS
    });
  }

  /* =========================================================================
   * 6. 入口与菜单
   * ========================================================================= */

  const STORE_KEY = 'ghzh_enabled';

  const store = {
    get: function (key, def) {
      try { return GM_getValue(key, def); } catch (e) { return def; }
    },
    set: function (key, val) {
      try { GM_setValue(key, val); } catch (e) { /* ignore */ }
    }
  };

  function menu(label, fn) {
    try { GM_registerMenuCommand(label, fn); } catch (e) { /* ignore */ }
  }

  function boot() {
    if (store.get(STORE_KEY, true) === false) {
      menu('▶ 开启 GitHub 中文化', () => {
        store.set(STORE_KEY, true);
        location.reload();
      });
      return;
    }

    menu('⏸ 暂停翻译（刷新生效）', () => {
      store.set(STORE_KEY, false);
      location.reload();
    });
    menu('🔄 立即重新翻译', () => {
      restoreAll();
      runFull();
    });

    runFull();
    startObserver();

    // GitHub 使用 Turbo / pjax 做局部导航，页面切换后再兜底扫一遍
    ['turbo:load', 'turbo:render', 'pjax:end', 'popstate'].forEach((evt) => {
      window.addEventListener(evt, () => setTimeout(runFull, 60), true);
    });
    window.addEventListener('load', () => setTimeout(runFull, 200), { once: true });
  }

  if (document.body) {
    boot();
  } else {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  }
})();
