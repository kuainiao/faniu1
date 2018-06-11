// pages/lawyer/caseExamples.js
let app = getApp();
let util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //案件id
    id: null,
    //案件状态
    status: null,
    //详情数据
    detailMsg: null,
    //案件进程列表数据
    lawcaseEventsArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.data.id = options.id;
    }
    if(options.status){
      this.data.status = options.status;
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
    this.handingData();
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
  //数据混合处理
  handingData: function () {
    let that = this;
    wx.showLoading({
      title: 'loading...',
    })
    Promise.race([that.getLawcaseDetail(), that.getlawcaseEvents()]).then(function(result){
      wx.hideLoading();
    })
  },
  //详情数据请求
  getLawcaseDetail: function () {
    let that = this;
    return new Promise((resolve, reject) => {
      app.getServerInfo("Lawcase/LawyerApi/lawcaseDetail?id=" + that.data.id, {}, function (res) {
        let data = res.data;
        if (data.errcode === 0) {
          data.data.addtime = util.formatDateTime(Number(data.data.addtime));
          that.setData({
            detailMsg: data.data,
            litigants: data.litigants.length > 0 ? data.litigants : []
          })
          for (let i = 0; i < data.litigants.length; i++) {
            data.litigants[i].selected = '1';
          }
          resolve(data);
        } else {
          wx.showModal({
            title: '错误提示',
            content: data.message,
              showCancel: false
          })
        }
      }, 'GET');
    })
  },
  //获取案件进程列表
  getlawcaseEvents: function () {
    let that = this;
    return new Promise((resolve, reject) => {
      app.getServerInfo("Lawcase/LawyerApi/lawcaseEvents?lawcaseId=" + that.data.id, {}, function (res) {
        let data = res.data;
        if (data.errcode === 0) {
          for (let i = 0; i < data.data.length; i++) {
            data.data[i].time = util.formatDateTime(Number(data.data[i].time)).split(' ')[0];
          }
          that.setData({
            lawcaseEventsArray: data.data
          });
          resolve(data);
        } else {
          wx.showModal({
            title: '错误提示',
            content: data.message,
              showCancel: false
          })
        }
      }, 'GET');
    })
  },
  //修改案件进程隐藏状态
  lawcaseEventChange: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let show = e.currentTarget.dataset.show;
    if(show==0){
      show=1;
    }else{
      show = 0;
    }
    app.getServerInfo("Lawcase/LawyerApi/lawcaseEventChange?id=" + id+'&show='+show, {}, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        wx.showModal({
          title: '提示',
          content: '修改成功！',
            showCancel: false
        })
        that.getlawcaseEvents();
      } else {
        wx.showModal({
          title: '错误提示',
          content: data.message,
            showCancel: false
        })
      }
    }, 'GET');
  },
  //打开成功案例页面——修改案件status 8->9 成功跳转页面
  gotoSuccessCase: function () {
    let that = this;
    app.getServerInfo("Lawcase/LawyerApi/lawcaseChange", { id: that.data.id, status: 9 }, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        wx.navigateTo({
          url: 'successCase?id=' + that.data.id,
        });
        /*wx.reLaunch({
          url: 'successCase?id=' + that.data.id,
        });*/
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