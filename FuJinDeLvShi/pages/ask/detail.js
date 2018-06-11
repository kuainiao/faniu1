var app = getApp(), page;
var config = require('../../config');
var util = require('../../utils/util');
let pageDefault = require('../../utils/default');


Page(util.extend({}, pageDefault,{
  data: {
    id: 0,
    asker: null,
    detail: null,
    replys: null,
    role: 0,
    allowListen: false,
    playFile: '',
    playing: false,
    tipboxvisible: false
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
    } else {
      page.setData({ id: options.id });
    }
  },
  onShow: function () {
    page.checkLogin();
  },
  init:function(){
    page.getInitData(page.options);
  },
  bindFollow: (e) => {
    var openid = e.currentTarget.dataset.openid;
    app.getServerInfo('WeApp/Lawyer/followLawyer', { openid: openid }, function (res) {
      if (res.data.errcode == 0) {
        page.setData({ 'isFollow': true });
      }
    });
  },
  bindPlay: (res) => {
    var pd = page.data, file = typeof (res) == 'string' ? res : res.currentTarget.dataset.file, upd = {};
    if (!pd.allowListen) {
      app.pay({
        'type': 1, 'for': pd.answer.id,
        success: (res) => {
          page.getInitData(page.options);
        }
      });
    } else {//播放
      wx.onBackgroundAudioPlay((res) => {
      });
      wx.onBackgroundAudioPause((res) => {
        page.setData({ playing: false });
      });
      wx.onBackgroundAudioStop((res) => {
        page.setData({ playFile: '', playing: false });
      });
      if (pd.playFile == file && pd.playing) {
        wx.pauseBackgroundAudio();
      } else {
        wx.playBackgroundAudio({
          dataUrl: file,
          title: '法妞问答-' + pd.expert.name + '律师回复',
          success: (res) => {
            page.setData({ playFile: file, playing: true });
          },
          fail: (res) => {
            wx.showModal({
              title: '提示',
              content: '播放失败',
              showCancel: false
            })
          }
        });
      }
    }
  },
  bindPump: (res) => {
    var pd = page.data, data = res.detail.value, formid = res.detail.formId;
    if (data.content.length < 10) {
      wx.showModal({
        title: '错误提示',
        content: '回复内容至少10个字!',
        showCancel: false
      })
    } else {
      wx.showLoading({ title: '正在为你提交数据，请稍候..', mask: true });
      app.getServerInfo('WeApp/Ask/pump',
        { replyid: pd.id, content: data.content, formid: formid },
        function (res) {
          var d = res.data;
          wx.hideLoading();
          if (d.errcode > 0) {
            wx.showModal({
              title: '错误提示', content: d.message, showCancel: false
            });
          } else {
            page.getInitData(page.options);
          }
        }, 'post');
    }
  },
  bindTipbox: () => {
    page.setData({ tipboxvisible: !page.data.tipboxvisible });
  },
  bindTip: (e) => {
    var pd = page.data, amount = e.detail.value;
    if (amount > 0) {
      page.setData({ tipboxvisible: false });
      wx.showLoading({
        title: '正在为你获取赞赏数据',
      })
      app.getServerInfo('WeApp/Ask/admire',
        { id: pd.id, amount: amount },
        (res) => {
          var d = res.data;
          if (d.errcode == 0) {
            wx.hideLoading();
            app.pay({
              'type': 5, 'for': d.id,
              success: (res) => {
                page.getInitData();
              }
            });
          } else {
            wx.showModal({
              title: '错误提示',
              content: d.message
            })
          }
        });
    }
  },
  getInitData: (options) => {
    wx.showLoading({ title: '加载中，请稍候..', mask: true });
    app.getServerInfo('WeApp/Ask/detail',
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
          var upd = {};
          for (var i in d.data) {
            if (i == 'expert') {
              d.data[i]['vipIcon'] = util.vipIcon(d.data[i]['groupid']);
              d.data[i]['introduce'] = d.data[i]['intro'].substr(0, 100);
            }
            upd[i] = d.data[i];
          }
          page.setData(upd);
          if (d.data.allowListen) {
            page.bindPlay(d.data.answer.mediaurl);
          }
        }
      });
  }
}
));