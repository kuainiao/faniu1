// pages/customer/customer.js
let app = getApp();

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
  userInfo: function (lawyerclick) {
    let that = this;
    app.getServerInfo("/WeApp/Index/userInfo", { 'do': 'lawcase' }, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        that.data.lawyer = data.lawyer;
        that.data.litigant = data.litigant;
        if (data.lawyer){
          wx.showModal({
            title: '提示',
            content: '您现在是律师，请前往案件管理律师端',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateToMiniProgram({
                  appId: 'wx3cabf816fed58c7f',
                  path: 'pages/lawyer/index',
                  extraData: {},
                  //envVersion: 'develop',
                  success(res) {
                    // 打开成功
                    console.log(res);
                  }
                })
              }
            }
          })
          return;
        }
        if (data.litigant) {
          
        } else {
          that.showMaskC();
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
  //当事人身份验证
  bindUser: function (e) {
    let that = this;
    if (e.detail.value.mobile == '') {
      wx.showModal({
        title: '提示',
        content: '手机号码不能为空',
        showCancel: false
      })
      return;
    }
    if (!/^1\d{10}$/.test(e.detail.value.mobile)) {
      wx.showModal({
        title: '提示',
        content: '手机号码输入不正确',
        showCancel: false
      })
      return;
    }
    let mobile = e.detail.value.mobile;
    if (e.detail.value.code == '') {
      wx.showModal({
        title: '提示',
        content: '邀请码不能为空',
        showCancel: false
      })
      return;
    }
    if (!/^\d{6}$/.test(e.detail.value.code)) {
      wx.showModal({
        title: '提示',
        content: '邀请码为6位数字',
        showCancel: false
      })
      return;
    }
    let code = e.detail.value.code;
    app.getServerInfo("Lawcase/Api/bindUser", { mobile: mobile, code: code }, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        that.hideMaskC();
        wx.showLoading({
          title: '提示',
          content: '绑定成功！',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              
            }
          }
        })
      } else {
        that.hideMaskC();
        that.showMaskFail();
        setTimeout(function () {
          that.hideMaskFail();
        }, 3000)
      }
    }, 'POST');
  },
  /**
   * 打开案件列表
   */
  gotoCaseList: function(){
    wx.switchTab({
      url: 'caseList',
    })
  },
  /**
   * 打开律师列表
   */
  gotoLawyerList: function () {
    wx.switchTab({
      url: 'lawyerList',
    })
  },
  //当事人蒙版显示
  showMaskC: function () {
    this.setData({
      maskC: true
    })
  },
  //当事人蒙版隐藏
  hideMaskC: function () {
    this.setData({
      maskC: false
    })
  },
  //当事人验证失败蒙版显示
  showMaskFail: function () {
    this.setData({
      testfail: true
    })
  },
  //当事人验证失败蒙版隐藏
  hideMaskFail: function () {
    this.setData({
      testfail: false
    })
  }
})