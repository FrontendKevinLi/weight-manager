import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import PageLayout from '@/components/PageLayout.vue'
import LoginView from '@/views/LoginView.vue'

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
        component: () => import('@/views/SettingsView.vue'),
      },
    ],
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  // },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
