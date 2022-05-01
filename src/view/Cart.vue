<template>
  <div class="cart-container">
    <TopSearch>
      <template #left>
        <div class="top-left"></div>
      </template>
      <template #center>
        <div class="center">购物车</div>
        <div class="border"></div>
      </template>
      <template #right>
        <div class="top-right" v-if="deleteFlag" @click="fun">退出管理</div>
        <div class="top-right" style="text-align: right" v-else>
          <van-popover
            placement="bottom-end"
            v-model:show="showPopover"
            theme="dark"
            :actions="actions"
            @select="onSelect"
          >
            <template #reference>
              <span class="span1 iconfont icon-gengduo" @click="show = true"></span>
            </template>
          </van-popover>
        </div>
      </template>
    </TopSearch>
    <van-overlay class="overlay" :show="show" @click="show = false" />
    <img class="no-cartitem" src="@/assets/cart.webp" alt="" v-if="!carts.length" />
    <div class="wrapper" v-else>
      <div class="goods-container">
        <div
          class="clearfis"
          :class="'clearfis' + cart.goodsId"
          v-for="cart in carts"
          :key="cart.goodsId"
          @touchstart="showstart"
          @touchend="showend(cart.goodsId, $event)"
        >
          <div class="goods">
            <label :for="'qw' + cart.goodsId">
              <input type="checkbox" class="oldinput" :id="'qw' + cart.goodsId" v-model="cart.isSelect" />
              <span class="newcheck"></span>
            </label>
            <div class="left">
              <img :src="$filters(cart.goodsCoverImg)" alt="" />
            </div>
            <div class="right">
              <h3>{{ cart.goodsName }}</h3>
              <div>
                <span class="yuan">¥ </span><span class="price">{{ cart.sellingPrice }}</span>
              </div>
              <Count class="count" :cart="cart" @updateCount="updateCount"></Count>
            </div>
          </div>
          <div class="delete" @click="deleteItem(cart.cartItemId)">删除</div>
        </div>
      </div>
    </div>
    <van-submit-bar class="submition" button-text="删除" @submit="deleteItemAll" v-if="deleteFlag">
      <label for="qw">
        <input type="checkbox" class="oldinput" id="qw" :checked="allSelect" @change="changeAll" />
        <span class="newcheck"></span>
      </label>
      全选
      <div style="flex: 1"></div>
    </van-submit-bar>
    <!-- <van-submit-bar class="submition" :price="3050" button-text="提交订单" @submit="onSubmit"> -->
    <van-submit-bar class="submition" :price="price" button-text="提交订单" @submit="push" v-else>
      <!-- <van-checkbox v-model="checked"> -->
      <label for="qw">
        <input type="checkbox" class="oldinput" id="qw" :checked="allSelect" @change="changeAll" />
        <span class="newcheck"></span>
      </label>
      全选
      <!-- </van-checkbox> -->
      <!-- <template #tip> 你的收货地址不支持配送, <span @click="onClickLink">修改地址</span> </template> -->
    </van-submit-bar>
  </div>
</template>

<script>
import TopSearch from '@/components/TopSearch.vue'
import Count from '@/components/Count.vue'
import { Toast } from 'vant'

import { getCartList, deleteCartItem } from '@/service/cart.js'
import { getDefaultAddress } from '@/service/address.js'
import Bscroll from '@/hooks/useBscroll.js'

