<template>
  <div v-if="lesson">
    <!-- 进度条 -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <button @click="goHome" class="text-(--color-text-secondary) hover:text-(--color-text) transition text-sm">
          ← 返回
        </button>
        <span class="text-sm text-(--color-text-secondary)">
          步骤 {{ currentStep + 1 }} / {{ totalSteps }}
        </span>
        <span class="text-sm font-mono text-(--color-text-secondary)">
          ⏱️ {{ formatTime(elapsed) }}
        </span>
      </div>
      <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          class="h-full bg-(--color-primary) rounded-full transition-all duration-500"
          :style="{ width: ((currentStep + 1) / totalSteps * 100) + '%' }"
        ></div>
      </div>
    </div>

    <!-- 步骤标题 -->
    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold">{{ lesson.title }}</h1>
      <p class="text-(--color-text-secondary) mt-1">{{ steps[currentStep] }}</p>
    </div>

    <!-- 步骤内容 -->
    <StepExplore
      v-if="currentStepName === 'explore'"
      :lesson="lesson"
      @complete="nextStep"
    />
    <StepTrace
      v-else-if="currentStepName === 'trace'"
      :lesson="lesson"
      @complete="nextStep"
    />
    <StepSynthesize
      v-else-if="currentStepName === 'synthesize'"
      :lesson="lesson"
      @complete="nextStep"
    />
    <StepQuiz
      v-else-if="currentStepName === 'quiz'"
      :lesson="lesson"
      @complete="onQuizComplete"
    />

    <!-- 通关结果 -->
    <div v-if="showResult" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 text-center transform animate-bounce-in">
        <h2 class="text-3xl font-bold mb-2">🎉 闯关成功!</h2>
        <div class="text-4xl my-4">
          {{ '⭐'.repeat(resultStars) }}{{ '☆'.repeat(3 - resultStars) }}
        </div>
        <div class="space-y-2 mb-6">
          <p class="text-lg">+{{ resultXP }} XP</p>
          <p class="text-(--color-text-secondary)">⏱️ 用时: {{ formatTime(elapsed) }}</p>
          <p class="text-(--color-text-secondary)">正确率: {{ resultAccuracy }}%</p>
        </div>
        <div class="space-y-3">
          <button
            @click="goHome"
            class="w-full py-3 bg-(--color-primary) text-white rounded-xl font-bold text-lg hover:bg-(--color-primary-dark) transition"
          >
            继续学习
          </button>
          <button
            @click="retry"
            class="w-full py-3 border-2 border-(--color-primary) text-(--color-primary) rounded-xl font-bold hover:bg-purple-50 transition"
          >
            再来一次
          </button>
        </div>
      </div>
    </div>
    <!-- 登录提示 -->
    <LoginPrompt v-if="showLoginPrompt" @close="showLoginPrompt = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { lessons } from '../data/lessons.js'
import { storage } from '../engine/storage.js'
import { srs } from '../engine/srs.js'
import { audio } from '../engine/audio.js'
import { userAuth } from '../engine/auth.js'
import StepExplore from '../components/StepExplore.vue'
import StepTrace from '../components/StepTrace.vue'
import StepSynthesize from '../components/StepSynthesize.vue'
import StepQuiz from '../components/StepQuiz.vue'
import LoginPrompt from '../components/LoginPrompt.vue'

const props = defineProps({ id: String })
const router = useRouter()

const lesson = computed(() => lessons.find(l => l.id === props.id))
const currentStep = ref(0)
const showResult = ref(false)
const resultStars = ref(0)
const resultXP = ref(0)
const resultAccuracy = ref(0)
const showLoginPrompt = ref(false)

// 有辅音的课程包含书写练习步骤，否则跳过
const hasTrace = computed(() => lesson.value && lesson.value.consonants && lesson.value.consonants.length > 0)
const steps = computed(() => {
  if (hasTrace.value) {
    return ['📖 字母探索', '✍️ 书写练习', '🔤 单词句子合成', '🎯 闯关测试']
  }
  return ['📖 字母探索', '🔤 单词句子合成', '🎯 闯关测试']
})
const totalSteps = computed(() => steps.value.length)
const stepSequence = computed(() => {
  if (hasTrace.value) {
    return ['explore', 'trace', 'synthesize', 'quiz']
  }
  return ['explore', 'synthesize', 'quiz']
})
const currentStepName = computed(() => stepSequence.value[currentStep.value])

// 计时器
const elapsed = ref(0)
let timer = null

onMounted(() => {
  timer = setInterval(() => elapsed.value++, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function nextStep() {
  if (currentStep.value < totalSteps.value - 1) {
    currentStep.value++
  }
}

function onQuizComplete({ correctCount, totalCount }) {
  clearInterval(timer)
  const accuracy = Math.round((correctCount / totalCount) * 100)
  const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1
  const xp = stars * 20 + (elapsed.value < 120 ? 10 : 0)

  resultStars.value = stars
  resultXP.value = xp
  resultAccuracy.value = accuracy

  // 保存进度
  storage.completeLesson(props.id, stars, elapsed.value)
  storage.addXP(xp)

  // 将字母加入 SRS 和收藏册
  const items = lesson.value.consonants.concat(lesson.value.vowels || [])
  items.forEach(item => srs.addItem(item.char, 'letter'))
  storage.addToCollection(items)

  // 播放庆祝音效
  audio.playCelebration()

  // 触发 confetti
  import('canvas-confetti').then(mod => {
    mod.default({ particleCount: 150, spread: 80, origin: { y: 0.6 } })
  })

  showResult.value = true

  // 完成 2 课后未登录，提示登录
  if (userAuth.shouldPromptLogin()) {
    setTimeout(() => { showLoginPrompt.value = true }, 1500)
  }
}

function goHome() {
  router.push('/')
}

function retry() {
  currentStep.value = 0
  showResult.value = false
  elapsed.value = 0
  timer = setInterval(() => elapsed.value++, 1000)
}
</script>

<style scoped>
@keyframes bounce-in {
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}
.animate-bounce-in {
  animation: bounce-in 0.5s ease-out;
}
</style>
