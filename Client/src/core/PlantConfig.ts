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

// 小游戏的 require 只支持 .js 模块，不支持直接 require 一个 .json 文件，
// 所以用文件系统 API 读取文本内容自己解析。路径相对于小游戏包根目录（game.json 所在目录）。
const rawConfig = wx.getFileSystemManager().readFileSync("config/plants.json", "utf8") as string;
const plantData: Record<string, PlantDef> = JSON.parse(rawConfig);

export function getPlant(id: string): PlantDef {
  const plant = plantData[id];
  if (!plant) {
    throw new Error(`未知植物配置: ${id}`);
  }
  return plant;
}
