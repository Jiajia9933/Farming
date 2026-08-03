// 点击空地后弹出的种植菜单。第一版只有一个作物选项，直接展示为"确认/取消"两个按钮。

import { PlantDef } from "../core/PlantConfig";

export type PlantMenuAction = "confirm" | "cancel";

interface MenuLayout {
  panelX: number;
  panelY: number;
  panelW: number;
  panelH: number;
  confirmBtn: { x: number; y: number; w: number; h: number };
  cancelBtn: { x: number; y: number; w: number; h: number };
}

function getLayout(width: number, height: number): MenuLayout {
  const panelW = 240;
  const panelH = 160;
  const panelX = (width - panelW) / 2;
  const panelY = (height - panelH) / 2;
  return {
    panelX,
    panelY,
    panelW,
    panelH,
    confirmBtn: { x: panelX + 20, y: panelY + 90, w: 90, h: 44 },
    cancelBtn: { x: panelX + panelW - 110, y: panelY + 90, w: 90, h: 44 },
  };
}

export function drawPlantMenu(ctx: WxCanvasContext2D, width: number, height: number, plant: PlantDef): void {
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(0, 0, width, height);

  const layout = getLayout(width, height);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(layout.panelX, layout.panelY, layout.panelW, layout.panelH);

  ctx.fillStyle = "#333333";
  ctx.font = "18px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(`种植 ${plant.name}`, layout.panelX + 20, layout.panelY + 30);
  ctx.fillText(`花费 ${plant.buyPrice} 金币`, layout.panelX + 20, layout.panelY + 58);

  ctx.fillStyle = "#4caf50";
  ctx.fillRect(layout.confirmBtn.x, layout.confirmBtn.y, layout.confirmBtn.w, layout.confirmBtn.h);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText("种植", layout.confirmBtn.x + layout.confirmBtn.w / 2, layout.confirmBtn.y + layout.confirmBtn.h / 2);

  ctx.fillStyle = "#aaaaaa";
  ctx.fillRect(layout.cancelBtn.x, layout.cancelBtn.y, layout.cancelBtn.w, layout.cancelBtn.h);
  ctx.fillStyle = "#ffffff";
  ctx.fillText("取消", layout.cancelBtn.x + layout.cancelBtn.w / 2, layout.cancelBtn.y + layout.cancelBtn.h / 2);
}

export function hitTestPlantMenu(x: number, y: number, width: number, height: number): PlantMenuAction | null {
  const layout = getLayout(width, height);
  const { confirmBtn, cancelBtn } = layout;
  if (x >= confirmBtn.x && x <= confirmBtn.x + confirmBtn.w && y >= confirmBtn.y && y <= confirmBtn.y + confirmBtn.h) {
    return "confirm";
  }
  if (x >= cancelBtn.x && x <= cancelBtn.x + cancelBtn.w && y >= cancelBtn.y && y <= cancelBtn.y + cancelBtn.h) {
    return "cancel";
  }
  return null;
}
