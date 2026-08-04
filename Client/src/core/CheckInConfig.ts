// 读取 /config/checkin.json，每日签到奖励数值不写死在代码里。

import { loadJsonConfig } from "./ConfigLoader";

interface CheckInConfigData {
  rewardGold: number;
}

const config = loadJsonConfig<CheckInConfigData>("config/checkin.json");

export function getCheckInRewardGold(): number {
  return config.rewardGold;
}
