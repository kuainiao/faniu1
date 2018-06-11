<template>
  <div class="manage_page fillcontain">
    <header-top v-bind:usermsg="usermsg"></header-top>
    <div class="height_100 pt_60">
      <!--<keep-alive>-->
        <router-view></router-view>
      <!--</keep-alive>-->
    </div>
  </div>
</template>

<script>
import headerTop from '../components/header'
import { getlocalStorage } from '../config/index'

export default {
  components: {
    headerTop
  },
  data () {
    return {
      usermsg: {
        nickname: '',
        thumb: ''
      }
    }
  },
  mounted () {
    this.getusermsg()
    // this.$router.push({
    //   name: 'home'
    // })
  },
  methods: {
    getusermsg () {
      this.usermsg = JSON.parse(getlocalStorage('usermsg'))
    }
  }
}
</script>

<style scoped>
  .fillcontain{
    width: 100%;
    height: 100%;
  }
  /*.el-submenu__title,.el-submenu,.el-menu-item{*/
    /*text-align: left;*/
  /*}*/
</style>
