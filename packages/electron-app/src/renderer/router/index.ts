import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/game/doudizhu',
    name: 'Doudizhu',
    component: () => import('@/views/DoudizhuGame.vue')
  },
  {
    path: '/game/guandan',
    name: 'Guandan',
    component: () => import('@/views/GuandanGame.vue')
  },
  {
    path: '/game/zhaojinhua',
    name: 'Zhaojinhua',
    component: () => import('@/views/ZhaojinhuaGame.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue')
  },
  {
    path: '/stats',
    name: 'Stats',
    component: () => import('@/views/Stats.vue')
  },
  {
    path: '/multiplayer',
    name: 'MultiplayerLobby',
    component: () => import('@/views/MultiplayerLobby.vue')
  },
  {
    path: '/multiplayer/room',
    name: 'MultiplayerRoom',
    component: () => import('@/views/MultiplayerRoom.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
