# 👋 Hi, I'm ShiYanG Yu (洋芋) — @techysy

> 🎞️ I use film, record my life and my friends 😼
> 📍 Chengdu, China · 🏔️ Cycling & Hiking · 💻 fnOS / NAS / AI Agent

---

## 🚀 核心项目 / Featured Projects

### 🐋 DeepSeek Harness (dsh)

> [**DeepSeek Harness fnOS)**](https://github.com/techysy/deepseek-harness-fnos) — DeepSeek官方 Agent 浏览器 UI 的 fnOS 应用
>
> 本地常驻服务 · DeepSeek 官方 Agent 浏览器界面 · 插件化设计 · 局域网 + FN Connect 远程访问
>
> [![fnOS 版本](https://img.shields.io/github/v/release/techysy/deepseek-harness-fnos?label=fnOS&color=0A5D9C)](https://github.com/techysy/deepseek-harness-fnos/releases)
> [![上游版本](https://img.shields.io/badge/upstream-v0.1.1--rc.2-1E88E5?logo=deepseek&logoColor=white&label=DeepSeek%20Harness)](https://github.com/deepseek-ai/deepseek-harness)
> [![离线打包](https://img.shields.io/badge/offline-免联网-2E7D32)](https://github.com/techysy/deepseek-harness-fnos)
> [![Stars](https://img.shields.io/github/stars/techysy/deepseek-harness-fnos?label=Stars&color=FFD700&logo=github)](https://github.com/techysy/deepseek-harness-fnos)

### 🌐 10Router

> [**10Router**](https://github.com/techysy/10router) — 本地 AI 路由网关 & Dashboard（9Router 精简优化版）
>
> 40+ 上游供应商路由 · 格式翻译 · 模型 Combo / 多账号 fallback · OAuth / API-key 凭据管理 · Token 刷新 · 配额用量追踪 · 可选云端同步
>
> [![Release](https://img.shields.io/github/v/release/techysy/10router?label=Release&color=2463eb)](https://github.com/techysy/10router/releases)
> [![npm](https://img.shields.io/npm/v/@techysy/10router?label=npm&color=CB3837&logo=npm&logoColor=white)](https://www.npmjs.com/package/@techysy/10router)
> [![Docker](https://img.shields.io/badge/Docker-ghcr.io%2Ftechysy%2F10router-2496ED?logo=docker&logoColor=white)](https://github.com/techysy/10router/pkgs/container/10router)
> [![Stars](https://img.shields.io/github/stars/techysy/10router?label=Stars&color=FFD700&logo=github)](https://github.com/techysy/10router)

### 🖥️ fnOS 应用（飞牛 NAS）

| 项目 | 版本 | 说明 |
|------|------|------|
| [**Hermes Agent**](https://github.com/techysy/hermes-dashboard-fnos) | ![Release](https://img.shields.io/github/v/release/techysy/hermes-dashboard-fnos) | Hermes 控制台快捷入口 · 可配置目标仪表盘 |
| [**Hugo Blog**](https://github.com/techysy/hugo-blog-fnos) | ![Release](https://img.shields.io/github/v/release/techysy/hugo-blog-fnos) | Hugo 静态博客 · 常驻渲染 · 管理面板 |
| [**Mihomo Core**](https://github.com/techysy/mihomo-core-fnos) | ![Release](https://img.shields.io/github/v/release/techysy/mihomo-core-fnos) | Mihomo 内核 fnOS 应用 |
| [**MetaCubeXD**](https://github.com/techysy/metacubexd-fnos) | ![Release](https://img.shields.io/github/v/release/techysy/metacubexd-fnos) | Mihomo Dashboard |
| [**Strava Panel**](https://github.com/techysy/strava-panel-fnos) | ![Release](https://img.shields.io/github/v/release/techysy/strava-panel-fnos) | 骑行数据面板 · 凭据 + Token 刷新 + 统计 |

### 📢 飞书消息卡片

| 项目 | 版本 | 说明 |
|------|------|------|
| [**hermes-fry-cards**](https://github.com/techysy/hermes-fry-cards) | ![Release](https://img.shields.io/github/v/release/techysy/hermes-fry-cards) | 🍟 Hermes **卡片渲染层** — 流式卡片插件，正在使用中 |
| [**claw-fry-cards**](https://github.com/techysy/claw-fry-cards) | ![Release](https://img.shields.io/github/v/release/techysy/claw-fry-cards) | 🍤 OpenClaw **伴侣插件** — 钩子观测自建卡片，通道仍用官方 |
| [**claw-lark-cards**](https://github.com/techysy/claw-lark-cards) | ![Release](https://img.shields.io/github/v/release/techysy/claw-lark-cards) | 🌯 OpenClaw **通道插件** — 官方通道 2.0 适配，卡片引擎内置 |
| [**zcode-feishu-bridge**](https://github.com/techysy/zcode-feishu-bridge) | ![Release](https://img.shields.io/github/v/release/techysy/zcode-feishu-bridge) | 🌉 ZCode **单向实况桥** — 只读 rollout 推送进度 |

> 🔖 **claw-fry-cards vs claw-lark-cards**：两者都是 OpenClaw 飞书卡片方案，**二选一，勿同时启用**。
> - `claw-fry-cards` **伴侣插件**：钩子观测对话 + 自建卡片接管回复展示，飞书通道仍由官方插件承担；打字机为完成后分片输出，思考仅解析 `<thinking>` 标签（公开钩子拿不到原生 reasoning）
> - `claw-lark-cards` **通道插件**：官方通道 fork + 2.0 适配，替代官方通道，卡片引擎内置于通道，支持原生 reasoning 流式
> - 新装推荐 `claw-lark-cards`（官方通道已停更于 2026-07，未适配 OpenClaw 2.0）

### 🤖 技能 & 工具

| 项目 | 版本 | 说明 |
|------|------|------|
| [**hermes-skills**](https://github.com/techysy/yangyu-hermes-skills) | ![Release](https://img.shields.io/github/v/release/techysy/yangyu-hermes-skills) | 🐟 Hermes Agent 技能集合（13 个技能：Git 生命周期、飞书、TTS/STT、代理、成本管理等） |
| [**hermes-core-fnos**](https://github.com/techysy/hermes-core-fnos) | ![Release](https://img.shields.io/github/v/release/techysy/hermes-core-fnos) | Hermes Agent 本地内核 fnOS 应用 |
| [**hermes-webui-fnos**](https://github.com/techysy/hermes-webui-fnos) | ![Release](https://img.shields.io/github/v/release/techysy/hermes-webui-fnos) | Hermes WebUI fnOS 封装 |

### 🛠️ 开源工具 & 其他

- [**spot-studio**](https://github.com/techysy/spot-studio) — 🚴🥾 骑行 & 徒步活动发布平台（GPX 渲染 / 海拔 / POI）
- [**inspection-visualizer**](https://github.com/techysy/inspection-visualizer) — OCR 巡检记录管理
- [**navi-bookmarks-chrome**](https://github.com/techysy/navi-bookmarks-chrome) — 运维书签导航
- [**web-jpg-tool**](https://github.com/techysy/web-jpg-tool) — 图片合并工具
- [**techysy.github.io**](https://github.com/techysy/techysy.github.io) — Jekyll 静态博客

---

## 📊 GitHub 统计

![Details](https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=techysy&theme=default)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/stars-top10-dark.svg">
  <img alt="Star Top 10 · 最近 42 天" src="assets/stars-top10.svg">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/commits-top10-dark.svg">
  <img alt="Commit Top 10 · 最近 42 天" src="assets/commits-top10.svg">
</picture>

---

## 🌐 我的博客 / Blog

- 🌐 [shiyangyu.com](https://shiyangyu.com)
- 📝 [techysy.github.io](https://techysy.github.io)
