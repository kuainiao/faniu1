// pages/lawyer/caseProcessName.js
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null
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
  //增加、编辑案件节点
  nodeEdit: function (e) {
    let that = this;
    let obj = {};
    if(that.data.id!=null){
      obj.id = that.data.id;
    }
    if(e.detail.value.name==''){
      wx.showModal({
        title: '提示',
        content: '自定义进程不能为空',
          showCancel: false
      });
      return;
    }
    obj.name = e.detail.value.name;
    app.getServerInfo("Lawcase/LawyerApi/nodeEdit", obj, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        wx.showModal({
          title: '提示',
          content: '添加成功',
            showCancel: false
        })
        that.gotoNewCase();
      } else {
        wx.showModal({
          title: '错误提示',
          content: data.message,
            showCancel: false
        })
      }
    }, 'POST');
  },
  //返回案件进程
  gotoNewCase: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})