// 地图/Hub 场景：目前只有两个入口——自己的农场、好友的农场。
// 好友农场现在是占位假数据，等服务器和好友关系做好了，这里改成真实好友列表即可，
// 场景切换的结构不用变。

import { Scene } from "./Scene";

export type MapTarget = "home" | "friendFarm";

interface CardRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const CARD_WIDTH = 240;
const CARD_HEIGHT = 100;
const CARD_GAP = 24;

export class MapScene implements Scene {
  private ctx: WxCanvasContext2D;
  private width: number;
  private height: number;
  private safeTop: number;
  private onSelect: (target: MapTarget) => void;
  private homeCard: CardRect;
  private friendCard: CardRect;

  constructor(
    ctx: WxCanvasContext2D,
    width: number,
    height: number,
    safeTop: number,
    onSelect: (target: MapTarget) => void
  ) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.safeTop = safeTop;
    this.onSelect = onSelect;

    const totalHeight = CARD_HEIGHT * 2 + CARD_GAP;
    const startY = (height - totalHeight) / 2;
    const cardX = (width - CARD_WIDTH) / 2;
    this.homeCard = { x: cardX, y: startY, w: CARD_WIDTH, h: CARD_HEIGHT };
    this.friendCard = { x: cardX, y: startY + CARD_HEIGHT + CARD_GAP, w: CARD_WIDTH, h: CARD_HEIGHT };
  }

  render(): void {
    const ctx = this.ctx;

    ctx.fillStyle = "#dfe9f5";
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = "#333333";
    ctx.font = "20px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("地图", this.width / 2, this.safeTop + 30);

    this.drawCard(this.homeCard, "我的农场");
    this.drawCard(this.friendCard, "好友农场（示例）");
  }

  private drawCard(card: CardRect, label: string): void {
    const ctx = this.ctx;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(card.x, card.y, card.w, card.h);
    ctx.strokeStyle = "#3c3c3c";
    ctx.lineWidth = 2;
    ctx.strokeRect(card.x, card.y, card.w, card.h);

    ctx.fillStyle = "#333333";
    ctx.font = "18px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, card.x + card.w / 2, card.y + card.h / 2);
  }

  handleTouch(x: number, y: number): void {
    if (this.isInside(x, y, this.homeCard)) {
      this.onSelect("home");
      return;
    }
    if (this.isInside(x, y, this.friendCard)) {
      this.onSelect("friendFarm");
    }
  }

  private isInside(x: number, y: number, rect: CardRect): boolean {
    return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
  }
}
