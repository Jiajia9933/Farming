// 自动消失的提示条：显示一段时间后渐渐淡出，不用点确定，也不挡住其他操作。

export interface Toast {
  message: string;
  startTime: number;
  /** 总共存活多久（毫秒），包含淡出的时间在内。 */
  duration: number;
  /** 淡出动画占最后多长时间（毫秒）。 */
  fadeDuration: number;
}

export function createToast(message: string, duration = 2000, fadeDuration = 500): Toast {
  return { message, startTime: Date.now(), duration, fadeDuration };
}

export function isToastAlive(toast: Toast, now: number): boolean {
  return now - toast.startTime < toast.duration;
}

export function drawToast(ctx: WxCanvasContext2D, width: number, toast: Toast, now: number): void {
  const elapsed = now - toast.startTime;
  const fadeStart = toast.duration - toast.fadeDuration;
  const alpha = elapsed > fadeStart ? Math.max(0, 1 - (elapsed - fadeStart) / toast.fadeDuration) : 1;

  const panelWidth = 220;
  const panelHeight = 50;
  const panelX = (width - panelWidth) / 2;
  const panelY = 120;

  ctx.globalAlpha = alpha * 0.85;
  ctx.fillStyle = "#333333";
  ctx.fillRect(panelX, panelY, panelWidth, panelHeight);

  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#ffffff";
  ctx.font = "16px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(toast.message, panelX + panelWidth / 2, panelY + panelHeight / 2);
  ctx.globalAlpha = 1;
}
