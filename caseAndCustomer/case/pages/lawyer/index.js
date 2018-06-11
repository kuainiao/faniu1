// pages/lawyer/index.js
let app = getApp();
var config = require('../../config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //请求来的身份验证
    lawyer: null,
    litigant: null
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
    this.userInfo();
    wx.setStorage({
      key: 'litigantsArr',
      data: '[]',
    })
    wx.setStorage({
      key: 'newCaseFormData',
      data: '{}',
    })
    wx.setStorage({
      key: 'id',
      data: '',
    })
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
  //律师身份验证
  userInfo: function (lawyerclick,goto) {
    let that = this;
    app.getServerInfo("/WeApp/Index/userInfo", { 'do': 'lawcase' }, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        that.data.lawyer = data.lawyer;
        that.data.litigant = data.litigant;
        if (data.lawyer) {
          if (data.lawyer.lawcase_status != -1) {
            if (goto =='newCase'){
              wx.switchTab({
                url: 'newCase',
              })
            }
            if (goto == 'caseList') {
              wx.switchTab({
                url: 'caseList',
              })
            }
            if (goto == 'customerList') {
              wx.switchTab({
                url: 'customerList',
              })
            }
          } else {
            if (lawyerclick) {
              wx.showModal({
                title: '提示',
                content: '请拨打客服电话 ' + config.tel + '，开通案件管理',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.makePhoneCall({
                      phoneNumber: config.tel
                    })
                  } else if (res.cancel) {
                    
                  }
                }
              })
            }
          }
        } else {
          if (lawyerclick) {
            wx.navigateToMiniProgram({
              appId: 'wx881ea2120c9a1058',
              path: 'pages/claim/claim',
              extraData: {},
              success(res) {}
            })
          }
        }
        if (data.litigant) {
          wx.navigateToMiniProgram({
            appId: 'wx0b339502c448ebc2',
            path: 'pages/customer/index',
            extraData: {},
            success(res) {}
          })
        }
      } else {
        wx.showModal({
          title: '错误提示',
          content: data.message,
          showCancel: false
        })
      }

    }, 'GET');
  },
  //打开创建案例页
  gotoNewCase: function(){
    this.userInfo('lawyerclick','newCase');
  },
  //打开我的案件页
  gotoCaseList: function () {
    this.userInfo('lawyerclick', 'caseList');
  },
  //打开我的当事人页
  gotoCustomerList: function () {
    this.userInfo('lawyerclick', 'customerList');
  }
})