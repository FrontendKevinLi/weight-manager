import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import PageLayout from '@/components/PageLayout.vue'
import LoginView from '@/views/LoginView.vue'
import { getIsAuthenticated } from '@/firebase/auth'
import { until } from '@open-draft/until'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/',
    component: PageLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: {
          label: 'Dashboard',
        },
        component: () => import('@/views/DashboardView.vue'),
      },
    ],
  },
  {
    path: '/records',
    component: PageLayout,
    children: [
      {
        path: '',
        name: 'records',
        meta: {
          label: 'Records',
        },
        component: () => import('@/views/RecordsView.vue'),
      },
    ],
  },
  {
    path: '/analytics',
    component: PageLayout,
    children: [
      {
        path: '',
        name: 'analytics',
        meta: {
          label: 'Analytics',
        },
        component: () => import('@/views/AnalyticsView.vue'),
      },
    ],
  },
  {
    path: '/settings',
    component: PageLayout,
    children: [
      {
        path: '',
        name: 'settings',
        meta: {
          label: 'Settings',
        },
        component: () => import('@/views/SettingsView.vue'),
      },
    ],
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),

  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const isAuthenticatedResult = await until(() => getIsAuthenticated())

  // special case
  if (to.name === 'register') {
    return true
  }

  // not authenticated
  if (!isAuthenticatedResult.data) {
    if (to.name !== 'login') return { name: 'login' }
  }

  // authenticated
  if (isAuthenticatedResult.data) {
    if (to.name === 'login') return { name: 'dashboard' }
  }
  return true
})

export default router
