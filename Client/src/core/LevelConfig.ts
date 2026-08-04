// 读取 /config/levels.json：等级经验曲线。
// 升到下一级需要的经验 = 上一级需要的经验 × growthRate，第一级门槛是 baseExp。
// 规则说明见 Docs/04_经济系统.md「等级经验曲线」。

import { loadJsonConfig } from "./ConfigLoader";

interface LevelConfigData {
  baseExp: number;
  growthRate: number;
}

const config = loadJsonConfig<LevelConfigData>("config/levels.json");

export function getLevelForExp(totalExp: number): number {
  let level = 1;
  let remaining = totalExp;
  let needed = config.baseExp;

  while (remaining >= needed) {
    remaining -= needed;
    level += 1;
    needed = Math.round(needed * config.growthRate);
  }

  return level;
}
