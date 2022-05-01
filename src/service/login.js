import axios from '@/api/ajax.js'
//{loginName,passwordMd5}
export const login = params => axios.post('/user/login', params)
//登出
export const logout = () => axios.post('/user/logout')
//注册{loginName,password}
export const register = params => axios.post('/user/register', params)
