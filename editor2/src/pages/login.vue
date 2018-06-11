<template>
  <div>
    <div class="form">
      <div class="mb_40 font_26">素材库后台编辑系统</div>
      <div class="login_box">
        <el-form :model="form" status-icon label-width="0" class="demo-ruleForm">
          <el-form-item prop="pass">
            <el-input placeholder="用户名" type="text" auto-complete="off" v-model="form.account"></el-input>
          </el-form-item>
          <el-form-item prop="checkPass">
            <el-input placeholder="密码" type="password" auto-complete="off" v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="login" style="width: 100%;">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/index'
import { setlocalStorage } from '../config/index'

export default {
  data () {
    return {
      form: {
        account: '',
        password: ''
      }
    }
  },
  mounted () {
    this.checkLogin()
  },
  methods: {
    login () {
      let that = this
      api.login(that.form).then((res) => {
        if (res.errcode === 0) {
          setlocalStorage('usermsg', JSON.stringify(res.data))
          setlocalStorage('id', res.data['admin_id'])
          that.$router.push({
            name: 'manage'
          })
          that.$message({
            type: 'success',
            message: '登录成功'
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
    },
    checkLogin () {
      let that = this
      api.checkLogin().then((res) => {
        if (res.errcode === 0) {
          setlocalStorage('usermsg', JSON.stringify(res.data))
          setlocalStorage('id', res.data['admin_id'])
          that.$router.push({
            name: 'manage'
          })
          that.$message({
            type: 'success',
            message: '已登录'
          })
        }
        if (res.errcode === 3) {
          that.$message({
            type: 'error',
            message: '登录超时，重新登录'
          })
        }
      }).catch(() => {
        console.log('error')
      })
    }
  }
}
</script>

<style scoped>
  .form{
    box-sizing: border-box;
    width: 440px;
    height: 334px;
    position: fixed;
    top: 40%;
    left: 50%;
    margin-top: -160px;
    margin-left: -220px;
  }
  .login_box{
    box-sizing: border-box;
    border: 1px solid #ccc;
    padding: 40px 20px;
  }
</style>
