// 点击空地后弹出的种植菜单：列出所有作物，金币不够的置灰不可点。

import { PlantDef } from "../core/PlantConfig";

export type PlantMenuAction = { type: "plant"; plantId: string } | { type: "cancel" };

const ROW_HEIGHT = 56;
const ROW_GAP = 8;
const PANEL_PADDING = 16;
const PANEL_WIDTH = 260;
const CANCEL_HEIGHT = 40;

interface RowRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface MenuLayout {
  panelX: number;
  panelY: number;
  panelW: number;
  panelH: number;
  rows: RowRect[];
  cancelBtn: RowRect;
}

function getLayout(width: number, height: number, plantCount: number): MenuLayout {
  const listHeight = plantCount * ROW_HEIGHT + (plantCount - 1) * ROW_GAP;
  const panelW = PANEL_WIDTH;
  const panelH = PANEL_PADDING * 2 + listHeight + ROW_GAP + CANCEL_HEIGHT;
  const panelX = (width - panelW) / 2;
  const panelY = (height - panelH) / 2;

  const rows: RowRect[] = [];
  for (let i = 0; i < plantCount; i++) {
    rows.push({
      x: panelX + PANEL_PADDING,
      y: panelY + PANEL_PADDING + i * (ROW_HEIGHT + ROW_GAP),
      w: panelW - PANEL_PADDING * 2,
      h: ROW_HEIGHT,
    });
  }

  const cancelBtn: RowRect = {
    x: panelX + PANEL_PADDING,
    y: panelY + PANEL_PADDING + listHeight + ROW_GAP,
    w: panelW - PANEL_PADDING * 2,
    h: CANCEL_HEIGHT,
  };

  return { panelX, panelY, panelW, panelH, rows, cancelBtn };
}

export function drawPlantMenu(
  ctx: WxCanvasContext2D,
  width: number,
  height: number,
  plants: PlantDef[],
  gold: number
): void {
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(0, 0, width, height);

  const layout = getLayout(width, height, plants.length);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(layout.panelX, layout.panelY, layout.panelW, layout.panelH);

  plants.forEach((plant, i) => {
    const row = layout.rows[i];
    const affordable = gold >= plant.buyPrice;
    ctx.fillStyle = affordable ? "#4caf50" : "#cccccc";
    ctx.fillRect(row.x, row.y, row.w, row.h);

    ctx.fillStyle = "#ffffff";
    ctx.textBaseline = "middle";

    ctx.font = "16px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(plant.name, row.x + 12, row.y + 18);

    ctx.font = "12px sans-serif";
    ctx.fillText(`成熟：${formatMatureTime(plant.matureSeconds)}`, row.x + 12, row.y + row.h - 16);

    ctx.font = "16px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`${plant.buyPrice}金币`, row.x + row.w - 12, row.y + row.h / 2);
  });

  const cancel = layout.cancelBtn;
  ctx.fillStyle = "#aaaaaa";
  ctx.fillRect(cancel.x, cancel.y, cancel.w, cancel.h);
  ctx.fillStyle = "#ffffff";
  ctx.font = "16px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("取消", cancel.x + cancel.w / 2, cancel.y + cancel.h / 2);
}

function formatMatureTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}秒`;
  }
  if (seconds % 60 === 0) {
    return `${seconds / 60}分钟`;
  }
  return `${Math.floor(seconds / 60)}分${seconds % 60}秒`;
}

function isInside(x: number, y: number, rect: RowRect): boolean {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

export function hitTestPlantMenu(
  x: number,
  y: number,
  width: number,
  height: number,
  plants: PlantDef[],
  gold: number
): PlantMenuAction | null {
  const layout = getLayout(width, height, plants.length);

  for (let i = 0; i < plants.length; i++) {
    if (isInside(x, y, layout.rows[i]) && gold >= plants[i].buyPrice) {
      return { type: "plant", plantId: plants[i].id };
    }
  }

  if (isInside(x, y, layout.cancelBtn)) {
    return { type: "cancel" };
  }

  return null;
}
