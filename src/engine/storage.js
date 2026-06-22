// localStorage + Firestore 双写存储引擎
import { getFirebaseDb } from './firebase.js'

const STORAGE_KEY = 'thai_alphabet_data'

// 当前登录用户的 UID
let _uid = null

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
  if (_uid) {
    saveToCloud(_uid, data)
  }
}

function createDefault() {
  const data = createDefaultShape()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  return data
}

function createDefaultShape() {
  return {
    unlockedLessons: ['L1'],
    completedLessons: {},
    xp: 0,
    level: 1,
    streak: 0,
    lastStudyDate: null,
    srsItems: {},
    collection: [],
  }
}

// ---- Firestore 云存储 ----

async function loadFromCloud(uid) {
  try {
    const db = await getFirebaseDb()
    if (!db) return null
    const { doc, getDoc } = await import('firebase/firestore')
    const snap = await getDoc(doc(db, 'users', uid))
    return snap.exists() ? snap.data() : null
  } catch (e) {
    console.warn('Cloud load failed:', e)
    return null
  }
}

async function saveToCloud(uid, data) {
  try {
    const db = await getFirebaseDb()
    if (!db) return
    const { doc, setDoc } = await import('firebase/firestore')
    await setDoc(doc(db, 'users', uid), data)
  } catch (e) {
    console.warn('Cloud save failed:', e)
  }
}

// 合并本地和云端数据（取最优值）
function mergeData(local, cloud) {
  if (!cloud) return local
  if (!local) return cloud

  const merged = createDefaultShape()

  // unlockedLessons: 取并集
  merged.unlockedLessons = [...new Set([
    ...(local.unlockedLessons || ['L1']),
    ...(cloud.unlockedLessons || ['L1']),
  ])]

  // completedLessons: 每课取更高星级
  merged.completedLessons = { ...cloud.completedLessons }
  for (const [id, val] of Object.entries(local.completedLessons || {})) {
    const existing = merged.completedLessons[id]
    if (!existing || val.stars > existing.stars) {
      merged.completedLessons[id] = val
    }
  }

  // xp / level: 取大值
  merged.xp = Math.max(local.xp || 0, cloud.xp || 0)
  merged.level = Math.floor(merged.xp / 200) + 1

  // streak: 取大值
  merged.streak = Math.max(local.streak || 0, cloud.streak || 0)
  merged.lastStudyDate = local.lastStudyDate || cloud.lastStudyDate

  // srsItems: 每项取最新复习的
  merged.srsItems = { ...cloud.srsItems }
  for (const [id, item] of Object.entries(local.srsItems || {})) {
    const existing = merged.srsItems[id]
    if (!existing || (item.lastReview || 0) > (existing.lastReview || 0)) {
      merged.srsItems[id] = item
    }
  }

  // collection: 按 char 取并集
  const charSet = new Set()
  merged.collection = []
  for (const item of [...(cloud.collection || []), ...(local.collection || [])]) {
    if (!charSet.has(item.char)) {
      charSet.add(item.char)
      merged.collection.push(item)
    }
  }

  return merged
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

  // 给 srs.js 用的保存方法
  save(data) {
    saveAll(data)
  },

  // 登录后：合并本地与云端数据
  async syncOnLogin(uid) {
    _uid = uid
    const local = getAll()
    const cloud = await loadFromCloud(uid)
    const merged = mergeData(local, cloud)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
    await saveToCloud(uid, merged)
  },
}
