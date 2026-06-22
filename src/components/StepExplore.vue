<template>
  <div class="space-y-6">
    <p class="text-center text-(--color-text-secondary)">
      {{ hasToneExamples ? '点击卡片，听听每个声调的区别 👆' : '点击字母卡片，听听它的发音 👆' }}
    </p>

    <!-- 声调卡片 -->
    <div v-if="hasToneExamples" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div
        v-for="(t, i) in lesson.toneExamples"
        :key="t.syllable"
        @click="selectTone(t, i)"
        :class="[
          'relative rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 border-2',
          toneExplored.has(i)
            ? 'bg-green-50 border-green-300 shadow-md'
            : selectedTone === i
              ? 'bg-purple-50 border-(--color-primary) shadow-lg scale-105'
              : 'bg-white border-gray-200 hover:border-(--color-primary-light) hover:shadow-md'
        ]"
      >
        <div v-if="toneExplored.has(i)" class="absolute top-2 right-2 text-green-500 text-xl">✓</div>
        <div class="thai text-5xl mb-3 text-(--color-primary)">{{ t.syllable }}</div>
        <div class="font-bold text-lg mb-1">{{ t.tone }}</div>
        <span class="inline-block text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
          {{ t.toneNameThai }}
        </span>
        <div class="text-sm text-(--color-text-secondary) mt-2">{{ t.description }}</div>
      </div>
    </div>

    <!-- 字母卡片（原有逻辑） -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div
        v-for="(c, i) in allLetters"
        :key="c.char"
        @click="selectLetter(c, i)"
        :class="[
          'relative rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 border-2',
          explored.has(i)
            ? 'bg-green-50 border-green-300 shadow-md'
            : selectedIndex === i
              ? 'bg-purple-50 border-(--color-primary) shadow-lg scale-105'
              : 'bg-white border-gray-200 hover:border-(--color-primary-light) hover:shadow-md'
        ]"
      >
        <div v-if="explored.has(i)" class="absolute top-2 right-2 text-green-500 text-xl">✓</div>
        <div class="thai text-6xl mb-3 select-none" :class="c.isVowel ? 'text-purple-600' : 'text-(--color-text)'">
          {{ c.char }}
        </div>
        <div class="font-bold text-lg mb-1">{{ c.name }}</div>
        <span
          :class="[
            'inline-block text-xs px-2 py-0.5 rounded-full',
            c.isVowel ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
          ]"
        >
          {{ c.isVowel ? '元音' : '辅音' }}
        </span>
        <div v-if="c.fullName" class="mt-2 text-sm text-(--color-text-secondary) thai">
          {{ c.fullName }}
        </div>
        <div class="text-sm text-(--color-text-secondary) mt-1">{{ c.meaning }}</div>
      </div>
    </div>

    <!-- 继续按钮 -->
    <div class="text-center">
      <button
        @click="$emit('complete')"
        :disabled="!canContinue"
        :class="[
          'px-8 py-3 rounded-xl font-bold text-lg transition-all',
          canContinue
            ? 'bg-(--color-primary) text-white hover:bg-(--color-primary-dark) shadow-lg'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        ]"
      >
        {{ canContinue ? '继续 →' : `还有 ${remaining} 个未探索` }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { audio } from '../engine/audio.js'

const props = defineProps({ lesson: Object })
defineEmits(['complete'])

const selectedIndex = ref(-1)
const explored = ref(new Set())
const selectedTone = ref(-1)
const toneExplored = ref(new Set())

const hasToneExamples = computed(() =>
  props.lesson.toneExamples && props.lesson.toneExamples.length > 0
)

const allLetters = computed(() => {
  const consonants = props.lesson.consonants.map(c => ({ ...c, isVowel: false }))
  const vowels = (props.lesson.vowels || []).map(v => ({ ...v, isVowel: true }))
  return [...consonants, ...vowels]
})

const canContinue = computed(() => {
  if (hasToneExamples.value) {
    return toneExplored.value.size >= props.lesson.toneExamples.length
  }
  return explored.value.size >= allLetters.value.length
})

const remaining = computed(() => {
  if (hasToneExamples.value) {
    return props.lesson.toneExamples.length - toneExplored.value.size
  }
  return allLetters.value.length - explored.value.size
})

onMounted(() => {
  if (hasToneExamples.value) {
    props.lesson.toneExamples.forEach(t => audio.preload(t.syllable))
  } else {
    allLetters.value.forEach(l => audio.preload(l.fullName || l.char))
  }
})

function selectLetter(letter, index) {
  selectedIndex.value = index
  explored.value.add(index)
  audio.speakThai(letter.fullName || letter.char)
  audio.playClick()
}

function selectTone(tone, index) {
  selectedTone.value = index
  toneExplored.value.add(index)
  audio.speakThai(tone.syllable)
  audio.playClick()
}
</script>
