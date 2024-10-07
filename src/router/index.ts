import { createRouter, createWebHistory } from 'vue-router'

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

router.beforeEach((to) => {
  if (to.path === '/') {
    return { name: 'Auth' }
  }
})

export default router
