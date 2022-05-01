import axios from '@/api/ajax.js'

//获取用户信息
export const getUserInfo = () => axios.get('/user/info')
//修改用户信息
//{introduceSign,nickName,passwordMd5}
export const modifyUserInfo = params => axios.put('/user/info', params)
