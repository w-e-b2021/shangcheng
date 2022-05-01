<template>
  <router-link class="shop-list" :to="`/goodsdetail?id=${shop.goodsId}`">
    <img :src="$filters(shop.goodsCoverImg)" alt="" />
    <p class="describe">
      {{ shop.goodsName }}
    </p>
    <p class="describe">
      {{ shop.goodsIntro }}
    </p>
    <p class="price">¥ {{ shop.sellingPrice }}</p>
  </router-link>
</template>

<script>
export default {
  props: ['shop'],
  setup(props, context) {
    // console.log(props)
  }
}
</script>

<style lang="less" scoped>
@import '@/common/style/mixin.less';
.shop-list {
  display: block;
  width: 50%;
  height: 200px;
  text-align: center;
  img {
    width: 70%;
    height: 65%;
  }
  .describe {
    padding: 0 10px;
    box-sizing: border-box;
    width: 100%;
    text-align: left;
    font-size: 13px;
    .wordellipsis(1);
  }
  .price {
    margin-top: 5px;
    color: #e94242;
  }
}
</style>
