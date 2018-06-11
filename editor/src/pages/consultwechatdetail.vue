<template>
  <div>
    <el-container>
      <el-main>
        <el-tabs type="border-card">
          <el-tab-pane label="该条咨询回复列表">
            <el-table :data="replylist" border style="width: 100%;">
              <el-table-column prop="id" label="ID" width="100">
              </el-table-column>
              <el-table-column prop="content" label="内容">
                <template slot-scope="scope">
                  <div class="text_left">{{scope.row.content}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="createtime" label="回复咨询时间" width="180">
                <template slot-scope="scope">
                  <div>{{scope.row.createtime | timeFilter('day')}}</div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
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
        replylist: []
      }
    },
    filters: {
      timeFilter
    },
    mounted () {
      this.replyList()
    },
    methods: {
      replyList () {
        let that = this
        let askid = that.$route.query.askid
        api.replyList({id: that.id, askid: askid}).then((res) => {
          if (res.errcode === 0) {
            that.replylist = res.data
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
      }
    }
  }
</script>

<style scoped>

</style>

