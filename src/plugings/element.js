import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
// message不同于其它上面的组件，而要挂载到vue的实例（原型对象）上，$message可以随便写成$什么，只是在调用的时候也要
// 写成相应的，调用时直接this.$message.success()成功
Vue.prototype.$message = Message
