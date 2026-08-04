// 小游戏入口。编译后必须叫 game.js 并放在项目根目录，这是微信小游戏的硬性要求。

import { GameState } from "./core/GameState";
import { HomeScene } from "./scenes/HomeScene";

const systemInfo = wx.getSystemInfoSync();
const canvas = wx.createCanvas();
canvas.width = systemInfo.windowWidth;
canvas.height = systemInfo.windowHeight;
const ctx = canvas.getContext("2d");

// 用胶囊按钮的位置确定顶部安全区域，避开刘海屏/状态栏。
const safeTop = wx.getMenuButtonBoundingClientRect().top;

const state = new GameState();
const scene = new HomeScene(ctx, canvas.width, canvas.height, safeTop, state);

scene.render();

wx.onTouchStart((event) => {
  const touch = event.touches[0];
  if (!touch) {
    return;
  }
  scene.handleTouch(touch.clientX, touch.clientY);
  scene.render();
});

// 每秒刷新一次，更新成熟倒计时显示。
setInterval(() => {
  scene.render();
}, 1000);
