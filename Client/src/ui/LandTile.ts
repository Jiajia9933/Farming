// 地块的通用绘制：带纹理的土壤背景 + 成熟高亮边框。
// HomeScene（真实数据）和 FriendFarmScene（假数据）都用这个，避免两边各画一套。

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** 用 sin 做确定性伪随机，同一个 seed 每次结果都一样，纹理不会每帧闪烁。 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * 画一块地的土壤背景：底色 + 犁沟线 + 土块斑点，让地块看起来像真的翻过的土地，
 * 而不是纯色方块。tilled 为 true 时（已经种了东西）颜色更深一点。
 */
export function drawSoil(ctx: WxCanvasContext2D, rect: Rect, seed: number, tilled: boolean): void {
  ctx.fillStyle = tilled ? "#6b4a2f" : "#8b5a2b";
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

  ctx.strokeStyle = "rgba(0,0,0,0.18)";
  ctx.lineWidth = 1;
  const furrowCount = 3;
  for (let i = 0; i < furrowCount; i++) {
    const y = rect.y + (rect.h * (i + 1)) / (furrowCount + 1);
    ctx.beginPath();
    ctx.moveTo(rect.x + 4, y);
    ctx.lineTo(rect.x + rect.w - 4, y);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(0,0,0,0.14)";
  const speckCount = 4;
  for (let i = 0; i < speckCount; i++) {
    const rx = seededRandom(seed * 12.9898 + i * 3.7);
    const ry = seededRandom(seed * 78.233 + i * 5.1);
    const sx = rect.x + 6 + rx * (rect.w - 12);
    const sy = rect.y + 6 + ry * (rect.h - 12);
    ctx.beginPath();
    ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** 成熟状态的高亮边框，画在 drawSoil 之后。 */
export function drawMatureHighlight(ctx: WxCanvasContext2D, rect: Rect): void {
  ctx.strokeStyle = "#ffd54f";
  ctx.lineWidth = 4;
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
}

/** 普通（非成熟）状态的地块边框。 */
export function drawPlainBorder(ctx: WxCanvasContext2D, rect: Rect): void {
  ctx.strokeStyle = "#3c3c3c";
  ctx.lineWidth = 2;
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
}
