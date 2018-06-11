<template>
  <div>
    <el-container>
      <el-main>
        <el-tabs type="border-card">
          <el-tab-pane label="咨询信息">
            <el-row class="mb_20">
              <el-col class="font_14 color_blue text_left">基本资料</el-col>
            </el-row>
            <el-row class="mb_20">
              <el-col :span="2" class="text_right font_14 color_3">姓名：</el-col>
              <el-col :span="10" class="font_14 color_3">{{detail['user_nickname']}}</el-col>
              <el-col :span="2" class="text_right font_14 color_3">手机号：</el-col>
              <el-col :span="10" class="font_14 color_3">{{detail['user_mobile']}}</el-col>
            </el-row>
            <el-row class="mb_20">
              <el-col :span="2" class="text_right font_14 color_3">邮箱：</el-col>
              <el-col :span="10" class="font_14 color_3">{{detail['user_email']}}</el-col>
              <el-col :span="2" class="text_right font_14 color_3">地区：</el-col>
              <el-col :span="10" class="font_14 color_3">{{detail['ip']}}</el-col>
            </el-row>
            <el-row class="mb_20">
              <el-col class="font_14 color_blue text_left">咨询内容（咨询时间：{{detail['addtime']|timeFilter}}）</el-col>
            </el-row>
            <el-row>
              <el-col>
                <div class="text_left font_14 color_3">{{detail.content}}</div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="回复咨询列表">
            <el-table :data="replylist" border style="width: 100%;">
              <el-table-column prop="reply_content" label="回复内容"></el-table-column>
              <el-table-column prop="reply_time" label="回复时间"></el-table-column>
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
      detail: {},
      replylist: []
    }
  },
  filters: {
    timeFilter
  },
  mounted () {
    this.readConsultation()
  },
  methods: {
    readConsultation () {
      let that = this
      let askid = that.$route.query.askid
      api.readConsultation({id: that.id, askid: askid}).then((res) => {
        if (res.errcode === 0) {
          that.detail = res.data.detail
          that.replylist = res.data.replylist
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
