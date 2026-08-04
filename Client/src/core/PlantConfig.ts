// 读取 /config/plants.json，不允许任何植物数值写死在代码里。
// 新增植物时只需要改 config/plants.json，不需要改这个文件。

import { loadJsonConfig } from "./ConfigLoader";

export interface PlantDef {
  id: string;
  name: string;
  icon: string;
  /** 发芽阶段的图标，每种作物不一样，让还没成熟的地块也能一眼分辨种的是什么。 */
  sproutIcon: string;
  /** 半成熟阶段的图标，同样每种作物不一样。 */
  growingIcon: string;
  /** 玩家等级低于这个值时不能种这个作物。 */
  requiredLevel: number;
  buyPrice: number;
  sellPrice: number;
  matureSeconds: number;
  exp: number;
}

const plantData = loadJsonConfig<Record<string, PlantDef>>("config/plants.json");

export function getPlant(id: string): PlantDef {
  const plant = plantData[id];
  if (!plant) {
    throw new Error(`未知植物配置: ${id}`);
  }
  return plant;
}

/** 种植菜单要展示的作物列表，顺序与 config/plants.json 里的书写顺序一致。 */
export function getAllPlants(): PlantDef[] {
  return Object.values(plantData);
}
