import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import PageLayout from '@/components/PageLayout.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import LoginRegisterLayout from '@/components/LoginRegisterLayout.vue'
import { getIsAuthenticated } from '@/firebase/auth'
import { until } from '@open-draft/until'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: LoginRegisterLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: LoginView,
      },
    ],
  },
  {
    path: '/signup',
    component: LoginRegisterLayout,
    children: [
      {
        path: '',
        name: 'signup',
        component: SignupView,
      },
    ],

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
        props: (route) => ({ query: route.query.infoPanel }),
        component: () => import(/* webpackPrefetch: true */ '@/views/DashboardView.vue'),
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
        component: () => import(/* webpackPrefetch: true */ '@/views/RecordsView.vue'),
      },
    ],
  },
  // {
  //   path: '/analytics',
  //   component: PageLayout,
  //   children: [
  //     {
  //       path: '',
  //       name: 'analytics',
  //       meta: {
  //         label: 'Analytics',
  //       },
  //       component: () => import(/* webpackPrefetch: true */ '@/views/AnalyticsView.vue'),
  //     },
  //   ],
  // },
  // {
  //   path: '/settings',
  //   component: PageLayout,
  //   children: [
  //     {
  //       path: '',
  //       name: 'settings',
  //       meta: {
  //         label: 'Settings',
  //       },
  //       component: () => import(/* webpackPrefetch: true */ '@/views/SettingsView.vue'),
  //     },
  //   ],
  // },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const isAuthenticatedResult = await until(() => getIsAuthenticated())

  // special case
  if (to.name === 'signup') {
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
