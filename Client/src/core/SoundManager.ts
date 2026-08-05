// 音效播放。现在还没有真实的音频素材文件，所以先把播放逻辑接好，
// 文件不存在时安静地失败（不报错不崩溃），等真的音频文件放进 Client/assets/audio/ 就能响，不用改代码。

const audioCache: Record<string, WxInnerAudioContext> = {};

function getAudio(src: string): WxInnerAudioContext {
  let audio = audioCache[src];
  if (!audio) {
    audio = wx.createInnerAudioContext();
    audio.src = src;
    audio.onError(() => {
      // 音频文件还没放进去，或者格式不支持：忽略，不影响游戏正常运行。
    });
    audioCache[src] = audio;
  }
  return audio;
}

export function playHarvestSound(): void {
  const audio = getAudio("assets/audio/harvest.mp3");
  audio.stop();
  audio.play();
}
