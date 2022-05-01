import axios from '@/api/ajax.js'

//获取搜索列表
export const getSearchList = params => axios.get('/search', { params })
//获取商品详情页
export const getGoodsDetail = id => axios.get(`/goods/detail/${id}`)
