import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.vue'
import Lesson from './views/Lesson.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/lesson/:id', name: 'Lesson', component: Lesson, props: true },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
