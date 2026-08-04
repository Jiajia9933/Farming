// 所有场景（首页农场、地图、好友农场）都实现这个接口，game.ts 只认这个接口切场景。

export interface Scene {
  render(): void;
  handleTouch(x: number, y: number): void;
}
