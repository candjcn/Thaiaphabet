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
          <!-- 用户头像 / 登录按钮 -->
          <div v-if="user" class="relative">
            <button @click="showMenu = !showMenu" class="w-8 h-8 rounded-full overflow-hidden border-2 border-(--color-primary)">
              <img :src="user.photoURL" :alt="user.displayName" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
            </button>
            <div v-if="showMenu" class="absolute right-0 top-10 bg-white shadow-lg rounded-xl p-3 w-48 border border-gray-100">
              <p class="text-sm font-medium truncate">{{ user.displayName }}</p>
              <p class="text-xs text-(--color-text-secondary) truncate mb-2">{{ user.email }}</p>
              <button @click="logout" class="text-sm text-red-500 hover:text-red-600">退出登录</button>
            </div>
          </div>
          <button
            v-else
            @click="showLogin = true"
            class="text-sm text-(--color-primary) hover:underline"
          >
            登录
          </button>
        </div>
      </div>
    </nav>

    <!-- 页面内容 -->
    <main class="max-w-4xl mx-auto px-4 py-6">
      <router-view :key="$route.fullPath" />
    </main>

    <!-- 登录弹窗 -->
    <LoginPrompt v-if="showLogin" @close="showLogin = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storage } from './engine/storage.js'
import { userAuth } from './engine/auth.js'
import LoginPrompt from './components/LoginPrompt.vue'

const userData = ref(storage.getData())
const showLogin = ref(false)
const showMenu = ref(false)
const user = userAuth.user

// 登录/登出后刷新数据
watch(user, () => {
  userData.value = storage.getData()
  showMenu.value = false
})

onMounted(() => {
  storage.updateStreak()
  userData.value = storage.getData()
})

async function logout() {
  await userAuth.signOut()
  showMenu.value = false
}
</script>
