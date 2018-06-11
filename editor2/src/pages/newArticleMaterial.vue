<template>
  <div>
    <el-container>
      <el-main>
        <el-row class="mb_20">
          <el-col :span="8">
            <p class="text_left mb_14">一级分类</p>
            <el-select v-model="formData.type1" placeholder="一级分类" v-on:change="catTypeChange1(formData.type1)" style="width: 100%;">
              <el-option v-for="item in catTypeArray1" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class="mb_20">
          <el-col :span="8">
            <p class="text_left mb_14">二级分类</p>
            <el-select v-model="formData.type2" placeholder="二级分类" v-on:change="catTypeChange2(formData.type2)" style="width: 100%;">
              <el-option v-for="item in catTypeArray2" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class="mb_20">
          <el-col :span="12">
            <p class="text_left mb_14">标题</p>
            <el-input placeholder="" class="mb_14" v-model="formData.title" v-on:change="titleChange(formData.title)"></el-input>
            <p class="text_left" v-show="titleStatus===1">
              <span class="font_14 color_red mr_100">该标题已存在，请重新编辑</span>
              <span class="font_14 color_blue">备注：该标题查看是精确查询判断</span>
            </p>
          </el-col>
        </el-row>
        <el-row class="mb_20">
          <el-col>
            <p class="text_left mb_14">正文</p>
            <script id="editor" type="text/plain"></script>
          </el-col>
        </el-row>
        <el-row class="">
          <el-col>
            <p class="text_left mb_14">
              封面图片
              <span class="font_12 color_9">(建议尺寸：720像素*400像素)</span>
            </p>
          </el-col>
        </el-row>
        <el-row class="">
          <el-col :span="8">
            <el-input class="mb_14" v-model="formData['thumb_media_id']"></el-input>
          </el-col>
          <el-col :span="8">
            <el-upload
              class="upload-demo"
              ref="upload"
              :action="baseuploadurl() + 'Admin/addImg'"
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
        <el-row class="mb_20">
          <el-col class="text_left">
            <img class="previewUrl" :src="formData['thumb_media_id']" alt="">
          </el-col>
        </el-row>
        <el-row class="mb_20">
          <el-col>
            <div class="text_left">
              <el-button @click="uploadlist">从正文选择</el-button>
              <el-button @click="dialog2">从图片库选择</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row class="mb_20">
          <el-col>
            <el-button type="primary" v-on:click="save">保存</el-button>
            <el-button >取消</el-button>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <el-dialog title="正文选择图片" :visible.sync="dialogUploadVisible1">
      <el-radio-group v-model="radio1">
        <el-row :gutter="20">
          <el-col :span="6"  v-for="(item, index) in dialogImgList1" v-bind:key="index" class="mb_14">
            <img :src="item" alt="" class="imguploaditem mb_14">
            <el-radio name="imgcheckbox" :label="index"></el-radio>
          </el-col>
        </el-row>
      </el-radio-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUploadVisible1 = false">取消</el-button>
        <el-button type="primary" @click="submitImg1">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="图片库选择图片" :visible.sync="dialogUploadVisible2">
      <el-radio-group v-model="radio2" style="width: 100%;">
        <el-row :gutter="20">
          <el-col :span="6"  v-for="(item, index) in dialogImgList2" v-bind:key="index" class="mb_14">
            <img :src="imgBaseUrl2 + item['img']" alt="" class="imguploaditem mb_14">
            <el-radio name="imgcheckbox" :label="index"></el-radio>
          </el-col>
        </el-row>
      </el-radio-group>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="current"
          :page-size="limit"
          layout="prev, pager, next, jumper"
          :total="count">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUploadVisible2 = false">取消</el-button>
        <el-button type="primary" @click="submitImg2">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import headerTop from '../components/header'
import wangeditor from '../components/wangeditor'
import api from '../api/index'
import { imgBaseUrl, imgBaseUrl2, baseuploadurl, getId } from '../config/index'
require('../../static/ueditor/ueditor.config')
require('../../static/ueditor/ueditor.all.min')

