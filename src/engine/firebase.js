// Firebase 初始化（延迟加载）
let _app = null
let _auth = null
let _db = null

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// 检查 Firebase 是否已配置
export function isFirebaseConfigured() {
  return !!firebaseConfig.apiKey && !!firebaseConfig.projectId
}

export async function getFirebaseAuth() {
  if (!isFirebaseConfigured()) return null
  if (!_auth) {
    const { initializeApp } = await import('firebase/app')
    const { getAuth } = await import('firebase/auth')
    _app = _app || initializeApp(firebaseConfig)
    _auth = getAuth(_app)
  }
  return _auth
}

export async function getFirebaseDb() {
  if (!isFirebaseConfigured()) return null
  if (!_db) {
    const { initializeApp } = await import('firebase/app')
    const { getFirestore } = await import('firebase/firestore')
    _app = _app || initializeApp(firebaseConfig)
    _db = getFirestore(_app)
  }
  return _db
}
