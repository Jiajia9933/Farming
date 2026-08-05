// 小游戏入口。编译后必须叫 game.js 并放在项目根目录，这是微信小游戏的硬性要求。

import { GameState } from "./core/GameState";
import { Scene } from "./scenes/Scene";
import { HomeScene } from "./scenes/HomeScene";
import { MapScene } from "./scenes/MapScene";
import { FriendFarmScene } from "./scenes/FriendFarmScene";
import { WarehouseScene } from "./scenes/WarehouseScene";

const systemInfo = wx.getSystemInfoSync();
const canvas = wx.createCanvas();
canvas.width = systemInfo.windowWidth;
canvas.height = systemInfo.windowHeight;
const ctx = canvas.getContext("2d");

// 用状态栏高度确定顶部安全区域，避开刘海屏/状态栏。
const safeTop = systemInfo.statusBarHeight || 20;

const state = new GameState();

// showHome() 在下面立刻调用一次，保证使用前一定已赋值。
let currentScene!: Scene;

function showHome(): void {
  currentScene = new HomeScene(ctx, canvas.width, canvas.height, safeTop, state, showMap, showWarehouse);
}

function showWarehouse(): void {
  currentScene = new WarehouseScene(ctx, canvas.width, canvas.height, safeTop, state, showHome);
}

function showMap(): void {
  currentScene = new MapScene(ctx, canvas.width, canvas.height, safeTop, (target) => {
    if (target === "home") {
      showHome();
    } else {
      showFriendFarm();
    }
  });
}

function showFriendFarm(): void {
  currentScene = new FriendFarmScene(ctx, canvas.width, canvas.height, safeTop, showMap);
}

showHome();
currentScene.render();

wx.onTouchStart((event) => {
  const touch = event.touches[0];
  if (!touch) {
    return;
  }
  currentScene.handleTouch(touch.clientX, touch.clientY);
  currentScene.render();
});

// 每帧刷新一次：既能更新倒计时，也能让收获时的飞行特效动画连贯。
function loop(): void {
  currentScene.render();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
