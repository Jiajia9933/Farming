// 微信小游戏运行时环境的最小类型声明。
// 只声明本项目实际用到的 API，需要更多 API 时再补充。

interface WxTouch {
  clientX: number;
  clientY: number;
}

interface WxTouchEvent {
  touches: WxTouch[];
}

interface WxSystemInfo {
  windowWidth: number;
  windowHeight: number;
  pixelRatio: number;
}

interface WxCanvasContext2D {
  fillStyle: string;
  strokeStyle: string;
  lineWidth: number;
  font: string;
  textAlign: string;
  textBaseline: string;
  fillRect(x: number, y: number, w: number, h: number): void;
  strokeRect(x: number, y: number, w: number, h: number): void;
  clearRect(x: number, y: number, w: number, h: number): void;
  fillText(text: string, x: number, y: number): void;
  beginPath(): void;
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number): void;
  fill(): void;
}

interface WxCanvas {
  width: number;
  height: number;
  getContext(type: "2d"): WxCanvasContext2D;
}

interface WxFileSystemManager {
  readFileSync(filePath: string, encoding: string): string;
}

interface WxRect {
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
  height: number;
}

interface Wx {
  getSystemInfoSync(): WxSystemInfo;
  createCanvas(): WxCanvas;
  onTouchStart(callback: (event: WxTouchEvent) => void): void;
  setStorageSync(key: string, data: unknown): void;
  getStorageSync<T = unknown>(key: string): T;
  getFileSystemManager(): WxFileSystemManager;
  /** 胶囊菜单按钮（右上角"..."和圆点）在屏幕上的位置，用来确定顶部安全区域。 */
  getMenuButtonBoundingClientRect(): WxRect;
}

declare const wx: Wx;
declare function require(path: string): any;
