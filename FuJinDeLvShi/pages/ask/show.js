var app = getApp(), page;
var config = require('../../config');
var util = require('../../utils/util');
let pageDefault = require('../../utils/default');

Page(util.extend({}, pageDefault,{
  data: {
    asker: null,
    detail: null,
    answers: null,
    role: 0,
    allowListen: false,

  },
  onLoad: function (options) {
    page = this;
    app.init(page);

    if (!options.id) {
      wx.showModal({
        title: '错误提示',
        content: '参数错误',
        showCancel: false,
        success: () => {
          wx.navigateBack();
        }
      })
    }
  },
  onShow: function () {
    page.checkLogin();
  },
  init:function(){
    page.getInitData(page.options);
  },
  getInitData: (options) => {
    wx.showLoading({ title: '加载中，请稍候..', mask: true });
    app.getServerInfo('WeApp/Ask/show',
      options,
      function (res) {
        var d = res.data;
        wx.hideLoading();
        if (d.errcode > 0) {
          wx.showModal({
            title: '错误提示', content: d.message, showCancel: false, success: () => {
              wx.navigateBack();
            }
          });
        } else {
          if (d.data.answers && d.data.answers.length == 1) {
            wx.redirectTo({
              url: '/pages/ask/detail?id=' + d.data.answers[0]['id']
            })
          } else {
            var upd = {};
            for (var i in d.data) {
              if (i == 'answers') {
                for (var j in d.data[i]) {
                  d.data[i][j]['vipIcon'] = util.vipIcon(d.data[i][j]['groupid']);
                }
              }
              upd[i] = d.data[i];
            }

            page.setData(upd);
          }
        }
      });
  }
}
));