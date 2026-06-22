// 音频引擎
// 辅音和元音使用本地录音文件（public/audio/），其他文本使用 Google Translate TTS

let currentAudio = null

// 全部44个泰语辅音字符集合
const CONSONANTS = new Set('กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ')

// 元音 char（课程中使用的格式）→ 音频文件名的映射
// 音频文件名使用 อ 作为占位辅音（标准泰语元音发音方式）
const VOWEL_MAP = {
  // 单个元音符号（上/下标）
  'า': 'อา', 'ี': 'อี', 'ู': 'อู', 'ิ': 'อิ', 'ึ': 'อึ', 'ุ': 'อุ',
  // 前置元音（用 - 代表辅音位置）
  'เ-': 'เอ', 'แ-': 'แอ', 'โ-': 'โอ', 'ไ-': 'ไอ', 'ใ-': 'ใอ',
  // 后置元音
  '-ะ': 'อะ', '-อ': 'ออ', '-ือ': 'อือ',
  // 复合/包围元音
  'อำ': 'อํา', 'เ-า': 'เอา', 'เ-อ': 'เออ', 'เ-ีย': 'เอีย',
  '-ัว': 'อัว', 'เ-ือ': 'เอือ',
  // 短元音
  'แ-ะ': 'แอะ', 'โ-ะ': 'โอะ', 'เ-าะ': 'เอาะ', 'เ-อะ': 'เออะ',
}

// 获取 base path（兼容 GitHub Pages 子路径部署）
const BASE = import.meta.env.BASE_URL || '/'

function getLocalAudioUrl(filename) {
  return `${BASE}audio/${encodeURIComponent(filename)}.mp3`
}

function getTTSUrl(text, lang = 'th') {
  const encoded = encodeURIComponent(text)
  return `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encoded}`
}

// 检查文本是否有本地录音，返回音频文件名（不含 .mp3）或 null
function getLocalAudioName(text) {
  if (!text) return null
  // 辅音：单个字符
  if (text.length === 1 && CONSONANTS.has(text)) return text
  // 辅音：fullName 格式 "มอ ม้า"
  if (text.length >= 4 && CONSONANTS.has(text.charAt(0)) && text.charAt(1) === 'อ' && text.charAt(2) === ' ') {
    return text.charAt(0)
  }
  // 元音：查表
  if (VOWEL_MAP[text]) return VOWEL_MAP[text]
  return null
}

export const audio = {
  // 播放泰语文本：辅音/元音用本地录音，其余用 Google TTS
  speakThai(text) {
    if (!text) return
    if (currentAudio) {
      currentAudio.pause()
      currentAudio = null
    }

    const localName = getLocalAudioName(text)
    if (localName) {
      const a = new Audio(getLocalAudioUrl(localName))
      currentAudio = a
      a.play().catch(() => {
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
    const localName = getLocalAudioName(text)
    const a = new Audio()
    a.preload = 'auto'
    a.src = localName ? getLocalAudioUrl(localName) : getTTSUrl(text)
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
