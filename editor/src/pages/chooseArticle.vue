<template>
  <div>
    <el-container>
      <el-main>
        <el-row class="mb_20">
          <el-col :span="3">
            <el-select v-model="value1" placeholder="一级分类" v-on:change="catTypeChange1(value1)">
              <el-option v-for="item in catTypeArray1" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="value2" placeholder="二级分类" v-on:change="catTypeChange2(value2)">
              <el-option v-for="item in catTypeArray2" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-input placeholder="审批人" v-model="keyword"></el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" v-on:click="searchClick">查询</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" v-on:click="setStoreRelation">导入</el-button>
          </el-col>
        </el-row>
        <div class="mb_40">
          <el-table  border ref="multipleTable" :data="materialArray" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
            <el-table-column type="selection" label="" width="60">
            </el-table-column>
            <el-table-column prop="use" label="状态" width="140">
              <template slot-scope="scope" >
                <div v-bind:class=" scope.row.use==0?'':'color_red'">{{ scope.row.use==0?'未添加':'已添加' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="addtime" label="发布时间" width="160">
              <template slot-scope="scope" >
                <div>{{ scope.row.addtime | timeFilter }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="user" label="发布人" width="140">
            </el-table-column>
            <el-table-column prop="showtype" label="所属分类" width="180">
              <template slot-scope="scope" >
                <div>{{ scope.row.showtype }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="quote" label="被引用次数" width="140">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
              <template slot-scope="scope">
                <el-button @click="getStoreInfo(scope.row)" type="text" size="small">查看全文</el-button>
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
        <img :src="imgBaseUrl + storeDetail.img" alt="">
        <div class="text_left" v-html="storeDetail.content"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '../api/index'
import { timeFilter } from '../components/mixins'
import { imgBaseUrl2, setsessionStorage, getsessionStorage, getId } from '../config'

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
      dialogTableVisible: false,
      storeDetail: {},
      // 已勾选aid
      aid: '',
      type: '',
      source: '',
      mediaid: '',
      // 新建list导入数据
      articleArray: []
    }
  },
  mounted () {
    let that = this
    this.type = this.$route.query.type
    this.mediaid = this.$route.query.mediaid
    this.source = this.$route.query.source
    this.getAdminStore({id: that.id, p: this.current})
    this.getCatType1()
  },
  methods: {
    // 获取列表数据
    getAdminStore (obj) {
      let that = this
      api.getAdminStore(obj).then((res) => {
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
    // 表格勾选事件
    handleSelectionChange (val) {
      let that = this
      that.aid = ''
      val.forEach((value) => {
        that.aid += value.id + ','
      })
      that.aid = that.aid.slice(0, -1)
      that.articleArray = val
    },
    // 分页
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.current = val
      this.getAdminStore({id: that.id, p: this.current})
    },
    // 查看全文
    getStoreInfo (val) {
      let that = this
      api.getStoreInfo({id: that.id, aid: val.id}).then((res) => {
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
      this.current = 1
      this.getAdminStore({id: that.id, p: this.current, type1: this.value1, type2: this.value2, keyword: this.keyword})
    },
    // 导入
    setStoreRelation () {
      let that = this
      let promiselist = []
      for (let i = 0; i < that.articleArray.length; i++) {
        promiselist.push(new Promise((resolve, reject) => {
          api.uploadimgWechat({
            coord: 1,
            id: that.id,
            file: that.articleArray[i]['img'].replace('http://bj.lawbang.com/', '')
          }).then((res) => {
            if (res.errcode === 0) {
              that.articleArray[i]['thumb_media_id'] = res.data['media_id']
              resolve(res)
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
          })
        }))
      }
      Promise.all(promiselist).then((res) => {
        console.log(that.articleArray)
        //if (that.type === 'new') {
        if (getsessionStorage('articleArray')) {
          let articleArray = JSON.parse(getsessionStorage('articleArray'))
          articleArray = articleArray.concat(that.articleArray)
          setsessionStorage('articleArray', JSON.stringify(articleArray))
          that.$router.push({
            name: 'newMaterial',
            query: {
              type: that.type
            }
          })
          that.$message({
            type: 'success',
            message: '数据导入成功！'
          })
        } else {
          setsessionStorage('articleArray', JSON.stringify(that.articleArray))
          that.$router.push({
            name: 'newMaterial',
            query: {
              type: that.type
            }
          })
          that.$message({
            type: 'success',
            message: '数据导入成功！'
          })
        }
        //}
      })
    }
  }
}
</script>

<style scoped>
  .el-table th>.cell{
    text-align: center;
  }
</style>
