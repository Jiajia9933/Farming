// 游戏首页：10 块土地的网格 + 顶部资源栏 + 种植菜单。
// 只负责绘制和触摸路由，具体数据规则都在 GameState / Land 里。

import { GameState } from "../core/GameState";
import { getPlant, getAllPlants } from "../core/PlantConfig";
import { getCheckInRewardGold } from "../core/CheckInConfig";
import { drawHUD, getHudHeight } from "../ui/HUD";
import { drawPlantMenu, hitTestPlantMenu } from "../ui/PlantMenu";
import { drawCheckInDialog, hitTestCheckInDialog } from "../ui/CheckInDialog";
import { drawSoil, drawMatureHighlight, drawPlainBorder } from "../ui/LandTile";
import { drawGrassBackground, drawSkyBand, drawFence } from "../ui/Scenery";
import { Scene } from "./Scene";

const GRID_COLS = 5;
const GRID_ROWS = 2;
const GRID_MARGIN = 16;
const CELL_GAP = 0;
const BOTTOM_BUTTON_HEIGHT = 48;
const BOTTOM_BUTTON_GAP = 12;
const SKY_HEIGHT = 64;
const FENCE_GAP_ABOVE_SKY = 16;
const FENCE_POST_CLEARANCE = 15;
const FENCE_INSET = 12;

interface LandRect {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export class HomeScene implements Scene {
  private ctx: WxCanvasContext2D;
  private width: number;
  private height: number;
  private state: GameState;
  private safeTop: number;
  private onVisitFriends: () => void;
  private onOpenWarehouse: () => void;
  private landRects: LandRect[];
  private fenceRect: Rect;
  private visitButton: Rect;
  private warehouseButton: Rect;
  private selectedLandId: number | null = null;
  private showCheckIn: boolean;

  constructor(
    ctx: WxCanvasContext2D,
    width: number,
    height: number,
    safeTop: number,
    state: GameState,
    onVisitFriends: () => void,
    onOpenWarehouse: () => void
  ) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.safeTop = safeTop;
    this.state = state;
    this.onVisitFriends = onVisitFriends;
    this.onOpenWarehouse = onOpenWarehouse;
    this.landRects = this.computeLandRects();
    this.fenceRect = this.computeFenceRect();
    const bottomButtons = this.computeBottomButtons();
    this.visitButton = bottomButtons.visitButton;
    this.warehouseButton = bottomButtons.warehouseButton;
    this.showCheckIn = state.canCheckInToday();
  }

