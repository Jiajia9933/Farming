// 读取 /config/harvest.json：每次收获（不管什么作物）都给的固定金币奖励。
// 除此之外的金币只能靠卖仓库里的作物，或者以后的订单系统（见 Docs/08_任务系统.md）。

import { loadJsonConfig } from "./ConfigLoader";

interface HarvestConfigData {
  flatGoldPerHarvest: number;
}

const config = loadJsonConfig<HarvestConfigData>("config/harvest.json");

export function getFlatGoldPerHarvest(): number {
  return config.flatGoldPerHarvest;
}
