// pages/lawyer/shareCase.js
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
    //案件混合信息列表
    lawcaseMixMsgArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.data.id = options.id;
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
    this.getcaseDetail();
    //this.handingData();
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
  //详情数据请求
  getcaseDetail: function () {
    let that = this;
    wx.showLoading({
      title: 'loading...',
    })
    app.getServerInfo("Lawcase/Api/caseDetail?id=" + that.data.id, {}, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        data.data.addtime = util.formatDateTime(Number(data.data.addtime));
        for (let i = 0; i < data.litigants.length; i++) {
          data.litigants[i].selected = '1';
        }
        for (let i = 0; i < data.events.length; i++) {
          data.events[i].time = util.formatDateTime(Number(data.events[i].time)).split(' ')[0];;
        }
        that.setData({
          detailMsg: data.data,
          litigants: data.litigants.length > 0 ? data.litigants : [],
          lawcaseEventsArray: data.events
        });
        wx.hideLoading();
      } else {
        wx.showModal({
          title: '错误提示',
          content: data.message,
            showCancel: false
        })
      }
    }, 'GET');
  }
})