# CHANGELOG

## 2026-08-04 — Version 0.2.1

新增：

- 种植菜单每种作物显示成熟时间

调整：

- 作物成熟时间改为胡萝卜1分钟/玉米2分钟/番茄5分钟（方便测试）
- 经验值改为按成熟时间正比计算：每1分钟成熟时间=10经验（胡萝卜10/玉米20/番茄50）

## 2026-08-04 — Version 0.2.0

新增：

- 种植菜单支持多种作物选择（胡萝卜/玉米/番茄，数值见 `Client/config/plants.json`，对应 [04_经济系统.md](04_经济系统.md)），金币不够的作物在菜单里禁用
- 地块生长/成熟状态显示具体作物名称

修复：

- HUD 安全区域改用 `wx.getSystemInfoSync().statusBarHeight`，替换掉不稳定的 `getMenuButtonBoundingClientRect`

## 2026-08-04 — Version 0.1.1

修复：

- 作物配置改为通过 `wx.getFileSystemManager().readFileSync` 读取 `config/plants.json`，因为微信小游戏的 `require` 不支持直接加载 `.json` 文件
- HUD 顶部资源栏改用 `wx.getMenuButtonBoundingClientRect()` 计算安全区域，避免被刘海屏/状态栏遮挡

## 2026-08-03 — Version 0.1.0

新增：

- 微信小游戏客户端工程搭建（TypeScript + 原生框架，`Client/project.config.json` / `game.json`）
- 游戏首页：10 块土地网格 + 顶部金币/经验栏
- 点击空地弹出种植菜单，可种植胡萝卜（购买价 20，售价 30，成熟 5 分钟，经验 5，见 `Client/config/plants.json`）
- 成熟后点击收获，获得金币与经验
- 本地存档（`wx.setStorageSync`/`getStorageSync`）

## 2026-08-03 — Version 0.0.1

新增：

- 项目文档结构初始化（Docs / Assets / Client / Server）
