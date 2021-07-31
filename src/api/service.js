import request from '@/utils/request'
import Qs from 'qs'
/* 列表服务保障
 * limit
 * page
 *
 */
export function serviceList(data) {
  return request({
    url: `api-user/parm/setting/listByPage`,
    method: 'post',
    // params: query
    data: Qs.stringify(data)
  })
}
/* 编辑服务保障  add新增update编辑using启用close关闭
 * operatorType:'',// 操作类型add新增update编辑using启用close关闭
 * parmName: "", // 参数名称
 * parmUrl: "", // 图片url
 * parmValue:"", // 参数值
 * status:0, // 0启用1禁用
 */
export function serviceModify(data) {
  return request({
    url: `api-user/parm/setting/modify`,
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 商品服务保障列表（商品详情）
 */
export function serviceListProduct(data) {
  return request({
    url: `api-user/parm/setting/getParmSettingByFunc`,
    method: 'post',
    data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
  })
}
