var util = require('util.js');
let app = getApp();

module.exports = {
  data: {
    userInfo: {},
    appInfo: {},
    shareTitle: '',
    shareDesc: ''
  },
  onLoad: function () {
  },
  checkLogin: function () {
    app.islogin((res) => {
      let afterLoginDo = app.afterLoginDo;
      app.afterLoginDo = null;
      if (res) {
        this.setData({ userInfo: res });
        if (this.init) this.init();
        if (afterLoginDo && afterLoginDo != 'init' && this[afterLoginDo]) this[afterLoginDo]();
      } else {
        if (afterLoginDo) {
          wx.switchTab({
            url: '/pages/findLawyer/findLawyer',
          });
        } else {
          wx.navigateTo({
            url: '/pages/login/login',
          });
        }
      }
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.shareTitle || app.globalData.appInfo.shareTitle || app.globalData.appInfo.name,
      desc: this.data.shareDesc || app.globalData.appInfo.shareDesc || app.globalData.appInfo.about
    }
  },


}