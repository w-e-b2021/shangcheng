<template>
  <div class="order-detail">
    <TopSearch>
      <template #center>
        <div class="center">订单详情</div>
      </template>
    </TopSearch>
    <div class="card">
      <div class="order-status">
        <div class="status-item">
          <label>订单状态：</label>
          <span>{{ detail.orderStatusString }}</span>
        </div>
        <div class="status-item">
          <label>订单编号：</label>
          <span>{{ detail.orderNo }}</span>
        </div>
        <div class="status-item">
          <label>下单时间：</label>
          <span>{{ detail.createTime }}</span>
        </div>
        <van-button
          v-if="detail.orderStatus == 1"
          style="margin-bottom: 10px"
          color="#1baeae"
          block
          @click="confirmOrder(detail.orderNo)"
          >确认收货</van-button
        >
        <van-button
          v-if="detail.orderStatus == 0"
          style="margin-bottom: 10px"
          color="#1baeae"
          block
          @click="show = true"
          >去支付</van-button
        >
        <van-button
          v-if="!(detail.orderStatus < 0 || detail.orderStatus == 4)"
          block
          @click="cancelOrder(detail.orderNo)"
          >取消订单</van-button
        >
      </div>
      <div class="price-info">
        <div class="price"><span>商品金额: </span> ¥{{ detail.totalPrice }}</div>
        <div class="convey"><span>配送方式: </span>顺丰速达</div>
      </div>

      <van-card
        v-for="item in detail.newBeeMallOrderItemVOS"
        :key="item.goodsId"
        class="van-card"
        :num="item.goodsCount"
        :price="item.sellingPrice"
        desc="描述信息"
        :title="item.goodsName"
        :thumb="$filters(item.goodsCoverImg)"
      />
    </div>
    <van-popup v-model:show="show" round position="bottom" :style="{ height: '30%' }">
      <br />
      <br />
      <van-button @click="zhifu(1)" class="pay-btn" color="#06b4fd" type="primary" block>
        支付宝支付
      </van-button>
      <br />
      <br />
      <van-button @click="zhifu(2)" class="pay-btn" color="#28c445" type="primary" block>微信支付</van-button>
    </van-popup>
  </div>
</template>

<script>
import TopSearch from '@/components/TopSearch.vue'

import { Toast, Dialog } from 'vant'
import { paySuccess, confirmOrderById, cancelOrderById, getOrderDetailById } from '@/service/order.js'
import { useRoute } from 'vue-router'
import { reactive, toRefs } from 'vue'
export default {
  components: { TopSearch },
  setup() {
    const route = useRoute()
    let _data = reactive({
      detail: JSON.parse(route.query.order),
      show: false
    })

    async function reRender() {
      let { data } = await getOrderDetailById(_data.detail.orderNo)
      _data.detail = data
    }

    function cancelOrder(orderNo) {
      Dialog.confirm({
        message: '是否确认取消订单'
      })
        .then(async () => {
          await cancelOrderById(orderNo)
          Toast('取消成功')
          reRender()
        })
        .catch(() => {})
    }

    async function zhifu(type) {
      await paySuccess({ orderNo: _data.detail.orderNo, payType: type })
      Toast('支付成功')
      reRender()
      _data.show = false
    }

    function confirmOrder(orderNo) {
      Dialog.confirm({
        message: '是否确认收货'
      })
        .then(async () => {
          await confirmOrderById(orderNo)
          Toast('收货成功')
          reRender()
        })
        .catch(() => {})
    }
    return {
      ...toRefs(_data),
      cancelOrder,
      confirmOrder,
      zhifu
    }
  }
}
</script>

<style lang="less" scoped>
.order-detail {
  padding-top: 59px;
  .card {
    padding: 0 15px;
    .order-status {
      border-radius: 5px;
      background-color: #f7f8fa;
      padding: 20px;
      font-size: 15px;
      .status-item {
        margin-bottom: 10px;
        label {
          color: #999;
        }
      }
    }
    .price-info {
      border-radius: 5px;
      margin: 20px 0;
      padding: 20px 20px 0 20px;
      overflow: hidden;
      background-color: #f7f8fa;
      .price,
      .convey {
        margin-bottom: 20px;
        span {
          color: #999;
        }
      }
    }
    .van-card {
      border-radius: 5px;
    }
  }
  .pay-btn {
    width: 90%;
    margin: 0 auto;
  }
}
</style>
