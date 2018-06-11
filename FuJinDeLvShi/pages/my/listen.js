var app = getApp(), page;
var config = require('../../config');
var util = require('../../utils/util');
let pageDefault = require('../../utils/default');

Page(util.extend({}, pageDefault, {
  data: {
    isListen: true,
    listenList: [],
    loading: false,
    listenCounts: 0,
    p: 1
  },

  bindtapcall: function () {
    footerjs.footercall();
  },

  /*
  *页面加载
  *
  */
  onLoad: function () {
    page = this;
    app.init(page);
  },

  /*
  *页面显示
  *
  */
  onShow: function () {
    page.checkLogin();
  },
  init: function () {
    this.data.p = 1;
    this.data.listenList = [];
    this.getListenList();
  },
  /*
  *拉取我听过的问题列表
  *
  */
  getListenList: function () {
    if (this.data.loading) {
      return;
    }
    this.data.loading = true;
    var that = this;
    wx.showNavigationBarLoading();
    app.getServerInfo('WeApp/Ucenter/getListenList', { p: this.data.p }, (res) => {
      wx.hideNavigationBarLoading();
      wx.hideNavigationBarLoading();
      if (res.data.errcode == 0 && res.data.listenList.list != '') {
        that.setData({ listenList: that.data.listenList.concat(res.data.listenList.list), listenCounts: res.data.listenList.pageinfo.count, isListen: true, loading: false });
      } else {
        if (that.data.p != 1) {
          that.setData({ loading: false });
        } else {
          that.setData({ isListen: false, loading: false });
        }
      }
    });
  }

}
));