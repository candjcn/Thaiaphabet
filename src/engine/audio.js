// 音频引擎 - 使用 Google Translate TTS 获取高质量泰语发音
// 通过 <audio> 标签加载，无 CORS 限制

let currentAudio = null

function getTTSUrl(text, lang = 'th') {
  const encoded = encodeURIComponent(text)
  return `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encoded}`
}

export const audio = {
  // 使用 Google Translate TTS 朗读泰语文本
  speakThai(text) {
    if (!text) return
    // 停止当前正在播放的音频
    if (currentAudio) {
      currentAudio.pause()
      currentAudio = null
    }
    const a = new Audio(getTTSUrl(text))
    a.playbackRate = 0.9
    currentAudio = a
    a.play().catch(() => {
      // 如果 Google TTS 失败，回退到浏览器 TTS
      this._fallbackSpeak(text)
    })
  },

  // 浏览器 TTS 回退方案
  _fallbackSpeak(text) {
    const synth = window.speechSynthesis
    if (!synth) return
    synth.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'th-TH'
    utterance.rate = 0.8
    synth.speak(utterance)
  },

  // 预加载音频（用于提升响应速度）
  preload(text) {
    const a = new Audio()
    a.preload = 'auto'
    a.src = getTTSUrl(text)
  },

  // 播放音效（使用 AudioContext 生成简单音效）
  playCorrect() {
    this._playTone([523.25, 659.25, 783.99], 0.15)
  },

  playIncorrect() {
    this._playTone([311.13, 233.08], 0.2)
  },

  playClick() {
    this._playTone([800], 0.05)
  },

  playCelebration() {
    const notes = [523.25, 659.25, 783.99, 1046.50]
    notes.forEach((freq, i) => {
      setTimeout(() => this._playTone([freq], 0.15), i * 150)
    })
  },

  _playTone(frequencies, duration) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        osc.type = 'sine'
        gain.gain.setValueAtTime(0.3, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
        osc.start(ctx.currentTime + i * 0.05)
        osc.stop(ctx.currentTime + duration + i * 0.05)
      })
    } catch {
      // AudioContext not available
    }
  },
}
