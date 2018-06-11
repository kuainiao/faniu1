<template>
  <div class="header bg_f">
    <el-row>
      <el-col :span="20">
        <el-menu :default-active="defaultActive" router mode="horizontal">
          <!--<el-menu-item index="manage"><i class="el-icon-menu"></i>网站首页</el-menu-item>-->
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>素材库</template>
            <el-menu-item index="articleManage">文章管理</el-menu-item>
            <el-menu-item index="classManage">分类管理</el-menu-item>
            <el-menu-item index="imgManage">图片库管理</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="4">
        <div class="header_box text_right">
          <el-dropdown @command="handleCommand">
            <div class="clearfix">
              <div class="userbox float_left">
                <img src="../assets/images/avator.jpg" class="avator">
              </div>
              <div class="float_left line_h60 mr_20">
                您好，
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
