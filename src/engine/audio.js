// 音频引擎
// 辅音字母使用本地录音文件（public/audio/），其他文本使用 Google Translate TTS

let currentAudio = null

// 全部44个泰语辅音字符集合（用于检测是否有本地录音）
const CONSONANTS = new Set('กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ')

// 获取 base path（兼容 GitHub Pages 子路径部署）
const BASE = import.meta.env.BASE_URL || '/'

function getLocalAudioUrl(char) {
  return `${BASE}audio/${encodeURIComponent(char)}.mp3`
}

function getTTSUrl(text, lang = 'th') {
  const encoded = encodeURIComponent(text)
  return `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encoded}`
}

// 检查文本是否对应一个辅音的发音名称
// 匹配：单个辅音字符 "ม"，或 fullName 格式 "มอ ม้า"（辅音 + อ + 空格 + 词）
function getConsonantChar(text) {
  if (!text) return null
  // 单个辅音字符
  if (text.length === 1 && CONSONANTS.has(text)) return text
  // fullName 格式如 "มอ ม้า"（第1个字符是辅音，第2个字符是 อ，第3个是空格）
  if (text.length >= 4 && CONSONANTS.has(text.charAt(0)) && text.charAt(1) === 'อ' && text.charAt(2) === ' ') {
    return text.charAt(0)
  }
  return null
}

export const audio = {
  // 播放泰语文本：辅音用本地录音，其余用 Google TTS
  speakThai(text) {
    if (!text) return
    if (currentAudio) {
      currentAudio.pause()
      currentAudio = null
    }

    const consonant = getConsonantChar(text)
    if (consonant) {
      // 使用本地辅音录音
      const a = new Audio(getLocalAudioUrl(consonant))
      currentAudio = a
      a.play().catch(() => {
        // 本地文件失败则回退到 Google TTS
        this._playGoogleTTS(text)
      })
    } else {
      this._playGoogleTTS(text)
    }
  },

  _playGoogleTTS(text) {
    const a = new Audio(getTTSUrl(text))
    a.playbackRate = 0.9
    currentAudio = a
    a.play().catch(() => {
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

  // 预加载音频
  preload(text) {
    const consonant = getConsonantChar(text)
    const a = new Audio()
    a.preload = 'auto'
    a.src = consonant ? getLocalAudioUrl(consonant) : getTTSUrl(text)
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
