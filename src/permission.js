import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // const hasToken = getToken()
  const hasToken = sessionStorage.getItem('Admin-Token')
  // const hasToken = 'token=Admin-Token'
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      console.log(1111)
      if (hasRoles) {
        next()
      } else {
        try {
          const roles = await store.dispatch('user/getInfo')
          console.log(roles)
          const accessRoutes = await store.dispatch(
            'permission/generateRoutes',
            roles
          )
          router.addRoutes(accessRoutes)
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // next(`/login?redirect=${to.path}`)
      next(`/login?redirect=/testing/monitor`)
      NProgress.done()
    }
  }

  // //搞好的一版开始
  // if (hasToken) {
  //   if (to.path === '/login') {
  //     next({path: '/'})
  //     NProgress.done()
  //   } else {
  //     try {
  //       const accessRoutes = await store.dispatch('permission/generateRoutes')
  //       router.addRoutes(accessRoutes)
  //       next()
  //     } catch (error) {
  //       next(`/login?redirect=${to.path}`)
  //       NProgress.done()
  //     }
  //   }
  // } else {
  //   /* has no token*/
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     next()
  //   } else {
  //     console.log('拦截')
  //     next(`/login?redirect=${to.path}`)
  //     NProgress.done()
  //   }
  // }
  // //搞好的一版结束
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
