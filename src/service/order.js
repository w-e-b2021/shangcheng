import axios from '@/api/ajax.js'

//生成订单(不管有没有支付都要生成订单)
//{addressId:7835,cartItemIds:[]}
export const createOrder = params => axios.post('/saveOrder', params)
//支付成功{orderNo:16505426872348132,payType:1}
export const paySuccess = params => axios.get('/paySuccess', { params })
//'','0','1'...'4',分别代表全部，待付款，待确认，待发货，已发货，交易完成{pageNumber,status}
export const getOrderListByStatus = params => axios.get('/order', { params })
//根据订单号确认订单
export const confirmOrderById = id => axios.put(`/order/${id}/finish`)
//根据订单号取消订单
export const cancelOrderById = id => axios.put(`/order/${id}/cancel`)
//根据订单编号获取订单详情
export const getOrderDetailById = id => axios.get(`/order/${id}`)
