// 用户认证模块
import { ref, readonly } from 'vue'
import { getFirebaseAuth, isFirebaseConfigured } from './firebase.js'
import { storage } from './storage.js'

const currentUser = ref(null)
const isReady = ref(false)

// 初始化认证监听（应用启动时调用一次）
async function initAuth() {
  if (!isFirebaseConfigured()) {
    isReady.value = true
    return
  }
  const auth = await getFirebaseAuth()
  if (!auth) {
    isReady.value = true
    return
  }
  const { onAuthStateChanged } = await import('firebase/auth')
  onAuthStateChanged(auth, async (user) => {
    currentUser.value = user
    if (user) {
      await storage.syncOnLogin(user.uid)
    }
    isReady.value = true
  })
}

// 启动时初始化
initAuth()

export const userAuth = {
  user: readonly(currentUser),
  isReady: readonly(isReady),

  async signInWithGoogle() {
    const auth = await getFirebaseAuth()
    if (!auth) return
    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth')
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  },

  async signOut() {
    const auth = await getFirebaseAuth()
    if (!auth) return
    const { signOut } = await import('firebase/auth')
    await signOut(auth)
    currentUser.value = null
  },

  get isLoggedIn() {
    return !!currentUser.value
  },

  shouldPromptLogin() {
    if (currentUser.value) return false
    if (!isFirebaseConfigured()) return false
    const data = storage.getData()
    const completedCount = Object.keys(data.completedLessons).length
    return completedCount >= 2
  },
}
