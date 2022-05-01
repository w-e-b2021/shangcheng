<template>
  <div class="count-container">
    <div class="reduce" :style="{ opacity: count == 1 ? 0.5 : 1 }" @click="updateCount(0)">
      <div class="row"></div>
    </div>
    <div class="center"><input type="number" v-model.number="count" @blur="updateCount(2)" /></div>
    <div class="add" @click="updateCount(1)">
      <div class="row"></div>
      <div class="column"></div>
    </div>
  </div>
</template>

<script>
import { modifyCart } from '@/service/cart.js'

import { reactive, toRefs } from 'vue'
import { Toast } from 'vant'
export default {
  props: ['cart'],
  emits: ['updateCount'],
  setup(props, context) {
    let _data = reactive({
      count: props.cart.goodsCount
    })

    function updateCount(type) {
      //0代表减，1代表加，2代表输入修改
      if (type == 0 && _data.count > 1) {
        modifyCart({ cartItemId: props.cart.cartItemId, goodsCount: --_data.count })
        context.emit('updateCount', _data.count, props.cart.cartItemId)
      } else if (type == 1 && _data.count < 5) {
        modifyCart({ cartItemId: props.cart.cartItemId, goodsCount: ++_data.count })
        context.emit('updateCount', _data.count, props.cart.cartItemId)
      } else if (_data.count == 5) {
        Toast.fail('商品数量达到最大！')
      } else if (type == 2) {
        modifyCart({ cartItemId: props.cart.cartItemId, goodsCount: _data.count })
        context.emit('updateCount', _data.count, props.cart.cartItemId)
      }
    }

    return {
      ...toRefs(_data),
      updateCount
    }
  }
}
</script>

<style lang="less" scoped>
.count-container {
  display: flex;
  box-sizing: border-box;
  width: 100px;
  height: 25px;
  .row {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 1px;
    width: 15px;
    background-color: black;
  }
  .column {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 15px;
    width: 1px;
    background-color: black;
  }
  .reduce {
    flex: 1;
    position: relative;
    border-radius: 5px;
    background-color: rgb(224, 225, 226);
  }
  .center {
    flex: 1;
    margin: 0 5px;
    border-radius: 5px;
    background-color: rgb(224, 225, 226);
    input {
      width: 100%;
      height: 100%;
      text-align: center;
      background-color: transparent;
    }
  }
  .add {
    flex: 1;
    position: relative;
    border-radius: 5px;
    background-color: rgb(224, 225, 226);
  }
  .add:active,
  .reduce:active {
    opacity: 0.5 !important;
  }
}
</style>
