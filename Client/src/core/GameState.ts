// 游戏数据的唯一入口：金币、经验、10 块地。
// UI 层只调用这里的方法，不直接修改 Land 或存档数据。

import { loadSave, writeSave } from "./SaveManager";
import { getPlant } from "./PlantConfig";
import { getCheckInRewardGold } from "./CheckInConfig";
import { getFlatGoldPerHarvest } from "./HarvestConfig";
import {
  getStartingWarehouseLevel,
  getWarehouseCapacity as calcWarehouseCapacity,
  getUpgradeCost as calcUpgradeCost,
} from "./WarehouseConfig";
import { Land, LandData } from "../entities/Land";

const LAND_COUNT = 10;
const STARTING_GOLD = 100;

interface SaveData {
  gold: number;
  exp: number;
  lands: LandData[];
  lastCheckInDate: string | null;
  inventory: Record<string, number>;
  warehouseLevel: number;
}

function createDefaultSave(): SaveData {
  const lands: LandData[] = [];
  for (let i = 0; i < LAND_COUNT; i++) {
    lands.push({ id: i, status: "empty", plantId: null, plantedAt: null });
  }
  return {
    gold: STARTING_GOLD,
    exp: 0,
    lands,
    lastCheckInDate: null,
    inventory: {},
    warehouseLevel: getStartingWarehouseLevel(),
  };
}

/** 本地设备日期的 yyyy-M-d 字符串。还没有服务器（见 Docs/11_技术架构.md），暂时用设备时间判断"今天"。 */
function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export class GameState {
  gold: number;
  exp: number;
  lands: Land[];
  inventory: Record<string, number>;
  warehouseLevel: number;
  private lastCheckInDate: string | null;

  constructor() {
    const save = loadSave(createDefaultSave());
    this.gold = save.gold;
    this.exp = save.exp;
    this.lands = save.lands.map((data) => new Land(data));
    this.lastCheckInDate = save.lastCheckInDate;
    this.inventory = save.inventory;
    this.warehouseLevel = save.warehouseLevel;
  }

  private save(): void {
    const data: SaveData = {
      gold: this.gold,
      exp: this.exp,
      lands: this.lands.map((land) => land.data),
      lastCheckInDate: this.lastCheckInDate,
      inventory: this.inventory,
      warehouseLevel: this.warehouseLevel,
    };
    writeSave(data);
  }

  getWarehouseCapacity(): number {
    return calcWarehouseCapacity(this.warehouseLevel);
  }

  getWarehouseUsed(): number {
    return Object.values(this.inventory).reduce((sum, count) => sum + count, 0);
  }

  /** 升到下一级需要的金币；已经满级时返回 null。 */
  getUpgradeCost(): number | null {
    return calcUpgradeCost(this.warehouseLevel);
  }

  upgradeWarehouse(): boolean {
    const cost = this.getUpgradeCost();
    if (cost === null || this.gold < cost) {
      return false;
    }
    this.gold -= cost;
    this.warehouseLevel += 1;
    this.save();
    return true;
  }

  /** 仓库里的作物一次性全部卖出换金币，返回卖出所得。第一版没有单独商店，先用这个占位。 */
  sellAllInventory(): number {
    let totalGold = 0;
    for (const [plantId, count] of Object.entries(this.inventory)) {
      totalGold += getPlant(plantId).sellPrice * count;
    }
    this.inventory = {};
    this.gold += totalGold;
    this.save();
    return totalGold;
  }

  canCheckInToday(): boolean {
    return this.lastCheckInDate !== todayString();
  }

  /** 领取每日签到奖励，返回获得的金币数；今天已经签过则返回 0，不做任何改动。 */
  claimDailyCheckIn(): number {
    if (!this.canCheckInToday()) {
      return 0;
    }
    const reward = getCheckInRewardGold();
    this.gold += reward;
    this.lastCheckInDate = todayString();
    this.save();
    return reward;
  }

  /** 在指定土地上种植，金币不足时返回 false，不做任何改动。 */
  plantOn(landId: number, plantId: string): boolean {
    const land = this.lands[landId];
    const plant = getPlant(plantId);
    if (!land || land.data.status !== "empty" || this.gold < plant.buyPrice) {
      return false;
    }
    this.gold -= plant.buyPrice;
    land.plant(plantId, Date.now());
    this.save();
    return true;
  }

  /**
   * 收获成熟作物存进仓库（经验立刻到手，每块地额外给固定金币，作物本身的钱要等仓库卖出才有）。
   * 仓库满了会收获失败，地里的作物保留，等腾出空间再收。
   */
  harvest(landId: number): boolean {
    const land = this.lands[landId];
    const now = Date.now();
    if (!land || !land.isMature(now)) {
      return false;
    }
    if (this.getWarehouseUsed() >= this.getWarehouseCapacity()) {
      return false;
    }
    const plantId = land.data.plantId as string;
    const plant = getPlant(plantId);
    this.exp += plant.exp;
    this.gold += getFlatGoldPerHarvest();
    this.inventory[plantId] = (this.inventory[plantId] || 0) + 1;
    land.harvest();
    this.save();
    return true;
  }
}
