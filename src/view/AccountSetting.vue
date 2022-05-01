<template>
  <div class="setting-container">
    <TopSearch>
      <template #center>
        <div class="top-center">账号管理</div>
      </template>
    </TopSearch>
    <van-cell-group class="cell-group" inset>
      <van-field v-model="name" label="昵称" placeholder="请输入用户名" />
      <van-field v-model="signature" label="个性签名" placeholder="请输入用户名" />
      <van-field v-model="modifyPassWord" label="修改密码" placeholder="请输入用户名" />
    </van-cell-group>
    <div class="button-group">
      <van-button class="save-button" type="primary" @click="save">保存</van-button>
      <van-button class="save-button" type="primary" @click="handlerLogout">退出登录</van-button>
    </div>
  </div>
</template>

<script>
import TopSearch from '@/components/TopSearch.vue'

import md5 from 'js-md5'
import { logout } from '@/service/login.js'
import { getUserInfo, modifyUserInfo } from '@/service/user.js'
import { Toast, Dialog } from 'vant'
import { useRouter } from 'vue-router'
import { reactive, toRefs, onMounted } from 'vue'
export default {
  components: { TopSearch },
  setup() {
    const router = useRouter()
    let _data = reactive({
      name: '',
      signature: '',
      modifyPassWord: ''
    })

    onMounted(async () => {
      let { data } = await getUserInfo()
      _data.name = data.nickName
      _data.signature = data.introduceSign
    })

    function save() {
      Dialog.confirm({
        message: '确认修改信息'
      })
        .then(async () => {
          let password
          //modifyPassWord为空就表示密码不修改
          if (_data.modifyPassWord) password = md5(_data.modifyPassWord)
          await modifyUserInfo({
            introduceSign: _data.signature,
            nickName: _data.name,
            passwordMd5: password
          })
          Toast.success('修改成功')
        })
        .catch(() => {})
    }
    async function handlerLogout() {
      await logout()
      localStorage.removeItem('token')
      router.back()
      Toast('登出成功')
    }
    return {
      ...toRefs(_data),
      save,
      handlerLogout
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/common/style/mixin.less';
.setting-container {
  padding-top: 59px;
  .top-center {
    flex: 7;
    text-align: center;
  }
  .cell-group {
    margin-bottom: 15px;
  }
  .button-group {
    display: flex;
    margin-top: 20px;
    padding: 0 10px;
    .save-button {
      flex: 1;
      margin: 0 10px;
    }
  }
}
</style>
