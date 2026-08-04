// 本地存档读写。第一版只用微信本地存储，后续接入服务器时替换这个模块即可，
// 不影响调用方（GameState）的接口。

const SAVE_KEY = "greenfarm_save";

/**
 * 跟默认值做浅合并，而不是假设旧存档已经有全部字段——
 * 每次给存档加新字段（比如仓库、签到）都会有玩家的存档是旧版本存的，缺新字段。
 */
export function loadSave<T extends object>(defaultValue: T): T {
  const data = wx.getStorageSync<Partial<T>>(SAVE_KEY);
  if (!data) {
    return defaultValue;
  }
  return { ...defaultValue, ...data };
}

export function writeSave<T>(data: T): void {
  wx.setStorageSync(SAVE_KEY, data);
}
