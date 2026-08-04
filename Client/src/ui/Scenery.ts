// 场景装饰：草地背景、天空云朵、栅栏。跟具体地块数据无关，纯装饰。

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function drawGrassBackground(ctx: WxCanvasContext2D, width: number, height: number): void {
  ctx.fillStyle = "#8bc34a";
  ctx.fillRect(0, 0, width, height);
}

export function drawSkyBand(ctx: WxCanvasContext2D, width: number, top: number, height: number): void {
  ctx.fillStyle = "#87ceeb";
  ctx.fillRect(0, top, width, height);

  ctx.font = "26px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("☁️", width * 0.26, top + height * 0.55);
  ctx.fillText("☁️", width * 0.72, top + height * 0.4);
}

/** 在 rect 周围画一圈简单的木栅栏（栏杆+柱子），rect 是里面地块占的范围。 */
export function drawFence(ctx: WxCanvasContext2D, rect: Rect): void {
  const railColor = "#a9744f";
  const postSpacing = 22;
  const railThickness = 6;

  ctx.fillStyle = railColor;
  ctx.fillRect(rect.x, rect.y, rect.w, railThickness);
  ctx.fillRect(rect.x, rect.y + rect.h - railThickness, rect.w, railThickness);
  ctx.fillRect(rect.x, rect.y, railThickness, rect.h);
  ctx.fillRect(rect.x + rect.w - railThickness, rect.y, railThickness, rect.h);

  for (let x = rect.x + 6; x <= rect.x + rect.w - 6; x += postSpacing) {
    ctx.fillRect(x - 2, rect.y - 5, 4, 15);
    ctx.fillRect(x - 2, rect.y + rect.h - 10, 4, 15);
  }
}
