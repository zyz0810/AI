import axios from 'axios'
import QS from 'qs'
import router from '@/router'
import { Message } from 'element-ui'
import store from '@/store'

import {
  requestUrl
} from "./request";
// const apiurl = 'http://192.168.3.66:9200/'
// const apiurl = 'http://uat.omc.kyaoduo.com/' //预生产
// const apiurl = 'https://omc.kyaoduo.com/'//生产
axios.defaults.baseURL = requestUrl


axios.defaults.timeout = 50000
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 对外接口
// export function request ({method, url, params}) {
//   if (method == 'Get') {
//     return get(url, params)
//   } else if (method == 'Post') {
//     return post(url, params)
//   } else if (method == 'Put') {
//     return put(url, params)
//   }else if(method == 'Liu'){
//     return getLiu(url, params)
//   }
// }
// 对外接口
export function request ({method, url, params}) {
  if(method == 'Liu'){
    return getLiu(url, params)
  }
}

// // 封装get方法
// function get (url, params) {
//   return new Promise((resolve, reject) => {
//     axios.get(url, {params: params}).then(res => {
//       resolve(res.data)
//     }).catch(err => {
//       reject(err)
//     })
//   })
// }
function getLiu (url, params,Type="blob") {
  return new Promise((resolve, reject) => {
    axios.post(url, QS.stringify(params),{responseType:Type}).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
// // 封装post方法
// function post (url, params) {
//   return new Promise((resolve, reject) => {
//     axios.post(url, QS.stringify(params)).then(res => {
//       resolve(res.data)
//     }).catch(err => {
//       reject(err)
//     })
//   })
// }
//
// // 封装put方法
// function put (url, params) {
//   return new Promise((resolve, reject) => {
//     axios.put(url, QS.stringify(params)).then(res => {
//       resolve(res.data)
//     }).catch(err => {
//       reject(err)
//     })
//   })
// }

// 图片上传方法
export function UploadImgUrl () {
  return apiurl+'/dljy-userservice/external/fileupload'
}

// 请求拦截(请求发出前处理请求)
axios.interceptors.request.use(
  config => {
    config.headers['client_id'] = 'supplierApp'
    config.headers['client_secret'] = 'supplierApp'
    // config.data = Qs.stringify(config.data) // 转为formdata数据格式
    if (store.getters.token) {
      // config.headers['Authorization'] = store.getters.token
      config.headers.Authorization = 'Bearer ' + store.getters.token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// axios.interceptors.response.use(res => {
//   if (res.status == 200) {
//     if (res.data.statusCode == '1001' || res.data.statusCode == '1002' || res.data.statusCode == '1003') {
//       sessionStorage.removeItem('user')
//       Message.error(res.data.message)
//       router.push('/')
//     }
//   }
//   return res
// })

// // 响应拦截器（处理响应数据）
// axios.interceptors.response.use(function (response) {
//   if (response.status == '200') {
//     if (response.data.statusCode == 1001 || response.data.statusCode == 1002) {
//       Message.error(response.data.message)
//       router.push('/login')
//     }
//   } else {
//     Message.error('当前请求' + response.status)
//     router.push('/login')
//   }
//   return response
// }, function (error) {
//   if (error.response) {
//     return error.response
//   } else {
//     Message.error('请求超时，请刷新页面重试')
//   }
// })
