// 课程数据 - L1 到 L15 完整泰语辅音+元音课程
export const lessons = [
  // ════════════════════════════════════════
  // 第一阶段：基础入门 (L1-L4)
  // ════════════════════════════════════════
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
      { char: 'า', name: 'aa', position: 'after', meaning: '长元音 aa' },
      { char: 'ี', name: 'ii', position: 'above', meaning: '长元音 ii' },
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
      { char: 'ู', name: 'uu', position: 'below', meaning: '长元音 uu' },
      { char: 'เ-', name: 'ee', position: 'before', meaning: '长元音 ee' },
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
      { char: 'ไ-', name: 'ai', position: 'before', meaning: '元音 ai' },
      { char: 'ใ-', name: 'ai', position: 'before', meaning: '元音 ai（特殊）' },
    ],
    words: [
      { thai: 'ขา', meaning: '腿', parts: ['ข', 'า'], phonetic: 'khǎa' },
      { thai: 'หา', meaning: '找', parts: ['ห', 'า'], phonetic: 'hǎa' },
      { thai: 'ไข่', meaning: '蛋', parts: ['ไ', 'ข', '่'], phonetic: 'khài' },
      { thai: 'ใจ', meaning: '心', parts: ['ใ', 'จ'], phonetic: 'jai' },
    ],
    sentences: [
      { thai: 'ตา หา ปู', meaning: '外公找螃蟹', words: ['ตา', 'หา', 'ปู'] },
      { thai: 'ปู มี ขา', meaning: '螃蟹有腿', words: ['ปู', 'มี', 'ขา'] },
    ],
  },
  {
    id: 'L4',
    title: '第四课：鸡与大象',
    subtitle: '学习中低辅音 ก อ ช，初识声调符号 ่',
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
      { thai: 'ไก่', meaning: '鸡', parts: ['ไ', 'ก', '่'], phonetic: 'kài' },
      { thai: 'ปู่', meaning: '爷爷', parts: ['ป', 'ู', '่'], phonetic: 'pùu' },
      { thai: 'ป่า', meaning: '森林', parts: ['ป', '่', 'า'], phonetic: 'pàa' },
    ],
    sentences: [
      { thai: 'ปู่ ดู ไก่', meaning: '爷爷看鸡', words: ['ปู่', 'ดู', 'ไก่'] },
    ],
  },

  // ════════════════════════════════════════
  // 第二阶段：日常高频 (L5-L7)
  // ════════════════════════════════════════
  {
    id: 'L5',
    title: '第五课：妈妈来了',
    subtitle: '学习高频辅音和前置元音 แ-',
    consonants: [
      { char: 'บ', name: 'Bo', fullName: 'บอ ใบไม้', meaning: '叶子', class: 'mid' },
      { char: 'ล', name: 'Lo', fullName: 'ลอ ลิง', meaning: '猴子', class: 'low' },
      { char: 'ว', name: 'Wo', fullName: 'วอ แหวน', meaning: '戒指', class: 'low' },
    ],
    vowels: [
      { char: 'แ-', name: 'ae', position: 'before', meaning: '长元音 ae' },
      { char: '-ะ', name: 'a', position: 'after', meaning: '短元音 a' },
    ],
    words: [
      { thai: 'ลา', meaning: '告别', parts: ['ล', 'า'], phonetic: 'laa' },
      { thai: 'แม่', meaning: '妈妈', parts: ['แ', 'ม', '่'], phonetic: 'mâe' },
      { thai: 'แตะ', meaning: '触碰', parts: ['แ', 'ต', 'ะ'], phonetic: 'tàe' },
      { thai: 'บี', meaning: '压扁', parts: ['บ', 'ี'], phonetic: 'bii' },
    ],
    sentences: [
      { thai: 'แม่ มา', meaning: '妈妈来了', words: ['แม่', 'มา'] },
      { thai: 'แม่ มี ตา ดี', meaning: '妈妈视力好', words: ['แม่', 'มี', 'ตา', 'ดี'] },
    ],
  },
  {
    id: 'L6',
    title: '第六课：大与药',
    subtitle: '学习低辅音 ค 和前置元音 โ-',
    consonants: [
      { char: 'ค', name: 'Kho', fullName: 'คอ ควาย', meaning: '水牛', class: 'low' },
      { char: 'จ', name: 'Jo', fullName: 'จอ จาน', meaning: '盘子', class: 'mid' },
      { char: 'ย', name: 'Yo', fullName: 'ยอ ยักษ์', meaning: '巨人', class: 'low' },
    ],
    vowels: [
      { char: 'โ-', name: 'oo', position: 'before', meaning: '长元音 oo' },
      { char: '-อ', name: 'aw', position: 'after', meaning: '长元音 aw' },
    ],
    words: [
      { thai: 'ยา', meaning: '药', parts: ['ย', 'า'], phonetic: 'yaa' },
      { thai: 'โต', meaning: '大', parts: ['โ', 'ต'], phonetic: 'too' },
      { thai: 'คอ', meaning: '脖子', parts: ['ค', 'อ'], phonetic: 'khaw' },
      { thai: 'จา', meaning: '记得', parts: ['จ', 'า'], phonetic: 'jaa' },
    ],
    sentences: [
      { thai: 'ตา โต', meaning: '眼睛大', words: ['ตา', 'โต'] },
      { thai: 'ปู่ มี ยา', meaning: '爷爷有药', words: ['ปู่', 'มี', 'ยา'] },
    ],
  },
  {
    id: 'L7',
    title: '第七课：爸爸与蛇',
    subtitle: '学习鼻音辅音和复合元音',
    consonants: [
      { char: 'ง', name: 'Ngo', fullName: 'งอ งู', meaning: '蛇', class: 'low' },
      { char: 'พ', name: 'Pho', fullName: 'พอ พาน', meaning: '托盘', class: 'low' },
      { char: 'ท', name: 'Tho', fullName: 'ทอ ทหาร', meaning: '军人', class: 'low' },
    ],
    vowels: [
      { char: 'อำ', name: 'am', position: 'after', meaning: '复合元音 am' },
      { char: 'เ-า', name: 'ao', position: 'wrap', meaning: '复合元音 ao' },
    ],
    words: [
      { thai: 'งู', meaning: '蛇', parts: ['ง', 'ู'], phonetic: 'nguu' },
      { thai: 'พ่อ', meaning: '爸爸', parts: ['พ', '่', 'อ'], phonetic: 'phâw' },
      { thai: 'ทำ', meaning: '做', parts: ['ท', 'ำ'], phonetic: 'tham' },
      { thai: 'เขา', meaning: '他/她', parts: ['เ', 'ข', 'า'], phonetic: 'khǎo' },
    ],
    sentences: [
      { thai: 'พ่อ มา', meaning: '爸爸来了', words: ['พ่อ', 'มา'] },
      { thai: 'เขา ดู งู', meaning: '他看蛇', words: ['เขา', 'ดู', 'งู'] },
      { thai: 'แม่ ทำ ยา', meaning: '妈妈制药', words: ['แม่', 'ทำ', 'ยา'] },
    ],
  },

  // ════════════════════════════════════════
  // 第三阶段：扩展辅音 (L8-L10)
  // ════════════════════════════════════════
  {
    id: 'L8',
    title: '第八课：颜色与水',
    subtitle: '学习高频擦音和第二声调符号',
    consonants: [
      { char: 'ส', name: 'So', fullName: 'สอ เสือ', meaning: '老虎', class: 'high' },
      { char: 'ซ', name: 'So', fullName: 'ซอ โซ่', meaning: '链条', class: 'low' },
      { char: 'ผ', name: 'Pho', fullName: 'ผอ ผึ้ง', meaning: '蜜蜂', class: 'high' },
    ],
    vowels: [],
    toneMarks: [
      { char: '้', name: 'Mai Tho', meaning: '第二声调符号' },
    ],
    words: [
      { thai: 'สี', meaning: '颜色', parts: ['ส', 'ี'], phonetic: 'sǐi' },
      { thai: 'ผี', meaning: '鬼', parts: ['ผ', 'ี'], phonetic: 'phǐi' },
      { thai: 'น้า', meaning: '阿姨/叔叔', parts: ['น', '้', 'า'], phonetic: 'náa' },
      { thai: 'ซื้อ', meaning: '买', parts: ['ซ', 'ื้', 'อ'], phonetic: 'súe' },
    ],
    sentences: [
      { thai: 'แม่ ซื้อ ยา', meaning: '妈妈买药', words: ['แม่', 'ซื้อ', 'ยา'] },
      { thai: 'น้า มา หา แม่', meaning: '阿姨来找妈妈', words: ['น้า', 'มา', 'หา', 'แม่'] },
    ],
  },
  {
    id: 'L9',
    title: '第九课：手与山',
    subtitle: '学习中位元音 เ-อ 和 ือ',
    consonants: [
      { char: 'ฟ', name: 'Fo', fullName: 'ฟอ ฟัน', meaning: '牙齿', class: 'low' },
      { char: 'ธ', name: 'Tho', fullName: 'ธอ ธง', meaning: '旗帜', class: 'low' },
      { char: 'ภ', name: 'Pho', fullName: 'ภอ สำเภา', meaning: '帆船', class: 'low' },
    ],
    vowels: [
      { char: 'เ-อ', name: 'oe', position: 'wrap', meaning: '长元音 oe' },
      { char: '-ือ', name: 'ue', position: 'above', meaning: '长元音 ue' },
    ],
    words: [
      { thai: 'มือ', meaning: '手', parts: ['ม', 'ือ'], phonetic: 'mue' },
      { thai: 'คือ', meaning: '是', parts: ['ค', 'ือ'], phonetic: 'khue' },
      { thai: 'เธอ', meaning: '她/你', parts: ['เ', 'ธ', 'อ'], phonetic: 'thoe' },
      { thai: 'ภู', meaning: '山', parts: ['ภ', 'ู'], phonetic: 'phuu' },
    ],
    sentences: [
      { thai: 'เธอ มี มือ', meaning: '她有手', words: ['เธอ', 'มี', 'มือ'] },
      { thai: 'เขา คือ พ่อ', meaning: '他是爸爸', words: ['เขา', 'คือ', 'พ่อ'] },
    ],
  },
  {
    id: 'L10',
    title: '第十课：我与雨',
    subtitle: '学习高辅音组和双元音',
    consonants: [
      { char: 'ฉ', name: 'Cho', fullName: 'ฉอ ฉิ่ง', meaning: '钹', class: 'high' },
      { char: 'ถ', name: 'Tho', fullName: 'ถอ ถุง', meaning: '袋子', class: 'high' },
      { char: 'ฝ', name: 'Fo', fullName: 'ฝอ ฝา', meaning: '盖子', class: 'high' },
    ],
    vowels: [
      { char: 'เ-ีย', name: 'ia', position: 'wrap', meaning: '双元音 ia' },
      { char: '-ัว', name: 'ua', position: 'mixed', meaning: '双元音 ua' },
    ],
    words: [
      { thai: 'ฉัน', meaning: '我', parts: ['ฉ', 'ั', 'น'], phonetic: 'chǎn' },
      { thai: 'ฝน', meaning: '雨', parts: ['ฝ', 'น'], phonetic: 'fǒn' },
      { thai: 'ถูก', meaning: '对/便宜', parts: ['ถ', 'ู', 'ก'], phonetic: 'thùuk' },
      { thai: 'หัว', meaning: '头', parts: ['ห', 'ั', 'ว'], phonetic: 'hǔa' },
    ],
    sentences: [
      { thai: 'ฉัน ดี', meaning: '我很好', words: ['ฉัน', 'ดี'] },
      { thai: 'ฝน ตก', meaning: '下雨了', words: ['ฝน', 'ตก'] },
    ],
  },

  // ════════════════════════════════════════
  // 第四阶段：完整声调 (L11-L12)
  // ════════════════════════════════════════
  {
    id: 'L11',
    title: '第十一课：声调全掌握',
    subtitle: '学会全部四个声调符号',
    consonants: [
      { char: 'ญ', name: 'Yo', fullName: 'ญอ หญิง', meaning: '女人', class: 'low' },
      { char: 'ณ', name: 'No', fullName: 'ณอ เณร', meaning: '沙弥', class: 'low' },
      { char: 'ฐ', name: 'Tho', fullName: 'ฐอ ฐาน', meaning: '台座', class: 'high' },
    ],
    vowels: [],
    toneMarks: [
      { char: '๊', name: 'Mai Tri', meaning: '第三声调符号' },
      { char: '๋', name: 'Mai Chattawa', meaning: '第四声调符号' },
    ],
    words: [
      { thai: 'โต๊ะ', meaning: '桌子', parts: ['โ', 'ต', '๊', 'ะ'], phonetic: 'tó' },
      { thai: 'ญาติ', meaning: '亲戚', parts: ['ญ', 'า', 'ต', 'ิ'], phonetic: 'yâat' },
      { thai: 'ฐาน', meaning: '基座', parts: ['ฐ', 'า', 'น'], phonetic: 'thǎan' },
      { thai: 'คุณ', meaning: '你/您', parts: ['ค', 'ุ', 'ณ'], phonetic: 'khun' },
    ],
    sentences: [
      { thai: 'คุณ มี โต๊ะ', meaning: '你有桌子', words: ['คุณ', 'มี', 'โต๊ะ'] },
      { thai: 'คุณ คือ ญาติ', meaning: '你是亲戚', words: ['คุณ', 'คือ', 'ญาติ'] },
    ],
  },
  {
    id: 'L12',
    title: '第十二课：短元音大集合',
    subtitle: '学习短元音和三合元音 เ-ือ',
    consonants: [],
    vowels: [
      { char: 'แ-ะ', name: 'ae', position: 'wrap', meaning: '短元音 ae' },
      { char: 'โ-ะ', name: 'o', position: 'wrap', meaning: '短元音 o' },
      { char: 'เ-าะ', name: 'aw', position: 'wrap', meaning: '短元音 aw' },
      { char: 'เ-อะ', name: 'oe', position: 'wrap', meaning: '短元音 oe' },
      { char: 'เ-ือ', name: 'uea', position: 'wrap', meaning: '三合元音 uea' },
    ],
    words: [
      { thai: 'แพะ', meaning: '山羊', parts: ['แ', 'พ', 'ะ'], phonetic: 'pháe' },
      { thai: 'เกาะ', meaning: '岛', parts: ['เ', 'ก', 'า', 'ะ'], phonetic: 'kàw' },
      { thai: 'โละ', meaning: '丢弃', parts: ['โ', 'ล', 'ะ'], phonetic: 'ló' },
      { thai: 'เมือง', meaning: '城市', parts: ['เ', 'ม', 'ือ', 'ง'], phonetic: 'mueang' },
    ],
    sentences: [
      { thai: 'ดู แพะ', meaning: '看山羊', words: ['ดู', 'แพะ'] },
      { thai: 'เขา มา จาก เกาะ', meaning: '他来自岛上', words: ['เขา', 'มา', 'จาก', 'เกาะ'] },
    ],
  },

  // ════════════════════════════════════════
  // 第五阶段：梵巴字母 + 收官 (L13-L15)
  // ════════════════════════════════════════
  {
    id: 'L13',
    title: '第十三课：古典字母（一）',
    subtitle: '认识梵文巴利文来源的辅音',
    consonants: [
      { char: 'ศ', name: 'So', fullName: 'ศอ ศาลา', meaning: '亭子', class: 'high' },
      { char: 'ษ', name: 'So', fullName: 'ษอ ฤษี', meaning: '隐士', class: 'high' },
      { char: 'ฆ', name: 'Kho', fullName: 'ฆอ ระฆัง', meaning: '钟', class: 'low' },
    ],
    vowels: [
      { char: '-ึ', name: 'ue', position: 'above', meaning: '短元音 ue' },
      { char: '-ิ', name: 'i', position: 'above', meaning: '短元音 i' },
    ],
    words: [
      { thai: 'ศาลา', meaning: '亭子', parts: ['ศ', 'า', 'ล', 'า'], phonetic: 'sǎa-laa' },
      { thai: 'ฆ้อง', meaning: '锣', parts: ['ฆ', '้', 'อ', 'ง'], phonetic: 'kháwng' },
      { thai: 'นิด', meaning: '一点', parts: ['น', 'ิ', 'ด'], phonetic: 'nít' },
      { thai: 'ศึก', meaning: '战争', parts: ['ศ', 'ึ', 'ก'], phonetic: 'sùek' },
    ],
    sentences: [
      { thai: 'ดู ศาลา', meaning: '看亭子', words: ['ดู', 'ศาลา'] },
      { thai: 'มี ฆ้อง นิด', meaning: '有一点锣声', words: ['มี', 'ฆ้อง', 'นิด'] },
    ],
  },
  {
    id: 'L14',
    title: '第十四课：古典字母（二）',
    subtitle: '掌握梵巴来源的特殊辅音',
    consonants: [
      { char: 'ฎ', name: 'Do', fullName: 'ฎอ ชฎา', meaning: '王冠', class: 'mid' },
      { char: 'ฏ', name: 'To', fullName: 'ฏอ ปฏัก', meaning: '长矛', class: 'mid' },
      { char: 'ฑ', name: 'Tho', fullName: 'ฑอ มณโฑ', meaning: '仙女', class: 'low' },
      { char: 'ฒ', name: 'Tho', fullName: 'ฒอ ผู้เฒ่า', meaning: '长者', class: 'low' },
    ],
    vowels: [
      { char: '-ุ', name: 'u', position: 'below', meaning: '短元音 u' },
    ],
    words: [
      { thai: 'กฎ', meaning: '规则', parts: ['ก', 'ฎ'], phonetic: 'kòt' },
      { thai: 'ปฏิ', meaning: '反/对', parts: ['ป', 'ฏ', 'ิ'], phonetic: 'pà-tì' },
      { thai: 'จุด', meaning: '点', parts: ['จ', 'ุ', 'ด'], phonetic: 'jùt' },
      { thai: 'ครุ', meaning: '老师', parts: ['ค', 'ร', 'ุ'], phonetic: 'khrú' },
    ],
    sentences: [
      { thai: 'มี กฎ', meaning: '有规则', words: ['มี', 'กฎ'] },
      { thai: 'ดู จุด นี้', meaning: '看这个点', words: ['ดู', 'จุด', 'นี้'] },
    ],
  },
  {
    id: 'L15',
    title: '第十五课：终章·全字母通关',
    subtitle: '学完最后的辅音，44字母全掌握！',
    consonants: [
      { char: 'ฌ', name: 'Cho', fullName: 'ฌอ เฌอ', meaning: '树', class: 'low' },
      { char: 'ฬ', name: 'Lo', fullName: 'ฬอ จุฬา', meaning: '风筝', class: 'low' },
      { char: 'ฮ', name: 'Ho', fullName: 'ฮอ นกฮูก', meaning: '猫头鹰', class: 'low' },
    ],
    vowels: [],
    words: [
      { thai: 'ฮา', meaning: '哈哈（笑）', parts: ['ฮ', 'า'], phonetic: 'haa' },
      { thai: 'จุฬา', meaning: '风筝', parts: ['จ', 'ุ', 'ฬ', 'า'], phonetic: 'jù-laa' },
      { thai: 'ฮู้', meaning: '知道(方言)', parts: ['ฮ', 'ู', '้'], phonetic: 'húu' },
    ],
    sentences: [
      { thai: 'เขา ฮา', meaning: '他笑了', words: ['เขา', 'ฮา'] },
      { thai: 'ดู จุฬา', meaning: '看风筝', words: ['ดู', 'จุฬา'] },
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
