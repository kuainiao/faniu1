// pages/lawyer/chooseCustomer.js
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lawcaseId: null,
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
    if(options.id){
      this.data.lawcaseId = options.id;
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
  //已选过当事人与请求当事人列表数据整合
  handingData: function (){
    let that = this;
    Promise.all([that.getOldLitigants(), that.getLitigants()]).then(function(res){
      let oldC = res[0];
      let newC = res[1];
      console.log(res)
      for(let i=0;i<newC.length;i++){
        for(let k=0;k<oldC.length;k++){
          if(oldC[k].selected==1&&newC[i].id==oldC[k].id){
            newC[i].selected =1;
          }
        }
      }
      that.setData({
        litigantsArr: newC
      })
    })
  },
  //获取已选过的当事人数据
  getOldLitigants: function () {
    let that = this;
    return new Promise((resolove, reject) => {
      wx.getStorage({
        key: 'litigantsArr',
        success: function (res) {
          let data = JSON.parse(res.data);
          resolove(data);
        }
      })
    })
  },
  //获取我的当事人列表
  getLitigants: function () {
    let that = this;
    return new Promise((resolove, reject) => {
      let queryS = '';
      if (that.data.lawcaseId != null){
        queryS = '?lawcaseId=' + that.data.lawcaseId;
      }
      app.getServerInfo("/Lawcase/LawyerApi/litigants" + queryS, {}, function (res) {
        let data = res.data;
        if (data.errcode === 0) {
          if(data.data.length>0){
            resolove(data.data);
            /*that.setData({
              litigantsArr: data.data
            })*/
          }
        } else {
          /*wx.showModal({
            title: '错误提示',
            content: data.message,
          })*/
        }
      }, 'GET');
    })
  },
  //添加当事人
  litigantAdd: function (e) {
    let that = this;
    let name = e.detail.value.name;
    let mobile = e.detail.value.mobile;
    if (name == '') {
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
    app.getServerInfo("/Lawcase/LawyerApi/litigantAdd", { name: name, mobile: mobile}, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        that.handingData();
        wx.showModal({
          title: '提示',
          content: '添加成功',
            showCancel: false
        })
        that.setData({
          name: '',
          mobile: ''
        })
        that.addMaskHide();
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
  //通知当事人蒙版
  smsMaskShow: function (e) {
    let that = this;
    //let litigantsArr = [];
    let checkbox = e.detail.value.checkbox;
    if (checkbox.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择当事人',
          showCancel: false
      })
      return;
    }
    this.setData({
      sms: true
    })
    for (let i = 0; i < checkbox.length; i++) {
      that.data.litigantsArr[checkbox[i]].selected = 1;
      //litigantsArr.push(that.data.litigantsArr[checkbox[i]]);
      that.data.uids += that.data.litigantsArr[checkbox[i]].id + ',';
    }
    that.data.uids = that.data.uids.slice(0,-1);
    //console.log(that.data.litigantsArr)
    wx.setStorage({
      key: 'litigantsArr',
      data: JSON.stringify(that.data.litigantsArr)
    })
    that.gotoNewCase();
  },
  smsMaskHide: function () {
    this.setData({
      sms: false
    })
  },
  //修改当事人
  lawcaseLitigantEdit: function () {
    let that = this;
    app.getServerInfo("Lawcase/LawyerApi/lawcaseLitigantEdit", { id: that.data.lawcaseId, uids: that.data.uids, do: 'edit' }, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.showModal({
          title: '错误提示',
          content: data.message,
            showCancel: false
        })
      }
    }, 'POST');
  },
  //打开创建案例页面或返回详情页面
  gotoNewCase: function(){
    if (this.data.lawcaseId){
      this.lawcaseLitigantEdit();
    }else{
      wx.switchTab({
        url: 'newCase'
      })
    }
  }
})