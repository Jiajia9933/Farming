// 统一读取 /config 下的 json 配置。小游戏的 require 不支持 .json，
// 所有需要读配置的模块都用这个函数，不要各写各的文件读取逻辑。

export function loadJsonConfig<T>(relativePath: string): T {
  const raw = wx.getFileSystemManager().readFileSync(relativePath, "utf8") as string;
  return JSON.parse(raw) as T;
}
