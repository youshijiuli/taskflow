# TaskFlow 部署 SOP —— 从代码到手机

## 前提：只需要做一次

以下两件事你**已经做过了**，换新项目才需要重复：

| 步骤 | 操作 | 位置 |
|------|------|------|
| ① 创建部署脚本 | 项目里放 `.github/workflows/deploy.yml` | 已配好，不用动 |
| ② 开启 GitHub Pages | Settings → Pages → Source 选 `gh-pages` 分支 → Save | 已配好，不用动 |

---

## 日常流程：每次改代码后

```
改代码 → git push → 等 2 分钟 → 手机刷新
```

具体命令：

```bash
git add -A
git commit -m "改了什么"
git push origin master
```

推送后 GitHub 自动构建部署，去这里看进度：

```
https://github.com/youshijiuli/taskflow/actions
```

黄色=构建中，绿色=部署完成。

---

## 手机安装（只需第一次）

### Android（OPPO / 小米 / 华为等）

1. 装 **Chrome**（自带浏览器不行）
2. Chrome 打开 `https://youshijiuli.github.io/taskflow/`
3. 弹窗「添加到主屏幕」→ 点**安装**
4. 没弹窗的话：点右上角 **⋮** → **安装应用**

### iPhone

1. **Safari** 打开 `https://youshijiuli.github.io/taskflow/`
2. 底部**分享按钮**（方框箭头↑）
3. **添加到主屏幕** → 点「添加」

---

## 新项目从零到手机（完整流程）

### 第一步：电脑上创建项目

```bash
# 1. 创建 Vite 项目（选 react-ts 模板）
npm create vite@latest my-app -- --template react-ts
cd my-app

# 2. 安装必备依赖
npm install
npm install dexie zustand react-router-dom recharts vite-plugin-pwa tailwindcss @tailwindcss/vite

# 3. 启动开发服务器，边写边预览
npm run dev
# → http://localhost:5173
```

### 第二步：写代码

> 这部分根据你的需求开发。核心文件：
> - `src/App.tsx` — 路由
> - `src/pages/` — 页面
> - `src/components/` — 组件

### 第三步：配好这 3 个文件（决定能否装到手机）

**① `vite.config.ts`** — 加 PWA 插件 + base 路径：

```ts
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/你的仓库名/',       // ⚠️ 改成你自己的
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '你的应用名',
        short_name: '应用名',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/你的仓库名/',   // ⚠️ 改这里
        icons: [{ src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
      },
    }),
  ],
});
```

**② `src/main.tsx`** — 用 HashRouter（不用 BrowserRouter）：

```tsx
import { HashRouter } from 'react-router-dom';
// ...
<HashRouter>
  <App />
</HashRouter>
```

**③ `.github/workflows/deploy.yml`** — 自动部署脚本：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]

permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 第四步：推送到 GitHub

```bash
# 1. 在 GitHub 网页上新建一个空仓库（不要勾选 README）
#    → 得到地址 https://github.com/你的用户名/仓库名

# 2. 推送代码
git init
git add -A
git commit -m "first commit"
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin master
```

### 第五步：开启 GitHub Pages

1. 打开 `https://github.com/你的用户名/仓库名/settings/pages`
2. Source → **Deploy from a branch**
3. Branch → 选 **`gh-pages`**，目录 `/ (root)` → **Save**
4. 打开 `https://github.com/你的用户名/仓库名/actions` 看构建进度
5. 绿色 ✓ 后，访问 `https://你的用户名.github.io/仓库名/`

### 第六步：手机安装

- **Android**：装 Chrome → 打开网址 → 弹窗安装
- **iPhone**：Safari → 分享按钮 → 添加到主屏幕

### 以后每次改代码

```bash
git add -A
git commit -m "描述修改"
git push origin master
# → 等 2 分钟 → 手机刷新
```

---

## 数据说明

- 数据存在手机浏览器的 IndexedDB（纯本地，不上传）
- 卸载 PWA 会清数据
- 不支持多设备同步
