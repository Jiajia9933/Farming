// 读取 /config/warehouse.json：仓库等级 1~20，每级容量 = level * capacityPerLevel，
// 20级时刚好是 20 * 10 = 200。升级花费 = level * upgradeGoldPerLevel（从当前等级升到下一级）。

import { loadJsonConfig } from "./ConfigLoader";

interface WarehouseConfigData {
  startingLevel: number;
  maxLevel: number;
  capacityPerLevel: number;
  upgradeGoldPerLevel: number;
}

const config = loadJsonConfig<WarehouseConfigData>("config/warehouse.json");

export function getStartingWarehouseLevel(): number {
  return config.startingLevel;
}

export function getMaxWarehouseLevel(): number {
  return config.maxLevel;
}

export function getWarehouseCapacity(level: number): number {
  return level * config.capacityPerLevel;
}

/** 从 level 升到 level+1 需要的金币；已经满级时返回 null。 */
export function getUpgradeCost(level: number): number | null {
  if (level >= config.maxLevel) {
    return null;
  }
  return level * config.upgradeGoldPerLevel;
}
