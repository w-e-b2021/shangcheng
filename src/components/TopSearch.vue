<template>
  <div class="top-container">
    <div ref="bg" class="bg" :class="{ bgc: top_flag }"></div>
    <!-- 这里不能用v-show，因为上来需要获取这element的高度 -->
    <h3 style="height: 2px"></h3>
    <div class="outer">
      <slot name="left">
        <div class="left" @click="back">
          <span class="iconfont icon-icon-test6"></span>
        </div>
      </slot>
      <slot name="center">
        <div class="center">商品详情</div>
      </slot>
      <slot name="right">
        <div class="right"><span class="iconfont icon-gengduo"></span></div>
      </slot>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  emits: ['bgheight'],
  props: ['top_flag', 'path'],
  setup(props, context) {
    let Router = useRouter()
    let bg = ref()
    onMounted(() => {
      context.emit('bgheight', bg.value.clientHeight)
    })

    function back() {
      props.path ? Router.replace(props.path) : Router.back()
    }
    return {
      bg,
      back
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/common/style/mixin.less';
.bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 58px;
  background-color: none;
  transition: all 0.3s;
  z-index: 1;
}
.bgc {
  background-color: rgb(243, 240, 239);
}
.outer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px 0 15px;
  position: fixed;
  z-index: 2;
  top: 15px;
  left: 0;
  right: 0;
  height: 39px;
  .left,
  .right {
    flex: 1.5;
    span {
      font-size: 35px;
      color: @bgc;
    }
  }
  .right {
    text-align: right;
  }
  .center {
    flex: 7;
    text-align: center;
  }
}
</style>
