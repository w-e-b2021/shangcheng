<template>
  <div class="about-container">
    <TopSearch>
      <template #center>
        <div class="top-center">关于我们</div>
      </template>
    </TopSearch>
    <img src="https://s.yezgea02.com/1604046067055/WechatIMG30231.jpeg" alt="" />
    <h3>简介</h3>
    <p>
      这是基于开源项目蜂窝商城开发的一套电商系统，
      前台商城系统包含首页门户、商品分类、新品上线、首页轮播、商品推荐、商品搜索、
      商品展示、购物车、订单结算、订单流程、个人订单管理、会员中心、帮助中心等模块。
    </p>
  </div>
</template>

<script>
import TopSearch from '@/components/TopSearch.vue'
export default {
  components: { TopSearch }
}
</script>

<style lang="less" scoped>
.about-container {
  padding-top: 59px;
  img {
    width: 100%;
  }
  .top-center {
    flex: 7;
    text-align: center;
  }
}
</style>
