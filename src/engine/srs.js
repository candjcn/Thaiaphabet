// 艾宾浩斯 SRS 引擎 - SuperMemo-2 简化版
import { storage } from './storage.js'

// 复习间隔（毫秒）: 30分钟、12小时、1天、2天、4天、7天、15天
const INTERVALS = [
  30 * 60 * 1000,
  12 * 60 * 60 * 1000,
  1 * 24 * 60 * 60 * 1000,
  2 * 24 * 60 * 60 * 1000,
  4 * 24 * 60 * 60 * 1000,
  7 * 24 * 60 * 60 * 1000,
  15 * 24 * 60 * 60 * 1000,
]

export const srs = {
  // 添加新学习项目
  addItem(itemId, type = 'letter') {
    const data = storage.getData()
    if (!data.srsItems[itemId]) {
      data.srsItems[itemId] = {
        type,
        strength: 100,
        intervalIndex: 0,
        nextReview: Date.now() + INTERVALS[0],
        lastReview: Date.now(),
      }
      storage.save(data)
    }
  },

  // 回答正确
  reviewCorrect(itemId) {
    const data = storage.getData()
    const item = data.srsItems[itemId]
    if (!item) return
    item.strength = 100
    item.intervalIndex = Math.min(item.intervalIndex + 1, INTERVALS.length - 1)
    item.nextReview = Date.now() + INTERVALS[item.intervalIndex]
    item.lastReview = Date.now()
    storage.save(data)
  },

  // 回答错误
  reviewIncorrect(itemId) {
    const data = storage.getData()
    const item = data.srsItems[itemId]
    if (!item) return
    item.strength = Math.max(0, item.strength - 30)
    item.intervalIndex = Math.max(0, item.intervalIndex - 2)
    item.nextReview = Date.now() + INTERVALS[item.intervalIndex]
    item.lastReview = Date.now()
    storage.save(data)
  },

  // 获取需要复习的项目
  getDueItems() {
    const data = storage.getData()
    const now = Date.now()
    return Object.entries(data.srsItems)
      .filter(([, item]) => item.nextReview <= now)
      .map(([id, item]) => ({ id, ...item }))
  },

  // 获取需要复习的项目数量
  getDueCount() {
    return this.getDueItems().length
  },
}
