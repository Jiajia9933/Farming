// 飞行粒子特效：一个图标从起点飞到终点，边飞边缩小变淡。
// 用于收获时"星星飞向金币/经验"这类一次性反馈，跟具体场景无关，谁都能用。

export interface FlyingParticle {
  icon: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startTime: number;
  duration: number;
}

export function createParticle(
  icon: string,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  durationMs = 500
): FlyingParticle {
  return { icon, startX, startY, endX, endY, startTime: Date.now(), duration: durationMs };
}

export function isParticleAlive(particle: FlyingParticle, now: number): boolean {
  return now - particle.startTime < particle.duration;
}

export function drawParticle(ctx: WxCanvasContext2D, particle: FlyingParticle, now: number): void {
  const t = Math.min(1, (now - particle.startTime) / particle.duration);
  const eased = 1 - Math.pow(1 - t, 2); // 先快后慢，飞到目标附近时减速

  const x = particle.startX + (particle.endX - particle.startX) * eased;
  const y = particle.startY + (particle.endY - particle.startY) * eased;
  const size = 24 - 10 * eased;

  ctx.globalAlpha = 1 - eased * 0.4;
  ctx.font = `${size}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(particle.icon, x, y);
  ctx.globalAlpha = 1;
}
