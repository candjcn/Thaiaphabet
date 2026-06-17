<template>
  <div class="space-y-8">
    <!-- 单词拼读 -->
    <div>
      <h3 class="text-lg font-bold mb-4 text-center">🔤 单词拼读</h3>
      <div class="space-y-4">
        <div
          v-for="(word, wi) in lesson.words"
          :key="word.thai"
          @click="playWord(word)"
          class="bg-white rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:shadow-md transition border border-gray-100"
          :class="{ 'ring-2 ring-(--color-primary) bg-purple-50': activeWord === wi }"
        >
          <div class="flex items-center gap-4">
            <!-- 拼读拆解 -->
            <div class="flex items-center gap-1">
              <span
                v-for="(part, pi) in word.parts"
                :key="pi"
                class="thai text-3xl"
              >
                <span
                  @click.stop="playPart(part, wi)"
                  class="px-2 py-1 rounded-lg hover:bg-purple-100 transition cursor-pointer"
                >{{ part }}</span>
                <span v-if="pi < word.parts.length - 1" class="text-gray-300 text-xl mx-1">+</span>
              </span>
            </div>

            <span class="text-2xl text-gray-300">=</span>

            <!-- 完整单词 -->
            <div class="text-center">
              <div class="thai text-4xl font-bold text-(--color-primary)">{{ word.thai }}</div>
              <div class="text-sm text-(--color-text-secondary) mt-1">{{ word.phonetic }}</div>
            </div>
          </div>

          <div class="text-right">
            <div class="text-lg">{{ word.meaning }}</div>
            <div class="text-xl mt-1">🔊</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 句子拆解 -->
    <div v-if="lesson.sentences.length > 0">
      <h3 class="text-lg font-bold mb-4 text-center">📝 句子阅读</h3>
      <div class="space-y-4">
        <div
          v-for="(sentence, si) in lesson.sentences"
          :key="si"
          class="bg-white rounded-2xl p-5 border border-gray-100"
        >
          <!-- 句子：点击单词高亮 -->
          <div class="flex items-center justify-center gap-3 mb-3 flex-wrap">
            <span
              v-for="(w, wi) in sentence.words"
              :key="wi"
              @click="playSentenceWord(w, si, wi)"
              :class="[
                'thai text-3xl px-3 py-1 rounded-lg cursor-pointer transition-all',
                activeSentence === si && activeSentenceWord === wi
                  ? 'bg-(--color-primary) text-white scale-110 shadow-md'
                  : 'hover:bg-purple-50'
              ]"
            >{{ w }}</span>
          </div>

          <div class="text-center text-(--color-text-secondary)">
            {{ sentence.meaning }}
          </div>

          <button
            @click="playSentenceFull(sentence)"
            class="mt-3 mx-auto block px-4 py-1.5 text-sm bg-purple-50 text-(--color-primary) rounded-lg hover:bg-purple-100 transition"
          >
            🔊 播放整句
          </button>
        </div>
      </div>
    </div>

    <!-- 继续 -->
    <div class="text-center">
      <button
        @click="$emit('complete')"
        class="px-8 py-3 bg-(--color-primary) text-white rounded-xl font-bold text-lg hover:bg-(--color-primary-dark) shadow-lg transition-all"
      >
        继续 →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { audio } from '../engine/audio.js'

const props = defineProps({ lesson: Object })
defineEmits(['complete'])

const activeWord = ref(-1)
const activeSentence = ref(-1)
const activeSentenceWord = ref(-1)

function playWord(word) {
  audio.speakThai(word.thai)
  activeWord.value = props.lesson.words.indexOf(word)
  setTimeout(() => { activeWord.value = -1 }, 1500)
}

function playPart(part) {
  audio.speakThai(part, 0.6)
}

function playSentenceWord(word, si, wi) {
  activeSentence.value = si
  activeSentenceWord.value = wi
  audio.speakThai(word)
  setTimeout(() => {
    activeSentence.value = -1
    activeSentenceWord.value = -1
  }, 1500)
}

function playSentenceFull(sentence) {
  audio.speakThai(sentence.words.join(' '), 0.7)
}
</script>
