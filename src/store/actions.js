import { getHome } from '@/service/home.js'

export default {
  async getHomeInfo(context, callback) {
    let { resultCode, data } = await getHome()
    if (resultCode === 200) {
      // let str = /^https:\/\//
      // Object.keys(data).forEach(item => {
      //   if (item !== 'carousels') {
      //     data[item] = data[item].filter(i => {
      //       return str.test(i.goodsCoverImg)
      //     })
      //   }
      // })
      context.commit('RECIEVE_HOMEINFO', data)
      callback && callback()
    }
  },
  getSelectCarts({ commit }, value) {
    commit('RECIEVE_SELECTCARTS', value)
  }
}
