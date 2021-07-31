import request from '@/utils/request'
import Qs from 'qs'
/* 列表设备
 * pageSize 分页结束位置
 * page  分页起始位置
 */
export function facilityList(data) {
  return request({
    url:'api/facility/facilityList',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 设备详情
 * id
 */
export function facilityDetail(data) {
  return request({
    url:'api/facility/facilityDetail',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 添加设备
 * pageSize 分页结束位置
 * page  分页起始位置
 * parent_id  是否禁用
 */
export function addFacility(data) {
  return request({
    url:'api/facility/addFacility',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 修改设备
 * pageSize 分页结束位置
 * page  分页起始位置
 * parent_id  是否禁用
 */
export function editFacility(data) {
  return request({
    url:'api/facility/editFacility',
    method: 'post',
    data: Qs.stringify(data)
  })
}
