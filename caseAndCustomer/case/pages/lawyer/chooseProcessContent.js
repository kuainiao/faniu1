// pages/lawyer/chooseProcessContent.js
let app = getApp();
let util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lawcaseId: null,
    eventId: null,
    lawcaseMsgArray: [],
    msgIds: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.lawcaseId) {
      this.data.lawcaseId = options.lawcaseId;
    }
    if (options.eventId) {
      this.setData({
        eventId: options.eventId
      })
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
    queryS = '?lawcaseId=' + that.data.lawcaseId + '&type=0';
    if (that.data.eventId){
      queryS = '?eventId=' + that.data.eventId + '&type=0';
    }
    app.getServerInfo("Lawcase/LawyerApi/lawcaseMsg" + queryS, {}, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        for(let i=0;i<data.data.length;i++){
          data.data[i].addtime = util.formatDateTime(Number(data.data[i].addtime));
        }
        //islawyer 1 律师 0 当事人
        that.setData({
          lawcaseMsgArray: data.data
        })
        if (that.data.lawcaseMsgArray.length==0){
          wx.showModal({
            title: '提示',
            content: '暂无内容',
            showCancel: false,
            success: function (resp){
              if(resp.confirm){
                wx.navigateBack({
                  delta: 1
                })
              }
            }
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
  },
  //归档案件进程
  postLawcaseEvents: function () {
    let that = this;
    let obj = {};
    obj.id = that.data.eventId;
    obj.msgIds = that.data.msgIds;
    obj.do = 'edit';
    app.getServerInfo("Lawcase/LawyerApi/lawcaseEventMsgEdit", obj, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.showModal({
          title: '错误提示',
          content: data.message,
            showCancel: false
        })
      }
    }, 'POST');
  },
  //返回案件进程页面
  gotoCaseProcess: function (e) {
    let msgIds = e.detail.value.msgIds;
    let lawcaseMsgArr = [];
    for (let i = 0; i < msgIds.length;i++){
      this.data.lawcaseMsgArray[msgIds[i]].selected = 1;
      lawcaseMsgArr.push(this.data.lawcaseMsgArray[msgIds[i]]);
      this.data.msgIds += this.data.lawcaseMsgArray[msgIds[i]].id + ',';
    }
    this.data.msgIds = this.data.msgIds.slice(0,-1);
    wx.setStorage({
      key: 'lawcaseMsgArr',
      data: JSON.stringify(lawcaseMsgArr),
    })
    if (this.data.eventId){
      this.postLawcaseEvents();
    }else{
      wx.navigateBack({
        delta: 1
      })
    }
  }
})