// 课程数据 - L1 到 L4 完整数据，后续课程可继续扩展
export const lessons = [
  {
    id: 'L1',
    title: '第一课：零门槛起步',
    subtitle: '第1分钟学会读泰语句子！',
    consonants: [
      { char: 'ม', name: 'Mo', fullName: 'มอ ม้า', meaning: '马', class: 'low' },
      { char: 'น', name: 'No', fullName: 'นอ หนู', meaning: '老鼠', class: 'low' },
      { char: 'ต', name: 'To', fullName: 'ตอ เต่า', meaning: '乌龟', class: 'mid' },
    ],
    vowels: [
      { char: 'า', name: 'a', position: 'after', meaning: '长元音 a' },
      { char: 'ี', name: 'i', position: 'above', meaning: '长元音 i' },
    ],
    words: [
      { thai: 'มา', meaning: '来', parts: ['ม', 'า'], phonetic: 'maa' },
      { thai: 'ตา', meaning: '眼睛/外公', parts: ['ต', 'า'], phonetic: 'taa' },
      { thai: 'มี', meaning: '有', parts: ['ม', 'ี'], phonetic: 'mii' },
    ],
    sentences: [
      { thai: 'ตา มา', meaning: '外公来了', words: ['ตา', 'มา'] },
      { thai: 'ตา มี ตา', meaning: '外公有眼睛', words: ['ตา', 'มี', 'ตา'] },
    ],
  },
  {
    id: 'L2',
    title: '第二课：看与好',
    subtitle: '引入中/低辅音，掌握常见动物及动词',
    consonants: [
      { char: 'ด', name: 'Do', fullName: 'ดอ เด็ก', meaning: '小孩', class: 'mid' },
      { char: 'ป', name: 'Po', fullName: 'ปอ ปลา', meaning: '鱼', class: 'mid' },
      { char: 'ร', name: 'Ro', fullName: 'รอ เรือ', meaning: '船', class: 'low' },
    ],
    vowels: [
      { char: 'ู', name: 'u', position: 'below', meaning: '长元音 u' },
      { char: 'เ-', name: 'e', position: 'before', meaning: '长元音 e' },
    ],
    words: [
      { thai: 'ดู', meaning: '看', parts: ['ด', 'ู'], phonetic: 'duu' },
      { thai: 'ปู', meaning: '螃蟹', parts: ['ป', 'ู'], phonetic: 'puu' },
      { thai: 'รู', meaning: '洞', parts: ['ร', 'ู'], phonetic: 'ruu' },
      { thai: 'ดี', meaning: '好', parts: ['ด', 'ี'], phonetic: 'dii' },
    ],
    sentences: [
      { thai: 'ตา ดู ปู', meaning: '外公看螃蟹', words: ['ตา', 'ดู', 'ปู'] },
      { thai: 'ปู มี รู', meaning: '螃蟹有洞', words: ['ปู', 'มี', 'รู'] },
      { thai: 'ตา ดี', meaning: '外公视力好', words: ['ตา', 'ดี'] },
    ],
  },
  {
    id: 'L3',
    title: '第三课：找与心',
    subtitle: '首次引入高辅音，感知声调的基础变化',
    consonants: [
      { char: 'ข', name: 'Kho', fullName: 'ขอ ไข่', meaning: '蛋', class: 'high' },
      { char: 'ห', name: 'Ho', fullName: 'หอ หีบ', meaning: '箱子', class: 'high' },
    ],
    vowels: [
      { char: 'ไ-', name: 'ai', position: 'before', meaning: '短元音 ai' },
      { char: 'ใ-', name: 'ai', position: 'before', meaning: '短元音 ai (特殊)' },
    ],
    words: [
      { thai: 'ขา', meaning: '腿', parts: ['ข', 'า'], phonetic: 'khaa' },
      { thai: 'หา', meaning: '找', parts: ['ห', 'า'], phonetic: 'haa' },
      { thai: 'ไข่', meaning: '蛋', parts: ['ไ', 'ข', '่'], phonetic: 'khai' },
      { thai: 'ใจ', meaning: '心', parts: ['ใ', 'จ'], phonetic: 'jai' },
    ],
    sentences: [
      { thai: 'ตา หา ปู', meaning: '外公找螃蟹', words: ['ตา', 'หา', 'ปู'] },
      { thai: 'ปู มี ขา', meaning: '螃蟹有腿', words: ['ปู', 'มี', 'ขา'] },
    ],
  },
  {
    id: 'L4',
    title: '第四课：声调入门',
    subtitle: '引入最核心的声调符号及中辅音',
    consonants: [
      { char: 'ก', name: 'Ko', fullName: 'กอ ไก่', meaning: '鸡', class: 'mid' },
      { char: 'อ', name: 'O', fullName: 'ออ อ่าง', meaning: '盆', class: 'mid' },
      { char: 'ช', name: 'Cho', fullName: 'ชอ ช้าง', meaning: '大象', class: 'low' },
    ],
    vowels: [],
    toneMarks: [
      { char: '่', name: 'Mai Ek', meaning: '第一声调符号' },
    ],
    words: [
      { thai: 'ไก่', meaning: '鸡', parts: ['ไ', 'ก', '่'], phonetic: 'kai' },
      { thai: 'ปู่', meaning: '爷爷', parts: ['ป', 'ู', '่'], phonetic: 'puu' },
      { thai: 'ป่า', meaning: '森林', parts: ['ป', '่', 'า'], phonetic: 'paa' },
    ],
    sentences: [
      { thai: 'ปู่ ดู ไก่', meaning: '爷爷看鸡', words: ['ปู่', 'ดู', 'ไก่'] },
    ],
  },
]

// 获取所有已解锁课程中学过的字母（用于生成干扰项）
export function getLearnedLetters(upToLessonIndex) {
  const letters = []
  for (let i = 0; i <= upToLessonIndex && i < lessons.length; i++) {
    const lesson = lessons[i]
    lesson.consonants.forEach(c => letters.push(c))
  }
  return letters
}
