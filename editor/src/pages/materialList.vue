<template>
  <div>
    <el-container>
      <el-main>
        <el-tabs v-model="activeName">
          <el-tab-pane label="图文消息" name="first"></el-tab-pane>
        </el-tabs>
        <el-row class="mt_20">
          <el-col :span="3" class="text_left"><el-button type="primary" v-on:click="syncwx">同步微信公众平台</el-button></el-col>
          <el-col :span="3" class="text_left"><el-button type="primary" v-on:click="openChooseArticle">从素材库中选择</el-button></el-col>
          <el-col :span="3" class="text_left"><el-button type="primary" v-on:click="openNewMaterial">新建图文消息</el-button></el-col>
          <el-col :span="15" class="text_right">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item>
                <el-select v-model="formInline.search" clearable placeholder="请选择">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input v-model="formInline.keyword" placeholder="请输入关键字搜索"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchClick">查询</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <ul class="list clearfix mb_40" id="macy-container">
          <li class="item float_left" v-for="item in materialArray" v-bind:key="item.id">
            <div class="item_div">
              <div class="item_con top" v-if="item.content['news_item'].length===1">
                <div class="item_title font_16 color_3 mb_14 text_left">{{item.content['news_item'][0].title}}</div>
                <!--<img :src="showWxImg(item.content['news_item'][0].thumb_url)" alt="" class="item_img mb_14" >-->
                <img :src="imgBaseUrl2 +'?id='+ id + '&url=' + item.content['news_item'][0].thumb_url" alt="" class="item_img mb_14" >
                <p class="font_15 color_6 text_left mb_14 line_h22 pointer" @click="review(item.content['news_item'][0].url)">{{item.content['news_item'][0].digest}}</p>
                <el-row>
                  <el-col :span="12">
                    <div class="text_left font_14 color_9">{{item.content['news_item'][0].addtime | timeFilter}}</div>
                  </el-col>
                  <el-col :span="12">
                    <div class="text_right">
                      <i class="iconfont icon--fuzhi" v-on:click.stop="copy(item['media_id'])"></i>
                      <i class="el-icon-edit-outline" v-on:click.stop="editor(item['media_id'])"></i>
                      <i class="el-icon-delete" v-on:click.stop="remove(item['media_id'])"></i>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div class="item_con bottom" v-else>
                <div class="item_img_box mb_14">
                  <!--<img :src="showWxImg(item.content['news_item'][0].thumb_url)" alt="" class="item_img">-->
                  <img :src="imgBaseUrl2 +'?id='+ id + '&url=' + item.content['news_item'][0].thumb_url" alt="" class="item_img">
                  <p class="item_img_title color_3 pointer" @click="review(item.content['news_item'][0].url)">{{item.content['news_item'][0].digest}}</p>
                </div>
                <div class="mb_20" v-for="value in item.content['news_item'].slice(1)" v-bind:key="value.id">
                  <el-row>
                    <el-col :span="12">
                      <div class="text_left font_14 color_9 pointer" @click="review(value.url)">{{value.digest}}</div>
                    </el-col>
                    <el-col :span="12">
                      <!--<img :src="showWxImg(value.thumb_url)" alt="" class="item_img_s">-->
                      <img :src="imgBaseUrl2 +'?id='+ id + '&url=' + value.thumb_url" alt="" class="item_img_s">
                    </el-col>
                  </el-row>
                </div>
                <el-row>
                  <el-col :span="12">
                    <div class="text_left font_14 color_9">{{item.content['news_item'][0].addtime | timeFilter}}</div>
                  </el-col>
                  <el-col :span="12">
                    <div class="text_right">
                      <i class="iconfont icon--fuzhi" v-on:click.stop="copy(item['media_id'])"></i>
                      <i class="el-icon-edit-outline" v-on:click.stop="editor(item['media_id'])"></i>
                      <i class="el-icon-delete" v-on:click.stop="remove(item['media_id'])"></i>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </li>
        </ul>
        <div class="mb_40 nodata" v-show="count === 0">暂无数据</div>
        <div class="block" v-show="count > 0">
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
  </div>
</template>

<script>
import api from '../api/index'
import { timeFilter } from '../components/mixins'
import Macy from 'macy'
import { getId, baseuploadurl, imgBaseUrl2 } from '../config/index'

