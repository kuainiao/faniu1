import axios from 'axios'
import Qs from 'qs'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'http://bj.lawbang.com/Wxmaterial/'
} else {
  axios.defaults.baseURL = 'api/Wxmaterial/'
}

function fetch (obj) {
  return new Promise((resolve, reject) => {
    if (!obj.params) {
      obj.params = {}
    }
    if (!obj.data) {
      obj.data = {}
    }
    if (obj.method === 'get') {
      axios.get(obj.url, {params: obj.params}).then(function (response) {
        resolve(response.data)
      }).catch(function (error) {
        reject(error)
      })
    } else {
      axios.post(obj.url, Qs.stringify(obj.data)).then(function (response) {
        resolve(response.data)
      }).catch(function (error) {
        reject(error)
      })
    }
  })
}

export default {
  // 登录
  login (data) {
    return fetch({
      method: 'post',
      url: 'Admin/login',
      data: data
    })
  },
  // 退出登录
  logout (data) {
    return fetch({
      method: 'get',
      url: 'Admin/logout'
    })
  },
  // 检测是否登陆
  checkLogin (params) {
    return fetch({
      method: 'get',
      url: 'Admin/checkLogin',
      params: params
    })
  },
  // 素材分类一二级分类信息获取
  getCatType (params) {
    return fetch({
      method: 'get',
      url: 'Admin/getCatType',
      params: params
    })
  },
  // 获取文章管理数据
  articleList (params) {
    return fetch({
      method: 'get',
      url: 'Admin/index',
      params: params
    })
  },
  // 素材库素材查看
  articleLook (params) {
    return fetch({
      method: 'get',
      url: 'Admin/edit',
      params: params
    })
  },
  // 素材库素材编辑
  articleEdit (params) {
    return fetch({
      method: 'get',
      url: 'Admin/edit',
      params: params
    })
  },
  // 素材库编辑修改提交
  articleEditpost (data) {
    return fetch({
      method: 'post',
      url: 'Admin/editpost',
      data: data
    })
  },
  // 素材库素材添加
  articleAdd (data) {
    return fetch({
      method: 'post',
      url: 'Admin/add',
      data: data
    })
  },
  // 素材库素材删除
  articleDel (params) {
    return fetch({
      method: 'get',
      url: 'Admin/del',
      params: params
    })
  },
  // 检测标题是否重复
  getCheckTitle (params) {
    return fetch({
      method: 'get',
      url: 'Api/getCheckTitle',
      params: params
    })
  },
  // 本地上传图片
  addImg (data) {
    return fetch({
      method: 'post',
      url: 'Admin/addImg',
      data: data
    })
  },
  // 上传微信图片
  uploadimgWechat (data) {
    return fetch({
      method: 'post',
      url: 'Api/uploadimg',
      data: data
    })
  },
  // 正文选择图片
  uploadlist (params) {
    return fetch({
      method: 'get',
      url: 'Admin/uploadlist',
      params: params
    })
  },
  // 图片库选择
  metalist (params) {
    return fetch({
      method: 'get',
      url: 'Admin/imglist',
      params: params
    })
  },
  // 素材库分类列表
  catlist (params) {
    return fetch({
      method: 'get',
      url: 'Admin/catlist',
      params: params
    })
  },
  // 素材分类删除
  delcat (params) {
    return fetch({
      method: 'get',
      url: 'Admin/delcat',
      params: params
    })
  },
  // 素材分类编辑
  editcat (params) {
    return fetch({
      method: 'get',
      url: 'Admin/editcat',
      params: params
    })
  },
  // 素材分类添加
  addcat (data) {
    return fetch({
      method: 'post',
      url: 'Admin/addcat',
      data: data
    })
  },
  // 素材分类编辑提交数据
  upcat (data) {
    return fetch({
      method: 'post',
      url: 'Admin/upcat',
      data: data
    })
  },
  // 获取百科分类
  categorys (params) {
    return fetch({
      method: 'get',
      url: 'Admin/categorys',
      params: params
    })
  },
  // 正文提交内容选择图片（适用正文提交）
  getContentImg (data) {
    return fetch({
      method: 'post',
      url: 'Admin/getContentImg',
      data: data
    })
  },
  // 获取公众号列表信息
  wxuser (params) {
    return fetch({
      method: 'get',
      url: 'Api/wxuser',
      params: params
    })
  },
  // 图片库添加图片
  imgadd (data) {
    return fetch({
      method: 'post',
      url: 'Admin/imgadd',
      data: data
    })
  },
  // 图片库图片删除
  imgdel (data) {
    return fetch({
      method: 'post',
      url: 'Admin/imgdel',
      data: data
    })
  }
}
