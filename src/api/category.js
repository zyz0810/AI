import request from '@/utils/request'
import Qs from 'qs'
/* 类型管理-列表
 * type type ==allList 就没有分页
 */
export function categoryList(data) {
  return request({
    url: `/admin/category/categoryList`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 类型管理-添加
 * name 	类别名
 * depart_id 	部门ID
 * parent_id 	父类就是0
 * status 	1、正常 2、禁用
 * send_time 	秒数
 */
export function categoryAdd(data) {
  return request({
    url: `/admin/category/addCategory`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 类型管理-编辑
 * id
 */
export function categoryEdit(data) {
  return request({
    url: `/admin/category/editCategory`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 类型管理-更改状态
 * id
 * status 1、正常 2、禁用
 */
export function categoryStatus(data) {
  return request({
    url: `/admin/category/changeStatus`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 类型管理-获取所有的小类
 */
export function categorySmall(data) {
  return request({
    url: `/admin/category/categorySmall`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
/* 违规类型
 */
export function departTree(data) {
  return request({
    url: `/admin/Department/departTree`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
