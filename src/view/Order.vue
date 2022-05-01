<template>
  <div class="order-container">
    <TopSearch class="top-search">
      <template #center>
        <div class="top-center">我的订单</div>
      </template>
    </TopSearch>
    <van-tabs class="tab" v-model="active" sticky @click-tab="onClickTab">
      <van-tab title="全部" name=""></van-tab>
      <van-tab title="待付款" name="0"></van-tab>
      <van-tab title="待确认" name="1"></van-tab>
      <van-tab title="待发货" name="2"></van-tab>
      <van-tab title="已发货" name="3"></van-tab>
      <van-tab title="交易完成" name="4"></van-tab>
    </van-tabs>
    <div class="wrapper">
      <van-pull-refresh v-model="refreshing" head-height="150" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          offset="50"
          @load="onLoad"
        >
          <div class="card" v-for="list in lists" :key="list.orderId">
            <div class="card-info clearfis">
              <div class="left">订单时间: {{ list.createTime }}</div>
              <div class="right">{{ list.orderStatusString }}</div>
            </div>
            <van-card
              v-for="item in list.newBeeMallOrderItemVOS"
              :key="item.goodsId"
              class="van-card"
              :num="item.goodsCount"
              :price="item.sellingPrice"
              desc="描述信息"
              :title="item.goodsName"
              :thumb="$filters(item.goodsCoverImg)"
              @click="push({ path: '/orderdetail', query: { order: JSON.stringify(list) } })"
            />
          </div>
        </van-list>
      </van-pull-refresh>
      <!-- 这里可以放一些其它的 DOM，但不会影响滚动 -->
    </div>
  </div>
</template>

<script>
import TopSearch from '@/components/TopSearch.vue'

import { getOrderListByStatus } from '@/service/order.js'
import { useRouter } from 'vue-router'
import { reactive, toRefs, nextTick, onMounted } from 'vue'
import router from '@/router'
export default {
  components: { TopSearch },
  setup() {
    const router = useRouter()
    let _data = reactive({
      active: '', //绑定当前激活标签对应的索引值,双向绑定
      lists: [],
      refreshing: false,
      loading: false,
      finished: false,
      number: 1
    })

    function onClickTab(context) {
      _data.active = context.name
      onRefresh()
    }
    async function init() {
      // alert(_data.number)
      let { data } = await getOrderListByStatus({ pageNumber: _data.number, status: _data.active })
      if (data.list.length) {
        _data.number++
        if (_data.loading) {
          _data.lists = [..._data.lists, ...data.list]
          nextTick(() => {
            _data.loading = false
          })
        } else {
          _data.lists = data.list
          nextTick(() => {
            _data.refreshing = false
            _data.finished = false
          })
        }
      } else {
        if (_data.refreshing) {
          _data.lists = data.list //status=0,1,2,3,4为空的情况
        }
        _data.finished = true
        _data.loading = false
        _data.refreshing = false
      }
    }
    function onRefresh() {
      // alert('refresh')
      _data.refreshing = true
      _data.number = 1
      init()
    }
    function onLoad() {
      // alert('load')
      _data.loading = true
      init()
    }
    return {
      ...toRefs(_data),
      onClickTab,
      onRefresh,
      onLoad,
      push: router.push
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/common/style/mixin.less';
.order-container {
  display: flex;
  flex-direction: column;
  padding-top: 119px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  .top-search {
    /deep/ .bg {
      background-color: #fff;
    }
  }
  .top-center {
    flex: 7;
    text-align: center;
  }
  .tab {
    position: fixed;
    top: 58px;
    height: 60px;
    background-color: #fff;
    z-index: 100;
  }
  .wrapper {
    flex: 1;
    // overflow: hidden;
    .card {
      padding: 0 15px;
      .card-info {
        color: #999;
        .left {
          float: left;
        }
        .right {
          float: right;
        }
      }
      .van-card {
        border-radius: 5px;
      }
    }
  }
}
</style>