export default {
  name: 'materialList',
  filters: {
    timeFilter
  },
  data () {
    return {
      imgBaseUrl2,
      id: getId(),
      formInline: {
        search: '3',
        keyword: ''
      },
      activeName: 'first',
      options: [{
        value: '1',
        label: '作者'
      }, {
        value: '2',
        label: '简介'
      }, {
        value: '3',
        label: '标题'
      }],
      count: 0,
      current: 1,
      limit: 12,
      materialArray: []
    }
  },
  mounted () {
    let that = this
    this.searchmaterial({id: that.id, search: this.formInline.search, keyword: this.formInline.keyword, p: this.current})
  },
  methods: {
    baseuploadurl,
    // 列表数据请求
    searchmaterial (obj) {
      let that = this
      api.searchmaterial(obj).then((res) => {
        if (res.errcode === 0) {
          that.materialArray = res.data.list
          that.$nextTick(() => {
            that.count = Number(res.data.info.count)
            Macy({
              container: '#macy-container',
              trueOrder: false,
              waitForImages: false,
              // margin: 24,
              columns: 4
              // ,
              // breakAt: {
              //   1200: 5,
              //   940: 3,
              //   520: 2,
              //   400: 1
              // }
            })
          })
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
        if (res.errcode ===4) {
          that.materialArray = []
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 打开新建图文页面
    openNewMaterial () {
      window.open('/#/newMaterial')
      // this.$router.push({
      //   name: 'newMaterial',
      //   query: {
      //     type: 'new'
      //   }
      // })
    },
    // 打开从素材库中选择页面
    openChooseArticle () {
      this.$router.push({
        name: 'chooseArticle',
        query: {
          type: 'new'
        }
      })
    },
    // 分页
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      let that = this
      that.current = val
      that.searchmaterial({id: that.id, search: that.formInline.search, keyword: that.formInline.keyword, p: that.current})
    },
    // 搜索素材
    searchClick () {
      let that = this
      that.searchmaterial({id: that.id, search: that.formInline.search, keyword: that.formInline.keyword, p: that.current})
    },
    // 复制
    copy (mediaid) {
      window.open('/#/newMaterial?type=copy&mediaid='+mediaid)
      // this.$router.push({
      //   name: 'newMaterial',
      //   query: {
      //     mediaid,
      //     type: 'copy'
      //   }
      // })
    },
    // 编辑
    editor (mediaid) {
      window.open('/#/newMaterial?type=editor&mediaid='+mediaid)
      // this.$router.push({
      //   name: 'newMaterial',
      //   query: {
      //     mediaid,
      //     type: 'editor'
      //   }
      // })
    },
    // 删除
    remove (mediaid) {
      let that = this
      api.delNews({id: that.id, media_id: mediaid}).then((res) => {
        if (res.errcode === 0) {
          that.searchmaterial({id: that.id, p: this.current})
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
              message: '删除失败'
            })
          }
        }
      }).catch(() => {

      })
    },
    // 预览
    review (url) {
      window.open(url)
    },
    // 同步微信公众平台
    syncwx () {
      let that = this
      api.syncwx({id: that.id}).then((res) => {
        if (res.errcode ===0) {
          that.$message({
            type: 'success',
            message: res.message
          })
          location.reload()
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
    },
    // 微信图片展示
    showWxImg (url) {
      let that = this
      api.showWxImg({id: that.id, url: url}).then((res) => {
        if (res.errcode ===0) {
          console.log(res.errcode)
        }
      })
    }
  }
}
</script>

<style scoped>
  .list {
    padding: 0 10px;
  }
  .item{
    width: 25%;
  }
  .item_div{
    box-sizing: border-box;
    margin: 10px;
  }
  .item:nth-child(4) .item_div{
    margin-right: 0;
  }
  .item_con{
    border: 1px solid #ccc;
    /*min-height: 450px;*/
    padding: 20px;
    box-sizing: border-box;
  }
  .item_title{
    width: 100%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .item_img{
    display: block;
    width: 100%;
    height: 200px;
    background-color: #ccc;
  }
  .item_img_s{
    display: block;
    width: 100%;
    height: 100px;
    background-color: #ccc;
  }
  .item_img_box{
    height: 200px;
    position: relative;
  }
  .item_img_title{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    line-height: 30px;
    background-color: #bbb;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .nodata{
    height: 200px;
    line-height: 200px;
  }
  .pointer{
    cursor: pointer;
  }
</style>
