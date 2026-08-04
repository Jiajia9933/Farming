// 单块土地的状态与生长判断。不涉及绘制、不涉及触摸，UI 层只读取这里的状态。

import { getPlant } from "../core/PlantConfig";

export type LandStatus = "empty" | "growing";

/** 生长的三个视觉阶段：发芽 / 半成熟 / 成熟。按经过时间占成熟时间的比例算。 */
export type GrowthStage = "sprout" | "growing" | "mature";

export interface LandData {
  id: number;
  status: LandStatus;
  plantId: string | null;
  plantedAt: number | null;
}

export class Land {
  data: LandData;

  constructor(data: LandData) {
    this.data = data;
  }

  plant(plantId: string, now: number): void {
    this.data.status = "growing";
    this.data.plantId = plantId;
    this.data.plantedAt = now;
  }

  isMature(now: number): boolean {
    if (this.data.status !== "growing" || this.data.plantId === null || this.data.plantedAt === null) {
      return false;
    }
    const plant = getPlant(this.data.plantId);
    const elapsedSeconds = (now - this.data.plantedAt) / 1000;
    return elapsedSeconds >= plant.matureSeconds;
  }

  /** 只有 status 是 growing 时才有意义，调用前自己确认。 */
  getGrowthStage(now: number): GrowthStage {
    const plant = getPlant(this.data.plantId as string);
    const elapsedSeconds = (now - (this.data.plantedAt as number)) / 1000;
    const progress = elapsedSeconds / plant.matureSeconds;
    if (progress >= 1) {
      return "mature";
    }
    if (progress >= 0.5) {
      return "growing";
    }
    return "sprout";
  }

  remainingSeconds(now: number): number {
    if (this.data.status !== "growing" || this.data.plantId === null || this.data.plantedAt === null) {
      return 0;
    }
    const plant = getPlant(this.data.plantId);
    const elapsedSeconds = (now - this.data.plantedAt) / 1000;
    return Math.max(0, Math.ceil(plant.matureSeconds - elapsedSeconds));
  }

  harvest(): void {
    this.data.status = "empty";
    this.data.plantId = null;
    this.data.plantedAt = null;
  }
}
