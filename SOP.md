# TaskFlow - 从开发到手机安装完整 SOP

## 前置条件

| 需要什么 | 说明 |
|---------|------|
| 一台电脑（Windows/Mac 均可） | 用于写代码和构建 |
| Node.js（v18 以上） | JavaScript 运行环境 |
| Git | 版本管理工具 |
| GitHub 账号 | 托管代码 + 自动部署 |
| 手机（Android/iOS） | Android 需装 Chrome，iOS 用 Safari |

## 一、项目技术概览

```
TaskFlow（PWA 任务管理应用）
├── 前端框架：React 19 + TypeScript
├── 样式：Tailwind CSS 4
├── 本地数据库：Dexie.js（IndexedDB 封装）
├── 状态管理：Zustand
├── 图表：Recharts
├── 构建工具：Vite 8
├── PWA 支持：vite-plugin-pwa（Service Worker + 离线缓存）
└── 路由：React Router v7（Hash 模式，兼容 GitHub Pages）
```

## 二、项目文件结构

```
taskflow/
├── index.html              # 入口 HTML
├── package.json            # 依赖配置
├── vite.config.ts          # Vite + PWA 配置
├── tsconfig.json           # TypeScript 配置
├── vercel.json             # Vercel 部署配置（备用）
├── .github/workflows/
│   └── deploy.yml          # GitHub Actions 自动部署脚本
├── public/
│   ├── favicon.svg         # 应用图标
│   └── manifest.json       # PWA 清单
└── src/
    ├── main.tsx            # React 入口
    ├── App.tsx             # 路由定义
    ├── index.css           # 全局样式 + Tailwind
    ├── types/index.ts      # TypeScript 类型定义
    ├── db/database.ts      # IndexedDB 数据库（Dexie）
    ├── store/
    │   ├── taskStore.ts    # 任务状态管理（Zustand）
    │   └── projectStore.ts # 项目状态管理（Zustand）
    ├── pages/
    │   ├── Dashboard.tsx   # 统计大屏（概览卡片/热力图/图表）
    │   ├── Tasks.tsx       # 任务列表 + 看板视图
    │   ├── TaskForm.tsx    # 新建/编辑任务表单
    │   ├── TaskDetail.tsx  # 任务详情页
    │   └── Projects.tsx    # 项目管理页
    ├── components/
    │   ├── Layout.tsx      # 底部导航 + 布局外壳
    │   ├── TaskCard.tsx    # 任务卡片
    │   ├── KanbanBoard.tsx # 看板视图
    │   ├── Heatmap.tsx     # GitHub 风格热力图
    │   ├── StatCard.tsx    # 统计卡片
    │   ├── PriorityBadge.tsx # 优先级标签
    │   └── InstallPrompt.tsx # PWA 安装提示
    ├── hooks/
    │   └── useNotification.ts # 通知 Hook
    └── utils/
        └── date.ts         # 日期工具函数
```

## 三、环境搭建（首次）

```bash
# 1. 克隆项目到本地
git clone https://github.com/youshijiuli/taskflow.git
cd taskflow

# 2. 安装依赖
npm install

# 3. 启动开发服务器（电脑上预览）
npm run dev
# 浏览器打开 http://localhost:5173
```

## 四、日常开发流程

```bash
# 1. 修改代码（用 VS Code 打开项目目录）
code .

# 2. 开发服务器会自动热更新，保存即刷新

# 3. 确认无误后，本地构建验证
npm run build

# 4. 提交代码
git add -A
git commit -m "描述你改了什么"
git push origin master
```

> 推送后 GitHub Actions 自动构建并部署，无需手动操作。

## 五、部署到手机（自动流程）

### 5.1 GitHub Pages 自动部署（推荐，国内可访问）

项目已配置好 GitHub Actions，每次 `git push` 到 master 分支会自动：

1. 检出代码
2. 安装依赖（`npm install`）
3. 构建项目（`npm run build`）
4. 将 `dist/` 目录推送到 `gh-pages` 分支
5. GitHub Pages 自动更新

**手机访问地址：** `https://youshijiuli.github.io/taskflow/`

### 5.2 Vercel 部署（备用，国内可能无法访问）

```bash
# 一键部署
npx vercel --prod

# Vercel 也会自动绑定 GitHub，每次推送自动部署
```

## 六、手机安装 PWA 步骤

### Android 手机（OPPO/小米/华为/vivo 等）

1. 安装 **Chrome 浏览器**（自带浏览器不支持 PWA）
2. 打开 `https://youshijiuli.github.io/taskflow/`
3. 弹窗提示「添加到主屏幕」→ 点击 **安装**
4. 如无弹窗：点右上角 ⋮ → **安装应用**
5. 桌面出现 TaskFlow 图标，点开即用

### iPhone 手机

1. 用 **Safari** 打开 `https://youshijiuli.github.io/taskflow/`
2. 点底部 **分享按钮**（方框箭头↑）
3. 往下滑找到 **「添加到主屏幕」**
4. 点右上角 **「添加」**
5. 桌面出现 TaskFlow 图标

## 七、数据说明

| 问题 | 答案 |
|------|------|
| 数据存在哪？ | 手机浏览器 IndexedDB（本地存储） |
| 数据会丢吗？ | 卸载 PWA 或清除浏览器数据会丢失 |
| 能多设备同步吗？ | 当前不支持，需要后端服务 |
| 数据安全吗？ | 纯本地，不上传任何服务器 |

## 八、常见问题

### Q: 改完代码推送后手机没更新？
A: 等 1-2 分钟让 GitHub Actions 跑完，然后手机上刷新页面。PWA 的话关闭应用再打开。

### Q: npm run build 报错？
A: 执行 `rm -rf node_modules && npm install` 重新装依赖。

### Q: GitHub Actions 运行失败？
A: 去 `https://github.com/youshijiuli/taskflow/actions` 点进失败的运行看日志。

### Q: 想改应用名称/图标？
A: 修改 `vite.config.ts` 中的 `manifest.name` 和 `public/favicon.svg`。

### Q: 如何增加新功能？
A: 在 `src/pages/` 下添加新页面，在 `src/App.tsx` 中注册路由即可。

## 九、完整流程速查

```
写代码 → npm run build（验证）→ git push → 自动部署 → 手机 Chrome 打开 → 安装到桌面
```

> 从修改代码到手机更新，整套流程不超过 3 分钟。
