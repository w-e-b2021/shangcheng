<template>
  <div class="search-container">
    <div class="bg"></div>
    <div class="outer">
      <div class="left" @click="push('/msite')">
        <span class="iconfont icon-icon-test6"></span>
      </div>
      <div class="search">
        <input placeholder="咪咪熊" v-model="inputing" />
        <div class="right">
          <span v-show="inputing.length" class="iconfont icon-chahao" @click="deleteText"></span>
          <div class="search-btn" @click="clickSearch">搜索</div>
        </div>
      </div>
    </div>
    <van-pull-refresh v-model="refreshing" head-height="100" success-text="刷新成功" @refresh="onRefresh">
      <!-- 下拉提示，通过 scale 实现一个缩放效果 -->
      <template #pulling>
        <img class="doge" src="@/assets/jiazai.gif" />
      </template>
      <!-- 加载提示 -->
      <template #loading>
        <img class="doge" src="@/assets/jiazai.gif" />
      </template>
      <!-- 释放提示 -->
      <template #loosing>
        <img class="doge" src="@/assets/jiazai.gif" />
      </template>
      <van-list
        class="van-lists"
        :loading="loading"
        :finished="finished"
        :finished-text="list.length ? '没有更多了' : '搜索想要的商品'"
        @load="onLoad"
      >
        <template v-if="list.length">
          <ul class="leibie clearfix">
            <li
              v-for="(item, index) in clarifyList"
              :class="{ 'react-color': item.flag }"
              :key="index"
              @click="changeList(item.code)"
            >
              {{ item.name }}
            </li>
          </ul>
          <Goods v-for="item in list" :key="item.goodsId" :goods="item" :isSearch="true"></Goods>
          <!-- <div class="goods" v-for="item in list" :key="item.goodsId">
            <div class="left">
              <img :src="$filters(item.goodsCoverImg)" alt="" />
            </div>
            <div class="right">
              <div>
                <h3>{{ item.goodsName }}</h3>
                <p class="clearfix">
                  <span class="describe" v-for="(goodsIntro, index) in item.goodsIntro" :key="index">{{
                    goodsIntro
                  }}</span>
                </p>
              </div>
              <div>
                <span class="yuan">¥</span><span class="price">{{ item.sellingPrice }}</span>
                <span>10228+ 人付款</span>
              </div>
            </div>
          </div> -->
        </template>
        <img v-else class="empty" src="https://s.yezgea02.com/1604041313083/kesrtd.png" alt="" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import router from '@/router'
import { getSearchList } from '@/service/good.js'

import Goods from '@/components/Goods.vue'

import { useRoute, useRouter } from 'vue-router'
import { nextTick, reactive, toRefs, onActivated } from 'vue'
export default {
  name: 'Search',
  components: { Goods },
  setup() {
    let _data = reactive({
      flag: true,
      loading: false,
      refreshing: false,
      finished: false,
      clarifyList: [
        { name: '全部', code: '', flag: true },
        { name: '新品', code: 'new', flag: false },
        { name: '折扣', code: 'price', flag: false }
      ],
      code: '',
      list: [],
      inputing: '',
      params: { pageNumber: 1, keyword: '', orderBy: '' }
    })

    function deleteText() {
      _data.inputing = ''
    }
    //点击分类搜索
    function changeList(value) {
      _data.params.pageNumber = 1
      _data.code = value
      _data.params.orderBy = value
      //点击变色
      _data.clarifyList.forEach(item => {
        value == item.code ? (item.flag = true) : (item.flag = false)
      })
      //防抖
      if (!_data.refreshing) onRefresh()
    }
    //点击搜索
    function clickSearch() {
      _data.params.keyword = _data.inputing
      //防抖
      if (!_data.refreshing) onRefresh()
    }
    //请求
    async function init() {
      alert(_data.params.pageNumber)
      if (!_data.params.keyword) {
        _data.list = []
        _data.finished = true
        _data.refreshing = false
        _data.loading = false
        return
      }
      let {
        resultCode,
        data,
        data: { totalPage }
      } = await getSearchList(_data.params)
      if (resultCode == 200) {
        if (data.list.length) {
          let list = data.list.map(item => {
            item.goodsIntro = item.goodsIntro.split(' ')
            return item
          })
          if (_data.refreshing) {
            if (_data.params.pageNumber >= totalPage) _data.params.pageNumber = 0
            _data.list = list
            _data.params.pageNumber++
          } else {
            _data.list = [..._data.list, ...list]
            _data.params.pageNumber++
          }
          nextTick(() => {
            //这里发请求之前需要重置finished,并且最好在这个时候重置finished
            _data.finished = false
            _data.loading = false
            _data.refreshing = false
          })
        } else {
          _data.finished = true
          _data.params.pageNumber = 1
          // _data.refreshing = false
          // _data.loading = false
        }
      }
    }
    //下拉搜索
    function onLoad() {
      alert('onLoad')
      _data.loading = true
      init()
    }
    //上拉搜索
    function onRefresh() {
      _data.refreshing = true
      init()
    }
    onActivated(() => {
      if (useRoute().query.refresh) {
        // _data.params.keyword = ''
        // onRefresh()
        _data.inputing = ''
        clickSearch()
      }
    })
    return {
      ...toRefs(_data),
      deleteText,
      push: router.push,
      onLoad,
      changeList,
      clickSearch,
      onRefresh
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/common/style/mixin.less';
.search-container {
  overflow: hidden;
}
.doge {
  width: 20%;
  height: 100%;
  transform: scale(2);
  margin-top: 8px;
  border-radius: 4px;
}
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
  .search {
    flex: 1;
    position: relative;
    margin: 0 15px 0 15px;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px solid @bgc;
    border-radius: 25px;
    input {
      float: left;
      padding-left: 20px;
      box-sizing: border-box;
      height: 100%;
      width: 65%;
      background-color: transparent;
    }
    .right {
      position: relative;
      float: right;
      display: flex;
      align-items: center;
      height: 100%;
      width: 35%;
      span {
        font-size: 25px;
        color: rgb(204, 202, 202);
      }
      .search-btn {
        position: absolute;
        right: 0;
        margin-right: 2px;
        width: 55px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        font-size: 13px;
        border-radius: 16px;
        color: #fff;
        background-image: linear-gradient(to right, #b6d0f0, #61a6fa);
      }
    }
  }
  .right {
    font-size: 20px;
    color: @bgc;
  }
}
.leibie {
  margin: auto;
  margin-top: 65px;
  width: 90%;
  padding: 7px 15px;
  box-sizing: border-box;
  border: 1px solid #61a6fa;
  border-radius: 5px;
  li {
    float: left;
    padding: 5px 8px;
    margin: 0 5px;
    border-radius: 11px;
    color: #61a6fa;
    background-color: #f3f0ef;
  }
}
.empty {
  display: block;
  margin: 0 auto 20px;
  width: 300px;
  height: 300px;
}
.van-lists {
  margin-top: 65px;
}
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
</style>
