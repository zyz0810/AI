import request from '@/utils/request'
import Qs from 'qs'
/* 获取区域树
 * code 区域code
 * name 区域名称
 * PROVINCE(1, "省"),
 * CITY(2, "市"),
 * DISTRICT(3, "区"),
 * STREET(4, "街道");
 */
export function findAreaTree(query) {
  // query = Object.assign({}, {
  //   level: "DISTRICT"
  // })
  return request({
    url: `api-user/area/findAreaTree`,
    method: 'get',
    params: query
  })
}
/* 获取区域叶子
 * code 区域code
 * name 区域名称
 * id 地区id
 */
export function findAreaChilds(query) {
  return request({
    url: `api-user/area/findAreaChilds`,
    method: 'get',
    params: query
  })
}



/* 新增、修改地区
 * code
 * id
 * lat
 * lng
 * name
 * orders
 * parentId
 * telCode
 * zipCode
 */
export function saveOrUpdateArea(data) {
  return request({
    url: `api-user/area/saveOrUpdateArea`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 删除区域
 * id
 */
export function deleteArea(data) {
  return request({
    url: `api-user/area/deleteArea`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
