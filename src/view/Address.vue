<template>
  <TopSearch>
    <template #center>
      <div class="center">地址管理</div>
    </template>
    <template #right>
      <div class="top-right" v-if="deleteFlag" @click="fun">退出管理</div>
      <div class="top-right" style="text-align: right" v-else>
        <van-popover
          placement="bottom-end"
          v-model:show="showPopover"
          theme="dark"
          :actions="actions"
          @select="onSelect"
        >
          <template #reference>
            <span class="span1 iconfont icon-gengduo" @click="show = true"></span>
          </template>
        </van-popover>
      </div>
    </template>
  </TopSearch>
  <van-overlay class="overlay" :show="show" @click="show = false" />

  <van-address-list
    class="address-list"
    v-model="chosenAddressId"
    :list="addressLists"
    default-tag-text="默认"
    @add="onAdd"
    @edit="onEdit"
    @select="selectAddress"
  >
    <!-- <template #tag>
      <label for="qw" class="ad-check">
        <input type="checkbox" class="oldinput" id="qw" />
        <span class="newcheck"></span>
      </label>
    </template> -->
  </van-address-list>
  <!-- <van-submit-bar class="submition" button-text="删除" @submit="deleteItemAll" v-if="deleteFlag">
    <label for="qw">
      <input type="checkbox" class="oldinput" id="qw" @change="changeAll" />
      <span class="newcheck"></span>
    </label>
    全选
    <div style="flex: 1"></div>
  </van-submit-bar> -->
</template>

<script>
import TopSearch from '@/components/TopSearch.vue'

import { getAddressList } from '@/service/address.js'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, reactive, toRefs } from 'vue'
export default {
  components: { TopSearch },
  setup() {
    const router = useRouter()
    const route = useRoute()
    let _data = reactive({
      addressLists: [],
      deleteFlag: false,
      showPopover: false,
      show: false,
      chosenAddressId: ''
    })
    let actions = ref([
      {
        // text: toRef(_data, 'text1'),
        text: '编辑'
        // fun() {
        //   _data.deleteFlag = !_data.deleteFlag
        //   _data.text1 = _data.deleteFlag ? '退出编辑' : '编辑'
        // }
      },
      { text: '选项二' },
      { text: '选项三' }
    ])
    //初始化
    onMounted(async () => {
      let { data } = await getAddressList({ pageNumber: 1, pageSize: 1 })
      data.forEach(item => {
        let address = item.provinceName + item.cityName + item.regionName + item.detailAddress
        let obj = new Address(item.addressId, item.userName, item.userPhone, address, item.defaultFlag)
        _data.addressLists.push(obj)
      })
    })

    function Address(id, name, tel, address, isDefault) {
      this.id = id
      this.name = name
      this.tel = tel
      this.address = address
      this.isDefault = isDefault
    }

    let onAdd = () => {
      router.push('/addressedit')
    }
    function onEdit(address) {
      router.push({
        path: '/addressedit',
        query: { id: address.id }
      })
    }
    function onSelect() {
      fun()
    }
    function fun() {
      _data.deleteFlag = !_data.deleteFlag
      _data.show = false
    }
    function selectAddress(address) {
      if (route.query.from !== 'user') {
        router.replace({
          path: '/createorder',
          query: {
            addressId: address.id,
            userName: address.name,
            userPhone: address.tel,
            address: address.address
          }
        })
      }
    }
    return {
      ...toRefs(_data),
      onAdd,
      onEdit,
      actions,
      fun,
      onSelect,
      selectAddress
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/common/style/mixin.less';
.center {
  flex: 7;
  text-align: center;
}
.top-right {
  flex: 1.5;
  color: @bgc;
  font-size: 12px;
}
.span1 {
  font-size: 35px;
}
.overlay {
  background-color: transparent;
  z-index: 2000;
}
.address-list {
  margin-top: 59px;
  /deep/ .van-radio__icon {
    display: none;
  }
}
.ad-check {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
.newcheck {
  display: inline-block;
  margin-right: 5px;
  width: 22px;
  height: 22px;
  border: 1px solid @bgc;
  border-radius: 3px;
  color: #fff;
  background-color: #fff;
  transition: all 0.5s;
}
.oldinput:checked + span {
  position: relative;
  background-color: @bgc;
  border: 1px solid transparent;
}
.oldinput:checked + span::after {
  content: '\2714';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
}
.oldinput {
  display: none;
}
.submition {
  z-index: 1999;
}
</style>
