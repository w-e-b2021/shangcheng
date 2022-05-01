<template>
  <div class="footer-nav">
    <routerLink to="/msite" replace class="lh" active-class="chang">
      <span class="iconfont icon-shouye1"></span>
      <small>主页</small>
    </routerLink>
    <routerLink to="/sort" replace class="lh" active-class="chang">
      <span class="iconfont icon-fenlei"></span>
      <small>分类</small>
    </routerLink>
    <routerLink to="/cart" replace class="lh" active-class="chang">
      <span class="iconfont icon-gouwuche1"></span>
      <small>购物车</small>
    </routerLink>
    <routerLink to="/profil" replace class="lh" active-class="chang">
      <span class="iconfont icon-zhanghao"></span>
      <small>我的</small>
    </routerLink>
  </div>
</template>

<script>
export default {
  setup(props, contex) {
    function show() {
      alert(1)
    }
    return {
      show
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/common/style/mixin.less';
.footer-nav {
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 3;
  height: 50px;
  border-top: 1px solid @bgc;
  background-color: #fff;
  .lh {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 50px;
    .color(143, 143, 143, 0.7);
    span {
      font-size: 22px;
    }
  }
  .chang {
    color: @bgc;
  }
}
</style>
