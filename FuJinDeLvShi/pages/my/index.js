var app = getApp(), page;
var config = require('../../config');
var util = require('../../utils/util');
let pageDefault = require('../../utils/default');

Page(util.extend({}, pageDefault, {
  data: {
    userDatas: {},
    showListenIncome: false
  },
  bindtapcall: function () {
    footerjs.footercall();
  },
  openConfirm: function () {
    wx.showModal({
      title: '拨打客户热线入驻法妞？',
      content: '',
      confirmText: "呼叫",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '053188803703'
          })
        }
      }
    });
  },

  /*
  *页面装载
  *
  */
  onLoad: function () {
    page = this;
  },

  /*
  *页面显示
  *
  */
  onShow: function () {
    page.checkLogin();
  },
  init: function () {
    this.getUserDatas();
  },
  /*
  *拉取个人中心信息
  *
  */
  getUserDatas: function () {
    var that = this;
    wx.showNavigationBarLoading();
    app.getServerInfo('WeApp/Ucenter/getUserDatas', {}, (res) => {
      wx.hideNavigationBarLoading();
      that.setData({ userDatas: res.data.userDatas, showListenIncome: res.data.showListenIncome ? res.data.showListenIncome : false });
    });
  }
}
));