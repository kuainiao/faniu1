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
      url: 'Api/login',
      data: data
    })
  },
  // 退出登录
  logout (data) {
    return fetch({
      method: 'get',
      url: 'Api/logout'
    })
  },
  // 检测是否登陆
  checkLogin (params) {
    return fetch({
      method: 'get',
      url: 'Api/checkLogin',
      params: params
    })
  },
  // 搜索素材
  searchmaterial (data) {
    return fetch({
      method: 'post',
      url: 'Api/searchmaterial',
      data: data
    })
  },
  // 获取素材列表信息
  localmaterial (params) {
    return fetch({
      method: 'get',
      url: 'Api/localmaterial',
      params: params
    })
  },
  // 修改素材
  editnews (params) {
    return fetch({
      method: 'get',
      url: 'Api/editnews',
      params: params
    })
  },
  // 删除素材接口
  delNews (params) {
    return fetch({
      method: 'get',
      url: 'Api/delNews',
      params: params
    })
  },
  // 素材库选择
  getAdminStore (params) {
    return fetch({
      method: 'get',
      url: 'Api/getAdminStore',
      params: params
    })
  },
  // 查看素材详情信息
  getStoreInfo (params) {
    return fetch({
      method: 'get',
      url: 'Api/getStoreInfo',
      params: params
    })
  },
  // 素材分类一二级分类信息获取
  getCatType (params) {
    return fetch({
      method: 'get',
      url: 'Template/getCatType',
      params: params
    })
  },
  // 素材库选择提交选择信息（导入提交处理）
  setStoreRelation (data) {
    return fetch({
      method: 'post',
      url: 'Api/setStoreRelation',
      data: data
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
  // 正文选择图片
  uploadlist (params) {
    return fetch({
      method: 'get',
      url: 'Api/uploadlist',
      params: params
    })
  },
  // 图片库选择
  metalist (params) {
    return fetch({
      method: 'get',
      url: 'Api/metalist',
      params: params
    })
  },
  // 关注、引导、默认链接、摘要获取数据
  getTemp (params) {
    return fetch({
      method: 'get',
      url: 'Api/getTemp',
      params: params
    })
  },
  // 文章采集
  fetch (data) {
    return fetch({
      method: 'post',
      url: 'Api/fetch',
      data: data
    })
  },
  // 本地上传图片
  addImg (data) {
    return fetch({
      method: 'post',
      url: 'Api/addImg',
      data: data
    })
  },
  // 新建图文保存
  addnews (data) {
    return fetch({
      method: 'post',
      url: 'Api/addnews',
      data: data
    })
  },
  // 修改图文保存
  addnewsSubmit (data) {
    return fetch({
      method: 'post',
      url: 'Api/editnews',
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
  // 同步微信数据
  syncwx (params) {
    return fetch({
      method: 'get',
      url: 'Api/syncwx',
      params: params
    })
  },
  // 正文提交内容选择图片（适用正文提交）
  getContentImg (data) {
    return fetch({
      method: 'post',
      url: 'Api/getContentImg',
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
  // 微信图片显示
  showWxImg (params) {
    return fetch({
      method: 'get',
      url: 'Api/showWxImg',
      params: params
    })
  },
  // 获取模板列表
  getcommonlylist (params) {
    return fetch({
      method: 'get',
      url: 'Api/commonly_list',
      params: params
    })
  },
  // 修改常用模板data
  postcommonlytemplate (data) {
    return fetch({
      method: 'post',
      url: 'Api/commonly_template',
      data: data
    })
  },
  // 获取常用模板
  getcommonlytemplate (params) {
    return fetch({
      method: 'get',
      url: 'Api/commonly_template',
      params: params
    })
  },
  // 微站列表信息（编辑新增）
  siteList (params) {
    return fetch({
      method: 'get',
      url: 'api/siteList',
      params: params
    })
  },
  // 获取咨询管理操作
  getLsConsultation (params) {
    return fetch({
      method: 'get',
      url: 'api/getLsConsultation',
      params: params
    })
  },
  // 获取咨询详情及回复列表
  readConsultation (params) {
    return fetch({
      method: 'get',
      url: 'api/readConsultation',
      params: params
    })
  },
  // 微信咨询接口
  wxask (params) {
    return fetch({
      method: 'get',
      url: 'api/wxask',
      params: params
    })
  },
  // 微信咨询回复列表
  replyList (params) {
    return fetch({
      method: 'get',
      url: 'api/replyList',
      params: params
    })
  },
  // 后台咨询的信息
  askAdmin (params) {
    return fetch({
      method: 'get',
      url: 'api/askAdmin',
      params: params
    })
  },
  // 后台咨询回复列表
  replySelf (params) {
    return fetch({
      method: 'get',
      url: 'api/replySelf',
      params: params
    })
  },
}
