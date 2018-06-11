<template>
  <div>
    <el-container>
      <el-main>
        <el-row class="mb_20">
          <el-col>
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column prop="id" label="微站ID" width="150">
              </el-table-column>
              <el-table-column prop="title" label="微站标题" width="200">
              </el-table-column>
              <el-table-column prop="isweb" label="是否引用外部微站" width="100">
                <template slot-scope="scope">
                  <div v-if="scope.row.isweb==1">是</div>
                  <div v-else>否</div>
                </template>
              </el-table-column>
              <el-table-column prop="weburl" label="微站首页链接">
              </el-table-column>
              <el-table-column prop="bindwx" label="绑定微信平台状态" width="100">
                <template slot-scope="scope">
                  <div v-if="scope.row.isweb==1">已绑定</div>
                  <div v-else>未绑定</div>
                </template>
              </el-table-column>
              <el-table-column prop="open_user_center" label="用户中心" width="100">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row['open_user_center']==1?true:false"></el-switch>
                </template>
              </el-table-column>
              <el-table-column prop="open_post_update" label="自动更新" width="100">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row['open_post_update']==1?true:false"></el-switch>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="small">当前主站点</el-button>
                  <el-button type="text" size="small">绑定</el-button>
                  <el-button type="text" size="small">关联分类</el-button>
                  <el-button type="text" size="small">管理</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import api from '../api/index'
import { getId } from '../config/index'

export default {
  data () {
    return {
      id: getId(),
      tableData: []
    }
  },
  mounted () {
    this.siteList()
  },
  methods: {
    siteList () {
      let that = this;
      api.siteList({id: that.id}).then((res) => {
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
        that.$router.push({
          name: 'login'
        })
        that.$message({
          type: 'error',
          message: '登录超时，重新登录'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
