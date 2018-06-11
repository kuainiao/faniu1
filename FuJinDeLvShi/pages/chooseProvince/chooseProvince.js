// pages/chooseProvince/chooseProvince.js
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
    provinceSearch: 'hide',
    citySearch: 'hide',
    provinceList: cityData,
    index: null,
    areaCode: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  bindSearchMask: function(){
    this.setData({
      searchMaskShow: 'hide',
      focus: true
    })
  },
  /**
   * input失去焦点事件
   */
  bindblur: function(){
    this.setData({
      searchMaskShow: 'show',
      focus: false
    })
  },
  /**
   * 去选择城市页面
   */
  gotochooseCity: function(e){
    wx.setStorageSync('areaCode',e.currentTarget.dataset.areacode);
    wx.navigateTo({
      url: '../chooseCity/chooseCity?index=' + e.currentTarget.dataset.index,
    })
  }
})