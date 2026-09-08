# 部署说明（GitHub Pages）

线上只有一个页面：`index.html`。所有文件只有一份，根目录即唯一来源。

## 项目结构

```
index.html               入口页面（唯一部署页面）
arcade.jsx               页面全部 UI（浏览器内 Babel 转译）
games-data.js            游戏数据
uni-layout.js            UNI 段马赛克排版（已固化）
tweaks-panel.jsx         运行时主题面板
img/                     游戏封面（87 张，与数据一一对应）
icon/                    favicon + 联系方式图标
.nojekyll                关闭 Jekyll 处理

uni-layout-editor.html   本地排版编辑工具（不需部署）
DEPLOY.md                本文件
HANDOFF.md               开发交接文档
CLAUDEDESIGN.md          设计说明
github.md                仓库同步记录
archive/                 历史稿：早期方向、探索页、旧静态站、截图（不需部署）
```

## 需要上传的内容

`index.html`、`arcade.jsx`、`games-data.js`、`uni-layout.js`、`tweaks-panel.jsx`、
`img/`、`icon/`、`.nojekyll`。其余都是本地用的。

## Pages 的限制与本项目的对应情况

| 限制 | 状态 |
| --- | --- |
| 仓库 / 站点建议 ≤ 1GB，单文件 ≤ 100MB | 远低于上限（全是小尺寸封面图） |
| 软带宽 100GB/月、每小时 10 次构建 | 个人站不会触及 |
| 纯静态、无服务端 | 全静态，React/Babel 走 CDN，无构建步骤 |
| 路径大小写敏感（Linux 服务器） | 已核对：数据里 87 处图片引用与 `img/` 文件名完全一致 |
| 默认走 Jekyll，忽略 `_`/`.` 开头文件 | 已加 `.nojekyll` 跳过 |
| 外部资源必须 HTTPS | React / ReactDOM / Babel 全部 https + SRI 校验 |
| 浏览器缓存旧文件 | 脚本引用带 `?v=` 版本号，改文件时 +1 |

## 本地测试

不能直接双击打开（`file://` 下 Babel 取不到 `.jsx`）。起本地服务器：

```
python3 -m http.server 8000
```

访问 `http://localhost:8000/`，编辑器在 `http://localhost:8000/uni-layout-editor.html`。

## 改排版

在 `uni-layout-editor.html` 里拖拽调整，Save 即时生效（存浏览器）；
点 Copy code 把数组粘进 `uni-layout.js` 的 `UNI_LAYOUT`，才会对所有访客生效。
固化后把 `index.html` 里 `uni-layout.js?v=` 的版本号 +1。
