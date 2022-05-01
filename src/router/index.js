import { createRouter, createWebHashHistory } from 'vue-router'

const Msite = () => import('@/view/Msite.vue')
const Sort = () => import('@/view/Sort.vue')
const Cart = () => import('@/view/Cart.vue')
const Profil = () => import('@/view/Profil.vue')
const Login = () => import('@/view/Login.vue')
const Search = () => import('@/view/Search.vue')
const GoodsDetail = () => import('@/view/GoodsDetail.vue')
const CreatOrder = () => import('@/view/CreateOrder.vue')
const Address = () => import('@/view/Address.vue')
const AddressEdit = () => import('@/view/AddressEdit.vue')
const About = () => import('@/view/About.vue')
const AccountSetting = () => import('@/view/AccountSetting.vue')
const Order = () => import('@/view/Order.vue')
const OrderDetail = () => import('@/view/OrderDetail.vue')

const routes = [
  { path: '/', redirect: '/msite' },
  { path: '/msite', component: Msite },
  { path: '/sort', component: Sort },
  { path: '/cart', component: Cart },
  { path: '/profil', component: Profil },
  { path: '/login', meta: { noShow: true }, component: Login },
  { path: '/search', meta: { noShow: true }, component: Search },
  { path: '/goodsdetail', meta: { noShow: true }, component: GoodsDetail },
  { path: '/createorder', meta: { noShow: true }, component: CreatOrder },
  { path: '/address', meta: { noShow: true }, component: Address },
  { path: '/addressedit', meta: { noShow: true }, component: AddressEdit },
  { path: '/about', meta: { noShow: true }, component: About },
  { path: '/accountsetting', meta: { noShow: true }, component: AccountSetting },
  { path: '/order', meta: { noShow: true }, component: Order },
  { path: '/orderdetail', meta: { noShow: true }, component: OrderDetail }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// router.beforeEach((to, from, next) => {

//   next()
// })

export default router
