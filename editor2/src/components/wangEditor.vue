<template>
  <div id="editorElem"></div>
</template>

<script>
import E from 'wangeditor'

export default {
  name: 'editor',
  // props: ['id'],
  data () {
    return {
      editorContent: ''
    }
  },
  mounted () {
    this.$nextTick(function () {
      var editor = new E('#editorElem')
      editor.create()
    })
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
