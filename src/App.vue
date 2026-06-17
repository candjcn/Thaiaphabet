<template>
  <div class="min-h-screen bg-(--color-bg)">
    <!-- 顶部导航 -->
    <nav class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-2 text-lg font-bold text-(--color-primary) no-underline">
          <span class="text-2xl">🇹🇭</span>
          <span>泰语字母学习</span>
        </router-link>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1 text-sm font-medium text-(--color-text-secondary)">
            <span>⭐</span>
            <span>{{ userData.xp }} XP</span>
          </div>
          <div class="flex items-center gap-1 text-sm font-medium text-(--color-warning)">
            <span>🔥</span>
            <span>{{ userData.streak }}天</span>
          </div>
          <router-link to="/collection" class="text-sm text-(--color-primary) no-underline hover:underline">
            藏书阁
          </router-link>
        </div>
      </div>
    </nav>

    <!-- 页面内容 -->
    <main class="max-w-4xl mx-auto px-4 py-6">
      <router-view :key="$route.fullPath" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storage } from './engine/storage.js'

const userData = ref(storage.getData())

onMounted(() => {
  storage.updateStreak()
  userData.value = storage.getData()
})
</script>
