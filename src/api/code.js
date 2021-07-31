import request from '@/utils/request'
import Qs from 'qs'
/* 发送手机短信验证码
 * mobile
 */
export function getSmsCode(data) {
  return request({
    url: `api-user/sms/getSmsCode`,
    method: 'post',
    data: Qs.stringify(data)
  })
}
