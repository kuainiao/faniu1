<template>
  <div>
    <el-container>
      <el-main>
        <el-row class="mb_20">
          <el-col :span="2" class="text_left">
            <el-button type="primary" v-on:click="openNewArticleMaterial">新建</el-button>
          </el-col>
          <el-col :span="4" :offset="4">
            <el-select v-model="value1" placeholder="一级分类" v-on:change="catTypeChange1(value1)">
              <el-option v-for="item in catTypeArray1" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="value2" placeholder="二级分类" v-on:change="catTypeChange2(value2)">
              <el-option v-for="item in catTypeArray2" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-input placeholder="请输入关键字搜索" v-model="keyword"></el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" v-on:click="searchClick">查询</el-button>
          </el-col>
        </el-row>
        <div class="mb_40">
          <el-table  border ref="multipleTable" :data="materialArray" tooltip-effect="dark" style="width: 100%;">
            <el-table-column  type="index" label="序号" width="60">
            </el-table-column>
            <el-table-column prop="title" label="标题" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="addtime" label="发布时间" width="160">
              <template slot-scope="scope" >
                <div>{{ scope.row.addtime | timeFilter }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="user" label="发布人" width="160">
            </el-table-column>
            <el-table-column prop="showtype" label="所属分类" width="160">
              <template slot-scope="scope" >
                <div>{{ scope.row.showtype }}</div>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="180">
              <template slot-scope="scope">
                <el-button @click="articleLook(scope.row)" type="text" size="small">查看</el-button>
                <el-button @click="articleEdit(scope.row)" type="text" size="small">编辑</el-button>
                <el-button @click.native.prevent="articleDel(scope.row.id)" type="text" size="small">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="block" v-show="materialArray.length>0">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="current"
            :page-size="limit"
            layout="prev, pager, next, jumper"
            :total="count">
          </el-pagination>
        </div>
      </el-main>
    </el-container>
    <el-dialog :title="storeDetail.title" :visible.sync="dialogTableVisible">
      <div>
        <div class="mb_20">
          <span class="mr_100">{{storeDetail.addtime | timeFilter}}</span>
          <span>引用次数:{{storeDetail.quote}}</span>
        </div>
        <img :src="storeDetail.img" alt="">
        <div class="text_left" v-html="storeDetail.content"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '../api/index'
import { timeFilter } from '../components/mixins'
import { imgBaseUrl2, getId } from '../config/index'

export default {
  filters: {
    timeFilter
  },
  data () {
    return {
      id: getId(),
      catTypeArray1: [],
      catTypeArray2: [],
      value1: '',
      value2: '',
      keyword: '',
      imgBaseUrl: imgBaseUrl2,
      materialArray: [],
      count: 0,
      current: 1,
      limit: 10,
      // 查看
      dialogTableVisible: false,
      storeDetail: {}
    }
  },
  mounted () {
    let that = this
    this.articleList({id: that.id, p: this.current})
    this.getCatType1()
  },
  methods: {
    // 打开新建页面
    openNewArticleMaterial () {
      this.$router.push({
        name: 'newArticleMaterial',
        query: {
          type: 'new'
        }
      })
    },
    // 分页
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      let that = this
      this.current = val
      this.articleList({id: that.id, p: this.current})
    },
    // 获取列表数据
    articleList (obj) {
      let that = this
      api.articleList(obj).then((res) => {
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
    // 一级分类
    getCatType1 () {
      let that = this
      api.getCatType({id: that.id, grade: 0}).then((res) => {
        if (res.errcode === 0) {
          that.catTypeArray1 = res.data.list
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
    // 一级分类change事件
    catTypeChange1 (id) {
      this.getCatType2(id)
    },
    // 二级分类
    getCatType2 (id) {
      let that = this
      api.getCatType({id: that.id, catid: id, grade: 1}).then((res) => {
        if (res.errcode === 0) {
          that.catTypeArray2 = res.data.list
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
    // 二级分类change事件
    catTypeChange2 (id) {
    },
    // 查询
    searchClick () {
      let that = this
      this.current = 1
      this.articleList({id: that.id, p: this.current, type1: this.value1, type2: this.value2, keyword: this.keyword})
    },
    // 查看
    articleLook (val) {
      let that = this
      api.articleLook({id: that.id, aid: val.id}).then((res) => {
        if (res.errcode === 0) {
          that.dialogTableVisible = true
          that.storeDetail = res.data.list
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
    // 编辑
    articleEdit (val) {
      this.$router.push({
        name: 'newArticleMaterial',
        query: {
          aid: val.id,
          type: 'editor'
        }
      })
    },
    // 删除
    articleDel (aids) {
      let that = this
      api.articleDel({id: that.id, aids: '' + aids}).then((res) => {
        if (res.errcode === 0) {
          that.articleList({id: that.id, type: this.type, keyword: this.keyword})
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
