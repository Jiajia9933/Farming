// 游戏数据的唯一入口：金币、经验、10 块地。
// UI 层只调用这里的方法，不直接修改 Land 或存档数据。

import { loadSave, writeSave } from "./SaveManager";
import { getPlant } from "./PlantConfig";
import { Land, LandData } from "../entities/Land";

const LAND_COUNT = 10;
const STARTING_GOLD = 100;

interface SaveData {
  gold: number;
  exp: number;
  lands: LandData[];
}

function createDefaultSave(): SaveData {
  const lands: LandData[] = [];
  for (let i = 0; i < LAND_COUNT; i++) {
    lands.push({ id: i, status: "empty", plantId: null, plantedAt: null });
  }
  return { gold: STARTING_GOLD, exp: 0, lands };
}

export class GameState {
  gold: number;
  exp: number;
  lands: Land[];

  constructor() {
    const save = loadSave(createDefaultSave());
    this.gold = save.gold;
    this.exp = save.exp;
    this.lands = save.lands.map((data) => new Land(data));
  }

  private save(): void {
    const data: SaveData = {
      gold: this.gold,
      exp: this.exp,
      lands: this.lands.map((land) => land.data),
    };
    writeSave(data);
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
