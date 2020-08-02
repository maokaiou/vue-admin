import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import UserList from '../views/User/userList.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: Login,
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      }, {
        path: '/users',
        component: UserList
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 在暴露路由之前，先挂载路由导航守位
router.beforeEach((to, from, next) => {
  // to 将要访问路径
  // from 从哪一个路径跳转过来
  // next 是以恶搞函数 表示放行
  // next（）放行    next('/login') 强制跳转
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
