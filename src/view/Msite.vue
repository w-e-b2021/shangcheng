<template>
  <div class="wrapper">
    <ul class="content">
      <div class="msite-container">
        <swiper
          class="swiper"
          :modules="modules"
          loop
          :autoplay="{ delay: 3000 }"
          :pagination="{ clickable: true }"
        >
          <swiper-slide class="swiper-slide" v-for="(img, index) in imgs" :key="index">
            <img :src="img.carouselUrl" alt="" />
          </swiper-slide>
        </swiper>
        <div ref="msitenav">
          <MsiteNav @click="show"></MsiteNav>
        </div>
        <div ref="msiteshop" class="msite-shop">
          <div class="msiteshop1" v-for="(shoplist, index) in shoplists" :key="index">
            <div class="shop-list-title">{{ arr[index] }}</div>
            <div class="shop-lists">
              <ShopList class="list" v-for="shop in shoplist" :key="shop.goodsId" :shop="shop"></ShopList>
            </div>
          </div>
        </div>
      </div>
    </ul>

    <div class="title_dynamic" v-show="scroll_flag" :style="`transform: translateY(${-top}px)`">
      {{ arr[currentIndex] }}
    </div>
    <!-- 这里可以放一些其它的 DOM,但不会影响滚动 -->
    <!-- <h3 style="position: fixed; top: 500px" @click="num++">
      {{ num }}--{{ currentIndex }}--{{ top }}--{{ flag }}
    </h3> -->
    <TopSearch :top_flag="top_flag" @bgheight="bgheight">
      <template #left>
        <div class="left">
          <span class="iconfont icon-caidan"></span>
        </div>
      </template>
      <template #center>
        <router-link to="/search?refresh=true" class="link">
          <div class="search">
            <span class="iconfont icon-icon-test2"></span>
            <div class="line"></div>
            山河无恙，人间皆安
          </div>
        </router-link>
      </template>
      <template #right>
        <div class="right">
          <router-link to="/login" v-if="!loginFlag">
            <span>登录</span>
          </router-link>
          <router-link to="/profil" replace v-else>
            <span class="iconfont icon-touxiang"></span>
          </router-link>
        </div>
      </template>
    </TopSearch>
  </div>
</template>

<script>
import { Autoplay, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/pagination'

import TopSearch from '@/components/TopSearch.vue'
import MsiteNav from '@/components/MsiteNav.vue'
import ShopList from '@/components/ShopList.vue'

import { useStore } from 'vuex'
import { reactive, computed, onUpdated, ref, nextTick } from 'vue'
import useBscroll from '@/hooks/useBscroll.js'

export default {
  components: { TopSearch, Swiper, SwiperSlide, MsiteNav, ShopList },
  setup() {
    let loginFlag = ref(false)
    loginFlag.value = localStorage.getItem('token') ? true : false
    let num = ref(0)
    let bs
    let height
    let arr_lis = ref([]) //导致有两次onUpdated
    let bscrollY = ref(0)
    let scroll_flag = ref(false)
    let top_flag = ref(false)
    const msiteshop = ref()
    const msitenav = ref()
    const topsearch = ref()
    const arr = reactive(['新品上线', '热销爆款', '官方推荐'])

    let currentIndex = computed(() => {
      return arr_lis.value.findIndex((item, index) => {
        return bscrollY.value >= item && bscrollY.value <= arr_lis.value[index + 1]
      })
    })
    //#regionend--------

    let flag = computed(() => {
      return arr_lis.value.some(item => {
        return bscrollY.value >= item - title && bscrollY.value <= item
      })
    })

    let top = computed(() => {
      return flag.value ? bscrollY.value - arr_lis.value[currentIndex.value + 1] + title : 0
    })

    let imgs = computed(() => useStore().state.swiperimg)
    let shoplists = computed(() => {
      let obj = useStore().state.shoplist
      let arr = []
      Object.keys(obj).forEach(item => {
        arr.push(obj[item])
      })
      return arr
    })

    useStore().dispatch('getHomeInfo', () => {
      nextTick(() => {
        bs = useBscroll()
        bs.on('scroll', option => {
          let y = Math.abs(option.y)
          bscrollY.value = y
          if (y >= msitenav.value.offsetTop - height) {
            top_flag.value = true
          } else {
            top_flag.value = false
          }
          if (y >= msiteshop.value.offsetTop - height) {
            scroll_flag.value = true
          } else {
            scroll_flag.value = false
          }
        })
        bs.on('scrollEnd', option => {
          bscrollY.value = Math.abs(option.y)
        })
      })
    })

    function bgheight(h) {
      height = h
    }
    let qw = 1
    let title
    onUpdated(() => {
      if (qw == 1) {
        title = document.querySelector('.shop-list-title').clientHeight
        arr_lis.value.push(msiteshop.value.offsetTop - height)
        let lis = document.querySelectorAll('.msiteshop1')
        lis.forEach((item, index) => {
          arr_lis.value.push(item.clientHeight + arr_lis.value[index])
        })
      }
      qw--
    })

    function show() {
      alert('no page')
    }
    return {
      loginFlag,
      num,
      imgs,
      arr,
      shoplists,
      show,
      msiteshop,
      msitenav,
      topsearch,
      top_flag,
      bgheight,
      scroll_flag,
      top,
      modules: [Autoplay, Pagination],
      currentIndex,
      flag
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/common/style/mixin.less';
.left {
  span {
    font-size: 20px;
    color: @bgc;
  }
}
.link {
  display: block;
  flex: 1;
  .search {
    padding-left: 60px;
    box-sizing: border-box;
    position: relative;
    margin: 0 15px 0 15px;
    height: 100%;
    line-height: 39px;
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px solid @bgc;
    color: rgba(143, 143, 143, 0.7);
    border-radius: 25px;
    span {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 15px;
      font-size: 25px;
      font-weight: 700;
      color: @bgc;
    }
    .line {
      position: absolute;
      left: 45px;
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: 30px;
      background-color: rgba(143, 143, 143, 0.5);
    }
  }
}
.right {
  span {
    font-size: 20px;
    color: @bgc;
  }
  .icon-touxiang {
    font-size: 25px;
  }
}
.title_dynamic {
  position: fixed;
  top: 58px;
  left: 0;
  right: 0;
  height: 35px;
  line-height: 35px;
  text-align: center;
  color: @bgc;
  font-size: 20px;
  font-weight: 500;
  background-color: rgb(244, 244, 244);
}
.wrapper {
  overflow: hidden;
  height: 100%;
  .msite-container {
    padding-bottom: 50px;
    background-color: #fff;
    .swiper {
      margin: 0;
      height: 170px;
      .swiper-slide {
        width: 100% !important;
        height: 100%;
        margin: 0 !important;
        img {
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
      }
    }
    .msite-shop {
      margin-top: 10px;
      .shop-list-title {
        height: 35px;
        line-height: 35px;
        text-align: center;
        color: @bgc;
        font-size: 20px;
        font-weight: 500;
        background-color: rgba(201, 198, 198, 0.2);
      }
      .shop-lists {
        display: flex;
        flex-wrap: wrap;
        .list {
          border-right: 1px solid rgba(201, 198, 198, 0.5);
          border-bottom: 1px solid rgba(201, 198, 198, 0.5);
          box-sizing: border-box;
        }
        .list:nth-child(even) {
          border-right: none;
        }
        .list:nth-last-child(1),
        .list:nth-last-child(2) {
          border-bottom: none;
        }
      }
    }
  }
}
</style>
