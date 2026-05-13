# 从零到手机安装 —— 完整操作手册

---

## 整体流程图

```
空文件夹 → 创建项目 → Vibe Coding 写代码 → 配 3 个文件 → 推送 GitHub → 开启 Pages → 手机安装
```

下面每一步都给出具体命令和文件内容，直接复制粘贴即可。

---

## 第 1 步：创建项目（电脑上，2 分钟）

```bash
# 在空文件夹里创建 Vite 项目
npm create vite@latest . -- --template react-ts

# 安装依赖
npm install

# 安装额外依赖
npm install dexie zustand react-router-dom recharts vite-plugin-pwa tailwindcss @tailwindcss/vite
```

验证：
```bash
npm run dev
# 浏览器打开 http://localhost:5173 能看到页面就对了
```

---

## 第 2 步：Vibe Coding 写代码

> 这一块你跟 AI 对话完成，写页面、组件、逻辑。不是本文重点，跳过。

---

## 第 3 步：配置 3 个关键文件

代码写完后，这 3 个文件决定了 APP 能不能装到手机上。**每个文件的内容都给你写好了，复制粘贴后改一下名字即可。**

---

### 文件 ①：`vite.config.ts`

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/你的仓库名/',    // ⚠️ 改这里！例如 '/my-app/'
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '你的应用全名',
        short_name: '应用简称',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/你的仓库名/',   // ⚠️ 改这里，跟 base 一样
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});
```

**需要改的地方（2 处）：**
- `base: '/你的仓库名/'` → 改成你 GitHub 仓库的名字
- `start_url: '/你的仓库名/'` → 同上

---

### 文件 ②：`src/main.tsx`

> GitHub Pages 不支持正常的前端路由，必须用 HashRouter。

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';   // ← 注意是 HashRouter
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>           // ← 这里
      <App />
    </HashRouter>          // ← 这里
  </StrictMode>
);
```

**关键：** 三处都是 `HashRouter`，不是 `BrowserRouter`。

---

### 文件 ③：`.github/workflows/deploy.yml`

> 这个文件让 GitHub 在每次你推送代码时，自动帮你构建并部署。

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

**不需要改任何东西**，直接复制粘贴。

---

## 第 4 步：本地验证

```bash
npm run build
```

没报错就说明配置正确，可以推送了。

---

## 第 5 步：创建 GitHub 仓库并推送

```
1. 浏览器打开 https://github.com/new
2. Repository name 填你的仓库名（例如 my-app）
3. ⚠️ 不要勾选 "Add a README file"
4. 点 "Create repository"
5. 看到 "Quick setup" 页面时，复制那三条命令：

   git init
   git add -A
   git commit -m "first commit"
   git remote add origin https://github.com/你的用户名/仓库名.git
   git push -u origin master
```

注意：上面的 git 命令在**项目文件夹里**执行。

---

## 第 6 步：开启 GitHub Pages

```
1. 打开 https://github.com/你的用户名/仓库名/actions
   → 等黄色圆点变成绿色 ✓（约 2 分钟）

2. 打开 https://github.com/你的用户名/仓库名/settings/pages
   → Source 选 "Deploy from a branch"
   → Branch 选 "gh-pages"、目录选 "/ (root)"
   → 点 Save
```

---

## 第 7 步：手机安装

访问地址：`https://你的用户名.github.io/仓库名/`

### Android（OPPO / 小米 / 华为等）

1. 装 **Chrome 浏览器**
2. Chrome 打开上面的网址
3. 弹窗「添加到主屏幕」→ 点**安装**
4. 没弹窗：点右上角 **⋮** → **安装应用**

### iPhone

1. **Safari** 打开上面的网址
2. 底部**分享按钮**（方框箭头↑）
3. **添加到主屏幕** → 点「添加」

---

## 以后每次改代码

```bash
git add -A
git commit -m "改了什么"
git push origin master

# 等 2 分钟，手机刷新即可
```

---

## 速查表

| 环节 | 做什么 | 几分钟 |
|------|--------|--------|
| 创建项目 | `npm create vite` + `npm install` | 2 |
| 写代码 | Vibe Coding 跟 AI 对话 | 看需求 |
| 配 3 个文件 | vite.config.ts / main.tsx / deploy.yml | 1 |
| 推送 | GitHub 建仓库 → `git push` | 2 |
| 开启 Pages | Settings → 选 gh-pages 分支 | 1 |
| 手机装 | Chrome 打开网址 → 安装 | 1 |
