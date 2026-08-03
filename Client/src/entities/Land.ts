// 单块土地的状态与生长判断。不涉及绘制、不涉及触摸，UI 层只读取这里的状态。

import { getPlant } from "../core/PlantConfig";

export type LandStatus = "empty" | "growing";

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
