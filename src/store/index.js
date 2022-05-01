import { createStore } from 'vuex'
import actions from '@/store/actions.js'
import mutations from '@/store/mutations.js'
import state from '@/store/state.js'

export default createStore({
  actions,
  mutations,
  state
})
