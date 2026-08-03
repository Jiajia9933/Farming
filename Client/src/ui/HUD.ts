// 顶部资源栏：金币、经验。

export const HUD_HEIGHT = 60;

export function drawHUD(ctx: WxCanvasContext2D, width: number, gold: number, exp: number): void {
  ctx.fillStyle = "#3c7a3c";
  ctx.fillRect(0, 0, width, HUD_HEIGHT);

  ctx.fillStyle = "#ffffff";
  ctx.font = "20px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(`金币: ${gold}`, 16, HUD_HEIGHT / 2);
  ctx.fillText(`经验: ${exp}`, width / 2, HUD_HEIGHT / 2);
}
