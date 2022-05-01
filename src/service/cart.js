import axios from '@/api/ajax'

//加入购物车
//{goodsCount:1,goodsId:10925}
// 返回值：{resultCode: 200, message: "SUCCESS", data: null}，
// {resultCode: 500, message: "已存在！无需重复添加！", data: null}
export const addCart = params => axios.post('/shop-cart', params)
//获取购物车列表
export const getCartList = () => axios.get('/shop-cart')
//根据cartItemIds数组获取列表
export const getCreateOrderList = cartItemIds => axios.get('/shop-cart/settle', { params: { cartItemIds } })
//修改购物车某个商品数量
export const modifyCart = params => axios.put('/shop-cart', params) //{cartItemId:123,goodsCount:2}
//删除购物车商品
export const deleteCartItem = cartItemId => axios.delete(`/shop-cart/${cartItemId}`)
