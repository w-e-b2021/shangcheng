<template>
  <div class="login-container">
    <TopSearch :path="'/'">
      <template #center>
        <div class="top-center">用户登录</div>
      </template>
      <template #right>
        <div class="top-right"></div>
      </template>
    </TopSearch>
    <div class="log">
      <img src="https://s.yezgea02.com/1604045825972/newbee-mall-vue3-app-logo.png" alt="" />
    </div>
    <van-form @submit="onSubmit" v-if="isLogin">
      <van-cell-group inset>
        <van-field
          v-model="username"
          name="loginName"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          v-model="confirmCode"
          name="confirmCode"
          label="验证码"
          placeholder="验证码"
          :rules="[{ required: true, message: '请填写验证码' }]"
        >
          <template #button>
            <RandomCode @confirmCode="getConfirmCode"></RandomCode>
          </template>
        </van-field>
        <p class="register">还没有账户，<span @click="changeLogin(false)">立即注册</span></p>
      </van-cell-group>

      <div class="submit">
        <van-button round block type="primary" native-type="submit"> 登录 </van-button>
      </div>
    </van-form>
    <van-form @submit="onSubmit" v-else>
      <van-cell-group inset>
        <van-field
          v-model="username"
          name="loginName"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          v-model="confirmCode"
          name="confirmCode"
          label="验证码"
          placeholder="验证码"
          :rules="[{ required: true, message: '请填写验证码' }]"
        >
          <template #button>
            <RandomCode @confirmCode="getConfirmCode"></RandomCode>
          </template>
        </van-field>
      </van-cell-group>
      <p class="register">已有账户，<span @click="changeLogin(true)">立即登录</span></p>
      <div class="submit">
        <van-button round block type="primary" native-type="submit"> 注册 </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import TopSearch from '@/components/TopSearch.vue'
import RandomCode from '@/components/RandomCode.vue'

import md5 from 'js-md5'
import { login, logout, register } from '@/service/login.js'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import { reactive, toRefs } from 'vue'
export default {
  components: { TopSearch, RandomCode },
  setup() {
    const router = useRouter()
    let _data = reactive({
      username: '',
      password: '',
      isLogin: true,
      confirmCode: '', //输入的验证码
      randomCode: '' //图片的验证码
    })
    const onSubmit = async ({ loginName, password, confirmCode }) => {
      let passwordMd5 = md5(password)
      //不区分大小写
      let str = new RegExp(`^${_data.confirmCode.trim()}$`, 'i')
      if (_data.isLogin && str.test(_data.randomCode)) {
        let { data } = await login({ loginName, passwordMd5 })
        localStorage.setItem('token', data)
        router.push('/')
      } else if (str.test(_data.randomCode)) {
        //可以不用写这个 !_data.isLogin &&
        await register({ loginName, password })
        Toast.success('注册成功')
      } else {
        Toast.fail('验证码不正确')
      }
    }
    function changeLogin(flag) {
      _data.isLogin = flag
      _data.username = ''
      _data.password = ''
      _data.confirmCode = ''
    }
    function getConfirmCode(randomCode) {
      _data.randomCode = randomCode
    }
    return {
      ...toRefs(_data),
      onSubmit,
      changeLogin,
      getConfirmCode
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/common/style/mixin.less';
.login-container {
  .top-center {
    flex: 7;
    text-align: center;
  }
  .top-right {
    flex: 1.5;
  }
  .title {
    font-size: 400;
    text-align: center;
  }
  .log {
    margin-top: 100px;
    text-align: center;
    img {
      width: 50%;
    }
  }
  .submit {
    margin: 16px;
  }
  .register {
    margin: 16px;
    span {
      color: @bgc;
    }
  }
}
</style>
