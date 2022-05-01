export default {
  RECIEVE_HOMEINFO(state, data) {
    state.swiperimg = data.carousels
    state.shoplist.newGoodses = data.newGoodses
    state.shoplist.hotGoodses = data.hotGoodses
    state.shoplist.recommendGoodses = data.recommendGoodses
  },
  RECIEVE_SELECTCARTS(state, value) {
    state.selectCarts = value
  }
}
