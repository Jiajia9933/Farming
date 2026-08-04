// 每日签到弹窗：进游戏当天第一次显示，点"领取"关闭。

const PANEL_WIDTH = 240;
const PANEL_HEIGHT = 160;
const CLAIM_BTN_HEIGHT = 44;

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function getLayout(width: number, height: number): { panel: Rect; claimBtn: Rect } {
  const panelX = (width - PANEL_WIDTH) / 2;
  const panelY = (height - PANEL_HEIGHT) / 2;
  return {
    panel: { x: panelX, y: panelY, w: PANEL_WIDTH, h: PANEL_HEIGHT },
    claimBtn: {
      x: panelX + 20,
      y: panelY + PANEL_HEIGHT - 20 - CLAIM_BTN_HEIGHT,
      w: PANEL_WIDTH - 40,
      h: CLAIM_BTN_HEIGHT,
    },
  };
}

export function drawCheckInDialog(ctx: WxCanvasContext2D, width: number, height: number, rewardGold: number): void {
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(0, 0, width, height);

  const { panel, claimBtn } = getLayout(width, height);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(panel.x, panel.y, panel.w, panel.h);

  ctx.fillStyle = "#333333";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "18px sans-serif";
  ctx.fillText("每日签到", panel.x + panel.w / 2, panel.y + 36);

  ctx.font = "16px sans-serif";
  ctx.fillText(`+${rewardGold} 金币`, panel.x + panel.w / 2, panel.y + 76);

  ctx.fillStyle = "#4caf50";
  ctx.fillRect(claimBtn.x, claimBtn.y, claimBtn.w, claimBtn.h);
  ctx.fillStyle = "#ffffff";
  ctx.font = "16px sans-serif";
  ctx.fillText("领取", claimBtn.x + claimBtn.w / 2, claimBtn.y + claimBtn.h / 2);
}

export function hitTestCheckInDialog(x: number, y: number, width: number, height: number): boolean {
  const { claimBtn } = getLayout(width, height);
  return x >= claimBtn.x && x <= claimBtn.x + claimBtn.w && y >= claimBtn.y && y <= claimBtn.y + claimBtn.h;
}
