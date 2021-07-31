// import request from '@/utils/ApiConfig'
import {request} from '@/utils/ApiConfig'
import Qs from 'qs'

/* 导出结算单报表
 */
// export function balanceExport(data) {
//   return request({
//     url: `api-order/supplier/balance/export/store/balance`,
//     method: 'Liu',
//     data: Qs.stringify(data,{ arrayFormat: 'indices', allowDots: true })
//   })
// }
const AdminServer = {
  balanceExport(params){
    return request({
      method: 'Liu',
      url: 'api-order/operation/balance/export/operation/balance',
      params:params
    })
  },
  /* 导出结算单列表
 */
  balanceListExport(params){
    return request({
      method: 'Liu',
      url: 'api-order/operation/balance/export/operation/balance/order',
      params:params
    })
  },
  /* 订单交易记录导出
 */
  recordsExport(params) {
    return request({
      url: `api-order/order/records/export`,
      method: 'Liu',
      params:params
    })
  },
  /* 导出客户信息
 */
  customerInfoExport(params) {
    return request({
      url: `api-user/customer/store/customer/info/export/sys`,
      method: 'Liu',
      params:params
    })
  },
  /* 导出客户图片
 */
  customerMaterialsExport(params) {
    return request({
      url: `api-user/customer/store/list/materials`,
      method: 'Liu',
      params:params
    })
  },
  /* 导出服务商结算单列表
*/
  providerBalanceListExport(params){
    return request({
      method: 'Liu',
      url: 'api-order/provider/balance/operator/exportBalance',
      params:params
    })
  },
  /* 导出服务商结算单明细
*/
  providerBalanceDetailExport(params){
    return request({
      method: 'Liu',
      url: 'api-order/provider/balance/export/balance/detail',
      params:params
    })
  },
  /* 商品明细导出
   * ids
   */
  productDetailExport(params) {
    return request({
      url: `api-order/provider/balance/product/detail/export`,
      method: 'Liu',
      params:params
    })
  },

  /* 订单明细导出
   * orderIds
   */
  orderDetailExport(params) {
    return request({
      url: `api-order/provider/balance/order/detail/export`,
      method: 'Liu',
      params:params
    })
  },


  /* 订单列表导出详情
   * clientName 客户名称
   * customerMobile 手机号码
   * endShippingTime 发货结束时间
   * endTime 下单结束时间
   * ids 订单单号批量
   * isOmc true表示运营后台，false表示供应商后台
   * offlineOrderStatus 对公转账tab订单状态
   *
   */
  orderExport(params) {
    return request({
      url: `api-order/web/order/export/order/detail`,
      method: 'Liu',
      params:params
    })
  },

  orderRefundExport(params) {
    return request({
      url: `api-order/web/order/export/order/refund/detail`,
      method: 'Liu',
      params:params
    })
  }

}
export default AdminServer
