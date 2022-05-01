import axios from '@/api/ajax'
//获取默认地址
export const getDefaultAddress = () => axios.get('/address/default')
//获取地址列表
//{pageNumber:Number,pageSize:Number},这个参数没有用
export const getAddressList = params => axios.get('/address', { params })
//编辑地址
export const editAddress = params => axios.put('/address', params)
//根据id获取地址
export const getAddressById = id => axios.get(`/address/${id}`)
//新增地址
export const addAddress = params => axios.post('/address', params)
//根据id删除地址
export const deleteAddress = params => axios.delete(`/address/${params}`)
