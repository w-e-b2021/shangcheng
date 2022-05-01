<template>
  <router-link :to="`/goodsdetail?id=${goods.goodsId}&isSearch=${isSearch}`" class="link">
    <div class="goods">
      <div class="left">
        <img :src="$filters(goods.goodsCoverImg)" alt="" />
      </div>
      <div class="right">
        <div>
          <h3>{{ goods.goodsName }}</h3>
          <p class="clearfix">
            <span class="describe" v-for="(goodsIntro, index) in goods.goodsIntro" :key="index">{{
              goodsIntro
            }}</span>
          </p>
        </div>
        <div>
          <span class="yuan">¥</span><span class="price">{{ goods.sellingPrice }}</span>
          <span>10228+ 人付款</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'Goods',
  props: ['goods', 'isSearch']
}
</script>

<style lang="less" scoped>
@import '@/common/style/mixin.less';
.link {
  display: block;
  .goods {
    display: flex;
    margin-top: 10px;
    padding: 10px 10px 0 10px;
    .left {
      flex: 3.5;
      margin-right: 5px;
      img {
        width: 100%;
        height: 150px;
        border-radius: 10px;
      }
    }
    .right {
      flex: 6.5;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      border-bottom: 1px solid rgba(153, 153, 153, 0.2);
      h3 {
        margin-bottom: 5px;
        font-weight: 400;
        font-size: 15px;
      }
      .price {
        font-size: 20px;
        color: #e4393c;
      }
      .price + span {
        font-size: 12px;
        color: #999;
      }
      .yuan {
        color: #e4393c;
        font-size: 12px;
      }
      .describe {
        display: block;
        float: left;
        margin: 0 5px 2px 0;
        padding: 2px;
        font-size: 13px;
        color: #999;
        background-color: #f2f2f7;
        border-radius: 5px;
      }
    }
  }
}
</style>
