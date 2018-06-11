<template>
  <div>
    <script id="editor" type="text/plain"></script>
  </div>
</template>

<script>
require('../../static/ueditor/ueditor.config')
require('../../static/ueditor/ueditor.all.min')
// require('../../static/ueditor/lang/zh-cn/zh-cn')
// require('../../static/ueditor/ueditor.parse.min')

export default {
  data () {
    return {
      editor: null,
      editorContent: '',
      config: {
        // initialFrameWidth : 100%,
        initialFrameHeight: 260,
        // focus时自动清空初始化时的内容
        autoClearinitialContent: true,
        // 关闭字数统计
        wordCount: false,
        // 允许的最大字符数
        // maximumWords:1000000,
        // 关闭elementPath
        elementPathEnabled: false
      }
    }
  },
  // 此时--el挂载到实例上去了,可以初始化对应的编辑器了
  mounted () {
    // const _this = this
    this.editor = UE.getEditor('editor', this.config) // 初始化UE
  },
  methods: {
    getUEContent () {
      return this.editor.getContent()
    },
    setUEContent (value) {
      this.editor.setContent(value)
    }
  },
  destroyed () {
    this.editor.destroy()
  }
}
</script>

<style scoped>

</style>
