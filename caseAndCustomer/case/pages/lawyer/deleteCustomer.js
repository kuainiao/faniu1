// pages/lawyer/deleteCustomer.js
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //案件id
    id: null,
    litigantsArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.data.id= options.id;
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
    this.getLitigants();
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
    app.getServerInfo("Lawcase/LawyerApi/litigants?lawcaseId="+this.data.id, {}, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        that.setData({
          litigantsArr: data.data
        })
      } else {
        wx.showModal({
          title: '错误提示',
          content: data.message,
            showCancel: false
        })
      }
    }, 'GET');
  },
  //删除当事人——修改当事人
  lawcaseLitigantEdit: function (e) {
    let that = this;
    let uids = e.detail.value.uids.join(',');
    wx.showModal({
      title: '提示',
      content: '确定删除当事人？',
      cancelText: '否',
      confirmText: '是',
      success: function (res) {
        if(res.confirm){
          app.getServerInfo("Lawcase/LawyerApi/lawcaseLitigantEdit", { id: that.data.id, uids: uids, do: 'del' }, function (res) {
            let data = res.data;
            if (data.errcode === 0) {
              wx.showModal({
                title: '提示',
                content: '删除成功',
                showCancel: false,
                success: function (re) {
                  if(re.confirm){
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                }
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
  },
  //返回案件详情页面
  gotoCaseDetail: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})