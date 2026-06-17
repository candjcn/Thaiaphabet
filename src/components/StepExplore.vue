<template>
  <div class="space-y-6">
    <p class="text-center text-(--color-text-secondary)">点击字母卡片，听听它的发音 👆</p>

    <!-- 字母卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
        <!-- 已探索标记 -->
        <div v-if="explored.has(i)" class="absolute top-2 right-2 text-green-500 text-xl">✓</div>

        <!-- 字母 -->
        <div class="thai text-6xl mb-3 select-none" :class="c.isVowel ? 'text-purple-600' : 'text-(--color-text)'">
          {{ c.char }}
        </div>

        <!-- 名称 -->
        <div class="font-bold text-lg mb-1">{{ c.name }}</div>

        <!-- 类型标签 -->
        <span
          :class="[
            'inline-block text-xs px-2 py-0.5 rounded-full',
            c.isVowel ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
          ]"
        >
          {{ c.isVowel ? '元音' : '辅音' }}
        </span>

        <!-- 含义 -->
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
        :disabled="explored.size < allLetters.length"
        :class="[
          'px-8 py-3 rounded-xl font-bold text-lg transition-all',
          explored.size >= allLetters.length
            ? 'bg-(--color-primary) text-white hover:bg-(--color-primary-dark) shadow-lg'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        ]"
      >
        {{ explored.size >= allLetters.length ? '继续 →' : `还有 ${allLetters.length - explored.size} 个未探索` }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { audio } from '../engine/audio.js'

const props = defineProps({ lesson: Object })
defineEmits(['complete'])

const selectedIndex = ref(-1)
const explored = ref(new Set())

const allLetters = computed(() => {
  const consonants = props.lesson.consonants.map(c => ({ ...c, isVowel: false }))
  const vowels = (props.lesson.vowels || []).map(v => ({ ...v, isVowel: true }))
  return [...consonants, ...vowels]
})

function selectLetter(letter, index) {
  selectedIndex.value = index
  explored.value.add(index)
  // 朗读字母名
  audio.speakThai(letter.fullName || letter.char)
  audio.playClick()
}
</script>
