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

## 如果你要建一个新项目

1. 把这份代码复制一份，改改内容
2. 在 GitHub 新建仓库
3. 推送到新仓库
4. **Settings → Pages → Source 选 `gh-pages` → Save**
5. 等 Actions 跑完，手机就能装了

---

## 数据说明

- 数据存在手机浏览器的 IndexedDB（纯本地，不上传）
- 卸载 PWA 会清数据
- 不支持多设备同步
