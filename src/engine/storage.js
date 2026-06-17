// localStorage 封装 - 管理学习进度、XP、打卡等数据
const STORAGE_KEY = 'thai_alphabet_data'

function getAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : createDefault()
  } catch {
    return createDefault()
  }
}

function saveAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function createDefault() {
  const data = {
    unlockedLessons: ['L1'],
    completedLessons: {},   // { L1: { stars: 3, bestTime: 85 } }
    xp: 0,
    level: 1,
    streak: 0,
    lastStudyDate: null,
    srsItems: {},           // SRS 数据
    collection: [],         // 收藏册已解锁卡片
  }
  saveAll(data)
  return data
}

export const storage = {
  getData() {
    return getAll()
  },

  isLessonUnlocked(lessonId) {
    return getAll().unlockedLessons.includes(lessonId)
  },

  completeLesson(lessonId, stars, timeSeconds) {
    const data = getAll()
    const existing = data.completedLessons[lessonId]
    if (!existing || stars > existing.stars) {
      data.completedLessons[lessonId] = { stars, bestTime: timeSeconds }
    }
    // 解锁下一课
    const num = parseInt(lessonId.replace('L', ''))
    const nextId = `L${num + 1}`
    if (!data.unlockedLessons.includes(nextId)) {
      data.unlockedLessons.push(nextId)
    }
    saveAll(data)
    return data
  },

  addXP(amount) {
    const data = getAll()
    data.xp += amount
    // 每 200 XP 升一级
    data.level = Math.floor(data.xp / 200) + 1
    saveAll(data)
    return data
  },

  updateStreak() {
    const data = getAll()
    const today = new Date().toDateString()
    if (data.lastStudyDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      data.streak = data.lastStudyDate === yesterday ? data.streak + 1 : 1
      data.lastStudyDate = today
      saveAll(data)
    }
    return data
  },

  addToCollection(items) {
    const data = getAll()
    items.forEach(item => {
      if (!data.collection.find(c => c.char === item.char)) {
        data.collection.push(item)
      }
    })
    saveAll(data)
    return data
  },

  resetAll() {
    localStorage.removeItem(STORAGE_KEY)
  },
}