  private computeLandRects(): LandRect[] {
    const skyBottom = getHudHeight(this.safeTop) + SKY_HEIGHT;
    const gridTop = skyBottom + FENCE_GAP_ABOVE_SKY + FENCE_POST_CLEARANCE + FENCE_INSET;
    const gridWidth = this.width - GRID_MARGIN * 2;
    const cellW = (gridWidth - CELL_GAP * (GRID_COLS - 1)) / GRID_COLS;
    const cellH = cellW;
    const rects: LandRect[] = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const id = row * GRID_COLS + col;
        rects.push({
          id,
          x: GRID_MARGIN + col * (cellW + CELL_GAP),
          y: gridTop + row * (cellH + CELL_GAP),
          w: cellW,
          h: cellH,
        });
      }
    }
    return rects;
  }

  private computeFenceRect(): Rect {
    const first = this.landRects[0];
    const last = this.landRects[this.landRects.length - 1];
    return {
      x: first.x - FENCE_INSET,
      y: first.y - FENCE_INSET,
      w: last.x + last.w - first.x + FENCE_INSET * 2,
      h: last.y + last.h - first.y + FENCE_INSET * 2,
    };
  }

  private computeBottomButtons(): { visitButton: Rect; warehouseButton: Rect } {
    const lastRow = this.landRects[this.landRects.length - 1];
    const y = lastRow.y + lastRow.h + GRID_MARGIN;
    const totalWidth = this.width - GRID_MARGIN * 2;
    const buttonWidth = (totalWidth - BOTTOM_BUTTON_GAP) / 2;
    return {
      visitButton: { x: GRID_MARGIN, y, w: buttonWidth, h: BOTTOM_BUTTON_HEIGHT },
      warehouseButton: { x: GRID_MARGIN + buttonWidth + BOTTOM_BUTTON_GAP, y, w: buttonWidth, h: BOTTOM_BUTTON_HEIGHT },
    };
  }

  render(): void {
    const ctx = this.ctx;
    const now = Date.now();

    drawGrassBackground(ctx, this.width, this.height);
    drawSkyBand(ctx, this.width, getHudHeight(this.safeTop), SKY_HEIGHT);
    drawFence(ctx, this.fenceRect);

    for (const rect of this.landRects) {
      this.drawLand(rect, now);
    }

    drawHUD(ctx, this.width, this.safeTop, this.state.gold, this.state.exp);
    this.drawVisitButton();
    this.drawWarehouseButton();

    if (this.selectedLandId !== null) {
      drawPlantMenu(ctx, this.width, this.height, getAllPlants(), this.state.gold);
    }

    if (this.showCheckIn) {
      drawCheckInDialog(ctx, this.width, this.height, getCheckInRewardGold());
    }
  }

  private drawVisitButton(): void {
    const ctx = this.ctx;
    const btn = this.visitButton;
    ctx.fillStyle = "#5b8def";
    ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("拜访好友", btn.x + btn.w / 2, btn.y + btn.h / 2);
  }

  private drawWarehouseButton(): void {
    const ctx = this.ctx;
    const btn = this.warehouseButton;
    ctx.fillStyle = "#e0a13a";
    ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("仓库", btn.x + btn.w / 2, btn.y + btn.h / 2);
  }

  private drawLand(rect: LandRect, now: number): void {
    const ctx = this.ctx;
    const land = this.state.lands[rect.id];
    const isGrowing = land.data.status === "growing" && land.data.plantId !== null;
    const stage = isGrowing ? land.getGrowthStage(now) : null;

    drawSoil(ctx, rect, rect.id, isGrowing);

    if (stage === "mature") {
      drawMatureHighlight(ctx, rect);
    } else {
      drawPlainBorder(ctx, rect);
    }

    if (isGrowing && stage !== null) {
      const plant = getPlant(land.data.plantId as string);
      let icon: string;
      let iconSize: number;
      if (stage === "sprout") {
        icon = "🌱";
        iconSize = 16;
      } else if (stage === "growing") {
        icon = "🌿";
        iconSize = 22;
      } else {
        icon = plant.icon;
        iconSize = 28;
      }

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${iconSize}px sans-serif`;
      ctx.fillText(icon, rect.x + rect.w / 2, rect.y + rect.h / 2 - 10);
      ctx.font = "14px sans-serif";
      ctx.fillText(
        stage === "mature" ? "可收获" : `${land.remainingSeconds(now)}s`,
        rect.x + rect.w / 2,
        rect.y + rect.h / 2 + 16
      );
    }
  }

  handleTouch(x: number, y: number): void {
    if (this.showCheckIn) {
      if (hitTestCheckInDialog(x, y, this.width, this.height)) {
        this.state.claimDailyCheckIn();
        this.showCheckIn = false;
      }
      return;
    }

    if (this.selectedLandId !== null) {
      const plants = getAllPlants();
      const action = hitTestPlantMenu(x, y, this.width, this.height, plants, this.state.gold);
      if (action !== null && action.type === "plant") {
        this.state.plantOn(this.selectedLandId, action.plantId);
      }
      if (action !== null) {
        this.selectedLandId = null;
      }
      return;
    }

    const visitBtn = this.visitButton;
    if (x >= visitBtn.x && x <= visitBtn.x + visitBtn.w && y >= visitBtn.y && y <= visitBtn.y + visitBtn.h) {
      this.onVisitFriends();
      return;
    }

    const warehouseBtn = this.warehouseButton;
    if (
      x >= warehouseBtn.x &&
      x <= warehouseBtn.x + warehouseBtn.w &&
      y >= warehouseBtn.y &&
      y <= warehouseBtn.y + warehouseBtn.h
    ) {
      this.onOpenWarehouse();
      return;
    }

    const rect = this.landRects.find(
      (r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h
    );
    if (!rect) {
      return;
    }

    const land = this.state.lands[rect.id];
    const now = Date.now();
    if (land.data.status === "empty") {
      this.selectedLandId = rect.id;
    } else if (land.isMature(now)) {
      this.state.harvest(rect.id);
    }
  }
}
