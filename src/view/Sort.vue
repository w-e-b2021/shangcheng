<template>
  <div class="container">
    <div class="bg"></div>
    <div class="outer">
      <div class="left" @click="push('/msite')">
        <span class="iconfont icon-icon-test6"></span>
      </div>
      <router-link to="/search?refresh=true" class="link">
        <div class="search">
          <span class="iconfont icon-icon-test2"></span>
          <div class="line"></div>
          山河无恙，人间皆安
        </div>
      </router-link>
    </div>
    <div class="content">
      <div class="wrapper1 left">
        <div>
          <ul>
            <li
              :class="{ blank: category.flag }"
              v-for="category in categorys"
              :key="category.categoryId"
              @click="changCategory(category, categorys)"
            >
              {{ category.categoryName }}
            </li>
          </ul>
        </div>
      </div>
      <div class="wrapper right">
        <div>
          <div class="every" v-for="list in lists" :key="list.categoryId">
            <h3>{{ list.categoryName }}</h3>
            <ul class="clearfis">
              <li v-for="item in list.thirdLevelCategoryVOS" :key="item.categoryId">
                {{ item.categoryName }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopSearch from '@/components/TopSearch.vue'
import BSCROLL from '@better-scroll/core'

import Bscroll from '@/hooks/useBscroll.js'
import { getSort } from '@/service/sort'
import { reactive, onMounted, toRefs, nextTick } from 'vue'
export default {
  components: { TopSearch },
  setup() {
    let BS
    let _data = reactive({
      categorys: [],
      lists: []
    })
    onMounted(async () => {
      let { data } = await getSort()
      _data.categorys = data
      changCategory(_data.categorys[0], _data.categorys)
      nextTick(() => {
        BS = Bscroll()
        new BSCROLL('.wrapper1', {
          click: true,
          probeType: 2,
          disableTouch: false
        })
      })
    })

    function changCategory(lists, categorys) {
      _data.lists = lists.secondLevelCategoryVOS
      nextTick(() => {
        BS.refresh()
      })
      categorys.forEach(item => {
        item.flag = false
      })
      lists.flag = true
    }

    return {
      ...toRefs(_data),
      changCategory
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/common/style/mixin.less';
.container {
  height: 100%;
  display: flex;
  padding-top: 59px;
  .bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 58px;
    background-color: rgb(243, 240, 239);
    transition: all 0.3s;
    z-index: 1;
  }
  .blank {
    background-color: #fff;
  }
  .outer {
    display: flex;
    align-items: center;
    padding: 0 15px 0 15px;
    position: fixed;
    z-index: 2;
    top: 15px;
    left: 0;
    right: 0;
    height: 36px;
    .left {
      span {
        font-size: 35px;
        color: @bgc;
      }
    }
    .link {
      display: block;
      flex: 1;
      .search {
        padding-left: 60px;
        box-sizing: border-box;
        position: relative;
        margin: 0 15px 0 15px;
        height: 100%;
        line-height: 39px;
        background-color: rgba(255, 255, 255, 0.5);
        border: 1px solid @bgc;
        color: rgba(143, 143, 143, 0.7);
        border-radius: 25px;
        span {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 15px;
          font-size: 25px;
          font-weight: 700;
          color: @bgc;
        }
        .line {
          position: absolute;
          left: 45px;
          top: 50%;
          transform: translateY(-50%);
          width: 1px;
          height: 30px;
          background-color: rgba(143, 143, 143, 0.5);
        }
      }
    }
  }
  .content {
    flex: 1;
    display: flex;
    .left {
      flex: 3;
      display: flex;
      flex-direction: column;
      text-align: center;
      background-color: #f8f8f8;
      li {
        padding: 20px 0;
      }
    }
    .right {
      flex: 7;
      .every {
        width: 100%;
        ul {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          li {
            flex: 25%;
            margin: 10px;
            height: 50px;
            text-align: center;
            line-height: 50px;
            background-color: #f8f8f8;
            border-radius: 5px;
          }
        }
      }
    }
  }
}
</style>
