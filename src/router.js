import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.vue'
import Lesson from './views/Lesson.vue'
import Collection from './views/Collection.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/lesson/:id', name: 'Lesson', component: Lesson, props: true },
  { path: '/collection', name: 'Collection', component: Collection },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
