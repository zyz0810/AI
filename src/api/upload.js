import request from '@/utils/request'
import axios from 'axios'
import Qs from 'qs'
/* 查询温馨提示列表
 * createEndTime 创建时间-结束
 * createStartTime 创建时间-开始
 * limit
 * page
 * title
 */
export function tipList(data) {
  return request({
    url: `api-user/warm-remind/list`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 公告新增、编辑、删除
 * content 内容
 * isDelete 0有效1无效
 * operatorType 操作类型add新增update编辑delete删除
 * title 标题
 */
export function tipSave(data) {
  return request({
    url: `api-user/warm-remind/insert`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}

/* 公告新增、编辑、删除
 * content 内容
 * isDelete 0有效1无效
 * operatorType 操作类型add新增update编辑delete删除
 * title 标题
 */
export function tipUpdate(data) {
  return request({
    url: `api-user/warm-remind/update`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}




/* 查询公告明细
 * id
 */
export function tipView(query) {
  return request({
    url: `api-user/warm-remind/detail`,
    method: 'get',
    params: query
  })
}
/* 图片上传
 */
export function uploadImg(file, type = "license") {
  const data = new FormData()
  data.append('file', file)
  data.append('type', type)
  return request({
    url: `api/tools/upload`,
    method: 'POST',
    data: data,
  }).then(res => {
    return res ? res.data : {}
  })
}

/* 图片上传
 */
// export function uploadImg(file,config) {
//   const data = new FormData()
//   data.append('file', file)
//   data.append('type', 'license')
//   let axiosConfig = {
//     url: `api-user/file/uploadSingleImage`,
//     method: 'POST',
//     data: data,
//   }
//   if(config instanceof  Object){
//     for(let key in config){
//       axiosConfig[key] = config[key]
//     }
//   }
//   return axios(axiosConfig)
// }

