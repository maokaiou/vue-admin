import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入局部引用的element-ui组件
import './plugings/element.js'
import axios from 'axios'

// 设置基地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.defaults.timeout = '8000'
axios.interceptors.request.use(config => {
  // config代表请求体
  // console.log(config)
  // 要在请求头中携带登录后的token，给请求头添加属性Authorization 该值为token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 将axios挂载到vue的原型对象上
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
