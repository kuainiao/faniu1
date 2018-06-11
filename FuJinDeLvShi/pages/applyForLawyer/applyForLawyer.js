var app = getApp(), page;
var config = require('../../config');
var util = require('../../utils/util');
let pageDefault = require('../../utils/default');
var citys = require("../../utils/citys.js");


Page(util.extend({}, pageDefault, {

  /**
   * 页面的初始数据
   */
  data: {
    maskShow: 'hide'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = this;
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
    page.checkLogin();
  },
  init: function () {
    this.getUserDatas();
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
  /**
   * 打开弹窗
   */
  /*openMask: function () {
    this.setData({
      maskShow: 'show'
    })
  },*/
  /**
   * 关闭弹窗
   */
  /*closeMask: function () {
    this.setData({
      maskShow: 'hide'
    })
  }*/
  gotoClaim: function () {
    wx.navigateTo({
      url: '../claim/claim',
    })
  },
  /*
  *拉取个人中心信息
  *
  */
  getUserDatas: function () {
    var that = this;
    wx.showNavigationBarLoading();
    app.getServerInfo('WeApp/Ucenter/getUserDatas', {}, (res) => {
      //console.log(res);
      if (res.data.errcode == 0) {
        that.setData({
          headimgurl: res.data.userDatas.headimgurl,
          nickname: res.data.userDatas.nickname
        });
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.message,
        })
      }
      wx.hideNavigationBarLoading();
      that.setData({ userDatas: res.data.userDatas});
    });
  },
}));