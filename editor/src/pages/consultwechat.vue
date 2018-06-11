<template>
  <div>
    <el-container>
      <el-main>
        <el-row class="mb_20">
          <el-col>
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column prop="id" label="ID" width="150">
              </el-table-column>
              <el-table-column prop="content" label="内容">
                <template slot-scope="scope">
                  <div class="text_left">{{scope.row.content}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="wx_name" label="来自哪个微信账号" width="180">
              </el-table-column>
              <el-table-column prop="createtime" label="咨询时间" width="180">
                <template slot-scope="scope">
                  <div>{{scope.row.createtime | timeFilter}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="180">
                <template slot-scope="scope">
                  <div v-if="scope.row['status']==2">已回复</div>
                  <div v-else-if="scope.row['status']==1">已读</div>
                  <div v-else>未读</div>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="180">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="openconsultwechatdetail(scope.row.id)">查看回复列表</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="current"
              :page-size="limit"
              layout="prev, pager, next, jumper"
              :total="count">
            </el-pagination>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import api from '../api/index'
  import { getId } from '../config/index'
  import { timeFilter } from '../components/mixins'

  export default {
    data () {
      return {
        id: getId(),
        tableData: [],
        p: 1,
        current: 1,
        limit: 20,
        count: 0
      }
    },
    filters: {
      timeFilter
    },
    mounted () {
      let that = this
      that.wxask({id: that.id, p: that.p, page: that.limit})
    },
    methods: {
      wxask (obj) {
        let that = this;
        api.wxask(obj).then((res) => {
          if (res.errcode === 0) {
            that.count = Number(res.data.info.count)
            that.tableData = res.data.list
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
      },
      // 分页
      handleSizeChange (val) {
        console.log(`每页 ${val} 条`)
      },
      handleCurrentChange (val) {
        let that = this
        that.current = val
        that.wxask({id: that.id, p: that.current, page: that.limit})
      },
      // 查看详情
      openconsultwechatdetail (askid) {
        let that = this
        that.$router.push({
          name: 'consultwechatdetail',
          query: {
            askid: askid
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
