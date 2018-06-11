// pages/buycar/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabactive: '',
    tab1: 'hide',
    tab3: 'hide',
    tab4: 'hide',
    // 最新上线
    news: '',
    newsname: '最新上线',
    // 价格
    price: '',
    // 车型
    types: '',
    // 自定义价格
    minprice: '',
    maxprice: ''
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
   * 打开详情页面
   */
  openDetail: function () {
    wx.navigateTo({
      url: 'detail',
    })
  },

  /**
   * 最新上架点击
  */
  tab1tap: function () {
    this.setData({
      tab1: 'show',
      tab3: 'hide',
      tab4: 'hide',
      tabactive: 'tabactive1'
    })
  },

  /**
   * 最新上架mask点击
  */
  tabmask1tap: function () {
    this.setData({
      tab1: 'hide',
      tab3: 'hide',
      tab4: 'hide',
      tabactive: ''
    })
  },

  /**
   * 品牌点击
  */
  tab2tap: function () {
    this.setData({
      tab1: 'hide',
      tab3: 'hide',
      tab4: 'hide',
      tabactive: 'tabactive2'
    })
  },

  /**
   * 价格点击
  */
  tab3tap: function () {
    this.setData({
      tab1: 'hide',
      tab3: 'show',
      tab4: 'hide',
      tabactive: 'tabactive3'
    })
  },

  /**
  * 价格mask点击
  */
  tabmask3tap: function () {
    this.setData({
      tab1: 'hide',
      tab3: 'hide',
      tab4: 'hide',
      tabactive: ''
    })
  },

  /**
   * 车型点击
  */
  tab4tap: function () {
    this.setData({
      tab1: 'hide',
      tab3: 'hide',
      tab4: 'show',
      tabactive: 'tabactive4'
    })
  },

  /**
  * 车型mask点击
  */
  tabmask4tap: function () {
    this.setData({
      tab1: 'hide',
      tab3: 'hide',
      tab4: 'hide',
      tabactive: ''
    })
  },

  /**
  * 最新上架点击
  */
  newtap: function (e) {
    let that = this;
    console.log(e.currentTarget.dataset.news);
    that.data.news = e.detail.value;
    that.setData({
      tab1: 'hide',
      tab3: 'hide',
      tab4: 'hide',
      tabactive: '',
      news: e.currentTarget.dataset.news,
      newsname: e.currentTarget.dataset.newsname
    })
  },

  /**
  * 价格点击
  */
  pricetap: function (e) {
    let that = this;
    console.log(e.currentTarget.dataset.minprice);
    console.log(e.currentTarget.dataset.maxprice);
    that.data.price = e.detail.value;
    that.setData({
      tab1: 'hide',
      tab3: 'hide',
      tab4: 'hide',
      tabactive: ''
    })
  },

  /**
  * 车型点击
  */
  typestap: function (e) {
    let that = this;
    console.log(e.currentTarget.dataset.types);
    that.data.types = e.detail.value;
    that.setData({
      tab1: 'hide',
      tab3: 'hide',
      tab4: 'hide',
      tabactive: ''
    })
  },

  /**
  * 自定义价格确定
  */
  priceSure: function (e) {
    let that = this;
    console.log(e.detail.value.minprice);
    console.log(e.detail.value.maxprice);
    that.data.minprice = e.detail.value.minprice;
    that.data.maxprice = e.detail.value.maxprice;
    that.setData({
      tab1: 'hide',
      tab3: 'hide',
      tab4: 'hide',
      tabactive: ''
    })
  },

  /**
  * 关键字搜索
  */
  bindconfirm: function (e) {
    wx.showModal({
      title: e.detail.value,
      content: e.detail.value,
    })
  }
})