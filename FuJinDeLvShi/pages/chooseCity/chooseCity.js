// pages/chooseCity/chooseCity.js
var citys = require('../../utils/citys.js');
var app = getApp();
//获取城市数据
var cityData = citys.getData();
//console.log(cityData);


Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchMaskShow: 'show',
    focus: false,
    cityList: null,
    index: null,
    areaCode: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cityList: cityData[options.index].sub,
      index: options.index
    })
    //console.log(this.data.cityList)
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
   * input上的view被tap事件
   */
  bindSearchMask: function () {
    this.setData({
      searchMaskShow: 'hide',
      focus: true
    })
  },
  /**
   * input失去焦点事件
   */
  bindblur: function () {
    this.setData({
      searchMaskShow: 'show',
      focus: false
    })
  },
  /**
   * 去往找律师页面
   */
  gotofindLawyer: function(e){
    var areaCode = e.currentTarget.dataset.areacode;
    app.globalData.selectAreaCode = areaCode;
    wx.setStorageSync('areaCode', areaCode);
    wx.switchTab({
      url: '../findLawyer/findLawyer',
    })
  }
})