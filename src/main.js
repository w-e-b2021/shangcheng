import { createApp } from 'vue'
import router from '@/router'
import store from '@/store/index.js'
import 'lib-flexible/flexible'
import {
  Icon,
  Toast,
  List,
  Cell,
  PullRefresh,
  ActionBar,
  ActionBarIcon,
  ActionBarButton,
  SubmitBar,
  Checkbox,
  Popover,
  Button,
  Overlay,
  Popup,
  AddressList,
  AddressEdit,
  Area,
  Skeleton,
  Field,
  CellGroup,
  Tab,
  Tabs,
  Card,
  Form,
  ConfigProvider
} from 'vant'
import App from './App.vue'

const app = createApp(App)
// app.config.globalProperties.propertype,在应用的任何组件实例中访问的全局 propertype
//相当于Vue.propertype
// 全局过滤器
app.config.globalProperties.$filters = function (url) {
  if (url && url.startsWith('http')) {
    //String.prototype.startsWith(a,[b])a,以a开头的字符串，b默认从0开始匹配
    return url
  } else {
    url = `http://backend-api-01.newbee.ltd${url}`

    return url
  }
}

console.log(process.env.NODE_ENV)
app
  .use(Icon)
  .use(Toast)
  .use(List)
  .use(Cell)
  .use(PullRefresh)
  .use(ActionBar)
  .use(ActionBarIcon)
  .use(ActionBarButton)
  .use(SubmitBar)
  .use(Checkbox)
  .use(Popover)
  .use(Button)
  .use(Overlay)
  .use(Popup)
  .use(AddressList)
  .use(AddressEdit)
  .use(Area)
  .use(Skeleton)
  .use(Field)
  .use(CellGroup)
  .use(Tab)
  .use(Tabs)
  .use(Card)
  .use(Form)
  .use(ConfigProvider)
app.use(router)
app.use(store)
// console.log(app)
app.mount('#app')
