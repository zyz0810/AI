import request from '@/utils/request'
import Qs from 'qs'
/* 趋势分析
 * day_time 如2020-10-16
 */
export function analysisData(data) {
  return request({
    url:'/ai/Analysis/analysisData',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 预警统计
 * start_time 如2020-10-16
 * end_time 如2020-10-16
 */
export function earlyWarning(data) {
  return request({
    url:'/ai/Analysis/earlyWarning',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 专项分析
 * category_big
 * category_small
 * end_time 如2020-10-16
 */
export function patrolCase(data) {
  return request({
    url:'/ai/Analysis/patrolCase',
    method: 'post',
    data: Qs.stringify(data)
  })
}
/* 运行报告
 * start_time 如2020-10-16
 * end_time 如2020-10-16
 */
export function runData(data) {
  return request({
    url:'/ai/Analysis/runData',
    method: 'post',
    data: Qs.stringify(data)
  })
}
