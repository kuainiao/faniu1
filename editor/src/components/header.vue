<template>
  <div class="header bg_f">
    <el-row>
      <el-col :span="20">
        <el-menu :default-active="defaultActive" router mode="horizontal">
          <!--<el-menu-item index="manage"><i class="el-icon-menu"></i>网站首页</el-menu-item>-->
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-setting"></i>素材管理</template>
            <el-menu-item index="materialList">素材列表</el-menu-item>
            <el-menu-item index="modle">设置常用模板</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-setting"></i>咨询中心</template>
            <el-menu-item index="consult">咨询中心</el-menu-item>
            <el-menu-item index="consultwechat">微信咨询</el-menu-item>
            <el-menu-item index="consultadmin">我的网站咨询</el-menu-item>
          </el-submenu>
          <el-menu-item index="welink">微网站链接</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="4">
        <div class="header_box text_right">
          <el-dropdown @command="handleCommand">
            <div class="clearfix">
              <div class="userbox float_left">
                <img :src="thumb" class="avator">
              </div>
              <div class="float_left line_h60 mr_20">
                您好，{{nickname}}
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from '../api/index'

export default {
  props: ['usermsg'],
  data () {
    return {
      thumb: '../assets/images/avator.jpg',
      nickname: ''
    }
  },
  computed: {
    defaultActive () {
      return this.$route.path.replace('/', '')
    }
  },
  watch: {
    usermsg (newval) {
      this.thumb = newval.thumb
      this.nickname = newval['user_nickname']
    }
  },
  methods: {
    handleCommand (command) {
      let that = this
      if (command === 'logout') {
        api.logout().then((res) => {
          if (res.errcode === 0) {
            that.$message({
              type: 'success',
              message: '退出成功'
            })
            that.$router.push({
              name: 'login'
            })
          } else {
            that.$message({
              type: 'error',
              message: res.message
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    }
  }
}
</script>

<style scoped>
.header{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
.header_box{
  height: 60px;
  border-bottom: solid 1px #e6e6e6;
}
.avator {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin: 12px 20px;
}
</style>
