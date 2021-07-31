import request from '@/utils/request'
import Qs from 'qs'
/* 获取餐饮企业列表
 * pageSize 分页结束位置
 * page  分页起始位置
 * parent_id  是否禁用
 */
export function companyList(data) {
  return request({
    url:'api/company/companyList',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 获取餐饮企业详情
 * pageSize 分页结束位置
 * page  分页起始位置
 * parent_id  是否禁用
 */
export function companyDetail(data) {
  return request({
    url:'api/company/companyDetail',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 添加餐饮企业
 * pageSize 分页结束位置
 * page  分页起始位置
 * parent_id  是否禁用
 */
export function addCompany(data) {
  return request({
    url:'api/company/addCompany',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 编辑餐饮企业
 * pageSize 分页结束位置
 * page  分页起始位置
 * parent_id  是否禁用
 */
export function editCompany(data) {
  return request({
    url:'api/company/editCompany',
    method: 'post',
    data: Qs.stringify(data)
  })
}
