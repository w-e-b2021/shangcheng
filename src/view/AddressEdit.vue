<template>
  <TopSearch>
    <template #center>
      <div class="center">地址编辑</div>
    </template>
  </TopSearch>
  <van-address-edit
    class="edit"
    :area-list="areaList"
    show-postal
    show-delete
    show-set-default
    show-search-result
    :search-result="searchResult"
    :area-columns-placeholder="['请选择', '请选择', '请选择']"
    :address-info="addressInitial"
    @save="onSave"
    @delete="onDelete"
    @change-detail="onChangeDetail"
  />
</template>

<script>
import TopSearch from '@/components/TopSearch.vue'

import { editAddress, getAddressById, addAddress, deleteAddress } from '@/service/address.js'
import { areaList } from '@vant/area-data'
import { Dialog } from 'vant'
import { Toast } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, reactive, toRefs } from 'vue'
export default {
  components: { TopSearch },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const searchResult = ref([])
    let _data = reactive({
      addressInitial: {}
    })

    onMounted(async () => {
      if (route.query.id) {
        let { data } = await getAddressById(route.query.id)
        let code = findCode(data.cityName, data.regionName)
        _data.addressInitial.name = data.userName
        _data.addressInitial.tel = data.userPhone
        _data.addressInitial.province = data.provinceName
        _data.addressInitial.city = data.cityName
        _data.addressInitial.county = data.regionName
        _data.addressInitial.addressDetail = data.detailAddress
        _data.addressInitial.isDefault = !!data.defaultFlag
        _data.addressInitial.postalCode = 422200
        _data.addressInitial.areaCode = code
      }
    })

    function findCode(cityName, regionName) {
      //省的话可以不找，基本不必有重名
      let cityArr = []
      Object.keys(areaList.city_list).forEach(key => {
        if (areaList.city_list[key] == cityName) cityArr.push(key)
      })
      return Object.keys(areaList.county_list).find(key => {
        if (areaList.county_list[key] == regionName) {
          return cityArr.some(id => id.substr(2, 2) == key.substr(2, 2))
        }
      })
    }

    const onSave = async address => {
      if (route.query.id) {
        //编辑地址
        await editAddress({
          addressId: route.query.id,
          userName: address.name,
          userPhone: address.tel,
          provinceName: address.province,
          cityName: address.city,
          regionName: address.county,
          detailAddress: address.addressDetail,
          defaultFlag: address.isDefault ? 1 : 0
        })
        Toast('保存成功!!!')
      } else {
        //新增地址
        await addAddress({
          userName: address.name,
          userPhone: address.tel,
          cityName: address.city,
          defaultFlag: address.isDefault ? 1 : 0,
          detailAddress: address.addressDetail,
          provinceName: address.province,
          regionName: address.county
        })
        Toast('保存成功!!!')
      }
    }

    const onDelete = () => {
      if (route.query.id) {
        Dialog.confirm({
          // title: '标题',
          message: '确定要删除吗!'
        })
          .then(async () => {
            await deleteAddress(route.query.id)
            Toast('删除成功')
            router.push('/address')
          }) //确定
          .catch(() => {}) //取消
      } else {
        Toast('您的信息还未保存')
      }
    }
    const onChangeDetail = val => {
      if (val) {
        searchResult.value = [
          {
            name: '老上海',
            address: '邵阳市七里坪区'
          }
        ]
      } else {
        searchResult.value = []
      }
    }
    return {
      ...toRefs(_data),
      onSave,
      onDelete,
      areaList,
      searchResult,
      onChangeDetail
    }
  }
}
</script>

<style lang="less" scoped>
.center {
  flex: 7;
  text-align: center;
}
.edit {
  margin-top: 59px;
}
</style>
