// pages/lawyer/chooseSMSCustomer.js
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //案件id
    id: null,
    add: false,
    sms: false,
    litigantsArr: [],
    uids: '',
    //添加当事人姓名和电话
    name: '',
    mobile: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.data.id = options.id;
    }
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
    this.getSMSLitigants();
    //this.handingData();
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
  //短信当事人列表数据请求
  getSMSLitigants: function () {
    let that = this;
    let queryS = '';
    queryS = '?lawcaseId=' + that.data.id;
    app.getServerInfo("/Lawcase/LawyerApi/litigants" + queryS, {}, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        if (data.data.length > 0) {
          that.setData({
            litigantsArr: data.data
          })
        }
      } else {
        /*wx.showModal({
          title: '错误提示',
          content: data.message,
        })*/
      }
    }, 'GET');
    
  },
  //点击确定——发送短信接口
  lawcaseLitigantNotice: function (e) {
    let that = this;
    let obj = {};
    obj.id = that.data.id;
    obj.uids = e.detail.value.uids.join(',');
    if(obj.uids===''){
      wx.reLaunch({
        url: 'caseList'
      })
      return;
    }
    wx.showModal({
      title: '提示',
      content: '是否通知当事人加入案件？',
      cancelText: '否',
      confirmText: '是',
      success: function (res) {
        if(res.confirm){
          if(obj.uids==''){
            wx.reLaunch({
              url: 'caseList'
            })
            return;
          }
          app.getServerInfo("Lawcase/LawyerApi/lawcaseLitigantNotice", obj, function (res) {
            let data = res.data;
            if (data.errcode === 0) {
              wx.reLaunch({
                url: 'caseList'
              })
            } else {
              wx.showModal({
                title: '错误提示',
                content: data.message,
                showCancel: false
              })
            }
          }, 'POST');
        }
      }
    })
  }
})