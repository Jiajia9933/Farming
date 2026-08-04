// 游戏数据的唯一入口：金币、经验、10 块地。
// UI 层只调用这里的方法，不直接修改 Land 或存档数据。

import { loadSave, writeSave } from "./SaveManager";
import { getPlant } from "./PlantConfig";
import { getCheckInRewardGold } from "./CheckInConfig";
import { Land, LandData } from "../entities/Land";

const LAND_COUNT = 10;
const STARTING_GOLD = 100;

interface SaveData {
  gold: number;
  exp: number;
  lands: LandData[];
  lastCheckInDate: string | null;
}

function createDefaultSave(): SaveData {
  const lands: LandData[] = [];
  for (let i = 0; i < LAND_COUNT; i++) {
    lands.push({ id: i, status: "empty", plantId: null, plantedAt: null });
  }
  return { gold: STARTING_GOLD, exp: 0, lands, lastCheckInDate: null };
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
  private lastCheckInDate: string | null;

  constructor() {
    const save = loadSave(createDefaultSave());
    this.gold = save.gold;
    this.exp = save.exp;
    this.lands = save.lands.map((data) => new Land(data));
    this.lastCheckInDate = save.lastCheckInDate;
  }

  private save(): void {
    const data: SaveData = {
      gold: this.gold,
      exp: this.exp,
      lands: this.lands.map((land) => land.data),
      lastCheckInDate: this.lastCheckInDate,
    };
    writeSave(data);
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

  /** 收获成熟作物，返回是否成功收获。 */
  harvest(landId: number): boolean {
    const land = this.lands[landId];
    const now = Date.now();
    if (!land || !land.isMature(now)) {
      return false;
    }
    const plant = getPlant(land.data.plantId as string);
    this.gold += plant.sellPrice;
    this.exp += plant.exp;
    land.harvest();
    this.save();
    return true;
  }
}
