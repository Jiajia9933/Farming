// 好友农场占位场景：数据是写死的假数据，纯展示，不能点地/收菜。
// 等好友关系和服务器数据就绪后，把 MOCK_LAND_STATUSES 换成真实好友的数据即可，
// 场景本身和 game.ts 里的切换逻辑不用改。

import { drawSoil, drawMatureHighlight, drawPlainBorder } from "../ui/LandTile";
import { drawGrassBackground, drawSkyBand, drawFence } from "../ui/Scenery";
import { Scene } from "./Scene";

const GRID_COLS = 5;
const GRID_ROWS = 2;
const GRID_MARGIN = 16;
const CELL_GAP = 0;
const BACK_BUTTON_HEIGHT = 48;
const SKY_HEIGHT = 64;
const FENCE_GAP_ABOVE_SKY = 16;
const FENCE_POST_CLEARANCE = 15;
const FENCE_INSET = 12;

type MockStatus = "empty" | "growing" | "mature";

const MOCK_LAND_STATUSES: MockStatus[] = [
  "mature", "growing", "empty", "mature", "growing",
  "empty", "empty", "growing", "mature", "empty",
];

const MOCK_FRIEND_NAME = "小明的农场（示例）";

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export class FriendFarmScene implements Scene {
  private ctx: WxCanvasContext2D;
  private width: number;
  private height: number;
  private safeTop: number;
  private onBack: () => void;
  private landRects: Rect[];
  private fenceRect: Rect;
  private backButton: Rect;

  constructor(ctx: WxCanvasContext2D, width: number, height: number, safeTop: number, onBack: () => void) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.safeTop = safeTop;
    this.onBack = onBack;
    this.landRects = this.computeLandRects();
    this.fenceRect = this.computeFenceRect();
    this.backButton = {
      x: GRID_MARGIN,
      y: height - GRID_MARGIN - BACK_BUTTON_HEIGHT,
      w: width - GRID_MARGIN * 2,
      h: BACK_BUTTON_HEIGHT,
    };
  }

  private computeLandRects(): Rect[] {
    const skyBottom = this.safeTop + SKY_HEIGHT;
    const gridTop = skyBottom + FENCE_GAP_ABOVE_SKY + FENCE_POST_CLEARANCE + FENCE_INSET;
    const gridWidth = this.width - GRID_MARGIN * 2;
    const cellW = (gridWidth - CELL_GAP * (GRID_COLS - 1)) / GRID_COLS;
    const rects: Rect[] = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        rects.push({
          x: GRID_MARGIN + col * (cellW + CELL_GAP),
          y: gridTop + row * (cellW + CELL_GAP),
          w: cellW,
          h: cellW,
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

  render(): void {
    const ctx = this.ctx;

    drawGrassBackground(ctx, this.width, this.height);
    drawSkyBand(ctx, this.width, this.safeTop, SKY_HEIGHT);
    drawFence(ctx, this.fenceRect);

    ctx.fillStyle = "#333333";
    ctx.font = "18px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(MOCK_FRIEND_NAME, this.width / 2, this.safeTop + 20);

    this.landRects.forEach((rect, i) => this.drawLand(rect, MOCK_LAND_STATUSES[i], i));

    const btn = this.backButton;
    ctx.fillStyle = "#5b8def";
    ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px sans-serif";
    ctx.fillText("返回地图", btn.x + btn.w / 2, btn.y + btn.h / 2);
  }

  private drawLand(rect: Rect, status: MockStatus, seed: number): void {
    const ctx = this.ctx;
    drawSoil(ctx, rect, seed, status !== "empty");

    if (status === "mature") {
      drawMatureHighlight(ctx, rect);
    } else {
      drawPlainBorder(ctx, rect);
    }

    if (status !== "empty") {
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = status === "mature" ? "28px sans-serif" : "22px sans-serif";
      ctx.fillText(status === "mature" ? "🌾" : "🌿", rect.x + rect.w / 2, rect.y + rect.h / 2);
    }
  }

  handleTouch(x: number, y: number): void {
    const btn = this.backButton;
    if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
      this.onBack();
    }
    // 地块本身不可点：好友互动（点赞/浇水/送礼）留到有真实数据/服务器之后再做。
  }
}
