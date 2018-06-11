<template>
  <div>
    <el-container>
      <el-main>
        <el-row class="mb_20">
          <el-col>
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column prop="id" label="ID" width="80">
              </el-table-column>
              <el-table-column prop="mobile" label="用户手机号" width="120">
              </el-table-column>
              <el-table-column prop="areaid" label="地区" width="150">
              </el-table-column>
              <el-table-column prop="content" label="内容">
                <template slot-scope="scope">
                  <div class="text_left">{{scope.row.content}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="addtime" label="咨询时间" width="120">
                <template slot-scope="scope">
                  <div>{{scope.row.addtime | timeFilter('day')}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="replystatus" label="状态" width="80">
                <template slot-scope="scope">
                  <div v-if="scope.row['replystatus']==1">已回复</div>
                  <div v-else>未回复</div>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="120">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="openconsultadmindetail(scope.row.id)">查看回复列表</el-button>
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
      that.askAdmin({id: that.id, p: that.p, page: that.limit})
    },
    methods: {
      askAdmin (obj) {
        let that = this;
        api.askAdmin(obj).then((res) => {
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
        that.askAdmin({id: that.id, p: that.current, page: that.limit})
      },
      // 查看详情
      openconsultadmindetail (askid) {
        let that = this
        that.$router.push({
          name: 'consultadmindetail',
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
