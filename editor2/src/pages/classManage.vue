<template>
  <div>
    <el-container>
      <el-main>
        <el-row class="mb_20">
          <el-col :span="2" class="text_left">
            <el-button type="primary" v-on:click="openAddClass">新建</el-button>
          </el-col>
          <el-col :span="4" :offset="8">
            <el-select v-model="type" placeholder="选择分类级别">
              <el-option v-for="item in catTypeArray" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-input placeholder="请输入分类名称" v-model="keyword"></el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" v-on:click="searchClick">查询</el-button>
          </el-col>
        </el-row>
        <div class="mb_20">
          <el-table  border ref="multipleTable" :data="materialArray" tooltip-effect="dark" style="width: 100%;">
            <el-table-column type="index" label="序号" width="100">
            </el-table-column>
            <el-table-column prop="name" label="分类名称" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="type" label="所属类别" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{scope.row.type==='0'?'一级分类':'二级分类'}}</div>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="300">
              <template slot-scope="scope">
                <el-button type="text" size="small" v-on:click="editor(scope.row.id)">编辑</el-button>
                <el-button type="text" size="small" v-on:click="delcat(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
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
      catTypeArray: [{
        id: 0,
        name: '一级分类'
      }, {
        id: 1,
        name: '二级分类'
      }],
      type: '',
      keyword: '',
      materialArray: []
    }
  },
  mounted () {
    let that = this
    this.catlist({id: that.id})
  },
  methods: {
    openAddClass () {
      this.$router.push({
        name: 'addClass',
        query: {
          type: 'new'
        }
      })
    },
    // 获取列表数据
    catlist (obj) {
      let that = this
      api.catlist(obj).then((res) => {
        if (res.errcode === 0) {
          that.materialArray = res.data.list
          that.count = Number(res.data.info.count)
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
    // 查询
    searchClick () {
      let that = this
      this.catlist({id: that.id, type: this.type, keyword: this.keyword})
    },
    // 编辑
    editor (catid) {
      this.$router.push({
        name: 'addClass',
        query: {
          type: 'editor',
          catid: catid
        }
      })
    },
    // 删除
    delcat (catid) {
      let that = this
      api.delcat({id: that.id, catid: catid}).then((res) => {
        if (res.errcode === 0) {
          that.catlist({id: that.id})
          that.$message({
            type: 'success',
            message: '删除成功'
          })
        } else {
          if (res.errcode === 3) {
            that.$router.push({
              name: 'login'
            })
            that.$message({
              type: 'error',
              message: '登录超时，重新登录'
            })
          } else {
            that.$message({
              type: 'error',
              message: res.message
            })
          }
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
