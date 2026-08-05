// 仓库场景：看库存、升级容量、一键卖出。
// 还没有真正的商店，"全部卖出"是过渡方案——见 Docs/06_建筑系统.md。

import { GameState } from "../core/GameState";
import { getPlant, getAllPlants } from "../core/PlantConfig";
import { Toast, createToast, isToastAlive, drawToast } from "../ui/Toast";
import { Scene } from "./Scene";

const GRID_MARGIN = 16;
const ROW_HEIGHT = 40;
const BUTTON_HEIGHT = 48;
const BUTTON_GAP = 12;
const ORDER_SECTION_TOP = 300;
const ORDER_BUTTON_HEIGHT = 40;

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export class WarehouseScene implements Scene {
  private ctx: WxCanvasContext2D;
  private width: number;
  private height: number;
  private safeTop: number;
  private state: GameState;
  private onBack: () => void;
  private upgradeButton: Rect;
  private sellAllButton: Rect;
  private backButton: Rect;
  private submitOrderButton: Rect;
  private sellToast: Toast | null = null;

  constructor(ctx: WxCanvasContext2D, width: number, height: number, safeTop: number, state: GameState, onBack: () => void) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.safeTop = safeTop;
    this.state = state;
    this.onBack = onBack;

    const btnWidth = width - GRID_MARGIN * 2;
    const backY = height - GRID_MARGIN - BUTTON_HEIGHT;
    const sellY = backY - BUTTON_GAP - BUTTON_HEIGHT;
    const upgradeY = sellY - BUTTON_GAP - BUTTON_HEIGHT;
    this.upgradeButton = { x: GRID_MARGIN, y: upgradeY, w: btnWidth, h: BUTTON_HEIGHT };
    this.sellAllButton = { x: GRID_MARGIN, y: sellY, w: btnWidth, h: BUTTON_HEIGHT };
    this.backButton = { x: GRID_MARGIN, y: backY, w: btnWidth, h: BUTTON_HEIGHT };
    this.submitOrderButton = {
      x: GRID_MARGIN,
      y: safeTop + ORDER_SECTION_TOP + 60,
      w: btnWidth,
      h: ORDER_BUTTON_HEIGHT,
    };
  }

  render(): void {
    const ctx = this.ctx;
    const now = Date.now();

    ctx.fillStyle = "#eef7ee";
    ctx.fillRect(0, 0, this.width, this.height);

    const capacity = this.state.getWarehouseCapacity();
    const used = this.state.getWarehouseUsed();

    ctx.fillStyle = "#333333";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "18px sans-serif";
    ctx.fillText(`仓库 Lv.${this.state.warehouseLevel}`, this.width / 2, this.safeTop + 26);
    ctx.font = "14px sans-serif";
    ctx.fillText(`容量 ${used} / ${capacity}`, this.width / 2, this.safeTop + 50);

    this.drawInventoryList();
    this.drawTodayOrder();
    this.drawUpgradeButton();
    this.drawSellAllButton();
    this.drawBackButton();

    if (this.sellToast !== null) {
      if (isToastAlive(this.sellToast, now)) {
        drawToast(ctx, this.width, this.sellToast, now);
      } else {
        this.sellToast = null;
      }
    }
  }

  private drawInventoryList(): void {
    const ctx = this.ctx;
    const plants = getAllPlants();
    let y = this.safeTop + 80;

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    plants.forEach((plant) => {
      const count = this.state.inventory[plant.id] || 0;
      ctx.fillStyle = "#333333";
      ctx.font = "22px sans-serif";
      ctx.fillText(plant.icon, GRID_MARGIN, y + ROW_HEIGHT / 2);
      ctx.font = "16px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`x${count}`, this.width - GRID_MARGIN, y + ROW_HEIGHT / 2);
      ctx.textAlign = "left";
      y += ROW_HEIGHT;
    });
  }

  private drawTodayOrder(): void {
    const ctx = this.ctx;
    const order = this.state.getTodayOrder();
    const requirementText = order.requirements
      .map((r) => `${getPlant(r.plantId).icon}x${r.count}`)
      .join(" ");
    const top = this.safeTop + ORDER_SECTION_TOP;

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#333333";
    ctx.font = "16px sans-serif";
    ctx.fillText("今日订单", GRID_MARGIN, top);
    ctx.font = "18px sans-serif";
    ctx.fillText(requirementText, GRID_MARGIN + 68, top);
    ctx.font = "14px sans-serif";
    ctx.fillText(`奖励：${order.rewardGold}金币 / ${order.rewardExp}经验`, GRID_MARGIN, top + 26);

    const btn = this.submitOrderButton;
    const completedToday = !this.state.canCompleteOrderToday();
    const enoughStock = this.state.hasEnoughForOrder(order);

    ctx.fillStyle = completedToday ? "#cccccc" : enoughStock ? "#4caf50" : "#cccccc";
    ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const label = completedToday ? "今日已完成" : enoughStock ? "交订单" : "库存不足";
    ctx.fillText(label, btn.x + btn.w / 2, btn.y + btn.h / 2);
  }

  private drawUpgradeButton(): void {
    const ctx = this.ctx;
    const btn = this.upgradeButton;
    const cost = this.state.getUpgradeCost();
    const affordable = cost !== null && this.state.gold >= cost;

    ctx.fillStyle = cost === null ? "#cccccc" : affordable ? "#4caf50" : "#cccccc";
    ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const label = cost === null ? "仓库已满级" : `升级仓库（${cost}金币）`;
    ctx.fillText(label, btn.x + btn.w / 2, btn.y + btn.h / 2);
  }

  private drawSellAllButton(): void {
    const ctx = this.ctx;
    const btn = this.sellAllButton;
    const hasStock = this.state.getWarehouseUsed() > 0;

    ctx.fillStyle = hasStock ? "#e07b39" : "#cccccc";
    ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("全部卖出", btn.x + btn.w / 2, btn.y + btn.h / 2);
  }

  private drawBackButton(): void {
    const ctx = this.ctx;
    const btn = this.backButton;
    ctx.fillStyle = "#5b8def";
    ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("返回", btn.x + btn.w / 2, btn.y + btn.h / 2);
  }

  private isInside(x: number, y: number, rect: Rect): boolean {
    return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
  }

  handleTouch(x: number, y: number): void {
    if (this.isInside(x, y, this.submitOrderButton)) {
      this.state.completeOrder();
      return;
    }
    if (this.isInside(x, y, this.upgradeButton)) {
      this.state.upgradeWarehouse();
      return;
    }
    if (this.isInside(x, y, this.sellAllButton) && this.state.getWarehouseUsed() > 0) {
      const gold = this.state.sellAllInventory();
      this.sellToast = createToast(`卖出成功 +${gold}金币`);
      return;
    }
    if (this.isInside(x, y, this.backButton)) {
      this.onBack();
    }
  }
}
