// 使用 Google Cloud Text-to-Speech API 批量生成单词和句子的音频文件
// 用法: node scripts/generate-tts.mjs <API_KEY>

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const AUDIO_DIR = path.join(__dirname, '..', 'public', 'audio')

const API_KEY = process.argv[2]
if (!API_KEY) {
  console.error('用法: node scripts/generate-tts.mjs <GOOGLE_CLOUD_API_KEY>')
  console.error('请先在 Google Cloud Console 启用 Cloud Text-to-Speech API 并创建 API Key')
  process.exit(1)
}

const TTS_URL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`

// 所有需要生成音频的文本（从 lessons.js 提取）
const texts = [
  // L1 words
  'มา', 'ตา', 'มี',
  // L2 words
  'ดู', 'ปู', 'รู', 'ดี',
  // L3 words
  'ขา', 'หา', 'ไข่', 'ใจ',
  // L4 words
  'ไก่', 'ปู่', 'ป่า',
  // L5 words
  'ลา', 'แม่', 'แตะ', 'บี',
  // L6 words
  'ยา', 'โต', 'คอ', 'จา',
  // L7 words
  'งู', 'พ่อ', 'ทำ', 'เขา',
  // L8 words
  'สี', 'ผี', 'น้า', 'ซื้อ',
  // L9 words
  'มือ', 'คือ', 'เธอ', 'ภู',
  // L10 words
  'ฉัน', 'ฝน', 'ถูก', 'หัว',
  // L11 words
  'โต๊ะ', 'ญาติ', 'ฐาน', 'คุณ',
  // L12 words
  'แพะ', 'เกาะ', 'โละ', 'เมือง',
  // L13 words
  'ศาลา', 'ฆ้อง', 'นิด', 'ศึก',
  // L14 words
  'กฎ', 'ปฏิ', 'จุด', 'ครุ',
  // L15 words
  'ฮา', 'จุฬา', 'ฮู้',
  // L1 sentences
  'ตา มา', 'ตา มี ตา',
  // L2 sentences
  'ตา ดู ปู', 'ปู มี รู', 'ตา ดี',
  // L3 sentences
  'ตา หา ปู', 'ปู มี ขา',
  // L4 sentences
  'ปู่ ดู ไก่',
  // L5 sentences
  'แม่ มา', 'แม่ มี ตา ดี',
  // L6 sentences
  'ตา โต', 'ปู่ มี ยา',
  // L7 sentences
  'พ่อ มา', 'เขา ดู งู', 'แม่ ทำ ยา',
  // L8 sentences
  'แม่ ซื้อ ยา', 'น้า มา หา แม่',
  // L9 sentences
  'เธอ มี มือ', 'เขา คือ พ่อ',
  // L10 sentences
  'ฉัน ดี', 'ฝน ตก',
  // L11 sentences
  'คุณ มี โต๊ะ', 'คุณ คือ ญาติ',
  // L12 sentences
  'ดู แพะ', 'เขา มา จาก เกาะ',
  // L13 sentences
  'ดู ศาลา', 'มี ฆ้อง นิด',
  // L14 sentences
  'มี กฎ', 'ดู จุด นี้',
  // L15 sentences
  'เขา ฮา', 'ดู จุฬา',
]

async function synthesize(text) {
  const body = {
    input: { text },
    voice: {
      languageCode: 'th-TH',
      name: 'th-TH-Neural2-C',  // 女声，高质量 Neural2
    },
    audioConfig: {
      audioEncoding: 'LINEAR16',  // WAV
      speakingRate: 0.85,         // 稍慢，适合学习
      pitch: 0,
    },
  }

  const res = await fetch(TTS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`API error for "${text}": ${res.status} ${err}`)
  }

  const data = await res.json()
  return Buffer.from(data.audioContent, 'base64')
}

async function main() {
  // 确保目录存在
  if (!fs.existsSync(AUDIO_DIR)) {
    fs.mkdirSync(AUDIO_DIR, { recursive: true })
  }

  console.log(`准备生成 ${texts.length} 个音频文件...`)
  console.log(`输出目录: ${AUDIO_DIR}\n`)

  let success = 0
  let fail = 0

  for (let i = 0; i < texts.length; i++) {
    const text = texts[i]
    const filename = `${text}.wav`
    const filepath = path.join(AUDIO_DIR, filename)

    // 跳过已存在的文件
    if (fs.existsSync(filepath)) {
      console.log(`[${i + 1}/${texts.length}] 跳过已存在: ${filename}`)
      success++
      continue
    }

    try {
      process.stdout.write(`[${i + 1}/${texts.length}] 生成: ${text} ... `)
      const audioData = await synthesize(text)
      fs.writeFileSync(filepath, audioData)
      console.log(`✓ (${(audioData.length / 1024).toFixed(1)} KB)`)
      success++

      // 避免 API 速率限制
      await new Promise(r => setTimeout(r, 200))
    } catch (e) {
      console.log(`✗ ${e.message}`)
      fail++
    }
  }

  console.log(`\n完成！成功: ${success}, 失败: ${fail}`)
}

main()
