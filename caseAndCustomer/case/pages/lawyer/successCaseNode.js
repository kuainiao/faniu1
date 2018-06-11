// pages/lawyer/successCaseNode.js
let app = getApp();
let util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //进程id
    eventId: null,
    //
    lawcaseMsgArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.eventId){
      this.data.eventId = options.eventId;
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
    this.getLawcaseMsgList();
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
  //案件消息列表请求
  getLawcaseMsgList: function () {
    let that = this;
    let queryS = '';
    queryS = '?eventId=' + that.data.eventId + '&type=2';
    app.getServerInfo("Lawcase/LawyerApi/lawcaseMsg" + queryS, {}, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        for (let i = 0; i < data.data.length; i++) {
          data.data[i].addtime = util.formatDateTime(Number(data.data[i].addtime));
        }
        //islawyer 1 律师 0 当事人
        that.setData({
          lawcaseMsgArray: data.data
        })
        if (that.data.lawcaseMsgArray.length==0){
          wx.showModal({
            title: '提示',
            content: '该进程暂无更多信息',
              showCancel: false
          })
        }
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