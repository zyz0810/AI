import request from '@/utils/request'
import Qs from 'qs'
/* 获取监控点列表
 * pageSize 分页结束位置
 * page  分页起始位置
 * type type===allList 没有分页
 * 设备检索页面 传 type  ==AI 的类型
 */
export function pointList(data) {
  return request({
    url:'/ai/monitory_point/pointList',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 修改监控点状态成功
 * 监控点ID
 */
export function pointStatus(data) {
  return request({
    url:'/ai/monitory_point/modifyStatus',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 示范小区列表
 * pageSize 分页结束位置
 * page  分页起始位置
 */
export function communityList(data) {
  return request({
    url:'/ai/community/communityList',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* 添加/编辑示范小区
 * name 小区名称
 * mobile 手机号
 * images 封面图
 * point_id 绑定监控点ID
 * linkman 	联系人
 * id 小区ID
 */
export function editCommunity(data) {
  return request({
    url:'/ai/community/editCommunity',
    method: 'post',
    data: Qs.stringify(data)
  })
}


/* AI 案件列表
 * pageSize 分页结束位置
 * page  分页起始位置
 * category_big
 * category_small
 * facility_id
 */
export function collectList(data) {
  return request({
    url:'/ai/case_collect/collectList',
    method: 'post',
    data: Qs.stringify(data)
  })
}

/* AI案件详情
 * id
 */
export function collectDetail(data) {
  return request({
    url:'/ai/case_collect/detailCollect',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* AI案件详情-审核
 * id
 * category_big 大类编号
 * category_big_name 大类名
 * category_small 小类编号
 * category_small_name 小类名
 * is_audited 1：立案；2：暂不立案；3：再学习；4：结案',
 * remark 备注
 * ids 重复案件ID 多个用英文,分割
 */
export function collectEdit(data) {
  return request({
    url:'/ai/case_collect/editCollect',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 类别列表
 * type type ==allList 就没有分页
 */
export function categoryList(data) {
  return request({
    url:'/admin/category/categoryList',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 案件上一条 下一条
 * id 案件ID
 * type 1 升序 0 降序
 */
export function nextDetailCollect(data) {
  return request({
    url:'/ai/case_collect/nextDetail',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 删除AI案件
 * id 多个用英文,拼接
 */
export function delCollect(data) {
  return request({
    url:'/ai/case_collect/delCollect',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 获取实时监控
 * camera_index_code 监控点编码
 */
export function getNowurl(data) {
  return request({
    url:'/api/Hikvision/getNowurl',
    method: 'post',
    data: data
  })
}
/* 获取历史监控数据
 * camera_index_code 监控点编码
 * begin_time 	2021-09-08 08：58：46
 * end_time  2021-09-08 08：58：46
 */
export function getHistoryUrl(data) {
  return request({
    url:'/ai/Hikvision/getHistoryUrl',
    method: 'post',
    data: Qs.stringify(data)
  })
}
