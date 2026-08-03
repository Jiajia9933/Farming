// 本地存档读写。第一版只用微信本地存储，后续接入服务器时替换这个模块即可，
// 不影响调用方（GameState）的接口。

const SAVE_KEY = "greenfarm_save";

export function loadSave<T>(defaultValue: T): T {
  const data = wx.getStorageSync<T>(SAVE_KEY);
  if (!data) {
    return defaultValue;
  }
  return data;
}

export function writeSave<T>(data: T): void {
  wx.setStorageSync(SAVE_KEY, data);
}
