import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/iframe',
  },
  {
    path: '/iframe',
    name: 'iframe',
    component: () => import('../views/layout-storage.vue'),
    children: [
      {
        path: '/storage',
        name: 'storage',
        component: () => import('../views/storageView/storage/main.vue'),
        children: [
          {
            path: '/storage/harddisk',
            name: 'harddisk',
            component: () =>
              import('../views/storageView/storage/components/harddisk.vue'),
          },
          {
            path: '/storage/filesystem',
            name: 'filesystem',
            component: () =>
              import('../views/storageView/storage/components/filesystem.vue'),
          },
          {
            path: '/storage/iSCSI',
            name: 'iSCSI',
            component: () =>
              import('../views/storageView/storage/components/iSCSI/index.vue'),
          },
          {
            path: '/storage/NAS',
            name: 'NAS',
            component: () =>
              import('../views/storageView/storage/components/NAS.vue'),
          },
          {
            path: '/storage/pool',
            name: 'zfs',
            component: () =>
              import('../views/storageView/storage/components/ZFS/index.vue'),
          },
          {
            path: '/storage/system',
            name: 'system',
            component: () =>
              import('../views/storageView/storage/components/system.vue'),
          },
          {
            path: '/storage/log',
            name: 'log',
            component: () =>
              import('../views/storageView/storage/components/log.vue'),
          },
        ],
      },
    ],
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
export default router