import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { reactive, toRefs, onMounted, computed, ref, nextTick } from 'vue'
export default {
  components: { TopSearch, Count },
  setup() {
    const reouter = useRouter()
    const store = useStore()
    let BS
    let _data = reactive({
      carts: [],
      selectArr: [],
      show: false,
      deleteFlag: false,
      text1: '编辑',
      showPopover: false
    })
    let actions = ref([
      {
        // text: toRef(_data, 'text1'),
        text: '编辑'
        // fun() {
        //   _data.deleteFlag = !_data.deleteFlag
        //   _data.text1 = _data.deleteFlag ? '退出编辑' : '编辑'
        // }
      },
      { text: '选项二' },
      { text: '选项三' }
    ])
    function updateCount(count, cartItemId) {
      _data.carts.some(item => {
        if (item.cartItemId == cartItemId) {
          item.goodsCount = count
          return true
        }
      })
    }

    onMounted(async () => {
      let { data } = await getCartList()
      _data.carts = data.map(item => {
        item.isSelect = false
        return item
      })
      nextTick(() => {
        BS = Bscroll()
      })
    })

    let allSelect = computed(() => {
      if (_data.carts.length) {
        return _data.carts.every(item => item.isSelect)
      } else {
        return false
      }
    })
    let price = computed(
      () =>
        _data.carts.reduce((total, item) => {
          if (item.isSelect) {
            return (total += item.goodsCount * item.sellingPrice)
          } else {
            return (total += 0)
          }
        }, 0) * 100
    )

    function changeAll(e) {
      _data.carts.forEach(item => {
        item.isSelect = e.target.checked
      })
    }
    let startX
    function showstart(e) {
      startX = e.touches[0].pageX
    }
    function showend(id, e) {
      let tar = document.querySelector(`.clearfis${id}`)
      if (startX - e.changedTouches[0].pageX > 40) {
        tar.style.transform = `translateX(-15%)`
      } else {
        tar.style.transform = `translateX(0)`
      }
    }
    function onSelect(a) {
      fun()
    }
    function fun() {
      _data.deleteFlag = !_data.deleteFlag
      _data.show = false
    }
    //删除
    async function deleteItem(id) {
      await deleteCartItem(id)
      Toast.success('删除成功')
      let { data } = await getCartList()
      //保证重新获取后原来的勾选不变
      _data.carts = data.map(dataItem => {
        let a = _data.carts.some(cartsItem => {
          if (cartsItem.cartItemId == dataItem.cartItemId) {
            dataItem = cartsItem
            return true
          }
        })
        if (!a) {
          dataItem.isSelect = false
        }
        return dataItem
      })
    }
    //删除勾选项
    function deleteItemAll() {
      _data.carts.forEach((item, index) => {
        if (item.isSelect) deleteItem(item.cartItemId)
        if (index == _data.carts.length - 1) Toast('选择你要删除的商品')
      })
    }

    async function push() {
      let selectCarts = []
      _data.carts.forEach(item => {
        if (item.isSelect) {
          selectCarts.push(item)
        }
      })
      if (!selectCarts.length) {
        Toast('请选择要购买的商品')
        return
      }
      store.dispatch('getSelectCarts', selectCarts)
      let { data } = await getDefaultAddress()
      if (data) {
        reouter.push({
          path: `/createorder`,
          query: data
        })
      } else {
        reouter.push('/address')
      }
    }
    return {
      actions,
      ...toRefs(_data),
      allSelect,
      price,
      changeAll,
      updateCount,
      showstart,
      showend,
      onSelect,
      deleteItem,
      deleteItemAll,
      push,
      fun
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/common/style/mixin.less';
.cart-container {
  padding-top: 59px;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  .no-cartitem {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
  }
  .top-left,
  .top-right {
    flex: 1.5;
    font-size: 12px;
    color: @bgc;
  }
  .span1 {
    font-size: 35px;
  }
  .center {
    flex: 7;
    text-align: center;
  }
  .overlay {
    background-color: transparent;
    z-index: 2;
  }
  .border {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background-color: @bgc;
  }
  .newcheck {
    display: inline-block;
    margin-right: 5px;
    width: 22px;
    height: 22px;
    border: 1px solid @bgc;
    border-radius: 3px;
    color: #fff;
    transition: all 0.2s;
  }
  .oldinput:checked + span {
    position: relative;
    background-color: @bgc;
    border: 1px solid transparent;
  }
  .oldinput:checked + span::after {
    content: '\2714';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
  }
  .oldinput {
    display: none;
  }
  .wrapper {
    flex: 1;
    padding: 0 10px;
    overflow: hidden;

    .goods-container {
      overflow: hidden;
      .clearfis {
        width: 120%;
        margin-top: 10px;
        transition: all 0.5s;
        .delete {
          float: left;
          width: 15%;
          height: 80px;
          line-height: 80px;
          background-color: red;
          color: #fff;
          text-align: center;
        }
        .goods {
          float: left;
          display: flex;
          align-items: center;
          padding: 0 10px 0 10px;
          width: 80%;
          height: 80px;
          background-color: #f7f8fa;
          border-radius: 5px;
          .left {
            flex: 3.5;
            height: 100%;
            margin-right: 5px;
            text-align: center;
            img {
              width: 75%;
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
              font-weight: 400;
              font-size: 15px;
            }
            .price {
              font-size: 20px;
              color: #fc5430;
            }
            .yuan {
              color: #fc5430;
              font-size: 12px;
            }
            .count {
              position: absolute;
              right: 10px;
              bottom: 10px;
            }
          }
        }
      }
    }
  }
  .submition {
    bottom: 50px;
    border-top: 1px solid @bgc;
    z-index: 1;
  }
}
</style>
