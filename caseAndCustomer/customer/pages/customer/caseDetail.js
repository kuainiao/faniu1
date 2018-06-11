// pages/customer/caseDetail.js
let app = getApp();
let util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //案件id
    id: null,
    //详情数据
    detailMsg: null,
    //当事人列表
    litigants: [],
    //案件混合信息列表
    lawcaseMixMsgArray: [],
    //textarea的value值
    textareaValue: '',
    //上传图片的urls
    urls: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.data.id = Number(options.id);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.handingData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //详情和混合信息处理
  handingData: function () {
    let that = this;
    wx.showLoading({
      title: 'loading...',
    })
    Promise.race([that.getlawcaseDetail(), that.getlawcaseMixMsg()]).then(function (res) {
      wx.hideLoading();
    })
  },
  //获取案件详情
  getlawcaseDetail: function () {
    let that = this;
    return new Promise((resolve, reject) => {
      app.getServerInfo("Lawcase/UserApi/lawcaseDetail?id=" + that.data.id, {}, function (res) {
        let data = res.data;
        if (data.errcode === 0) {
          data.data.addtime = util.formatDateTime(Number(data.data.addtime));
          that.setData({
            detailMsg: data.data,
            litigants: data.litigants.length > 0 ? data.litigants : []
          })
          resolve(data.data);
        } else {
          wx.showModal({
            title: '错误提示',
            content: data.message,
            showCancel: false
          })
        }
      }, 'GET');
    })
  },
  //获取混合信息列表
  getlawcaseMixMsg: function () {
    let that = this;
    return new Promise((resolve, reject) => {
      app.getServerInfo("Lawcase/UserApi/lawcaseMixMsg?lawcaseId=" + that.data.id, {}, function (res) {
        let data = res.data;
        if (data.errcode === 0) {
          for (let i = 0; i < data.data.length; i++) {
            data.data[i].addtime = util.formatDateTime(Number(data.data[i].addtime));
            if (data.data[i].type==2){
              data.data[i].addtime = data.data[i].addtime.split(' ')[0];
            }
          }
          that.setData({
            lawcaseMixMsgArray: data.data
          });
          resolve(data.data);
        } else {
          wx.showModal({
            title: '错误提示',
            content: data.message,
              showCancel: false
          })
        }
      }, 'GET');
    })
  },
  //图片预览
  previewImg: function (e) {
    let url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    })
  },
  //发送
  send: function (e, urls) {
    let that = this;
    let obj = {};
    obj.lawcaseId = that.data.id;
    if (e) {
      if (e.detail.value.content == '') {
        return;
      }
      obj.content = e.detail.value.content;
      obj.type = 1;
      obj.formid = e.detail.formId;
    } else {
      obj.content = urls;
      obj.type = 2;
    }
    app.getServerInfo("Lawcase/UserApi/lawcaseMsgAdd", obj, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        that.setData({
          textareaValue: ''
        })
        that.getlawcaseMixMsg();
      } else {
        wx.showModal({
          title: '错误提示',
          content: data.message,
          showCancel: false
        })
      }
    }, 'POST');
  },
  //上传图片
  uploadimg: function () {
    let that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        that.data.urls = [];
        let list = [];
        function promiseListFun(url) {
          return new Promise((resolve, reject) => {
            wx.uploadFile({
              url: 'https://www.faniuwenda.com/WeApp/Upload/image',
              filePath: url,
              name: 'file',
              header: { 'Cookie': 'PHPSESSID=' + app.session('session_id') },
              formData: {
                'type': 3
              },
              success: function (r) {
                let data = JSON.parse(r.data);
                if (data.errcode == 0) {
                  resolve(data.url);
                  that.data.urls.push(data.url);
                  //if (i == (tempFilePaths.length - 1)) {
                  //  that.send(undefined, that.data.urls.join(','));
                  //}
                }
              }
            })
          })
        }
        for (let i = 0; i < tempFilePaths.length; i++) {
          list.push(promiseListFun(tempFilePaths[i]));
        }
        Promise.all(list).then(function (res) {
          that.send(undefined, that.data.urls.join(','));
        })
      }
    })
  },
})