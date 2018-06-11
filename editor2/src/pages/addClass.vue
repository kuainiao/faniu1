<template>
  <div>
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="12" :offset="5">
            <el-form label-width="100px">
              <el-form-item label="所属类别" class="text_left">
                <el-select v-model="form.type" placeholder="选择分类级别" style="width: 60%;" v-on:change="typeChange(form.type)">
                  <el-option v-for="item in catTypeArr" :key="item.pid" :label="item.name" :value="item.pid">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="上级分类" class="text_left">
                <el-select v-model="form.pid" placeholder="" style="width: 60%;">
                <el-option v-for="item in catTypeArray" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="分类名称" class="text_left">
                <el-input v-model="form.name" style="width: 90%;"></el-input>
              </el-form-item>
              <el-form-item label="同步百科分类" class="text_left">
                <el-select placeholder="一级分类" style="width: 45%;" v-model="form.baike1" v-on:change="categorysChange1(form.baike1)">
                  <el-option  v-for="item in categorysArray1" :key="item.term_id" :label="item.name" :value="item.term_id"></el-option>
                </el-select>
                <el-select placeholder="二级分类" style="width: 45%;" v-model="form.baike2" >
                  <el-option  v-for="item in categorysArray2" :key="item.term_id" :label="item.name" :value="item.term_id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="margin-top: 100px;">
                <el-button type="primary" @click="onSubmit">保存</el-button>
                <el-button>取消</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import api from '../api/index'
import headerTop from '../components/header'
import { getId } from '../config/index'

export default {
  components: {
    headerTop
  },
  data () {
    return {
      id: getId(),
      catTypeArr: [{
        pid: '0',
        name: '一级分类'
      }, {
        pid: '1',
        name: '二级分类'
      }],
      catTypeArray: [],
      catTypeArray1: [{
        id: '0',
        name: '无',
        pid: '0'
      }],
      catTypeArray2: [],
      form: {
        id: getId(),
        pid: '',
        name: '',
        type: '',
        sort: 1,
        baike1: '',
        baike2: ''
      },
      type: '',
      catid: null,
      // 百科分类
      categorysArray1: [],
      categorysArray2: []
    }
  },
  mounted () {
    let that = this
    that.type = this.$route.query.type
    that.catid = this.$route.query.catid
    that.categorys1()
    that.getCatType1().then((res) => {
      if (res) {
        if (that.type === 'new') {}
        if (that.type === 'editor') {
          that.editcat()
        }
      }
    })
  },
  methods: {
    // 选择级别：一级或二级
    typeChange (type) {
      let that = this
      if (type === '0') {
        that.catTypeArray = that.catTypeArray1
      }
      if (type === '1') {
        that.form.pid = ''
        that.catTypeArray = that.catTypeArray2
      }
    },
    // 请求一级分类
    getCatType1 () {
      let that = this
      return new Promise((resolve, reject) => {
        api.getCatType({id: that.id, grade: 0}).then((res) => {
          if (res.errcode === 0) {
            that.catTypeArray2 = res.data.list
            resolve(res.data.list)
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
      })
    },
    // 获取百科一级分类
    categorys1 () {
      let that = this
      api.categorys({id: that.id, child: 0}).then((res) => {
        if (res.errcode === 0) {
          that.categorysArray1 = res.data
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
    // 百科一级分类change事件
    categorysChange1 (val) {
      this.categorys2(val)
    },
    // 获取百科二级分类
    categorys2 (termid) {
      let that = this
      api.categorys({id: that.id, child: termid}).then((res) => {
        if (res.errcode === 0) {
          that.categorysArray2 = res.data
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
    // 编辑数据获取
    editcat () {
      let that = this
      api.editcat({id: that.id, catid: that.catid}).then((res) => {
        if (res.errcode === 0) {
          that.form.id = res.data.list.wxid
          that.form.catid = res.data.list.id
          that.form.pid = res.data.list.pid
          that.form.name = res.data.list.name
          that.form.type = res.data.list.type
          that.form.sort = res.data.list.sort
          that.form.baike1 = res.data.list.baike1
          that.form.baike2 = res.data.list.baike2
          if (that.form.baike1 === '0') {
            that.form.baike1 = ''
          }
          if (that.form.baike2 === '0') {
            that.form.baike2 = ''
          }
          if (that.form.type === '0') {
            that.catTypeArray = that.catTypeArray1
          }
          if (that.form.type === '1') {
            that.catTypeArray = that.catTypeArray2
          }
          that.categorys2(that.form.baike1)
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
    // 表单提交
    onSubmit () {
      let that = this
      if (that.form.type === '') {
        that.$message({
          type: 'error',
          message: '所属类别不能为空'
        })
        return
      }
      if (that.form.catid === '') {
        that.$message({
          type: 'error',
          message: '上级分类不能为空'
        })
        return
      }
      if (that.form.name === '') {
        that.$message({
          type: 'error',
          message: '分类名称不能为空'
        })
        return
      }
      if (that.type === 'new') {
        api.addcat(that.form).then((res) => {
          if (res.errcode === 0) {
            that.$confirm('是否留在此页继续添加', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              that.form = {
                id: that.id,
                catid: '',
                name: '',
                type: '',
                sort: 1,
                baike1: '',
                baike2: ''
              }
              location.reload()
            }).catch(() => {
              that.$router.push({
                name: 'classManage'
              })
              that.$message({
                type: 'success',
                message: res.message
              })
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
        api.upcat(that.form).then((res) => {
          if (res.errcode === 0) {
            that.$router.push({
              name: 'classManage'
            })
            that.$message({
              type: 'success',
              message: res.message
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

</style>
