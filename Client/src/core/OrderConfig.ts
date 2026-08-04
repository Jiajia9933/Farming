// 读取 /config/orders.json：一批订单模板，每天按日期固定挑一个（同一天不会变）。
// 奖励数值规则：按需求作物的 sellPrice/exp 总和 × 1.5 算，比直接卖仓库划算，鼓励做订单。

import { loadJsonConfig } from "./ConfigLoader";

export interface OrderRequirement {
  plantId: string;
  count: number;
}

export interface OrderTemplate {
  requirements: OrderRequirement[];
  rewardGold: number;
  rewardExp: number;
}

const templates = loadJsonConfig<OrderTemplate[]>("config/orders.json");

function hashDate(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash += dateStr.charCodeAt(i);
  }
  return hash;
}

export function getOrderForDate(dateStr: string): OrderTemplate {
  const index = hashDate(dateStr) % templates.length;
  return templates[index];
}
