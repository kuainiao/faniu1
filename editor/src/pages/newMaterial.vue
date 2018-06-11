<template>
  <div class="height_100">
    <el-row type="flex" class="height_100">
      <el-col :span="4" class="height_100" style="overflow: auto;">
        <div class="p_20">
          <div class="color-list">
            <ul class="list">
              <li class="item mb_20" v-bind:class="{itemactive: indexed === index}" v-for="(item,index) in articleArray"
                  v-bind:key="index" v-dragging="{item: item, list: articleArray}" v-on:click="AMClick(index)">
                <!--<img :src="item['thumb_url']" v-show="!!item['thumb_media_id']">-->
                <!--<img :src="imgBaseUrl2 +'?id='+ id + '&url=' + item['thumb_url']" v-show="!!item['thumb_media_id']">-->
                <img :src="imgBaseUrl + id + '/media_id/'+item['thumb_media_id']" >
                <p class="item_title text_left line_h30 h_30 p_lr_10 font_14">{{item.title}}</p>
                <div class="up_and_down">
                  <i class="el-icon-caret-bottom" v-on:click.stop="movedown(index,item)"
                     v-if="index<articleArray.length-1"></i>
                  <i class="el-icon-caret-top" v-on:click.stop="moveup(index,item)" v-if="index>0"></i>
                  <i class="el-icon-delete" v-on:click.stop="del(index)" v-if="index>0"></i>
                </div>
              </li>
            </ul>
            <div class="mb_20">
              <el-button type="primary" plain v-on:click="newAMM" v-show="type!=='editor'">新建图文</el-button>
            </div>
            <div class="mb_20">
              <el-button type="primary" plain v-on:click="openChooseArticle" v-show="type!=='editor'">从素材库中选择
              </el-button>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="16" class="height_100" style="overflow: auto;border-left: 1px solid #ccc;border-right: 1px solid #ccc;">
        <div class="p_20">
          <el-row class="mb_20">
            <el-col>
              <p class="text_left mb_14">标题</p>
              <el-input placeholder="请输入内容" class="mb_14" v-model="articleObj.title" v-on:change="titleChange(articleObj.title)" :maxlength="64"></el-input>
              <p class="text_left mb_14" v-show="titleStatus===1">
                <span class="font_14 color_red mr_100">该标题已存在，请重新编辑</span>
                <span class="font_14 color_blue">备注：该标题查重是精确查询判断</span>
              </p>
            </el-col>
          </el-row>
          <el-row class="mb_20">
            <el-col>
              <p class="text_left mb_14">作者（选填）</p>
              <el-input placeholder="请输入内容" class="mb_14" v-model="articleObj.author"></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <p class="text_left mb_14">正文
                <!--<el-button type="text">返回底部</el-button>-->
              </p>
            </el-col>
          </el-row>
          <el-row class="mb_20">
            <el-col>
              <div>
                <script id="editor" type="text/plain"></script>
                <!--<UE ref="ue"></UE>-->
                <!--<wangeditor v-bind:content="articleObj.content" style="width: 100%;min-height: 300px;margin-bottom: 30px;text-align: left;"></wangeditor>-->
                <!--<div id="editorElem" style="width: 100%;min-height: 300px;margin-bottom: 30px;text-align: left;"></div>-->
              </div>
            </el-col>
          </el-row>
          <el-row class="">
            <el-col>
              <p class="text_left mb_14">
                封面图片
                <span class="font_12 color_9 mr_100">(建议尺寸：720像素*400像素)</span>
                <span>是否显示</span>
                <el-radio-group v-model="articleObj['show_cover_pic']">
                  <el-radio :label="1">显示</el-radio>
                  <el-radio :label="0">不显示</el-radio>
                </el-radio-group>
              </p>
            </el-col>
          </el-row>
          <el-row class="mb_20 text_left" :gutter="20">
            <el-col :span="10">
              <el-input v-show="!!articleObj['thumb_media_id']" v-model="articleObj['thumb_media_id']"></el-input>
              <el-input v-show="!articleObj['thumb_media_id']" v-model="articleObj['img']"></el-input>
            </el-col>
            <el-col :span="14">
              <el-upload
                class="upload-demo"
                ref="upload"
                :action="baseuploadurl() + 'Api/addImg'"
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
          <el-row class="mb_20" v-show="articleObj['show_cover_pic']===1">
            <el-col class="text_left">
              <img class="previewUrl" :src="imgBaseUrl + id + '/media_id/' + articleObj['thumb_media_id']" alt="">
            </el-col>
          </el-row>
          <el-row class="mb_20">
            <el-col>
              <div class="text_left">
                <el-button @click="uploadlist">从正文选择</el-button>
                <el-button @click="dialogUploadVisible2 = true">从图片库选择</el-button>
              </div>
            </el-col>
          </el-row>
          <el-row class="mb_20">
            <el-col>
              <p class="text_left mb_14">摘要（选填）</p>
              <el-input type="textarea" v-model="articleObj.digest"></el-input>
            </el-col>
          </el-row>
          <el-row class="mb_20">
            <el-col>
              <p class="text_left mb_14">原文链接（选填）</p>
              <el-input placeholder="请输入内容" class="mb_14" v-model="articleObj['content_source_url']"></el-input>
              <p class="text_left mb_14">
                <span class="mr_100">是否开启微信留言</span>
                <el-radio-group v-model="articleObj['need_open_comment']">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
              </p>
            </el-col>
          </el-row>
          <el-row class="mb_20">
            <el-col>
              <!--<el-button type="text">返回顶部</el-button>-->
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="4" class="height_100">
        <div class="p_20 btns">
          <div class="mb_20">
            <el-button @click="fetchClick">采集数据</el-button>
          </div>
          <div class="mb_20">
            <el-button v-on:click="getTemp(1)">关注引导模板</el-button>
          </div>
          <div class="mb_20">
            <el-button v-on:click="getTemp(2)">签名模板</el-button>
          </div>
          <div class="mb_20">
            <el-button type="primary" v-on:click="saveForm">保存</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogFormVisible">
      <el-form :model="fetchForm" ref="fetchForm" class="demo-ruleForm">
        <el-form-item prop="url" :rules="fetchRules.url">
          <el-input type="text" v-model="fetchForm.url" auto-complete="off" placeholder="采集链接不能为空"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchSubmit('fetchForm')">提交</el-button>
          <el-button @click="resetFetch('fetchForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="正文选择图片" :visible.sync="dialogUploadVisible1">
      <el-radio-group v-model="radio1">
        <el-row :gutter="20">
          <el-col :span="6" v-for="(item, index) in dialogImgList1" v-bind:key="index" class="mb_14">
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
      <el-radio-group v-model="radio2">
        <el-row :gutter="20">
          <el-col :span="6" v-for="(item, index) in dialogImgList2" v-bind:key="index" class="mb_14">
            <img :src="imgBaseUrl + id + '/media_id/' + item['media_id']" alt="" class="imguploaditem mb_14">
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
  import api from '../api/index'
  import {
    imgBaseUrl,
    imgBaseUrl2,
    setsessionStorage,
    getsessionStorage,
    removesessionStorage,
    baseuploadurl,
    getId,
  } from '../config/index'

  require('../../static/ueditor/ueditor.config')
  require('../../static/ueditor/ueditor.all.min')

  export default {
    name: 'newMaterial',
    components: {
      // wangeditor
      // ,
      // UE
    },
    data() {
      return {
        activeName2: 'first',
        // 编辑器
        editor: null,
        editorContent: '',
        config: {
          // initialFrameWidth : 600,
          initialFrameHeight: 460,
          // focus时自动清空初始化时的内容
          // autoClearinitialContent: true,
          // 关闭字数统计
          wordCount: false,
          // 允许的最大字符数
          // maximumWords:1000000,
          // 关闭elementPath
          // elementPathEnabled: false
          // allowDivTransToP: false,
          // scaleEnabled: false,
          // autoHeightEnabled: false
        },
        // editor: null,
        // editorContent: '',
        // defaultMsg: '测试ue',
        // 本地上传
        fileList: [],
        fileData: {id: getId()},
        uploadImgUrl: '',
        // 图片库选择数据
        dialogImgList1: [],
        dialogUploadVisible1: false,
        // 正文选择数据
        dialogImgList2: [],
        dialogUploadVisible2: false,
        // 图片库选择分页,
        count: 0,
        current: 1,
        limit: 8,
        // 正文和图片库被选中值
        radio1: '',
        radio2: '',
        imgBaseUrl: imgBaseUrl,
        imgBaseUrl2: imgBaseUrl2,
        baseuploadurl: baseuploadurl,
        // 第几篇文章的index
        indexed: 0,
        articleArray: [],
        articleObj: {},
        // 文章标题是否重复
        titleStatus: false,
        // 文章采集
        dialogFormVisible: false,
        fetchForm: {
          id: getId(),
          url: ''
        },
        fetchRules: {
          url: [{required: true, message: '采集链接不能为空'}]
        },
        id: getId(),
        type: '',
        mediaid: ''
      }
    },
    mounted() {
      let that = this
      that.type = that.$route.query.type
      that.mediaid = that.$route.query.mediaid
      that.source = that.$route.query.source
      UE.delEditor('editor')
      that.editor = UE.getEditor('editor', that.config) // 初始化UE
      // that.editor.render('editor')
      that.editor.addListener('ready', function () {
        //if (that.type === 'new') {
           that.newAM()
        //}
        if (that.type === 'copy' || that.type === 'editor') {
          that.editnews()
        }
        that.metalist({id: that.id, p: this.current})
      })
      that.editor.addListener('blur', function (editor) {
        that.articleObj.content = that.editor.getContent()
        if (that.articleObj.digest === '') {
          that.articleObj.digest = that.editor.getContentTxt().slice(0, 55)
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
      // 图文上下移动
      movedown(index, item) {
        this.articleArray.splice(index, 1)
        this.articleArray.splice(index + 1, 0, item)
      },
      moveup(index, item) {
        this.articleArray.splice(index, 1)
        this.articleArray.splice(index - 1, 0, item)
      },
      del(index) {
        this.indexed = 0
        this.articleObj = this.articleArray[this.indexed]
        this.editor.setContent(this.articleObj.content)
        this.articleArray.splice(index, 1)
      },
      // 新建图文
      newAM() {
        let that = this
        if (getsessionStorage('articleArray')) {
          let articleArray = JSON.parse(getsessionStorage('articleArray'))
          that.articleArray = that.articleArray.concat(articleArray)
          removesessionStorage('articleArray')
        } /*else {
          that.articleArray.push({
            title: '文章标题',
            author: '',
            content: '',
            show_cover_pic: 0,
            thumb_media_id: '',
            digest: '',
            comment: '',
            need_open_comment: 0,
            content_source_url: ''
          })
        }*/
        if(this.articleArray.length > 0){
          this.indexed = this.articleArray.length - 1
          this.articleObj = this.articleArray[this.indexed]
          that.editor.setContent(that.articleObj.content)
          if (!this.articleObj.digest) {
            this.articleObj.digest = that.editor.getContentTxt().slice(0, 55)
          }
        }
      },
      // 新建图文点击
      newAMM () {
        let that = this
        that.articleArray.push({
          title: '文章标题',
          author: '',
          content: '',
          show_cover_pic: 0,
          thumb_media_id: '',
          digest: '',
          comment: '',
          need_open_comment: 0,
          content_source_url: ''
        })
        if(this.articleArray.length > 0){
          this.indexed = this.articleArray.length - 1
          this.articleObj = this.articleArray[this.indexed]
          that.editor.setContent(that.articleObj.content)
          if (!this.articleObj.digest) {
            this.articleObj.digest = that.editor.getContentTxt().slice(0, 55)
          }
        }
      },
      // 图文点击
      AMClick(index) {
        let that = this
        that.indexed = index
        that.articleObj = that.articleArray[that.indexed]
        that.editor.setContent(that.articleObj.content)
        if (!this.articleObj.digest) {
          this.articleObj.digest = that.editor.getContentTxt().slice(0, 55)
        }
      },
      // 打开从素材库中选择
      openChooseArticle() {
        setsessionStorage('articleArray', JSON.stringify(this.articleArray))
        this.$router.push({
          name: 'chooseArticle',
          query: {
            type: this.type
          }
        })
      },
      // 关注、引导、默认链接、摘要获取数据
      getTemp(type) {
        let that = this
        // that.newAM()
        api.getTemp({id: that.id}).then((res) => {
          if (res.errcode === 0) {
            if (type === 1) {
              that.articleObj.content = res.data.content1
              that.editor.setContent(that.articleObj.content)
            }
            if (type === 2) {
              that.articleObj.content = res.data.content2
              that.editor.setContent(that.articleObj.content)
            }
            that.articleObj['content_source_url'] = res.data.wxurl
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
      // 文章采集
      fetchClick() {
        let that = this
        if (that.articleArray.length > 0) {
          that.dialogFormVisible = true
          that.fetchForm.url = ''
        } else {
          that.$message({
            type: 'success',
            message: '新建图文再操作'
          })
        }
      },
      fetchSubmit(fetchForm) {
        let that = this
        that.$message({
          type: 'success',
          message: '提交中...'
        })
        that.$refs[fetchForm].validate((valid) => {
          if (valid) {
            api.fetch(that.fetchForm).then((res) => {
              if (res.errcode === 0) {
                that.$message({
                  type: 'success',
                  message: '采集链接提交成功！'
                })
                that.dialogFormVisible = false
                //that.indexed = that.articleArray.length - 1
                that.articleArray[that.indexed] = res.data
                that.articleObj = that.articleArray[this.indexed]
                that.editor.setContent(that.articleObj.content)
                if (!this.articleObj.digest) {
                  this.articleObj.digest = that.editor.getContentTxt().slice(0, 55)
                }
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
                  this.$message({
                    type: 'error',
                    message: res.message
                  })
                }
              }
            }).catch(() => {
              this.$message({
                type: 'error',
                message: '采集链接提交失败！'
              })
            })
          } else {
            this.$message({
              type: 'error',
              message: '采集链接不能为空！'
            })
            return false
          }
        })
      },
      resetFetch(formName) {
        this.$refs[formName].resetFields()
      },
      // 修改数据请求
      editnews() {
        let that = this
        let mediaid = that.$route.query.mediaid
        api.editnews({id: that.id, media_id: mediaid}).then((res) => {
          if (res.errcode === 0) {
            that.articleArray = that.articleArray.concat(res.data.list)
            if (getsessionStorage('articleArray')) {
              let articleArray = JSON.parse(getsessionStorage('articleArray'))
              that.articleArray = articleArray.concat(that.articleArray)
              removesessionStorage('articleArray')
            }
            that.indexed = 0
            that.articleObj = that.articleArray[that.indexed]
            that.editor.setContent(that.articleObj.content)
            if (!this.articleObj.digest) {
              this.articleObj.digest = that.editor.getContentTxt().slice(0, 55)
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
        })
      },
      // 本地上传图片
      uploadImg() {
        this.$refs.upload.submit()
      },
      // 本地上传图片预览
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      // 预览本地上传图片
      handlePreview(file) {
        // this.uploadImgUrl = file.url
      },
      handleSuccess(res, file, fileList) {
        if (res.errcode === 0) {
          this.uploadImgUrl = file.url
          this.articleArray[this.indexed]['thumb_media_id'] = res.data['thumb_media_id']
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
      // 正文选择图片
      uploadlist() {
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
      submitImg1() {
        let that = this
        that.dialogUploadVisible1 = false
        api.uploadimgWechat({
          id: that.id,
          file: that.dialogImgList1[that.radio1].replace('http://bj.lawbang.com/', '')
        }).then((res) => {
          if (res.errcode === 0) {
            that.articleArray[that.indexed]['thumb_media_id'] = res.data['media_id']
            that.radio1 = ''
            that.$message({
              type: 'success',
              message: '上传成功'
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
          if (res.errcode === 4) {
            that.$message({
              type: 'error',
              message: '上传失败'
            })
          }
        })
      },
      // 图片库选择
      metalist() {
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
      // 图片库分页
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`)
      },
      handleCurrentChange(val) {
        this.current = val
        this.metalist({id: id, p: this.current})
      },
      // 图片库选择changeg事件
      // 图片库选择图片提交
      submitImg2() {
        this.articleArray[this.indexed]['thumb_media_id'] = this.dialogImgList2[this.radio2]['media_id']
        this.radio2 = ''
        this.dialogUploadVisible2 = false
      },
      // 标题是否重复
      titleChange(val) {
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
      // 保存
      saveForm() {
        let that = this
        that.$message({
          type: 'success',
          message: '提交中...'
        })
        for (let i = 0; i < that.articleArray.length; i++) {
          //if (!!that.articleArray[i]['img']) {
            //that.articleArray[i]['thumb_media_id'] = that.articleArray[i]['img']
          //}
          if (that.articleArray[i].title === '') {
            that.$message({
              type: 'error',
              message: '第' + (i + 1) + '篇文章的标题不能为空'
            })
            return
          }
          if (that.articleArray[i].content === '') {
            that.$message({
              type: 'error',
              message: '第' + (i + 1) + '篇文章的正文内容不能为空'
            })
            return
          }
          if (that.articleArray[i]['thumb_media_id'] === '') {
            that.$message({
              type: 'error',
              message: '第' + (i + 1) + '篇文章的封面必传'
            })
            return
          }
          if (that.articleArray[i]['digest'] === '') {
            that.$message({
              type: 'error',
              message: '第' + (i + 1) + '篇文章的摘要不能为空'
            })
            return
          }
          if (!that.articleArray[i]['content_source_url']) {
            that.$message({
              type: 'error',
              message: '第' + (i + 1) + '篇文章的原文链接不能为空'
            })
            return
          }
        }
        if (that.type === 'editor') {
          api.addnewsSubmit({
            menu: JSON.stringify(this.articleArray),
            id: that.id,
            media_id: that.mediaid
          }).then((res) => {
            if (res.errcode === 0) {
              that.$message({
                type: 'success',
                message: '保存成功'
              })
              that.$router.push({
                name: 'materialList'
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
            if (res.errcode === 4) {
              that.$message({
                type: 'error',
                message: '保存失败'
              })
            }
          }).catch(() => {
            console.log('error')
          })
        }
        if (that.type === 'new' || that.type === 'copy') {
          api.addnews({menu: JSON.stringify(that.articleArray), id: that.id}).then((res) => {
            if (res.errcode === 0) {
              that.$message({
                type: 'success',
                message: '保存成功'
              })
              that.$router.push({
                name: 'materialList'
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
            if (res.errcode === 4) {
              that.$message({
                type: 'error',
                message: '保存失败'
              })
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
  .item.itemactive {
    border: 2px solid #00a0e9;
  }

  .el-button {
    width: 150px;
  }

  .list {

  }

  .item {
    border: 1px solid #000;
  }

  .item_title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .item img {
    display: block;
    width: 100%;
    height: 140px;
    background-color: #ccc;
  }

  .imguploaditem {
    display: block;
    width: 100%;
    height: 200px;
  }

  .previewUrl {
    width: 300px;
    height: 300px;
  }

  .el-icon-delete {
    margin-left: 30px;
  }
  .template-list{
    height: 500px;
    overflow-y: auto;
  }
  .btns{
    position: fixed;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    z-index: 10;
  }
</style>
