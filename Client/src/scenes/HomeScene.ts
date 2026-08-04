// 游戏首页：10 块土地的网格 + 顶部资源栏 + 种植菜单。
// 只负责绘制和触摸路由，具体数据规则都在 GameState / Land 里。

import { GameState } from "../core/GameState";
import { getPlant, getAllPlants } from "../core/PlantConfig";
import { drawHUD, getHudHeight } from "../ui/HUD";
import { drawPlantMenu, hitTestPlantMenu } from "../ui/PlantMenu";
import { Scene } from "./Scene";

const GRID_COLS = 5;
const GRID_ROWS = 2;
const GRID_MARGIN = 16;
const CELL_GAP = 12;
const VISIT_BUTTON_HEIGHT = 48;

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
  private landRects: LandRect[];
  private visitButton: Rect;
  private selectedLandId: number | null = null;

  constructor(
    ctx: WxCanvasContext2D,
    width: number,
    height: number,
    safeTop: number,
    state: GameState,
    onVisitFriends: () => void
  ) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.safeTop = safeTop;
    this.state = state;
    this.onVisitFriends = onVisitFriends;
    this.landRects = this.computeLandRects();
    this.visitButton = this.computeVisitButton();
  }

  private computeLandRects(): LandRect[] {
    const gridTop = getHudHeight(this.safeTop) + GRID_MARGIN;
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

  private computeVisitButton(): Rect {
    const lastRow = this.landRects[this.landRects.length - 1];
    return {
      x: GRID_MARGIN,
      y: lastRow.y + lastRow.h + GRID_MARGIN,
      w: this.width - GRID_MARGIN * 2,
      h: VISIT_BUTTON_HEIGHT,
    };
  }

  render(): void {
    const ctx = this.ctx;
    const now = Date.now();

    ctx.fillStyle = "#eef7ee";
    ctx.fillRect(0, 0, this.width, this.height);

    for (const rect of this.landRects) {
      this.drawLand(rect, now);
    }

    drawHUD(ctx, this.width, this.safeTop, this.state.gold, this.state.exp);
    this.drawVisitButton();

    if (this.selectedLandId !== null) {
      drawPlantMenu(ctx, this.width, this.height, getAllPlants(), this.state.gold);
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

  private drawLand(rect: LandRect, now: number): void {
    const ctx = this.ctx;
    const land = this.state.lands[rect.id];

    if (land.data.status === "empty") {
      ctx.fillStyle = "#8b5a2b";
    } else if (land.isMature(now)) {
      ctx.fillStyle = "#e07b39";
    } else {
      ctx.fillStyle = "#5fa85f";
    }
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

    ctx.strokeStyle = "#3c3c3c";
    ctx.lineWidth = 2;
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);

    if (land.data.status === "growing" && land.data.plantId !== null) {
      const plant = getPlant(land.data.plantId);
      const statusLine = land.isMature(now) ? "可收获" : `${land.remainingSeconds(now)}s`;
      ctx.fillStyle = "#ffffff";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(plant.name, rect.x + rect.w / 2, rect.y + rect.h / 2 - 10);
      ctx.fillText(statusLine, rect.x + rect.w / 2, rect.y + rect.h / 2 + 10);
    }
  }

  handleTouch(x: number, y: number): void {
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

    const btn = this.visitButton;
    if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
      this.onVisitFriends();
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
