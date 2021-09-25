import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: () => import('@/views/dashboard/index'),
  //       name: '首页',
  //       meta: { title: '首页', icon: 'indexIcon', affix: true }
  //     }
  //   ]
  // }
]
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/testing/monitor',
    // name: '实时监测',
    meta: {
      // title: '实时监测',
      icon: 'iconfont icon-hangzhengguanli',
      roles: ['admin'],
    },
    children: [
      {
        path: 'testing/monitor',
        component: () => import('@/views/testing/monitor/list'),
        name: 'modelList',
        meta: {
          title: '实时监测',
          roles: ['admin'],
        }
      }
    ]
  },
  {
    path: '/workOrder',
    component: Layout,
    redirect: '/workOrder/police',
    // name: '预警审核',
    meta: {
      // title: '预警审核',
      icon: 'iconfont icon-jiance',
      roles: [
        'admin',
      ]
    },
    children: [
      {
        path: 'police',
        component: () => import('@/views/workOrder/police/list'),
        name: '预警审核',
        meta: {
          title: '预警审核',
          roles: [
            'admin',
          ]
        }
      },
      {
        path: 'policeView',
        hidden:true,
        component: () => import('@/views/workOrder/police/components/view'),
        name: '预警审核',
        meta: {
          title: '预警审核',
          activeMenu: '/workOrder/police',
          roles: [
            'admin',
          ]
        }
      },
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    redirect: 'noRedirect',
    name: '数据查询',
    alwaysShow: true,
    meta: {
      title: '数据查询',
      icon: 'iconfont icon-xiangqing',
      roles: [
        'admin',
      ]
    },
    children: [
      {
        path: 'intelligence',
        component: () => import('@/views/statistics/intelligence/list'),
        name: 'intelligenceList',
        meta: {
          title: '事件检索',
          roles: [
            'admin',
          ]
        }
      },
      {
        path: 'intelligenceView',
        hidden:true,
        // component: () => import('@/views/statistics/intelligence/components/view'),
        component: () => import('@/views/workOrder/police/components/view'),
        name: '事件详情',
        meta: {
          title: '事件详情',
          activeMenu: '/statistics/intelligence',
          roles: [
            'admin',
          ]
        }
      },
      {
        path: 'equipment',
        component: () => import('@/views/statistics/equipment/list'),
        name: 'equipmentList',
        meta: {
          title: '设备检索',
          roles: [
            'admin',
          ]
        }
      },{
        path: 'data',
        component: () => import('@/views/statistics/data/list'),
        name: 'dataList',
        meta: {
          title: '重复事件查询',
          roles: [
            'admin',
          ]
        }
      },{
        path: 'dataView',
        hidden:true,
        // component: () => import('@/views/statistics/data/components/view'),
        component: () => import('@/views/workOrder/police/components/view'),
        name: '重复事件查询详情',
        meta: {
          title: '重复事件查询详情',
          activeMenu: '/statistics/data',
          roles: [
            'admin',
          ]
        }
      },
    ]
  },
  {
    path: '/devOps',
    component: Layout,
    redirect: 'noRedirect',
    // name: '示范小区',
    meta: {
      // title: '示范小区',
      icon: 'iconfont icon-xingxing',
      roles: [
        'admin',
      ]
    },
    children: [
      {
        path: 'verify',
        component: () => import('@/views/devOps/verify/list'),
        name: 'verifyList',
        meta: {
          title: '示范小区',
          roles: [
            'admin',
          ]
        }
      },{
        path: 'verifyView',
        hidden:true,
        // component: () => import('@/views/devOps/verify/components/view'),
        component: () => import('@/views/workOrder/police/components/view'),
        name: '示范小区详情',
        meta: {
          title: '示范小区详情',
          activeMenu: '/devOps/verify',
          roles: [
            'admin',
          ]
        }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: 'noRedirect',
    name: '统计分析',
    alwaysShow: true,
    meta: {
      title: '统计分析',
      icon: 'iconfont icon-tongji',
      roles: [
        'admin',
      ]
    },
    children: [
      {
        path: 'catering',
        component: () => import('@/views/system/catering/list'),
        name: 'cateringList',
        meta: {
          title: '趋势分析',
          roles: [
            'admin',
          ]
        }
      },
      {
        path: 'monitor',
        component: () => import('@/views/system/monitor/list'),
        name: 'monitorList',
        meta: {
          title: '预警统计',
          roles: ['admin',]
        }
      },
      {
        path: 'jurisdiction',
        component: () => import('@/views/system/jurisdiction/list'),
        name: 'jurisdictionList',
        meta: { title: '专项分析', roles: ['admin', 'menu:list'] }
      },
      {
        path: 'user',
        component: () => import('@/views/system/user/list'),
        name: 'userList',
        meta: {
          title: '运行报告',
          roles: [
            'admin',
          ]
        }
      },
    ]
  },
  // {
  //   path: '/category',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   // name: '示范小区',
  //   meta: {
  //     // title: '示范小区',
  //     icon: 'el-icon-menu',
  //     roles: [
  //       'admin',
  //     ]
  //   },
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/views/category/list'),
  //       name: 'categoryList',
  //       meta: {
  //         title: '类型设置',
  //         roles: [
  //           'admin',
  //         ]
  //       }
  //     }
  //   ]
  // },
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
