<template>
  <router-view v-slot="{ Component }">
    <keep-alive include="Search">
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <FooterNarBar v-show="!route.meta.noShow"></FooterNarBar>
</template>

<script>
import FooterNarBar from '@/components/FooterNarBar.vue'

import { useRoute } from 'vue-router'
export default {
  name: 'App',
  components: {
    FooterNarBar
  },
  setup() {
    let route = useRoute()
    return {
      route
    }
  }
}
</script>

<style lang="less">
@import '@/common/style/base.less';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  /deep/ .van-pull-refresh {
    overflow: none;
  }
}
</style>
