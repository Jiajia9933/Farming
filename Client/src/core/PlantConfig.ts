// 读取 /config/plants.json，不允许任何植物数值写死在代码里。
// 新增植物时只需要改 config/plants.json，不需要改这个文件。

export interface PlantDef {
  id: string;
  name: string;
  buyPrice: number;
  sellPrice: number;
  matureSeconds: number;
  exp: number;
}

const plantData: Record<string, PlantDef> = require("../config/plants.json");

export function getPlant(id: string): PlantDef {
  const plant = plantData[id];
  if (!plant) {
    throw new Error(`未知植物配置: ${id}`);
  }
  return plant;
}
