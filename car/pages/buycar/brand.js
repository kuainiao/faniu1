// pages/buycar/brand.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brandchild: 'hide',
    toView: 'hot',
    orientationList: [
      { id: 'hot' },
      { id: 'all' },
      { id: 'A' },
      { id: 'B' },
      { id: 'C' },
      { id: 'D' },
      { id: 'E' },
      { id: 'F' },
      { id: 'G' },
      { id: 'H' },
      { id: 'I' },
      { id: 'J' },
      { id: 'K' },
      { id: 'L' },
      { id: 'M' },
      { id: 'N' },
      { id: 'O' },
      { id: 'P' },
      { id: 'Q' },
      { id: 'I' },
      { id: 'S' },
      { id: 'T' },
      { id: 'U' },
      { id: 'V' },
      { id: 'W' },
      { id: 'X' },
      { id: 'Y' },
      { id: 'Z' }
    ],
    brandIndex: 1,
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
   * 品牌点击
   */
  brandtap: function (e) {
    console.log(e.currentTarget.dataset.brandname);
    let brand_name = e.currentTarget.dataset.brandname;
    this.setData({
      brandchild: 'show'
    })
  },

  /**
   * 品牌change
   */
  brandchange: function (e) {
    console.log(e.detail.value)
    this.setData({
      brandIndex: Number(e.detail.value)
    })
  },

  /**
   * mask点击
   */
  masktap: function () {
    this.setData({
      brandchild: 'hide'
    })
  },

  /**
   * 车系点击
   */
  brandtypetap: function () {
    this.setData({
      brandchild: 'hide'
    })
  },

  /**
   * 车系change
   */
  brandtypechange: function (e) {
    console.log(e.detail.value)
  },

  /**
   * 描点
   */
  scrollToViewFn: function (e) {
    var _id = e.target.dataset.id;
    this.setData({
      toView: _id
    })
    console.log(this.data.toView)
  }
})