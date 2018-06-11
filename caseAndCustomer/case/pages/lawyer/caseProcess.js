// pages/lawyer/caseProcess.js
let app = getApp();
let util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //案件进行详情
    detailMsg: null,
    //案件进程节点数据
    nodeIndex: null,
    nodesArray: [],
    //进程id
    id: null,
    //案件id
    lawcaseId: null,
    //结点id
    nodeId: null,
    //进程描述
    content: null,
    //进程内容 逗号分隔消息id
    msgIds: '',
    msgIdsName: '',
    //进程日期
    time: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        id: options.id
      })
    }
    if (options.lawcaseId){
      this.data.lawcaseId = options.lawcaseId;
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
    let that = this;
    that.getNodes().then(function(res){
      if (that.data.id) {
        that.lawcaseEventDetail(res);
      }
    });
    wx.getStorage({
      key: 'lawcaseMsgArr',
      success: function(res) {
        let data = JSON.parse(res.data);
        let msgIdsName = [];
        for(let i=0;i<data.length;i++){
          that.data.msgIds += data[i].id +',';
          if (msgIdsName.indexOf(data[i].addtime.slice(0, 10))==-1){
            msgIdsName.push(data[i].addtime.slice(0,10));
          }
        }
        that.data.msgIds = that.data.msgIds.slice(0,-1);
        if (msgIdsName.length!=0){
          that.setData({
            msgIdsName: '您选择了' + msgIdsName.join(',') + '聊天记录进行归档'
          })
        }
      }
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
  //有id的请求案件进行详情
  lawcaseEventDetail: function (nodesArray) {
    let that = this;
    app.getServerInfo("Lawcase/LawyerApi/lawcaseEventDetail?id="+that.data.id, {}, function (res) {
      let data = res.data;
      let nodeIndex;
      if (data.errcode === 0) {
        //msgIds: null
        for (let i = 0; i < that.data.nodesArray.length;i++){
          if (that.data.nodesArray[i].id == data.data.node_id){
            nodeIndex = i;
          }
        }
        that.setData({
          content: data.data.content,
          nodeId: data.data.node_id,
          nodeIndex: nodeIndex,
          time: util.formatDate(Number(data.data.time))
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
  //案件进程节点变化事件
  bindNodeChange: function (e) {
    this.setData({
      nodeIndex: e.detail.value
    })
    this.data.nodeId = this.data.nodesArray[e.detail.value].id;
  },
  //获取案件进程节点列表
  getNodes: function () {
    let that = this;
    return new Promise((resolve,reject) => {
      app.getServerInfo("Lawcase/LawyerApi/nodes?type=0", {}, function (res) {
        let data = res.data;
        if (data.errcode === 0) {
          that.setData({
            nodesArray: data.data
          });
          resolve(data.data);
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
  //选择时间
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  //表单提交
  lawcaseEventEdit: function (e) {
    let that = this;
    let obj = {};
    if(that.data.id != null){
      obj.id = that.data.id;
    }
    obj.lawcaseId = that.data.lawcaseId;
    if(e.detail.value.content==''){
      wx.showModal({
        title: '提示',
        content: '进程描述不能为空',
          showCancel: false
      })
      return;
    }
    obj.content = e.detail.value.content;
    obj.msgIds = that.data.msgIds;
    if(e.detail.value.nodeId===null){
      wx.showModal({
        title: '提示',
        content: '案件进程不能为空',
          showCancel: false
      })
      return;
    }
    obj.nodeId = this.data.nodesArray[e.detail.value.nodeId].id;
    if (e.detail.value.time === null) {
      wx.showModal({
        title: '提示',
        content: '选择时间不能为空',
          showCancel: false
      })
      return;
    }
    obj.time = e.detail.value.time;
    app.getServerInfo("Lawcase/LawyerApi/lawcaseEventEdit", obj, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        wx.removeStorageSync('lawcaseMsgArr');
        that.gotoCaseDetail();
      } else {
        wx.showModal({
          title: '错误提示',
          content: data.message,
            showCancel: false
        })
      }
    }, 'POST');
  },
  //打开选择进程内容页面
  gotoChooseProcessContent: function () {
    let queryS = '';
    if(this.data.id){
      queryS = '&eventId=' + this.data.id;
    }
    wx.navigateTo({
      url: 'chooseProcessContent?lawcaseId=' + this.data.lawcaseId + queryS,
    })
  },
  //打开自定义进程页面
  gotoCaseProcessName: function () {
    wx.navigateTo({
      url: 'caseProcessName',
    })
  },
  //返回案件详情页面
  gotoCaseDetail: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})