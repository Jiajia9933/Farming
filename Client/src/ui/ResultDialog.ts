// 通用的"操作结果"提示弹窗：一行消息 + 一个确定按钮。目前用于仓库"全部卖出"的结果反馈。

const PANEL_WIDTH = 240;
const PANEL_HEIGHT = 140;
const CONFIRM_BTN_HEIGHT = 44;

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function getLayout(width: number, height: number): { panel: Rect; confirmBtn: Rect } {
  const panelX = (width - PANEL_WIDTH) / 2;
  const panelY = (height - PANEL_HEIGHT) / 2;
  return {
    panel: { x: panelX, y: panelY, w: PANEL_WIDTH, h: PANEL_HEIGHT },
    confirmBtn: {
      x: panelX + 20,
      y: panelY + PANEL_HEIGHT - 20 - CONFIRM_BTN_HEIGHT,
      w: PANEL_WIDTH - 40,
      h: CONFIRM_BTN_HEIGHT,
    },
  };
}

export function drawResultDialog(ctx: WxCanvasContext2D, width: number, height: number, message: string): void {
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(0, 0, width, height);

  const { panel, confirmBtn } = getLayout(width, height);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(panel.x, panel.y, panel.w, panel.h);

  ctx.fillStyle = "#333333";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "18px sans-serif";
  ctx.fillText(message, panel.x + panel.w / 2, panel.y + 44);

  ctx.fillStyle = "#4caf50";
  ctx.fillRect(confirmBtn.x, confirmBtn.y, confirmBtn.w, confirmBtn.h);
  ctx.fillStyle = "#ffffff";
  ctx.font = "16px sans-serif";
  ctx.fillText("确定", confirmBtn.x + confirmBtn.w / 2, confirmBtn.y + confirmBtn.h / 2);
}

export function hitTestResultDialog(x: number, y: number, width: number, height: number): boolean {
  const { confirmBtn } = getLayout(width, height);
  return x >= confirmBtn.x && x <= confirmBtn.x + confirmBtn.w && y >= confirmBtn.y && y <= confirmBtn.y + confirmBtn.h;
}
