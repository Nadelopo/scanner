import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      name: 'Auth',
      component: () => import('../views/AuthView.vue')
    },
    {
      path: '/tariffs',
      name: 'Tariffs',
      component: () => import('../views/TariffsView.vue'),
      meta: { auth: true }
    },
    {
      path: '/set-tariff',
      name: 'SetTariff',
      meta: { auth: true },
      component: () => import('../views/SetTariffView.vue')
    }
  ]
})

router.beforeEach(async (to) => {
  const { checkToken } = useAuthStore()
  const isAuth = await checkToken()
  const requireAuth = to.matched.some((record) => record.meta.auth)

  if (isAuth && !requireAuth) {
    return { name: 'Tariffs' }
  }
  if (to.path === '/' || (!isAuth && requireAuth)) {
    return { name: 'Auth' }
  }

  return true
})

export default router
