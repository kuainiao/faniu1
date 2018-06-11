var app = getApp(), page;
var config = require('../../config');
var util = require('../../utils/util');
let pageDefault = require('../../utils/default');

Page(util.extend({}, pageDefault,{
  data: {
    answered: true,
    isAsk: true,
    askList: [],
    loading: false,
    p: 1,
    askCounts: 0,
  },
  /*
  *页面加载
  *
  */
  onLoad: function () {
    page = this;
    app.init(page);
  },
  onShow: () => {
    page.checkLogin();
  },
  init:function(){
    page.data.p = 1;
    page.data.askList = [];
    page.getAskList();
  },
  bindPay: (e) => {
    var id = e.currentTarget.dataset.id;
    if (id > 0) {
      app.pay({
        'type': 4, 'for': id,
        success: (res) => {
          page.getAskList();
        },
        fail: (res) => {
          page.getAskList();
        }
      });
    }
  },
  /*
  *拉取我问过的问题列表
  *
  */
  getAskList: function () {
    if (this.data.loading) {
      return;
    }
    this.data.loading = true;
    var that = this;
    wx.showNavigationBarLoading();
    app.getServerInfo('WeApp/Ucenter/getAskList', { p: this.data.p }, (res) => {
      wx.hideNavigationBarLoading();
      if (res.data.errcode == 0 && res.data.askList.list != '') {
        that.setData({ askList: that.data.askList.concat(res.data.askList.list), isAsk: true, loading: false, askCounts: res.data.askList.pageinfo.count });
      } else {
        if (that.data.p != 1) {
          that.setData({ loading: false });
        } else {
          that.setData({ isAsk: false, loading: false });
        }
      }
    });
  },

  /*
  *上划加载
  *
  */
  onReachBottom: function () {
    if (this.data.loading) {
      return;
    }
    this.data.p = this.data.p * 1 + 1;
    this.getAskList();
  },
  gotoAskPost: function(e){
    console.log(e);
    wx.switchTab({
      url: '../ask/post',
    })
  }

}
));