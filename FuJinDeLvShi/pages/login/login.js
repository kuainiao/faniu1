var app = getApp();
var config = require('../../config');
var util = require('../../utils/util.js');
let pageDefault = require('../../utils/default');
var login = require('../../utils/login');
var Session = require('../../utils/session');

Page(util.extend({}, pageDefault, {
  data: {
    comInfo: null,
  },

  onLoad: function (options) {
    app.afterLoginDo = options.afterLogin || 'navigateBack';
  },

  onShow: function (options) {
    let p = this;
    let comInfo = app.globalData.usersinfo;
    if (comInfo) p.setData({ comInfo: comInfo });
  },
  bindReject: function () {
    wx.navigateBack();
  },
  bindLogin: function (res) {
    let detail = res.detail;
    if (detail.userInfo) {
      let data = {
        data: { iv: detail.iv, data: detail.encryptedData },
        flush: true,
        silent: true,
        success:(res)=>{
          console.log(res);
          wx.hideLoading();
          app.globalData.wxid = res.wxid;
          app.globalData.userinfo = res;
          if (app.afterLoginCall) app.afterLoginCall(res);
          wx.navigateBack();
        },
        fail:(res)=>{
          wx.hideLoading();
          wx.showModal({
            title: '登录失败',
            content: '抱歉登录失败，请重试或联系客服！',
          })
        }
      };
      wx.showLoading({ title: '登录中...', mask:true});
      login.login(data);
    }
  }
}))