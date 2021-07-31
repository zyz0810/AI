import request from '@/utils/request'
import Qs from 'qs'
/* 查询所有菜单、权限
  * limit page
*/
export function getRoles(query) {
  return request({
    url: `api-user/roles/getRoles`,
    method: 'get',
    params: query
  })
}
/* 新增、修改系统权限
  * limit page
*/
export function saveOrUpdateSysRole(data) {
  return request({
    url: `api-user/roles/saveOrUpdateSysRole`,
    method: 'post',
    data: Qs.stringify(data)
  })
}


/* 后台管理删除角色
  * ids 用户id
*/
export function deleteRoleByIds(data) {
  return request({
    url: `api-user/roles/deleteRoleByIds`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
