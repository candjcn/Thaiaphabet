// 音频引擎
// 所有泰语发音（辅音、元音、单词、句子）均使用本地 WAV 录音文件

let currentAudio = null

// 全部44个泰语辅音字符集合
const CONSONANTS = new Set('กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ')

// 元音 char（课程中使用的格式）→ 音频文件名的映射
const VOWEL_MAP = {
  'า': 'อา', 'ี': 'อี', 'ู': 'อู', 'ิ': 'อิ', 'ึ': 'อึ', 'ุ': 'อุ',
  'เ-': 'เอ', 'แ-': 'แอ', 'โ-': 'โอ', 'ไ-': 'ไอ', 'ใ-': 'ใอ',
  '-ะ': 'อะ', '-อ': 'ออ', '-ือ': 'อือ',
  'อำ': 'อํา', 'เ-า': 'เอา', 'เ-อ': 'เออ', 'เ-ีย': 'เอีย',
  '-ัว': 'อัว', 'เ-ือ': 'เอือ',
  'แ-ะ': 'แอะ', 'โ-ะ': 'โอะ', 'เ-าะ': 'เอาะ', 'เ-อะ': 'เออะ',
}

const BASE = import.meta.env.BASE_URL || '/'

function getLocalAudioUrl(filename) {
  return `${BASE}audio/${encodeURIComponent(filename)}.wav`
}

// 获取本地音频文件名
function getLocalAudioName(text) {
  if (!text) return null
  // 辅音：单个字符
  if (text.length === 1 && CONSONANTS.has(text)) return text
  // 辅音：fullName 格式 "มอ ม้า" → 取首字符
  if (text.length >= 4 && CONSONANTS.has(text.charAt(0)) && text.charAt(1) === 'อ' && text.charAt(2) === ' ') {
    return text.charAt(0)
  }
  // 元音：查表
  if (VOWEL_MAP[text]) return VOWEL_MAP[text]
  // 单词和句子：直接用文本作为文件名
  return text
}

export const audio = {
  // 播放泰语文本：全部使用本地音频文件
  speakThai(text) {
    if (!text) return
    if (currentAudio) {
      currentAudio.pause()
      currentAudio = null
    }

    const localName = getLocalAudioName(text)
    const a = new Audio(getLocalAudioUrl(localName))
    currentAudio = a
    a.play().catch(() => {
      // 本地文件不存在时回退到浏览器 TTS
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
    a.src = getLocalAudioUrl(localName)
  },

  // 播放音效
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
