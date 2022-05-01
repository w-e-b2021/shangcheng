<template>
  <div class="container">
    <TopSearch :path="'/cart'">
      <template #center>
        <div class="center">生成订单</div>
      </template>
    </TopSearch>
    <div class="address-wrap" @click="push('/address')">
      <div class="name">
        <span>{{ address.userName }}</span>
        <span>{{ address.userPhone }}</span>
      </div>
      <div class="address ellipsis" v-if="address.address">
        {{ address.address }}
      </div>
      <div class="address ellipsis" v-else>
        {{ address.provinceName + address.cityName + address.regionName + address.detailAddress }}
      </div>

      <span class="arrow iconfont icon-icon-test8"></span>
    </div>
    <div class="goods" v-for="item in carts" :key="item.cartItemId">
      <div class="left">
        <img :src="$filters(item.goodsCoverImg)" alt="" />
      </div>
      <div class="right">
        <h3>
          {{ item.goodsName }} <span class="count">×{{ item.goodsCount }}</span>
        </h3>
        <div>
          <span class="yuan">¥ </span><span class="price">{{ item.sellingPrice }}</span>
        </div>
      </div>
    </div>
    <div class="pay-wrap">
      <div class="price">
        <span>商品金额</span>
        <span>¥1223</span>
      </div>
      <van-button @click="handleCreateOrder" class="pay-btn" color="#61a6fa" type="primary" block
        >立即付款</van-button
      >
    </div>
    <van-popup v-model:show="show" round position="bottom" @closed="onClosed" :style="{ height: '30%' }">
      <br />
      <br />
      <van-button @click="zhifubao" color="#06b4fd" type="primary" block> 支付宝支付 </van-button>
      <br />
      <br />
      <van-button @click="weixin" color="#28c445" type="primary" block>微信支付</van-button>
    </van-popup>
    <!-- <van-popup class="weixin" v-model:show="show1">
      <img src="@/assets/weixin.jpg" alt="" />
    </van-popup>
    <van-popup class="zhifubao" v-model:show="show2">
      <img src="@/assets/zhifubao.jpg" alt="" />
    </van-popup> -->
  </div>
</template>

<script>
import TopSearch from '@/components/TopSearch.vue'

import { useStore } from 'vuex'
import { getCartList, getCreateOrderList } from '@/service/cart.js'
import { createOrder, paySuccess } from '@/service/order.js'
import { Toast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import { reactive, onMounted, toRefs } from 'vue'
export default {
  components: { TopSearch },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    let _data = reactive({
      carts: [],
      show: false,
      cartItemIds: [],
      orderCode: ''
    })
    onMounted(async () => {
      // let { data } = await getCreateOrderList(route.params.cartItemIds)
      _data.carts = store.state.selectCarts
      _data.carts.forEach(item => _data.cartItemIds.push(item.cartItemId))
    })

    async function handleCreateOrder() {
      let { data } = await createOrder({
        addressId: route.query.addressId,
        cartItemIds: _data.cartItemIds
      })
      _data.orderCode = data
      _data.show = true
    }

    async function zhifubao() {
      await paySuccess({ orderNo: _data.orderCode, payType: 1 })
      Toast.success('支付成功')
      router.replace('/order')
    }

    async function weixin() {
      await paySuccess({ orderNo: _data.orderCode, payType: 2 })
      Toast.success('支付成功')
      router.replace('/order')
    }

    function onClosed() {
      //动画结束时被触发
      router.replace('/order')
    }
    return {
      ...toRefs(_data),
      push: router.push,
      address: route.query,
      handleCreateOrder,
      zhifubao,
      weixin,
      onClosed
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/common/style/mixin.less';
.container {
  background-color: #f9f9f9;
  height: 100%;
  .center {
    text-align: center;
    flex: 7;
  }
  .address-wrap {
    margin-top: 59px;
    margin-bottom: 20px;
    background-color: #fff;
    position: relative;
    font-size: 14px;
    padding: 15px;
    color: #222333;
    .name > span {
      margin-right: 5px;
    }
    .name,
    .address {
      margin: 10px 0;
    }
    .arrow {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 28px;
    }
    &::before {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 2px;
      background: -webkit-repeating-linear-gradient(
        135deg,
        #ff6c6c 0,
        #ff6c6c 20%,
        transparent 0,
        transparent 25%,
        #1989fa 0,
        #1989fa 45%,
        transparent 0,
        transparent 50%
      );
      background: repeating-linear-gradient(
        -45deg,
        #ff6c6c 0,
        #ff6c6c 20%,
        transparent 0,
        transparent 25%,
        #1989fa 0,
        #1989fa 45%,
        transparent 0,
        transparent 50%
      );
      background-size: 80px;
      content: '';
    }
  }
  .goods {
    float: left;
    display: flex;
    align-items: center;
    padding: 10px 10px 0 10px;
    margin-top: 10px;
    width: 100%;
    height: 90px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 6px -3px #333;
    box-sizing: border-box;
    .left {
      flex: 3.5;
      height: 100%;
      margin-right: 5px;
      text-align: center;
      img {
        width: 70%;
        height: 100%;
        border-radius: 10px;
      }
    }
    .right {
      flex: 6.5;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      position: relative;
      border-bottom: 1px solid rgba(153, 153, 153, 0.2);
      h3 {
        margin-bottom: 5px;
        margin-right: 60px;
        font-weight: 400;
        font-size: 12px;
        position: relative;
        .count {
          position: absolute;
          top: 50%;
          right: -20px;
        }
      }
      .price {
        font-size: 20px;
        color: #fc5430;
      }
      .yuan {
        color: #fc5430;
        font-size: 12px;
      }
    }
  }
  .pay-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    padding: 10px 0;
    padding-bottom: 50px;
    border-top: 1px solid #e9e9e9;
    > div {
      display: flex;
      justify-content: space-between;
      padding: 0 5%;
      margin: 10px 0;
      font-size: 14px;
      span:nth-child(2) {
        color: red;
        font-size: 18px;
      }
    }
    .pay-btn {
      position: fixed;
      bottom: 7px;
      right: 0;
      left: 0;
      width: 90%;
      margin: 0 auto;
    }
  }
  .zhifubao,
  .weixin {
    img {
      display: block;
      width: 200px;
      height: 200px;
    }
  }
}
</style>
