import axios from '@/api/ajax.js'

//获取主页数据
export const getHome = () => axios.get('/index-infos')
