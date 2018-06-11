// pages/lawyer/caseList.js
let app = getApp();
let util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //案件状态 省略是全部 1进行中 7结案 8确认结案 9已生成案例
    status: null,
    //搜索关键词
    keyword: '',
    //页码
    p: 1,
    //案件列表
    caseListArray: [],
    queryS: '',
    active: 'active1',
    btn: '',
    focus: false
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
    this.setData({
      active: 'active1'
    })
    this.data.queryS = '?p=' + this.data.p;
    this.data.caseListArray = [];
    this.getLawcasesList(this.data.queryS);
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
    this.data.p = 1;
    this.data.queryS = '?p=' + this.data.p;
    if (this.data.status != null){
      this.data.queryS += '&status=' + this.data.status;
    }
    this.data.caseListArray = [];
    this.getLawcasesList(this.data.queryS);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.p++;
    this.data.queryS = '?p=' + this.data.p;
    if (this.data.status != null) {
      this.data.queryS += '&status=' + this.data.status;
    }
    this.getLawcasesList(this.data.queryS);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //列表筛选——全部
  getAllData: function () {
    this.setData({
      active: 'active1',
      btn: 'btn1'
    })
    this.data.p = 1;
    this.data.queryS = '?p=' + this.data.p;
    this.data.caseListArray = [];
    this.getLawcasesList(this.data.queryS);
  },
  //列表筛选——进行中
  getStatus1Data: function () {
    this.setData({
      active: 'active2',
      btn: 'btn2'
    })
    this.data.p = 1;
    this.data.status = 1;
    this.data.queryS = '?p=' + this.data.p + '&status=' + this.data.status;
    this.data.caseListArray = [];
    this.getLawcasesList(this.data.queryS);
  },
  //列表筛选——已结案
  getStatus7Data: function () {
    this.setData({
      active: 'active3',
      btn: 'btn3'
    })
    this.data.p = 1;
    this.data.status = '7,8';
    this.data.queryS = '?p=' + this.data.p + '&status=' + this.data.status;
    this.data.caseListArray = [];
    this.getLawcasesList(this.data.queryS);
  },
  //列表筛选——成功案例
  getStatus9Data: function () {
    this.setData({
      active: 'active4',
      btn: 'btn4'
    })
    this.data.p = 1;
    this.data.status = 9;
    this.data.queryS = '?p=' + this.data.p + '&status=' + this.data.status;
    this.data.caseListArray = [];
    this.getLawcasesList(this.data.queryS);
  },
  //列表筛选——关键词搜索
  getKeyWordData: function (e) {
    this.data.p = 1;
    if (e.type == 'confirm') {
      this.data.keyword = e.detail.value;
    }
    if (e.type == 'submit') {
      this.data.keyword = e.detail.value.keyword;
    }
    this.data.queryS = '?p=' + this.data.p + '&keyword=' + this.data.keyword;
    if (this.data.status != null) {
      this.data.queryS += '&status=' + this.data.status;
    }
    if (this.data.keyword===''){
      return;
    }
    this.data.caseListArray = [];
    this.getLawcasesList(this.data.queryS);
  },
  //获取案件列表数据
  getLawcasesList: function (queryS) {
    let that = this;
    wx.showLoading({
      title: 'loading...',
    })
    app.getServerInfo("Lawcase/LawyerApi/lawcases" + queryS, {}, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        if (data.data != null && data.data.length > 0) {
          for (let i = 0; i < data.data.length; i++) {
            data.data[i].addtime = util.formatDateTime(Number(data.data[i].addtime));
          }
          that.setData({
            caseListArray: that.data.caseListArray.concat(data.data),
            btn: ''
          })
          wx.hideLoading();
        } else {
          that.setData({
            caseListArray: that.data.caseListArray.concat([]),
            btn: ''
          })
          wx.hideLoading();
          if (that.data.p > 1) {
            that.data.p--;
          }
        }
      } else {
        wx.hideLoading();
        wx.showModal({
          title: '错误提示',
          content: data.message,
          showCancel: false,
          success: function(res){
            if(res.confirm){
              wx.switchTab({
                url: 'index',
              })
            }
          }
        })
      }
    }, 'GET');
  },
  //删除案件——status状态9->8
  lawcaseDel: function (e) {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否删除此记录？',
      cancelText: '否',
      confirmText: '是',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中...',
          });
          let id = Number(e.currentTarget.dataset.id);
          app.getServerInfo("Lawcase/LawyerApi/lawcaseChange", { id: id, status: 8 }, function (res) {
            let data = res.data;
            if (data.errcode === 0) {
              wx.hideLoading();
              that.data.caseListArray = [];
              that.getLawcasesList(that.data.queryS);
              wx.showModal({
                title: '提示',
                content: '删除成功',
                showCancel: false
              })
            } else {
              wx.hideLoading();
              wx.showModal({
                title: '错误提示',
                content: data.message,
                showCancel: false
              })
            }
          }, 'POST');
          /*app.getServerInfo("Lawcase/LawyerApi/lawcaseDel?id=" + id, {}, function (res) {
            let data = res.data;
            if (data.errcode === 0) {
              console.log(that.data.caseListArray)
              for (let i = 0; i < that.data.caseListArray.length; i++) {
                if (that.data.caseListArray[i].id == id) {
                  that.data.caseListArray.splice(i, 1);
                }
              }
              that.setData({
                caseListArray: that.data.caseListArray.concat([])
              })
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '删除成功',
                showCancel: false
              })
            } else {
              wx.hideLoading();
              wx.showModal({
                title: '错误提示',
                content: data.message,
                showCancel: false
              })
            }
          }, 'GET');*/
        }
      }
    })
    
  },
  //打开案件详情页面
  gotoCaseDetail: function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'caseDetail?id='+id,
    })
  },
  //打开成功案例页面
  gotoSuccessCase: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'successCase?id=' + id,
    })
  },
  //打开生成案例页面
  gotoCaseExamples: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'caseExamples?id=' + id
    })
  }
})