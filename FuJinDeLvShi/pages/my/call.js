var app = getApp(), page;
var config = require('../../config');
var util = require('../../utils/util');
let pageDefault = require('../../utils/default');

Page(util.extend({}, pageDefault,{
  data: {
    isCall: true,
    callList: [],
    loading: false,
    p: 1,
    maxp: 0
  },
  bindtapcall: function () {
    footerjs.footercall();
  },
  btn_complete: function () {
    var that = this;
    wx.showModal({
      title: '确认',
      content: '确认该电话咨询已经完成了吗？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          that.setData({
            btntxt: '已完成',
            completed: true
          })
        }
      }
    });
  },
  onLoad: function () {
    page = this;
    app.init(page);
  },
  onShow: function () {
    page.checkLogin();
  },
  init:function(){
    this.data.p = 1;
    this.data.callList = [];
    this.getCallList();
  },
  /*
  *绑定事件,拨打电话
  *
  */
  bindtapCall: function (e) {
    var tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  bindPay: (e) => {
    var id = e.currentTarget.dataset.id;
    if (id > 0) {
      app.pay({
        'type': 2, 'for': id,
        success: (res) => {
          page.getCallList();
        },
        fail: (res) => {
          page.getCallList();
        }
      });
    }
  },

  /*
  *绑定事件,点击完成
  *
  */
  callFinish: function (e) {
    if (this.data.loading) {
      return;
    }
    this.data.loading = true;
    var id = e.currentTarget.dataset.id;
    var that = this;
    wx.showLoading({ title: '正在提交' });
    app.getServerInfo('WeApp/Ucenter/callFinish', { id: id }, (res) => {
      wx.hideLoading();
      if (res.data.errcode == 0) {
        that.data.loading = false;
        that.data.callList = [];
        that.data.p = 1;
        that.getCallList();
      } else {
        that.data.loading = false;
        wx.showToast({ title: res.data.message });
      }
    });
  },
  /*
  *拉取数据，获取我的电话咨询
  *
  */
  getCallList: function () {
    if (this.data.loading) {
      return;
    }
    this.data.loading = true;
    var that = this;
    wx.showNavigationBarLoading();
    app.getServerInfo('WeApp/Ucenter/getCallList', { p: this.data.p }, (res) => {
      wx.hideNavigationBarLoading();
      if (res.data.errcode == 0 && res.data.callList.list != '') {
        that.setData({ callList: that.data.callList.concat(res.data.callList.list), maxp: res.data.callList.pageinfo.pagesize, isCall: true, loading: false });
      } else {
        if (that.data.p != 1) {
          that.setData({ loading: false });
        } else {
          that.setData({ isCall: false, loading: false });
        }
      }
    });
  },

  /*
  *上划加载
  *
  */
  onReachBottom: function () {
    if (this.data.loading || (this.data.p * 1 + 1 > this.data.maxp)) {
      return;
    }
    this.data.p = this.data.p * 1 + 1;
    this.getCallList();
  },
/*
 *去往/pages/lawyer/index
*/
  gotolawyerIndex:function(e){
    console.log(e);
    wx.navigateToMiniProgram({
      appId: 'wx35ecd8a63ca91af4',
      path: 'pages/lawyer/index'
    })
  }
}
));