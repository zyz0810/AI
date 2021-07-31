import request from '@/utils/request'
import Qs from 'qs'
/* 城市列表
 * pageSize 分页结束位置
 * page  分页起始位置
 * parent_id  是否禁用
 */
export function cityList(data) {
  return request({
    url:'api/city/cityList',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 城市详情
 * id
 */
export function cityDetail(data) {
  return request({
    url:'api/city/cityDetail',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 添加城市
 */
export function addCity(data) {
  return request({
    url:'api/city/addcity',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 修改城市
 * pageSize 分页结束位置
 * page  分页起始位置
 * parent_id  是否禁用
 */
export function updateCity(data) {
  return request({
    url:'api/city/editcity',
    method: 'post',
    data: Qs.stringify(data)
  })
}
