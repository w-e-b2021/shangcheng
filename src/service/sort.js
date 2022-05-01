import axios from '@/api/ajax.js'

export const getSort = () => axios.get('/categories')
