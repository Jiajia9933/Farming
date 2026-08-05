// 通用的"确认/取消"弹窗：一行消息 + 两个按钮。目前用于"仓库满了，要不要去升级"。

export type ConfirmDialogAction = "confirm" | "cancel";

const PANEL_WIDTH = 260;
const PANEL_HEIGHT = 150;
const BTN_HEIGHT = 44;
const BTN_GAP = 12;

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function getLayout(width: number, height: number): { panel: Rect; confirmBtn: Rect; cancelBtn: Rect } {
  const panelX = (width - PANEL_WIDTH) / 2;
  const panelY = (height - PANEL_HEIGHT) / 2;
  const btnWidth = (PANEL_WIDTH - 40 - BTN_GAP) / 2;
  const btnY = panelY + PANEL_HEIGHT - 20 - BTN_HEIGHT;
  return {
    panel: { x: panelX, y: panelY, w: PANEL_WIDTH, h: PANEL_HEIGHT },
    cancelBtn: { x: panelX + 20, y: btnY, w: btnWidth, h: BTN_HEIGHT },
    confirmBtn: { x: panelX + 20 + btnWidth + BTN_GAP, y: btnY, w: btnWidth, h: BTN_HEIGHT },
  };
}

export function drawConfirmDialog(
  ctx: WxCanvasContext2D,
  width: number,
  height: number,
  message: string,
  confirmLabel: string,
  cancelLabel: string
): void {
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(0, 0, width, height);

  const { panel, confirmBtn, cancelBtn } = getLayout(width, height);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(panel.x, panel.y, panel.w, panel.h);

  ctx.fillStyle = "#333333";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "16px sans-serif";
  ctx.fillText(message, panel.x + panel.w / 2, panel.y + 50);

  ctx.fillStyle = "#aaaaaa";
  ctx.fillRect(cancelBtn.x, cancelBtn.y, cancelBtn.w, cancelBtn.h);
  ctx.fillStyle = "#ffffff";
  ctx.font = "15px sans-serif";
  ctx.fillText(cancelLabel, cancelBtn.x + cancelBtn.w / 2, cancelBtn.y + cancelBtn.h / 2);

  ctx.fillStyle = "#4caf50";
  ctx.fillRect(confirmBtn.x, confirmBtn.y, confirmBtn.w, confirmBtn.h);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(confirmLabel, confirmBtn.x + confirmBtn.w / 2, confirmBtn.y + confirmBtn.h / 2);
}

export function hitTestConfirmDialog(x: number, y: number, width: number, height: number): ConfirmDialogAction | null {
  const { confirmBtn, cancelBtn } = getLayout(width, height);
  if (x >= confirmBtn.x && x <= confirmBtn.x + confirmBtn.w && y >= confirmBtn.y && y <= confirmBtn.y + confirmBtn.h) {
    return "confirm";
  }
  if (x >= cancelBtn.x && x <= cancelBtn.x + cancelBtn.w && y >= cancelBtn.y && y <= cancelBtn.y + cancelBtn.h) {
    return "cancel";
  }
  return null;
}
