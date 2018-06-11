<template>
  <div>
    <el-container>
      <el-main>
        <el-row class="mb_20">
          <el-col :span="8">
            <el-input class="mb_14" v-model="formData['thumb_media_id']"></el-input>
          </el-col>
          <el-col :span="8">
            <el-upload
              class="upload-demo"
              ref="upload"
              :action="baseuploadurl() + 'Admin/addimg'"
              :data="fileData"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="fileList"
              :auto-upload="false"
              :show-file-list="false">
              <el-button slot="trigger">本地选择图片</el-button>
              <el-button @click="uploadImg">上传</el-button>
            </el-upload>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="clearfix">
          <el-col :span="6"  v-for="(item, index) in dialogImgList2" v-bind:key="index" class="mb_14 text_center">
            <img :src="item['img']" alt="" class="imguploaditem mb_14">
            <i class="el-icon-delete" v-on:click="remove(item['id'])"></i>
          </el-col>
        </el-row>
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
        <div class="mb_40 nodata" v-show="count === 0">暂无数据</div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import api from '../api/index'
import { imgBaseUrl, imgBaseUrl2, baseuploadurl, getId } from '../config/index'

export default {
  data () {
    return {
      formData: {
        id: getId(),
        thumb_media_id: ''
      },
      // 本地上传
      fileList: [],
      fileData: {id: getId()},
      dialogImgList2: [],
      imgBaseUrl: imgBaseUrl,
      imgBaseUrl2: imgBaseUrl2,
      baseuploadurl: baseuploadurl,
      // 图片库选择分页,
      count: 0,
      current: 1,
      limit: 8,
      id: getId()
    }
  },
  mounted () {
    this.metalist()
  },
  methods: {
    // 本地上传图片
    uploadImg () {
      this.$refs.upload.submit()
    },
    // 本地上传图片预览
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    // 预览本地上传图片
    handlePreview (file) {
      // this.uploadImgUrl = file.url
    },
    handleSuccess (res, file, fileList) {
      let that = this
      if (res.errcode === 0) {
        that.uploadImgUrl = file.url
        that.formData['thumb_media_id'] = res.data.burl
        api.imgadd({img: that.formData['thumb_media_id']}).then((res) => {
          if (res.errcode === 0) {
            this.metalist()
            that.$message({
              message: '上传成功！',
              type: 'success'
            })
          }
        })
      } else {
        that.$message({
          message: res.msg,
          type: 'error'
        })
      }
    },
    // 图片库分页
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      let that = this
      this.current = val
      this.metalist({id: that.id, p: this.current})
    },
    // 图片库数据获取
    metalist () {
      let that = this
      api.metalist({id: that.id, p: this.current}).then((res) => {
        if (res.errcode === 0) {
          that.dialogImgList2 = res.data.list
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
    // 图片库图片删除
    remove (id) {
      let that = this
      api.imgdel({imgid: id}).then((res) => {
        if (res.errcode === 0) {
          that.metalist()
          that.$message({
            type: 'success',
            message: '删除成功'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.el-icon-delete{
  padding: 10px;
  display: block;
  margin: 0 auto;
}
.nodata{
  height: 200px;
  line-height: 200px;
}
.imguploaditem{
  /*display: block;*/
  /*width: 100%;*/
  /*height: 200px;*/
}
</style>
