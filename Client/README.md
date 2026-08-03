# GreenFarm Client

微信小游戏客户端，原生框架 + TypeScript（不使用 Cocos/Unity 等引擎）。

## 首次运行

```bash
npm install
npm run build
```

`npm run build` 会把 `src/**/*.ts` 编译成同目录结构的 `.js`（例如 `src/game.ts` → `game.js`），微信开发者工具运行的是编译后的 `.js`，不是 `.ts`。

开发时可以用 `npm run watch` 让 tsc 持续监听并自动重新编译。

## 用微信开发者工具打开

1. 打开微信开发者工具 → 导入项目 → 项目目录选这个 `Client/` 文件夹。
2. 项目类型选择"小游戏"。
3. AppID 目前用的是占位值 `touristappid`（`project.config.json` 里），可以直接本地预览；正式发布前需要替换成在 [mp.weixin.qq.com](https://mp.weixin.qq.com) 注册小游戏后拿到的真实 AppID。

## 目录结构

见根目录 [README.md](../README.md) 和 [Docs/11_技术架构.md](../Docs/11_技术架构.md)。

- `src/` — TypeScript 源码，唯一手写的代码
- `config/` — 数值配置（JSON），不写死在代码里
- `game.js`、`core/`、`entities/`、`ui/`、`scenes/`（项目根目录下） — tsc 编译产物，已加入 `.gitignore`，不要手动改
- `game.json`、`project.config.json` — 微信小游戏工程配置
