// pages/customer/lawyerList.js
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //翻页p
    p: 1,
    lawyersArray: []
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
    this.getlawyers();
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
    this.getlawyers();
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
  //获取我的律师列表
  getlawyers: function () {
    wx.showLoading({
      title: 'loading...',
    })
    let that = this;
    let queryS = '?p=' + that.data.p +'&pagesize=1000';
    app.getServerInfo("Lawcase/UserApi/lawyers" + queryS, {}, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        that.setData({
          lawyersArray: data.data
        })
        wx.hideLoading();
      } else {
        wx.hideLoading();
        wx.showModal({
          title: '错误提示',
          content: data.message,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.switchTab({
                url: 'index',
              })
            }
          }
        })
      }
    }, 'GET');
  },
  //打电话
  call: function (e) {
    let tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel //仅为示例，并非真实的电话号码
    })
  }
})