import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      name: 'Auth',
      component: () => import('../views/AuthView.vue')
    }
  ]
})

router.beforeEach((to) => {
  if (to.path === '/') {
    return { name: 'Auth' }
  }
})

export default router
