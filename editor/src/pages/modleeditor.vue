<template>
  <div>
    <el-container>
      <el-main>
        <el-form :modle="form" label-width="120px">
          <el-form-item label="设置类型：">
            <el-select v-model="form['tpl_type']" v-on:change="selectChange(form['tpl_type'])" placeholder="请选择" class="w_100">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设置内容：" v-show="form['tpl_type']==1 || form['tpl_type']==2">
            <div>
              <script id="editor" type="text/plain"></script>
            </div>
          </el-form-item>
          <el-form-item label="原文链接：">
            <el-input type="text" v-model="form.wxurl"></el-input>
          </el-form-item>
          <el-form-item label="文章摘要：">
            <el-input type="textarea" v-model="form.digest"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确认提交</el-button>
          </el-form-item>
        </el-form>
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
        allowDivTransToP: false,
        scaleEnabled: false,
        autoHeightEnabled: false
      },
      options: [{
        value: '1',
        label: '关注引导模板'
      }, {
        value: '2',
        label: '签名模板'
      }, {
        value: '3',
        label: '文章摘要'
      }, {
        value: '4',
        label: '原文链接设置'
      }],
      value: '',
      form: {
        id: getId(),
        wncid: '',
        'tpl_type': '',
        wxurl: '',
        content: '',
        digest: ''
      },
      id: getId()
    }
  },
  mounted () {
    let that = this
    that.form.wncid = that.$route.query.wncid
    that.form['tpl_type'] = that.$route.query['tpl_type']
    UE.delEditor('editor')
    that.editor = UE.getEditor('editor', that.config) // 初始化UE
    // that.editor.render('editor')
    that.editor.addListener('ready', function () {
      if (that.form.wncid && that.id) {
        that.getData()
      }
    })
    that.editor.addListener('blur', function (editor) {

    })

  },
  methods: {
    selectChange (tpltype) {
      let that = this
      that.form['tpl_type'] = tpltype
    },
    getData () {
      let that = this
      api.getcommonlytemplate({id: that.id, wncid: that.form.wncid}).then((res) => {
        if (res.errcode === 0) {
          that.form.content = res.data.content
          that.form.digest = res.data.digest
          that.form.wxurl = res.data.wxurl
          that.editor.setContent(that.form.content)
        }
      }).catch(() => {
        console.log('error')
      })
    },
    onSubmit () {
      let that = this
      if (that.form['tpl_type'] == 1 || that.form['tpl_type'] == 2) {
        that.form.content = that.editor.getContent()
        if (that.form.content == '') {
          that.$message({
            type: 'error',
            message: '设置内容不能为空！'
          })
          return
        }
      }
      if (that.form.wxurl == '') {
        that.$message({
          type: 'error',
          message: '原文链接不能为空！'
        })
        return
      }
      if (that.form.digest == '') {
        that.$message({
          type: 'error',
          message: '文章摘要不能为空！'
        })
        return
      }
      api.postcommonlytemplate(that.form).then((res) => {
        if (res.errcode===0) {
          that.$router.push({
            name: 'modle'
          })
          that.$message({
            type: 'success',
            message: res.message
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
