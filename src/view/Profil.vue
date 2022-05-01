<template>
  <div class="profil-container">
    <TopSearch>
      <template #left>
        <div class="top-left"></div>
      </template>
      <template #center>
        <div class="top-center">我的{{}}</div>
      </template>
    </TopSearch>
    <van-skeleton title :avatar="true" :row="3" :loading="loading">
      <div class="user-info">
        <div class="info">
          <img src="https://s.yezgea02.com/1604040746310/aaaddd.png" />
          <div class="user-desc">
            <span>昵称：{{ userInfo.nickName }}</span>
            <span>登录名：{{ userInfo.loginName }}</span>
            <span class="name">个性签名：{{ userInfo.introduceSign }}</span>
          </div>
        </div>
      </div>
    </van-skeleton>
    <ul class="user-list">
      <li class="van-hairline--bottom" @click="goTo('/order')">
        <span>我的订单</span>
        <van-icon name="arrow" />
      </li>
      <li class="van-hairline--bottom" @click="goTo('/accountsetting')">
        <span>账号管理</span>
        <van-icon name="arrow" />
      </li>
      <li class="van-hairline--bottom" @click="goTo('/address?from=user')">
        <span>地址管理</span>
        <van-icon name="arrow" />
      </li>
      <li @click="goTo('/about')">
        <span>关于我们</span>
        <van-icon name="arrow" />
      </li>
    </ul>
  </div>
</template>

<script>
import TopSearch from '@/components/TopSearch.vue'

import { getUserInfo } from '@/service/user.js'
import { useRouter } from 'vue-router'
import { reactive, onMounted, toRefs } from 'vue'
export default {
  components: { TopSearch },
  setup() {
    const router = useRouter()
    let _data = reactive({
      userInfo: {},
      loading: true
    })

    onMounted(async () => {
      let { data } = await getUserInfo()
      _data.loading = false
      _data.userInfo = data
    })

    function goTo(path) {
      router.push(path)
    }
    return {
      ...toRefs(_data),
      goTo
    }
  }
}
</script>

<style lang="less" scoped>
.profil-container {
  padding-top: 59px;
  .top-left {
    flex: 1.5;
  }
  .top-center {
    flex: 7;
    text-align: center;
  }
  .user-info {
    width: 94%;
    margin: 10px;
    height: 115px;
    background: linear-gradient(90deg, #51c7c7, #51c7c7);
    box-shadow: 0 2px 5px #269090;
    border-radius: 6px;
    .info {
      position: relative;
      display: flex;
      width: 100%;
      height: 100%;
      padding: 25px 20px;
      box-sizing: border-box;
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin-top: 4px;
      }
      .user-desc {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        line-height: 20px;
        font-size: 14px;
        color: #fff;
        span {
          color: #fff;
          font-size: 14px;
          padding: 2px 0;
        }
      }
      .account-setting {
        position: absolute;
        top: 10px;
        right: 20px;
        font-size: 13px;
        color: #fff;
        .van-icon-setting-o {
          font-size: 16px;
          vertical-align: -3px;
          margin-right: 4px;
        }
      }
    }
  }
  .user-list {
    padding: 0 20px;
    margin-top: 20px;
    li {
      height: 40px;
      line-height: 40px;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      .van-icon-arrow {
        margin-top: 13px;
      }
    }
  }
}
</style>
