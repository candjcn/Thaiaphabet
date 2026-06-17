<template>
  <div>
    <h1 class="text-2xl font-bold mb-2">📚 藏书阁</h1>
    <p class="text-(--color-text-secondary) mb-6">你已收集 {{ collection.length }} 张卡片</p>

    <div v-if="collection.length === 0" class="text-center py-16 text-(--color-text-secondary)">
      <p class="text-5xl mb-4">📖</p>
      <p>还没有收集到卡片，去完成课程吧！</p>
      <router-link to="/" class="inline-block mt-4 px-6 py-2 bg-(--color-primary) text-white rounded-lg no-underline">
        开始学习
      </router-link>
    </div>

    <div v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
      <div
        v-for="item in collection"
        :key="item.char"
        @click="speak(item.char)"
        class="bg-white rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100 hover:border-(--color-primary)"
      >
        <div class="thai text-4xl mb-2">{{ item.char }}</div>
        <div class="text-sm font-medium text-(--color-primary)">{{ item.name }}</div>
        <div class="text-xs text-(--color-text-secondary) mt-1">{{ item.meaning }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storage } from '../engine/storage.js'
import { audio } from '../engine/audio.js'

const collection = ref(storage.getData().collection || [])

function speak(char) {
  audio.speakThai(char)
}
</script>
