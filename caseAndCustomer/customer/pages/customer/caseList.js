// pages/customer/caseList.js
let app = getApp();
let util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //翻页p
    p: 1,
    lawcasesArray: [],
    //当事人蒙版
    maskC: false,
    //验证失败蒙版
    testfail: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    this.getlawcases();
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
    this.getlawcases();
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
  
  //获取案件列表数据
  getlawcases: function () {
    wx.showLoading({
      title: 'loading...',
    })
    let that = this;
    let queryS = '?p='+that.data.p+'&size=1000';
    app.getServerInfo("Lawcase/UserApi/lawcases"+queryS, {}, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        for (let i = 0; i < data.data.length; i++) {
          data.data[i].addtime = util.formatDateTime(Number(data.data[i].addtime));
        }
        that.setData({
          lawcasesArray: data.data
        })
        wx.hideLoading();
      } else {
        wx.hideLoading();
        wx.showModal({
          title: '错误提示',
          content: data.message,
          showCancel: false,
          success: function (res) {
            if(res.confirm){
              wx.switchTab({
                url: 'index',
              })
            }
          }
        })
      }
    }, 'GET');
  },
  //打开案件详情页面
  gotoCaseDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'caseDetail?id='+id,
    })
  }
})