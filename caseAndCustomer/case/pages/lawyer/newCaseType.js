// pages/lawyer/newCaseType.js
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryArray: [],
    index: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.lawcaseCategory();
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
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  //获取案件类型
  lawcaseCategory: function () {
    let that = this;
    app.getServerInfo("/Lawcase/LawyerApi/lawcaseCategory?parent=0", {}, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        if(data.data.length>0){
          that.setData({
            categoryArray: data.data
          });
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
  gotoNewCase: function (e) {
    let that = this;
    if (e.detail.value.parentid == '' || e.detail.value.parentid == null) {
      wx.showModal({
        title: '提示',
        content: '案件类型不能为空',
          showCancel: false
      })
      return;
    }
    if(e.detail.value.name==''){
      wx.showModal({
        title: '提示',
        content: '自定义分类不能为空',
          showCancel: false
      })
      return;
    }
    let name = e.detail.value.name;
    let index = Number(e.detail.value.parentid);
    let parentid = Number(that.data.categoryArray[index].id);
    app.getServerInfo("/Lawcase/LawyerApi/lawcaseCategoryEdit", {parentid:parentid,name:name}, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        wx.getStorage({
          key: 'newCaseFormData',
          success: function (resp) {
            let dataS = JSON.parse(resp.data);
            dataS.catid = data.data.id;
            dataS.name = data.data.name;
            wx.setStorage({
              key: 'newCaseFormData',
              data: JSON.stringify(dataS),
              success: function () {
                wx.switchTab({
                  url: 'newCase'
                })
              }
            })
          },
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
})