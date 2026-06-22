<template>
  <div class="space-y-6">
    <!-- 进度指示器 -->
    <div class="flex justify-center gap-2">
      <div
        v-for="(q, i) in questions"
        :key="i"
        :class="[
          'w-3 h-3 rounded-full transition-all',
          i < currentQ
            ? answers[i] ? 'bg-green-500' : 'bg-red-400'
            : i === currentQ
              ? 'bg-(--color-primary) scale-125'
              : 'bg-gray-200'
        ]"
      ></div>
    </div>

    <!-- 题目区域 -->
    <div v-if="currentQ < questions.length" class="text-center">
      <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <!-- 听音选字题 -->
        <template v-if="questions[currentQ].type === 'listen'">
          <p class="text-(--color-text-secondary) mb-4">听音选字：这是哪个字母？</p>
          <button
            @click="playQuestionAudio"
            class="mb-6 w-20 h-20 rounded-full bg-purple-100 text-4xl flex items-center justify-center mx-auto hover:bg-purple-200 transition"
          >
            🔊
          </button>

          <div class="grid grid-cols-3 gap-3 max-w-md mx-auto">
            <button
              v-for="(opt, oi) in questions[currentQ].options"
              :key="oi"
              @click="selectAnswer(oi)"
              :disabled="answered"
              :class="[
                'thai text-4xl p-4 rounded-xl border-2 transition-all',
                !answered
                  ? 'border-gray-200 bg-white hover:border-(--color-primary) hover:bg-purple-50'
                  : oi === questions[currentQ].correctIndex
                    ? 'border-green-500 bg-green-50'
                    : selectedOption === oi
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-200 bg-gray-50 opacity-50'
              ]"
            >
              {{ opt }}
            </button>
          </div>
        </template>

        <!-- 词义选择题 -->
        <template v-else-if="questions[currentQ].type === 'meaning'">
          <p class="text-(--color-text-secondary) mb-2">这个词是什么意思？</p>
          <div class="thai text-5xl mb-6 text-(--color-primary)">{{ questions[currentQ].word }}</div>

          <div class="grid grid-cols-1 gap-3 max-w-sm mx-auto">
            <button
              v-for="(opt, oi) in questions[currentQ].options"
              :key="oi"
              @click="selectAnswer(oi)"
              :disabled="answered"
              :class="[
                'p-3 rounded-xl border-2 text-lg transition-all',
                !answered
                  ? 'border-gray-200 bg-white hover:border-(--color-primary) hover:bg-purple-50'
                  : oi === questions[currentQ].correctIndex
                    ? 'border-green-500 bg-green-50'
                    : selectedOption === oi
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-200 bg-gray-50 opacity-50'
              ]"
            >
              {{ opt }}
            </button>
          </div>
        </template>

        <!-- 反馈 -->
        <div v-if="answered" class="mt-4">
          <p v-if="answers[currentQ]" class="text-green-600 font-bold text-lg">✅ 正确！</p>
          <p v-else class="text-red-500 font-bold text-lg">❌ 再想想，正确答案已标出</p>
        </div>
      </div>

      <!-- 下一题 -->
      <button
        v-if="answered"
        @click="nextQuestion"
        class="mt-4 px-8 py-3 bg-(--color-primary) text-white rounded-xl font-bold text-lg hover:bg-(--color-primary-dark) transition"
      >
        {{ currentQ < questions.length - 1 ? '下一题 →' : '查看结果' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { audio } from '../engine/audio.js'

const props = defineProps({ lesson: Object })
const emit = defineEmits(['complete'])

const questions = ref([])
const currentQ = ref(0)
const answered = ref(false)
const selectedOption = ref(-1)
const answers = ref([])

onMounted(() => {
  // 预加载所有字母发音
  props.lesson.consonants.forEach(c => audio.preload(c.fullName || c.char))
  props.lesson.words.forEach(w => audio.preload(w.thai))
  generateQuestions()
  // 自动播放第一题
  setTimeout(playQuestionAudio, 500)
})

function generateQuestions() {
  const qs = []
  const consonants = props.lesson.consonants

  // 听音选字题（每个辅音一题）
  consonants.forEach(c => {
    const options = shuffle([...consonants]).slice(0, 3).map(x => x.char)
    if (!options.includes(c.char)) {
      options[Math.floor(Math.random() * 3)] = c.char
    }
    qs.push({
      type: 'listen',
      audio: c.fullName || c.char,
      options,
      correctIndex: options.indexOf(c.char),
    })
  })

  // 词义选择题（每个词一题）
  const words = props.lesson.words
  const allMeanings = words.map(w => w.meaning)

  words.forEach(w => {
    let wrongMeanings = allMeanings.filter(m => m !== w.meaning)
    // 如果干扰项不够，从通用词库补充
    const fallbackMeanings = ['来', '看', '好', '有', '大', '小', '多', '少', '走', '吃']
    while (wrongMeanings.length < 2) {
      const fb = fallbackMeanings.find(m => m !== w.meaning && !wrongMeanings.includes(m))
      if (fb) wrongMeanings.push(fb)
      else break
    }
    const options = shuffle([w.meaning, ...shuffle(wrongMeanings).slice(0, 2)])
    qs.push({
      type: 'meaning',
      word: w.thai,
      options,
      correctIndex: options.indexOf(w.meaning),
    })
  })

  questions.value = shuffle(qs)
}

function playQuestionAudio() {
  const q = questions.value[currentQ.value]
  if (q?.type === 'listen') {
    audio.speakThai(q.audio)
  }
}

function selectAnswer(index) {
  if (answered.value) return
  selectedOption.value = index
  answered.value = true

  const correct = index === questions.value[currentQ.value].correctIndex
  answers.value.push(correct)

  if (correct) {
    audio.playCorrect()
  } else {
    audio.playIncorrect()
  }
}

function nextQuestion() {
  if (currentQ.value < questions.value.length - 1) {
    currentQ.value++
    answered.value = false
    selectedOption.value = -1
    setTimeout(playQuestionAudio, 300)
  } else {
    const correctCount = answers.value.filter(Boolean).length
    emit('complete', { correctCount, totalCount: questions.value.length })
  }
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
</script>
