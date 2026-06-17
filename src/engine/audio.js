// 音频引擎 - 使用 Web Speech API 合成泰语发音
// 生产环境应替换为预录制的音频文件

let synth = null

function getSynth() {
  if (!synth && window.speechSynthesis) {
    synth = window.speechSynthesis
  }
  return synth
}

export const audio = {
  // 使用 TTS 朗读泰语文本
  speakThai(text, rate = 0.8) {
    const s = getSynth()
    if (!s) return
    s.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'th-TH'
    utterance.rate = rate
    utterance.pitch = 1
    s.speak(utterance)
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
