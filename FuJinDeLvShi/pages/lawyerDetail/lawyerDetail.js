var app = getApp(), page;
var config = require('../../config');
var util = require('../../utils/util');
let pageDefault = require('../../utils/default');

Page(util.extend({}, pageDefault,{

  /**
   * 页面的初始数据
   */
  data: {
    detailMsg: null,
    cats: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getServerInfo("Lbs/Index/lawyerDetail?userid=" + options.userid , {}, function (res) {
      //console.log(res);
      var cats = [];
      if(res.data.errcode == 0){
        for (var i in res.data.data.cats){
          cats.push({
            name: res.data.data.cats[i],
            id: i
          });
        }
        that.setData({
          detailMsg: res.data.data,
          cats: cats
        });
        //console.log(that.data);
      } else {
        wx.showModal({
          title: '错误提示',
          content: res.data.message,
        })
      }  
    }, 'get');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 跳转到我要认领页面
   */
  gotoClaim: function(e){
    var that = this;
    //console.log(e);
    if (e.currentTarget.dataset.status==1){
      wx.navigateTo({
        url: '../claim/claim?userid=' + e.currentTarget.dataset.userid,
      });
    }else{
      wx.showModal({
        title: '提示',
        content: '已经被认领过！',
      })
    }
  },
  /**
   * 跳转到办公位置地图页面
   */
  gotomapOfficeAddress: function(e){
    //console.log(e);
    //wx.navigateTo({
    //  url: '../mapOfficeAddress/mapOfficeAddress',
    //})
    wx.openLocation({
      latitude: Number(e.currentTarget.dataset.latitude),
      longitude: Number(e.currentTarget.dataset.longitude),
      scale: 18,
      name: '',
      address: e.currentTarget.dataset.address,
      success: function (res) {
        //console.log(res);
      },
      fail: function (res) {
        //console.log(res);
      },
      complete: function (res) {
        //console.log(res);
      }
    })
  },
  /*跳转到公开咨询或一对一咨询*/
  gotopostask: function (e) {
    wx.switchTab({
      url: '../ask/post'
    });
    /*
    var isreg = e.currentTarget.dataset.isreg;
    var call_fee = e.currentTarget.dataset.callfee;
    var openid = e.currentTarget.dataset.openid;
    console.log(isreg);
    console.log(call_fee);
    if (isreg == 1) {
      wx.navigateToMiniProgram({
        appId: 'wx35ecd8a63ca91af4',
        path: 'pages/ask/post2?to=' + openid,
        extraData: {},
        //envVersion: 'develop',
        success(res) {
          // 打开成功
          console.log(res);
        }
      });
    } else {
      wx.switchTab({
        url: '../ask/post'
      })
    }
    */
  },
  /*跳转到电话咨询页面*/
  gotolawyerDetailCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
    /*
    var isreg = e.currentTarget.dataset.isreg;
    var call_fee = parseFloat(e.currentTarget.dataset.callfee);
    var openid = e.currentTarget.dataset.openid;
    console.log(isreg);
    console.log(call_fee);
    if (isreg == 1 && call_fee > 0) {
      wx.navigateToMiniProgram({
        appId: 'wx35ecd8a63ca91af4',
        path: 'pages/call/post2?to=' + openid,
        extraData: {},
        //envVersion: 'develop',
        success(res) {
          // 打开成功
          console.log(res);
        }
      })
    } else {
      wx.navigateTo({
        url: '../ask/post',
      });
    }
    */
  }
}));