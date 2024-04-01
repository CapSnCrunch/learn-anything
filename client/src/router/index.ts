// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    children: [
      {
        path: '', 
        name: 'home',
        component: () => import('@/pages/HomePage.vue'),
      },
      {
        path: 'login', 
        name: 'login',
        component: () => import('@/pages/Login.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
