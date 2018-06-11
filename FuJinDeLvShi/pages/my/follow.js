var app = getApp(), page;
var config = require('../../config');
var util = require('../../utils/util');
let pageDefault = require('../../utils/default');

Page(util.extend({}, pageDefault, {
  data: {
    p: 1,
    followList: [],
    isFollow: true,
    followCounts: 0,
    loading: false
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
    this.data.followList = [];
    this.getFollowList();
  },
  /*
  *拉取关注列表
  *
  */
  getFollowList: function () {
    if (this.data.loading) {
      return;
    }
    this.data.loading = true;
    var that = this;
    wx.showNavigationBarLoading();
    app.getServerInfo('WeApp/Ucenter/getFollowList', { p: this.data.p }, (res) => {
      wx.hideNavigationBarLoading();
      if (res.data.errcode == 0 && res.data.followList.list != '') {
        that.setData({ followList: that.data.followList.concat(res.data.followList.list), followCounts: res.data.followList.pageinfo.count, isFollow: true, loading: false });
      } else {
        if (that.data.p != 1) {
          that.setData({ loading: false });
        } else {
          that.setData({ isFollow: false, loading: false });
        }
      }
    });
  },

  /*
  *绑定事件，弹窗
  *
  */
  openAlert: () => {
    wx.showModal({
      content: '该律师还未开通电话咨询服务',
      showCancel: false
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
    this.getFollowList();
  },

}
));