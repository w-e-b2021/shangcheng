<template>
  <div class="goodsdetail" v-if="detail.goodsCoverImg">
    <TopSearch>
      <template #left v-if="isSearch">
        <div class="left" @click="push('/search')">
          <span class="iconfont icon-icon-test6"></span>
        </div>
      </template>
    </TopSearch>
    <div style="height: 1px"></div>
    <!-- <div class="show-top"> -->
    <swiper class="swiper" loop :modules="modules" :space-between="0">
      <swiper-slide class="swiper-slide" v-for="(img, index) in detail.goodsCarouselList" :key="index">
        <img :src="$filters(img)" alt="" />
      </swiper-slide>
      <swiper-slide>
        <img :src="$filters(detail.goodsCoverImg)" alt="" />
      </swiper-slide>
    </swiper>
    <!-- </div> -->
    <h3 class="describe">
      {{ detail.goodsName }}
    </h3>
    <div class="convey">
      <span>{{ detail.goodsIntro }}</span>
    </div>
    <div class="price">
      ¥ <span class="now-price">{{ detail.sellingPrice }}</span
      ><i class="origin-price">¥ {{ detail.originalPrice }}</i>
    </div>
    <ul class="clearfix service">
      <li>概述</li>
      <li>参数</li>
      <li>安装服务</li>
      <li>常见问题</li>
    </ul>
    <p v-html="detail.goodsDetailContent"></p>
    <van-action-bar>
      <van-action-bar-icon icon="shop-o" text="店铺" />
      <van-action-bar-icon icon="star" text="已收藏" color="#ff5000" />
      <van-action-bar-icon
        icon="cart-o"
        @click="goToCart('/cart')"
        :badge="amount ? amount : ''"
        text="购物车"
      />
      <van-action-bar-button type="warning" @click="add" text="加入购物车" color="#b6d0f0" />
      <van-action-bar-button type="danger" @click="goToCart('/cart')" text="立即购买" color="#61a6fa" />
    </van-action-bar>
    <!--:badge="!count ? '' : count" @click="goTo()"
    @click="handleAddCart"
     -->
  </div>
</template>

<script>
import { Autoplay, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { Toast } from 'vant'

import TopSearch from '@/components/TopSearch'

import { getGoodsDetail } from '@/service/good.js'
import { addCart, getCartList } from '@/service/cart'
import { useStore } from 'vuex'
import { computed, reactive, toRefs, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
export default {
  components: {
    TopSearch,
    Swiper,
    SwiperSlide
  },
  setup() {
    let Route = useRoute()
    let _data = reactive({
      detail: { goodsCarouselList: [] },
      amount: ''
    })
    let imgs = computed(() => useStore().state.swiperimg)

    getGoodsDetail(Route.query.id).then(
      ({ data, resultCode }) => {
        if (resultCode == 200) {
          _data.detail = data
        }
      },
      error => {
        alert(error.message)
      }
    )
    //上来初始化调用一次
    onMounted(async () => {
      let { data } = await getCartList()
      _data.amount = data.length
    })

    async function add() {
      try {
        let { resultCode, message } = await addCart({ goodsCount: 1, goodsId: Route.query.id })
        // if (resultCode == 200) Toast.success('添加成功！')
        // resultCode !== 200的情况，在axios响应拦截器中已经做了处理，到这一步的时候resultCode只可能是200
        Toast.success('添加成功！')
        //如果重复添加了，resultCode=500，响应拦截器会会返回一个失败的promise，就会调用失败的回调，就会抛出错误执行catch()
        //就不会再执行try中剩余的代码，addCartList()就不会再被调用
        let { data } = await getCartList()
        _data.amount = data.length
      } catch (err) {
        console.log(err)
      }
    }

    return {
      ...toRefs(_data),
      imgs,
      add,
      goToCart: useRouter().push,
      push: useRouter().push,
      isSearch: useRoute().query.isSearch,
      modules: [Pagination]
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/common/style/mixin.less';
.goodsdetail {
  padding: 0 10px;
  .left {
    flex: 1;
    span {
      font-size: 35px;
      color: @bgc;
    }
  }
  .swiper {
    margin-top: 59px;
    height: 350px;
    width: 100%;
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
  .describe {
    margin-bottom: 10px;
    font-weight: 400;
  }
  .convey {
    margin-bottom: 10px;
    span {
      margin-right: 5px;
      font-size: 12px;
      color: grey;
    }
  }
  .price {
    margin-bottom: 10px;
    font-size: 18px;
    color: red;
    .now-price {
      margin: 0 10px 10px 0;
      font-size: 25px;
    }
    .origin-price {
      text-decoration: line-through;
      color: grey;
    }
  }

  .service {
    width: 100%;
    height: 25px;
    margin-bottom: 10px;
    li {
      float: left;
      width: 25%;
      height: 100%;
      text-align: center;
      line-height: 25px;
      border-right: 1px solid grey;
      box-sizing: border-box;
    }
    li:last-child {
      border: none;
    }
  }
}
</style>
