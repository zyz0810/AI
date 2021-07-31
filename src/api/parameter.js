import request from '@/utils/request'
import Qs from 'qs'
/* 商品参数 列表
 * limit
 * page
 * 0:禁用 1.启用
 */
export function paraList(data) {
  return request({
    url: `api-product/parameter/list`,
    method: 'post',
    // params: query
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 保存商品参数
 */
export function paraSave(data) {
  return request({
    url: `api-product/parameter/save`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}

/* 修改商品参数
 */
export function paraUpdate(data) {
  return request({
    url: `api-product/parameter/update`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}


/* 删除商品参数
 */
export function paraDelete(data) {
  return request({
    url: `api-product/parameter/deleteById`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}



/* 参数值列表
 */
export function paraValueList(data) {
  return request({
    url: `api-product/parameterValue/list`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 保存参数值
 */
export function paraValueSave(data) {
  return request({
    url: `api-product/parameterValue/save`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}

/* 修改参数值
 */
export function paraValueUpdate(data) {
  return request({
    url: `api-product/parameterValue/update`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}


/* 删除参数值
 */
export function paraValueDelete(data) {
  return request({
    url: `api-product/parameterValue/deleteById`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}