export default {
  name: 'newArticleMaterial',
  components: {
    headerTop,
    wangeditor
  },
  data () {
    return {
      activeName2: 'first',
      imgBaseUrl: imgBaseUrl,
      imgBaseUrl2: imgBaseUrl2,
      baseuploadurl: baseuploadurl,
      // 编辑器
      editor: null,
      editorContent: '',
      config: {
        // initialFrameWidth : 600,
        initialFrameHeight: 460,
        // focus时自动清空初始化时的内容
        // autoClearinitialContent: true,
        // 关闭字数统计
        wordCount: false
        // ,
        // 允许的最大字符数
        // maximumWords:1000000,
        // 关闭elementPath
        // elementPathEnabled: false
        // allowDivTransToP: false,
        // scaleEnabled: false,
        // autoHeightEnabled: false
      },
      catTypeArray1: [],
      catTypeArray2: [],
      value1: '',
      value2: '',
      storeDetail: {},
      aid: null,
      type: '',
      // 本地上传
      fileList: [],
      fileData: {id: getId()},
      uploadImgUrl: '',
      // 文章标题是否重复
      titleStatus: false,
      formData: {
        id: getId(),
        aid: '',
        title: '',
        type1: '',
        type2: '',
        sort: 1,
        content: '',
        // show_cover_pic: 0,
        thumb_media_id: ''
        // digest: '',
        // comment: '',
        // need_open_comment: 0,
        // content_source_url: ''
      },
      // 图片库选择数据
      dialogImgList1: [],
      dialogUploadVisible1: false,
      // 正文选择数据
      dialogImgList2: [],
      dialogUploadVisible2: false,
      // 正文和图片库被选中值
      radio1: '',
      radio2: '',
      // 图片库选择分页,
      count: 0,
      current: 1,
      limit: 8,
      id: getId()
    }
  },
  mounted () {
    let that = this
    that.aid = that.$route.query.aid
    that.type = that.$route.query.type
    UE.delEditor('editor')
    that.editor = UE.getEditor('editor', that.config) // 初始化UE
    // that.editor.render('editor')
    that.editor.addListener('ready', function () {
      that.getCatType1()
      if (that.type === 'new') { }
      if (that.type === 'editor') {
        that.articleEdit()
      }
    })
  },
  methods: {
    cardclick: function (e) {
      let that = this
      e.path.forEach(function (val) {
        if (val.className === 'wwei-editor') {
          that.editor.execCommand('insertHtml', val.outerHTML + '<p><br/></p>')
        }
      })
    },
    handleClick (tab, event) {
      console.log(tab, event)
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
    // 编辑
    articleEdit (val) {
      let that = this
      api.articleEdit({id: that.id, aid: that.aid}).then((res) => {
        if (res.errcode === 0) {
          this.getCatType2(res.data.list.type1)
          that.formData.id = res.data.list.wxid
          that.formData.aid = res.data.list.id
          that.formData.title = res.data.list.title
          that.formData.content = res.data.list.content
          that.formData.sort = res.data.list.sort
          that.formData.type1 = res.data.list.type1
          that.formData.type2 = res.data.list.type2
          that.formData.img = res.data.list.img
          that.formData['thumb_media_id'] = res.data.list.img
          that.editor.setContent(res.data.list.content)
          that.uploadImgUrl = that.formData.img
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
      if (res.errcode === 0) {
        this.uploadImgUrl = file.url
        this.formData['thumb_media_id'] = res.data.burl
        this.$message({
          message: '上传成功！',
          type: 'success'
        })
      } else {
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
    },
    // 标题是否重复
    titleChange (val) {
      let that = this
      if (val === '') {
        that.$message({
          type: 'error',
          message: '标题不能为空'
        })
        return
      }
      api.getCheckTitle({id: that.id, title: val}).then((res) => {
        if (res.errcode === 0) {
          that.titleStatus = 0
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
        if (res.errcode === 4) {
          that.titleStatus = 1
        }
      }).catch(() => {
        console.log('error')
      })
    },
    // 正文选择图片
    uploadlist () {
      let that = this
      api.getContentImg({id: that.id, content: that.editor.getContent()}).then((res) => {
        if (res.errcode === 0 && res.data.length > 0) {
          that.dialogUploadVisible1 = true
          that.dialogImgList1 = res.data
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
        if (res.errcode === 4) {
          that.$message({
            type: 'error',
            message: res.message
          })
        }
      }).catch(() => {
        console.log('error')
      })
    },
    // 正文选择图片提交
    submitImg1 () {
      let that = this
      that.dialogUploadVisible1 = false
      that.formData['thumb_media_id'] = that.dialogImgList1[that.radio1]
      that.$message({
        type: 'success',
        message: '上传成功'
      })
      // api.uploadimgWechat({id: that.id, file: that.dialogImgList1[that.radio1].replace('http://bj.lawbang.com/', '')}).then((res) => {
      //   if (res.errcode === 0) {
      //     that.formData['thumb_media_id'] = res.data['media_id']
      //     that.radio1 = ''
      //     that.$message({
      //       type: 'success',
      //       message: '上传成功'
      //     })
      //   } else {
      //     if (res.errcode === 3) {
      //       that.$router.push({
      //         name: 'login'
      //       })
      //       that.$message({
      //         type: 'error',
      //         message: '登录超时，重新登录'
      //       })
      //     } else {
      //       that.$message({
      //         type: 'error',
      //         message: '上传失败'
      //       })
      //     }
      //   }
      // })
    },
    // 从图片库选择图片点击
    dialog2 () {
      let that = this
      that.metalist({id: that.id, p: this.current})
    },
    // 图片库选择
    metalist () {
      let that = this
      api.metalist({id: that.id, p: this.current}).then((res) => {
        if (res.errcode === 0) {
          that.dialogImgList2 = res.data.list
          that.count = Number(res.data.info.count)
          if (res.data.list.length > 0) {
            that.dialogUploadVisible2 = true
          } else {
            that.$message({
              type: 'error',
              message: '暂无图片'
            })
          }
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
    // 图片库分页
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      let that = this
      this.current = val
      this.metalist({id: that.id, p: this.current})
    },
    // 图片库选择图片提交
    submitImg2 () {
      this.formData['thumb_media_id'] = this.imgBaseUrl2 + this.dialogImgList2[this.radio2]['img']
      this.radio2 = ''
      this.dialogUploadVisible2 = false
    },
    save () {
      let that = this
      that.formData.content = that.editor.getContent()
      that.formData.img = that.formData['thumb_media_id']
      if (that.type === 'new') {
        api.articleAdd(that.formData).then((res) => {
          if (res.errcode === 0) {
            that.$router.push({
              name: 'articleManage'
            })
            that.$message({
              type: 'success',
              message: '添加成功'
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
      if (that.type === 'editor') {
        api.articleEditpost(that.formData).then((res) => {
          if (res.errcode === 0) {
            that.$router.push({
              name: 'articleManage'
            })
            that.$message({
              type: 'success',
              message: '修改成功'
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
}
</script>

<style scoped>
  .imguploaditem{
    display: block;
    width: 100%;
    height: 200px;
  }
  .previewUrl{
    width: 300px;
    height: 300px;
  }
  .template-list{
    height: 500px;
    overflow-y: auto;
  }
</style>
