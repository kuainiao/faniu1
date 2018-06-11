// pages/lawyer/newCase.js
let app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    categoryArray: [],
    index: null,
    //自定义的案件名
    name: null,
    //当事人
    litigants: [],
    //案件id
    id: null,
    title: '',
    catid: '',
    content: '',
    uids: '',
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
    let that = this;
    let id = wx.getStorageSync('id');
    if(id != ''){
      that.setData({
        id: id
      })
    }
    wx.getStorage({
      key: 'litigantsArr',
      success: function (res) {
        that.setData({
          litigants: JSON.parse(res.data)
        })
      },
    })
    wx.getStorage({
      key: 'newCaseFormData',
      success: function (res) {
        let data = JSON.parse(res.data);
        that.setData({
          id: that.data.id,
          title: data.title?data.title:'',
          catid: data.catid?data.catid:'',
          content: data.content?data.content:'',
          index: data.index?data.index:null,
          name: data.name?data.name:'',
          uids: data.uids?data.uids:''
        })
      },
    })
    that.lawcaseCategory();
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
  //案件类型变化事件
  bindPickerChange: function (e) {
    let that = this;
    if (that.data.categoryArray.length==0){
      return;
    }
    that.setData({
      index: e.detail.value
    })
    that.data.catid = that.data.categoryArray[e.detail.value].id;
    wx.getStorage({
      key: 'newCaseFormData',
      success: function (resp) {
        let dataS = JSON.parse(resp.data);
        dataS.catid = that.data.catid;
        dataS.index = e.detail.value;
        dataS.name = that.data.categoryArray[e.detail.value].name;
        wx.setStorage({
          key: 'newCaseFormData',
          data: JSON.stringify(dataS)
        })
      }
    })
  },
  //案件名称失去焦点事件
  bindTitleBlur: function (e) {
    let that = this;
    that.data.title = e.detail.value;
    wx.getStorage({
      key: 'newCaseFormData',
      success: function (resp) {
        let dataS = JSON.parse(resp.data);
        dataS.title = e.detail.value;
        wx.setStorage({
          key: 'newCaseFormData',
          data: JSON.stringify(dataS)
        })
      }
    })
  },
  //备注失去焦点事件
  bindContentBlur: function (e) {
    let that = this;
    that.data.content = e.detail.value;
    wx.getStorage({
      key: 'newCaseFormData',
      success: function (resp) {
        let dataS = JSON.parse(resp.data);
        dataS.content = e.detail.value;
        wx.setStorage({
          key: 'newCaseFormData',
          data: JSON.stringify(dataS)
        })
      }
    })
  },
  //获取案件类型
  lawcaseCategory: function () {
    let that = this;
    app.getServerInfo("/Lawcase/LawyerApi/lawcaseCategory", {}, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        that.setData({
          categoryArray: data.data
        })
        if(that.data.name!=null){
          for (var i = 0; i < that.data.categoryArray.length; i++) {
            if (that.data.name != null && that.data.categoryArray[i].name == that.data.name) {
              that.setData({
                index: i
              })
            }
          }
          wx.getStorage({
            key: 'newCaseFormData',
            success: function (resp) {
              let dataS = JSON.parse(resp.data);
              dataS.index = that.data.index;
              wx.setStorage({
                key: 'newCaseFormData',
                data: JSON.stringify(dataS)
              })
            }
          })
        }
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
  //删除当事人
  delLitigants: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定删除当事人',
      success: function (res) {
        if (res.confirm) {
          //console.log('用户点击确定')
          for (let i = 0; i < that.data.litigants.length; i++) {
            if (id == that.data.litigants[i].id) {
              that.data.litigants[i].selected = 0;
            }
          }
          that.setData({
            litigants: that.data.litigants
          })
          wx.setStorage({
            key: 'litigantsArr',
            data: JSON.stringify(that.data.litigants),
          })
        } 
      }
    })
    
  },
  //打开自定义案件类型页面
  gotoNewCaseType: function () {
    wx.navigateTo({
      url: 'newCaseType',
    })
  },
  //打开选择当事人页面
  gotoChooseCustomer: function () {
    let queryS = '';
    if(this.data.id){
      queryS = '?id='+this.data.id;
    }
    wx.navigateTo({
      url: 'chooseCustomer'+queryS,
    })
  },
  //打开案件列表页面
  gotoCaseList: function(e){
    let that = this;
    let obj = {};
    if (that.data.id!=null){
      obj.id = that.data.id;
    }
    if (e.detail.value.title == '') {
      wx.showModal({
        title: '提示',
        content: '案件名称不能为空',
          showCancel: false
      })
      return;
    }
    obj.title = e.detail.value.title;
    if (e.detail.value.catid === '' || e.detail.value.catid === null) {
      wx.showModal({
        title: '提示',
        content: '案件类型不能为空',
          showCancel: false
      })
      return;
    }
    obj.catid = that.data.categoryArray[e.detail.value.catid].id;
    if(e.detail.value.uids.length>0){
      obj.uids = e.detail.value.uids.join(',');
    }
    obj.content = e.detail.value.content;
    app.getServerInfo("/Lawcase/LawyerApi/lawcaseEdit", obj, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        wx.setStorageSync('litigantsArr', '[]');
        wx.setStorageSync('newCaseFormData', '{}');
        wx.setStorageSync('id', '')
        if(obj.uids){
          wx.navigateTo({
            url: 'chooseSMSCustomer?id=' + data.data.id,
          })
        }else{
          wx.reLaunch({
            url: 'caseList'
          })
        }
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