var app = getApp(), page, cityPicker;
var config = require('../../config');
var util = require('../../utils/util');
let pageDefault = require('../../utils/default');
var citys = require("../../utils/citys.js");


Page(util.extend({}, pageDefault, {
  data: {
    categorys: null,
    reward: null,
    catIndex: 0,
    cats: null,
    objectCats: null,
    rewardsIndex: 0,
    rewards: null,
    objectRewards: null,
    to: '',
    expert: null,
    lawyerAmount: 0,
    showRewardSelect: false,
    selectedCity: '',
    selectedCityCode: 0,
    selectedCityIndex: [0, 0],
    askContent: ''
  },
  onLoad: function (options) {
    page = this;
    app.init(page);

    app.getAreaCode().then(() => {
      var code = wx.getStorageSync('areaCode');
      page.setData({ 'areaCode': code });
      cityPicker = citys.initPicker(page, code);
    });

    app.getCategorys().then(() => {
      var categorys = wx.getStorageSync('categorys'), cats = [], objectCats = [];
      for (var i in categorys) {
        cats[cats.length] = categorys[i]['name'];
        objectCats[objectCats.length] = categorys[i];
      }
      this.setData({ 'categorys': categorys, cats: cats, objectCats: objectCats });
    });

    
    if (options.content) {
      page.setData({ askConent: options.content });
    }
  },
  onShow:function(e){
    page.checkLogin();
  },
  init:function(res){
    page.getInitData(this.options);
  },
  bindPickerCat: function (e) {
    this.setData({
      catIndex: e.detail.value
    })
  },
  bindPickerReward: function (e) {
    this.setData({
      rewardsIndex: e.detail.value
    })
  },
  bindAskPost: (e) => {
    var data = e.detail.value, pd = page.data;
    data.to = pd.to;
    data.formid = e.detail.formId;
    data.catid = pd.objectCats[pd.catIndex].id;
    data.areaid = cityPicker.getSelected('code');
    if (pd.showRewardSelect) data.money = pd.objectRewards[pd.rewardsIndex];
    if (data.content.length < 10) {
      wx.showModal({
        title: '提示',
        content: '咨询内容不得少于10个字',
        showCancel: false
      });
      return false;
    }

    if (!data.catid) {
      wx.showModal({
        title: '提示',
        content: '请选择分类',
        showCancel: false
      });
      return false;
    }

    /*
    if (data.areaid == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel: false
      });
      return false;
    }
    
    if (data.mobile == '') {
      wx.showModal({
        title: '提示',
        content: '手机号不能为空',
        showCancel: false
      });
      return false;
    }
    */
    if (data.mobile.length > 0 && !util.isMobile(data.mobile)) {
      wx.showModal({
        title: '提示',
        content: '手机号不正确',
        showCancel: false
      });
      return false;
    }
    wx.showLoading({ title: '正在为你提交数据,请稍后..', mask: true });
    app.getServerInfo('WeApp/Ask/post', data, (res) => {
      var d = res.data;
      wx.hideLoading();
      if (d.errcode == 0) {
        if (d.money > 0) {
          //支付流程
          app.pay({
            'type': 4, 'for': d.id,
            success: (res) => {
              wx.switchTab({
                url: '../my/my',
              });
            },
            fail: (res) => {
              wx.redirectTo({
                url: '../my/my',
              })
            }
          });
        } else {
          wx.showToast({
            title: '发布成功',
            duration: 2000,
            complete: () => {
              setTimeout(function () {
                wx.switchTab({
                  url: '/pages/my/my',
                });
              }, 2000);
            }
          });
        }
      } else {
        wx.showModal({
          title: '错误提示', content: d.message, showCancel: false
        });
      }
    }, 'post');
  },
  getInitData: (options) => {
    wx.showLoading({ title: '加载中，请稍候..', mask: true });
    app.getServerInfo('WeApp/Ask/post',
      options,
      function (res) {
        var d = res.data, reward, rewards, objectRewards, expert;
        wx.hideLoading();
        if (d.errcode > 0) {
          wx.showModal({
            title: '错误提示', content: d.message, showCancel: false, success: () => {
              wx.navigateBack();
            }
          });
        } else {
          reward = d.reward;
          if (d.expert) {
            d.expert['homepage'] = '/pages/lawyer/home?openid=' + d.expert['openid'];
            d.expert['vipIcon'] = util.vipIcon(d.expert['groupid']);
          }
          page.setData({ to: d.expert ? d.expert.openid : '', expert: d.expert ? d.expert : null, reward: reward, lawyerAmount: d.lawyerAmount });
          if (typeof (d.reward) == 'object') {
            rewards = ['请选择金额']; objectRewards = [0];
            for (var i in reward) {
              rewards[rewards.length] = reward[i] + '元';
              objectRewards[objectRewards.length] = reward[i];
            }
            page.setData({ rewards: rewards, objectRewards: objectRewards });
          } else {
            page.setData({ showRewardSelect: false });
          }
        }
      });
  }
}
));