import axios from 'axios'
import { Toast } from 'vant'
import router from '@/router'

axios.defaults.baseURL = 'http://backend-api-01.newbee.ltd/api/v1'
// axios.defaults.withCredentials = true
axios.defaults.headers['token'] = localStorage.getItem('token')
axios.interceptors.request.use(req => {
  req.headers['token'] = localStorage.getItem('token')
  return Promise.resolve(req)
})

axios.interceptors.response.use(res => {
  if (typeof res.data !== 'object') {
    Toast.fail('服务器异常')
    return Promise.reject(res)
  }
  if (res.data.resultCode !== 200) {
    if (res.data.message) Toast.fail(res.data.message)
    if (res.data.resultCode == 416) {
      router.push('/login')
    }
    return Promise.reject(res.data)
  }
  return res.data
})

export default axios
