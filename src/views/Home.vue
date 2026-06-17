<template>
  <div>
    <!-- 复习提示 -->
    <div v-if="dueCount > 0" class="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
      <div>
        <p class="font-bold text-amber-800">📖 你有 {{ dueCount }} 个字母/单词需要温习！</p>
        <p class="text-sm text-amber-600 mt-1">完成复习后解锁新课程</p>
      </div>
      <button @click="startReview" class="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition">
        开始复习
      </button>
    </div>

    <!-- 关卡地图 -->
    <h2 class="text-xl font-bold mb-4">学习关卡</h2>
    <div class="space-y-4">
      <div
        v-for="(lesson, index) in lessons"
        :key="lesson.id"
        class="relative"
      >
        <!-- 连接线 -->
        <div v-if="index > 0" class="absolute -top-4 left-8 w-0.5 h-4 bg-gray-200"></div>

        <div
          :class="[
            'p-5 rounded-2xl border-2 transition-all cursor-pointer',
            isUnlocked(lesson.id)
              ? isCompleted(lesson.id)
                ? 'bg-green-50 border-green-300 hover:shadow-md'
                : 'bg-white border-(--color-primary) hover:shadow-lg hover:-translate-y-0.5'
              : 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
          ]"
          @click="enterLesson(lesson.id)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <!-- 关卡编号 -->
              <div
                :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold',
                  isCompleted(lesson.id)
                    ? 'bg-green-500 text-white'
                    : isUnlocked(lesson.id)
                      ? 'bg-(--color-primary) text-white'
                      : 'bg-gray-300 text-white'
                ]"
              >
                <span v-if="isCompleted(lesson.id)">✓</span>
                <span v-else>{{ index + 1 }}</span>
              </div>

              <div>
                <h3 class="font-bold text-lg">{{ lesson.title }}</h3>
                <p class="text-sm text-(--color-text-secondary) mt-0.5">{{ lesson.subtitle }}</p>
                <!-- 本课字母预览 -->
                <div class="flex gap-2 mt-2">
                  <span
                    v-for="c in lesson.consonants"
                    :key="c.char"
                    class="thai text-xl px-2 py-0.5 bg-gray-100 rounded"
                  >{{ c.char }}</span>
                  <span
                    v-for="v in lesson.vowels"
                    :key="v.char"
                    class="thai text-xl px-2 py-0.5 bg-purple-50 rounded text-purple-600"
                  >{{ v.char }}</span>
                </div>
              </div>
            </div>

            <!-- 星级 -->
            <div v-if="isCompleted(lesson.id)" class="text-2xl">
              {{ '⭐'.repeat(getStars(lesson.id)) }}
            </div>
            <div v-else-if="!isUnlocked(lesson.id)" class="text-2xl">
              🔒
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { lessons } from '../data/lessons.js'
import { storage } from '../engine/storage.js'
import { srs } from '../engine/srs.js'

const router = useRouter()
const userData = ref(storage.getData())
const dueCount = computed(() => srs.getDueCount())

function isUnlocked(id) {
  return userData.value.unlockedLessons.includes(id)
}

function isCompleted(id) {
  return !!userData.value.completedLessons[id]
}

function getStars(id) {
  return userData.value.completedLessons[id]?.stars || 0
}

function enterLesson(id) {
  if (isUnlocked(id)) {
    router.push(`/lesson/${id}`)
  }
}

function startReview() {
  // 简单实现：跳转到第一课复习
  router.push('/lesson/L1')
}
</script>
