// 顶部资源栏：金币、等级/经验。
// safeTop 是状态栏高度（wx.getSystemInfoSync().statusBarHeight），保证文字画在刘海/状态栏下面。

import { getLevelForExp } from "../core/LevelConfig";

const CONTENT_HEIGHT = 44;

export function getHudHeight(safeTop: number): number {
  return safeTop + CONTENT_HEIGHT;
}

export function drawHUD(ctx: WxCanvasContext2D, width: number, safeTop: number, gold: number, exp: number): void {
  const totalHeight = getHudHeight(safeTop);
  ctx.fillStyle = "#3c7a3c";
  ctx.fillRect(0, 0, width, totalHeight);

  const textY = safeTop + CONTENT_HEIGHT / 2;
  ctx.fillStyle = "#ffffff";
  ctx.font = "20px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(`金币: ${gold}`, 16, textY);
  ctx.fillText(`Lv.${getLevelForExp(exp)}（经验: ${exp}）`, width / 2, textY);
}
