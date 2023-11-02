import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/iframe",
  },
  {
    path: '/iframe',
    name: "iframe",
    component: () => import("../views/layout-storage.vue"),
    children: [{
      path: "/storage",
      name: "storage",
      component: () => import("../views/storageView/storage/main.vue"),
      children: [
        {
          path: "/storage/harddisk",
          name: "harddisk",
          component: () => import("../views/storageView/storage/components/harddisk.vue"),
        },
        {
          path: "/storage/filesystem",
          name: "filesystem",
          component: () => import("../views/storageView/storage/components/filesystem.vue"),
        },
        {
          path: "/storage/iSCSI",
          name: "iSCSI",
          component: () => import("../views/storageView/storage/components/iSCSI/index.vue"),
        },
        {
          path: "/storage/NAS",
          name: "NAS",
          component: () => import("../views/storageView/storage/components/NAS.vue"),
        },
        {
          path: "/storage/pool",
          name: "zfs",
          component: () => import("../views/storageView/storage/components/ZFS/index.vue"),
        },
        {
          path: "/storage/system",
          name: "system",
          component: () => import("../views/storageView/storage/components/system.vue"),
        },
        {
          path: "/storage/log",
          name: "log",
          component: () => import("../views/storageView/storage/components/log.vue"),
        },
        // {
        //   path: "/storage/remoteCopy",
        //   name: "remoteCopy",
        //   component: () => import("../views/storageView/storage/components/remote-copy.vue"),
        // },
        // {
        //   path: "/storage/sensor",
        //   name: "sensor",
        //   component: () => import("../views/storageView/storage/components/sensor.vue"),
        // }
      ]
    }]
  },
  // {
  //   path: "/home",
  //   name: "home",
  //   component: () => import("../views/layout.vue"),
  //   children: [
  //     {
  //       path: "/vm",
  //       name: "vm",
  //       component: () => import("../views/vmView/main.vue"),
  //       children: [
  //         {
  //           path: "/vm/console",
  //           name: "console",
  //           component: () => import("../views/vmView/comp/console.vue")
  //         },
  //         {
  //           path: "/vm/summary",
  //           name: "vmSummary",
  //           component: () => import("../views/vmView/comp/summary.vue")
  //         },
  //         {
  //           path: "/vm/hardware",
  //           name: "vmHardware",
  //           component: () => import("../views/vmView/comp/hardware.vue")
  //         },
  //         {
  //           path: "/vm/snapshot",
  //           name: "vmSnapshot",
  //           component: () => import("../views/vmView/comp/snapshot.vue")
  //         },
  //         {
  //           path: "/vm/options",
  //           name: "vmOptions",
  //           component: () => import("../views/vmView/comp/options.vue")
  //         },
  //       ]
  //     },
  //     {
  //       path: "/node",
  //       name: "node",
  //       component: () => import("../views/nodeView/main.vue"),
  //       children: [
  //         {
  //           path: "/node/shell",
  //           name: "shell",
  //           component: () => import("../views/nodeView/comp/shell.vue")
  //         },
  //         {
  //           path: "/node/summary",
  //           name: "nodeSummary",
  //           component: () => import("../views/nodeView/comp/summary.vue")
  //         },
  //         {
  //           path: "/node/network",
  //           name: "network",
  //           component: () => import("../views/nodeView/comp/network.vue")
  //         },
  //         {
  //           path: "/node/image",
  //           name: "image",
  //           component: () => import("../views/nodeView/comp/image.vue"),
  //         },
  //       ]
  //     },
  //     {
  //       path: "/cluster",
  //       name: "cluster",
  //       component: () => import("../views/clusterView/main.vue"),
  //       children: [
  //         {
  //           path: "/cluster/storage",
  //           name: "clusterStorage",
  //           component: () => import("../views/clusterView/comp/storage.vue")
  //         },
  //         {
  //           path: "/cluster/summary",
  //           name: "clusterSummary",
  //           component: () => import("../views/clusterView/comp/summary.vue")
  //         },
  //         {
  //           path: "/cluster/cluster",
  //           name: "clusterConfig",
  //           component: () => import("../views/clusterView/comp/cluster.vue")
  //         },
  //         {
  //           path: "/cluster/HA",
  //           name: "clusterHA",
  //           component: () => import("../views/clusterView/comp/HA.vue")
  //         },
  //       ]
  //     },
  //     {
  //       path: "/gpu/device",
  //       name: "gpudevice",
  //       component: () => import("../views/gpuView/device.vue"),
  //     },
  //     {
  //       path: "/gpu/virtualization",
  //       name: "gpuvirtualization",
  //       component: () => import("../views/gpuView/virtualization.vue"),
  //     },
  //     {
  //       path: "/bigdata/dataaccess",
  //       name: "dataaccess",
  //       component: () => import("../views/bigData/dataaccess.vue"),
  //     },
  //   ]
  // },
]
  const router = createRouter({
    history: createWebHashHistory(),
    routes,
  })
  export default router;