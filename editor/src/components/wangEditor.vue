<template>
  <div id="editorElem"></div>
</template>

<script>
import E from 'wangeditor'

export default {
  name: 'editor',
  props: ['content'],
  data () {
    return {
      editor: null,
      editorContent: ''
    }
  },
  watch: {
    content (newVal) {
      this.editor.txt.html(newVal)
    }
  },
  mounted () {
    let that = this
    that.editor = new E('#editorElem')
    that.editor.customConfig.onblur = function (html) {
      // html 即编辑器中的内容
      console.log('onblur', html)
    }
    that.editor.create()
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
