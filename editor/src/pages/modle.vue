<template>
  <div>
     <el-container>
       <el-main>
         <el-row class="mb_20">
           <el-col class="text_left">
             <el-button type="primary"  @click="openmodleeditor">添加</el-button>
           </el-col>
         </el-row>
         <el-table
           border
           :data="tableData"
           style="width: 100%">
           <el-table-column
             prop="date"
             label="设置名称"
             width="180">
             <template slot-scope="scope">
               <div v-show="scope.row['tpl_type']==1">关注引导模板</div>
               <div v-show="scope.row['tpl_type']==2">签名模板</div>
               <div v-show="scope.row['tpl_type']==3">文章摘要</div>
               <div v-show="scope.row['tpl_type']==4">原文链接设置</div>
             </template>
           </el-table-column>
           <el-table-column
             prop="time"
             label="设置时间"
             width="180">
           </el-table-column>
           <el-table-column
             prop="address"
             label="管理">
             <template slot-scope="scope">
               <el-button type="text" size="small" @click="openmodleeditor(scope.row['tpl_type'], scope.row.id)">编辑</el-button>
             </template>
           </el-table-column>
         </el-table>
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
      tableData: [
        {
          "tpl_type": "1",
          "content": "<p>eeeeeeeeeeee</p>",
          "wxurl": "dddddddddddddddddddddddddd",
          "id": "4",
          "time": "2017-05-20 14:26:28",
          "uid": "1943",
          "wxid": "13233"
        },
        {
          "tpl_type": "2",
          "content": "<p>gggggggggggggggggggg</p>",
          "wxurl": "dddddddddddddddddddd",
          "id": "5",
          "time": "2017-05-20 14:26:37",
          "uid": "1943",
          "wxid": "13233"
        },
        {
          "tpl_type": "3",
          "content": "<p>test3<br/></p>",
          "wxurl": "ggggggggggggggggggggg",
          "id": "6",
          "time": "2017-05-20 14:26:51",
          "uid": "1943",
          "wxid": "13233"
        },
        {
          "tpl_type": "4",
          "content": "",
          "wxurl": "dddddgggggggggggggggg",
          "id": "7",
          "time": "2017-05-20 14:27:01",
          "uid": "1943",
          "wxid": "13233"
        }
      ],
      id: getId(),
    }
  },
  mounted () {
    // this.getcommonlylist()
  },
  methods: {
    getcommonlylist () {
      let that = this
      api.getcommonlylist({id: that.id}).then((res) => {
        if (res.errcode === 0) {
          that.tableData = res.data
          console.log(JSON.stringify(that.tableData))
        }
      }).catch(() => {
        console.log('error')
      })
    },
    openmodleeditor (tpltype, id) {
      if(tpltype && id){
        this.$router.push({
          name: 'modleeditor',
          query: {
            'tpl_type': tpltype,
            wncid: id
          }
        })
      } else {
        this.$router.push({
          name: 'modleeditor'
        })
      }

    }
  }
}
</script>

<style scoped>

</style>
