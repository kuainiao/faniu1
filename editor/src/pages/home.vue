<template>
  <div>
    <head-top></head-top>
    <el-container>
      <el-main>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="wx_name" label="账号名称" width="180">
          </el-table-column>
          <el-table-column prop="wx_num" label="微信号" width="180">
          </el-table-column>
          <el-table-column prop="wx_token" label="Token(令牌)">
          </el-table-column>
          <el-table-column prop="address" label="授权第三方平台">
            <template slot-scope="scope">
              <div>{{scope.row.auth_status==='1'?'已授权':'未授权'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="管理">
            <template slot-scope="scope">
              <el-button type="text" v-on:click="openMaterialList(scope.row.id)">平台管理</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import  headTop from '../components/head'
import api from '../api/index'
import { setlocalStorage } from '../config/index'

export default {
  components: {
    headTop
  },
  data () {
    return {
      tableData: []
    }
  },
  mounted () {
    this.wxuser()
  },
  methods: {
    wxuser () {
      let that = this
      api.wxuser().then((res) => {
        if (res.errcode === 0) {

          that.tableData = res.data
        }
        if (res.errcode === 3) {
          that.$router.push({
            name: 'login'
          })
          that.$message({
            type: 'error',
            message: '登录超时，重新登录'
          })
        }
      }).catch(() => {
        console.log('error')
      })
    },
    openMaterialList (id) {
      setlocalStorage('id', id)
      this.$router.push({
        name: 'manage'
      })
    }
  }
}
</script>

<style scoped>

</style>
