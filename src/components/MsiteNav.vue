<template>
  <div class="nav-container">
    <ul>
      <li v-for="categoryList in categoryLists" :key="categoryList.categoryId">
        <img :src="$filters(categoryList.imgUrl)" alt="" />
        <p>{{ categoryList.name }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  setup() {
    let categoryLists = computed(() => useStore().state.categoryList)
    return {
      categoryLists
    }
  }
}
</script>

<style lang="less" scpoed>
.nav-container {
  width: 100%;
  ul {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    li {
      margin-top: 12px;
      width: 20%;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;
      img {
        width: 50%;
      }
    }
  }
}
</style>
