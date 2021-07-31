import request from '@/utils/request'
import Qs from 'qs'
/* 字典列表
 * pageSize 分页结束位置
 * page  分页起始位置
 * parent_id  是否禁用
 */
export function dicList(data) {
  return request({
    url:'api/dictionary/dicList',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 修改字典状态
 * id 分页结束位置
 */
export function mofidyStatusDic(data) {
  return request({
    url:'api/dictionary/mofidyStatus',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 添加字典
 * id 分页结束位置
 */
export function addDictionary(data) {
  return request({
    url:'api/dictionary/addDictionary',
    method: 'post',
    data: Qs.stringify(data)
  })
}

