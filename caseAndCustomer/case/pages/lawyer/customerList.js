// pages/lawyer/customerList.js
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    add: false
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
    this.getLitigants();
    wx.setStorageSync('litigantsArr', '[]');
    wx.setStorageSync('newCaseFormData', '{}');
    wx.setStorageSync('id', '')
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
  //获取当事人列表
  getLitigants: function () {
    let that = this;
    app.getServerInfo("Lawcase/LawyerApi/litigants", {}, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        that.setData({
          litigantsArr: data.data
        })
      } else {
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
  //添加当事人
  litigantAdd: function (e) {
    console.log(e)
    let that = this;
    let name = e.detail.value.name;
    let mobile = e.detail.value.mobile;
    if(name==''){
     wx.showModal({
       title: '提示',
       content: '姓名不能为空',
         showCancel: false
     })
      return;
    }
    if (mobile == '') {
      wx.showModal({
        title: '提示',
        content: '手机号不能为空',
        showCancel: false
      })
      return;
    }
    app.getServerInfo("/Lawcase/LawyerApi/litigantAdd", { name: name, mobile: mobile }, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        that.getLitigants();
        that.addMaskHide();
        wx.showModal({
          title: '提示',
          content: '添加成功',
          showCancel: false
        });
      } else {
        wx.showModal({
          title: '错误提示',
          content: data.message,
          showCancel: false
        })
      }
    }, 'POST');
  },
  //添加当事人蒙版
  addMaskShow: function () {
    this.setData({
      add: true
    })
  },
  addMaskHide: function () {
    this.setData({
      add: false
    })
  },
  //删除当事人
  litigantDel: function (e) {
    let that = this;
    let id = Number(e.currentTarget.dataset.id);
    wx.showModal({
      title: '提示',
      content: '确定删除当事人？',
      cancelText: '否',
      confirmText: '是',
      success: function (res) {
        if (res.confirm) {
          app.getServerInfo("Lawcase/LawyerApi/litigantDel?id=" + id, {}, function (res) {
            let data = res.data;
            if (data.errcode === 0) {
              that.getLitigants();
              wx.showModal({
                title: '提示',
                content: '删除成功',
                showCancel: false
              })
            } else {
              wx.showModal({
                title: '错误提示',
                content: data.message,
                showCancel: false
              })
            }
          }, 'GET');
        }
      }
    })
  },
  //打开创建案例页
  gotoNewCase: function () {
    wx.setStorage({
      key: 'litigantsArr',
      data: '[]',
    })
    wx.setStorage({
      key: 'newCaseFormData',
      data: '{}',
    })
    wx.redirectTo({
      url: 'newCase',
    })
  },
  //打开我的案件页
  gotoCaseList: function () {
    wx.redirectTo({
      url: 'caseList',
    })
  },
  //打开我的当事人页
  gotoCustomerList: function () {
    wx.redirectTo({
      url: 'customerList',
    })
  }
})