import request from '@/utils/request'
import Qs from 'qs'
// 查询所有菜单、权限
export function findMenuTree(query) {
  return request({
    url: `api-user/menus/findMenuTree`,
    method: 'get',
    params: query
  })
}
/* 根据角色查询菜单、权限列表
  * roleId
 */
export function findMenuByRole(query) {
  return request({
    url: `api-user/menus/findMenuByRole`,
    method: 'get',
    params: query
  })
}

