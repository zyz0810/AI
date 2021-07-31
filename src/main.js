import Vue from 'vue'
import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import directive from './directive/directive'
import {
 MessageBox
} from 'element-ui'
import './iconfont/iconfont.css'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import commonComponents from '@/components/index'
import * as filters from './filters' // global filters

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import '@/styles/animate.css'
// import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/reset.css'

import moment from 'moment'
Vue.prototype.$moment = moment

Vue.use(commonComponents)
Vue.use(VueQuillEditor)
Vue.use(directive)
Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size 	medium / small / mini
})


// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// 禁止input输入+-符号
Vue.prototype.validNumber = function (value) {
  value = value.replace(/[`～*~!@#$%^&*()_\-+=<>?:"{}|,/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g, '').replace(/\s/g, "");
  return value;
};

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
