// pages/lawyer/caseDetail.js
let app = getApp();
let util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //案件id
    id: null,
    //详情数据
    detailMsg: null,
    //当事人列表
    litigants: [],
    //案件混合信息列表
    lawcaseMixMsgArray: [],
    //textarea的value值
    textareaValue: '',
    //上传图片的urls
    urls: [],
    //以下数据用于点击案件编辑保存本地数据
    title:null,
    catid:null,
    content:null,
    index:null,
    name: null,
    uids:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.data.id = options.id;
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
    //this.getLawcaseDetail();
    //this.getlawcaseMixMsg();
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
  //详情数据和混合信息列表数据处理
  handingData: function () {
    let that =this;
   wx.showLoading({
      title: 'loading...',
    })
    Promise.race([that.getLawcaseDetail(), that.getlawcaseMixMsg()]).then(function(res){
      wx.hideLoading();
    })
  },
  //详情数据请求
  getLawcaseDetail: function () {
    let that = this;
    return new Promise((resolve, reject) => {
      app.getServerInfo("Lawcase/LawyerApi/lawcaseDetail?id=" + that.data.id, {}, function (res) {
        let data = res.data;
        console.log(data)
        let uids = [];
        if (data.errcode === 0) {
          data.data.addtime = util.formatDateTime(Number(data.data.addtime));
          for (let i = 0; i < data.litigants.length; i++) {
            data.litigants[i].selected = '1';
            uids.push(data.litigants[i].id);
          }
          that.setData({
            detailMsg: data.data,
            litigants: data.litigants.length > 0 ? data.litigants : []
          })
          that.data.title = data.data.title;
          that.data.catid = data.data.catid;
          that.data.content = data.data.content;
          that.data.index = null;
          that.data.name = data.data.catname;
          that.data.uids = uids.join(',');
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
  //删除案件
  lawcaseDel: function () {
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
          app.getServerInfo("Lawcase/LawyerApi/lawcaseDel?id=" + that.data.id, {}, function (res) {
            let data = res.data;
            if (data.errcode === 0) {
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '删除成功',
                showCancel: false
              })
              that.gotoCaseList();
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
  //打开案件编辑页面
  gotoNewCase: function () {
    let that = this;
    wx.setStorage({
      key: 'id',
      data: this.data.id,
      success: function () {
        wx.setStorageSync('litigantsArr', JSON.stringify(that.data.litigants) );
        wx.setStorageSync('newCaseFormData',
          JSON.stringify({
            title: that.data.title,
            catid: that.data.catid,
            content: that.data.content,
            index: that.data.index,
            name: that.data.name,
            uids: that.data.uids
          })
        );
        wx.switchTab({
          url: 'newCase',
        })
      }
    })
  },
  //返回列表页
  gotoCaseList: function () {
    wx.navigateBack({
      delta: 1
    });
  },
  //获取案件混合信息列表
  getlawcaseMixMsg: function () {
    let that = this;
    return new Promise((resolve, reject) => {
      app.getServerInfo("Lawcase/LawyerApi/lawcaseMixMsg?lawcaseId=" + that.data.id, {}, function (res) {
        let data = res.data;
        if (data.errcode === 0) {
          for (let i = 0; i < data.data.length; i++) {
            data.data[i].addtime = util.formatDateTime(Number(data.data[i].addtime));
            if (data.data[i].type == 2) {
              data.data[i].addtime = data.data[i].addtime.split(' ')[0];
            }
          }
          that.setData({
            lawcaseMixMsgArray: data.data
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
  //图片预览
  previewImg: function (e) {
    let url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    })
  },
  //发送
  send: function (e,urls) {
    let that = this;
    let obj = {};
    obj.lawcaseId= that.data.id;
    if(e){
      if (e.detail.value.content == '') {
        return;
      }
      obj.content = e.detail.value.content;
      obj.type = 1;
      obj.formid = e.detail.formId;
    }else{
      obj.content = urls;
      obj.type = 2;
    }
    app.getServerInfo("Lawcase/LawyerApi/lawcaseMsgAdd", obj , function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        that.setData({
          textareaValue: ''
        })
        that.getlawcaseMixMsg();
        wx.hideLoading();
      } else {
        wx.hideLoading();
        wx.showModal({
          title: '错误提示',
          content: data.message,
            showCancel: false
        })
      }
    }, 'POST');
  },
  //上传图片
  uploadimg: function () {
    let that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '图片上传中',
        })
        var tempFilePaths = res.tempFilePaths;
        that.data.urls = [];
        let list = [];
        function promiseListFun(url){
          return new Promise((resolve, reject) => {
            wx.uploadFile({
              url: 'https://www.faniuwenda.com/WeApp/Upload/image',
              filePath: url,
              name: 'file',
              header: { 'Cookie': 'PHPSESSID=' + app.session('session_id') },
              formData: {
                'type': 3
              },
              success: function (r) {
                let data = JSON.parse(r.data);
                if (data.errcode == 0) {
                  resolve(data.url);
                  that.data.urls.push(data.url);
                  //if (i == (tempFilePaths.length - 1)) {
                  //  that.send(undefined, that.data.urls.join(','));
                  //}
                }
              }
            })
          })
        }
        for (let i = 0; i < tempFilePaths.length; i++) {
          list.push(promiseListFun(tempFilePaths[i]));
        }
        Promise.all(list).then(function (res) {
          that.send(undefined, that.data.urls.join(','));
        })
      }
    })
  },
  //打开案件进程页面
  gotoCaseProcess: function (e) {
    let that = this;
    let queryS = '';
    //有进程id和没有进程id
    if(e.currentTarget.dataset.id){
      queryS = '&id=' + e.currentTarget.dataset.id;
      that.getLawcaseMsgList(e.currentTarget.dataset.id).then(function(res){
        wx.navigateTo({
          url: 'caseProcess?lawcaseId=' + that.data.id + queryS,
        })
      });
    }else{
      wx.setStorage({
        key: 'lawcaseMsgArr',
        data: '[]',
        success: function () {
          wx.navigateTo({
            url: 'caseProcess?lawcaseId=' + that.data.id + queryS,
          })
        }
      })
    }
  },
  //案件消息列表请求
  getLawcaseMsgList: function (eventId) {
    let that = this;
    let queryS = '';
    queryS = '?eventId=' + eventId + '&type=2';
    return new Promise((resolve, reject) => {
      app.getServerInfo("Lawcase/LawyerApi/lawcaseMsg" + queryS, {}, function (res) {
        let data = res.data;
        if (data.errcode === 0) {
          for (let i = 0; i < data.data.length; i++) {
            data.data[i].addtime = util.formatDateTime(Number(data.data[i].addtime));
          }
          wx.setStorage({
            key: 'lawcaseMsgArr',
            data: JSON.stringify(data.data.length > 0 ? data.data : []),
          })
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
  //删除案件进程
  lawcaseEventDel: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '是否删除此记录？',
      cancelText: '否',
      confirmText: '是',
      success: function (res) {
        if (res.confirm) {
          app.getServerInfo("Lawcase/LawyerApi/lawcaseEventDel?id=" + id, {}, function (res) {
            let data = res.data;
            if (data.errcode === 0) {
              that.getlawcaseMixMsg();
              wx.showModal({
                title: '提示',
                content: '删除成功！',
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
  //打开选择当事人页面
  gotoChooseCustomer: function () {
    wx.navigateTo({
      url: 'chooseCustomer?id=' + this.data.id,
    })
  },
  //打开删除当事人页面
  gotoDeleteCustomer: function () {
    if (this.data.litigants.length==0){
      wx.showModal({
        title: '提示',
        content: '请选邀请当事人',
          showCancel: false
      });
      return;
    }
    wx.navigateTo({
      url: 'deleteCustomer?id='+this.data.id,
    })
  },
  //结案被点击——修改案件status 1->7 成功跳转页面
  endCase: function () {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否结案？',
      cancelText: '否',
      confirmText: '是',
      success: function (res) {
        if (res.confirm) {
          app.getServerInfo("Lawcase/LawyerApi/lawcaseChange", { id: that.data.id, status: 7 }, function (res) {
            let data = res.data;
            if (data.errcode === 0) {
              that.getLawcaseDetail();
              wx.showModal({
                title: '提示',
                content: '结案成功',
                showCancel: false
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
  //确认结案被点击——打开生成案例页面——修改案件status 7->8 成功跳转页面
  gotoCaseExamples: function () {
    let that = this;
    app.getServerInfo("Lawcase/LawyerApi/lawcaseChange", { id: that.data.id, status: 8}, function (res) {
      let data = res.data;
      if (data.errcode === 0) {
        wx.navigateTo({
          url: 'caseExamples?id=' + that.data.id + '&status=8',
        });
        /*wx.reLaunch({
          url: 'caseExamples?id=' + that.data.id + '&status=8',
        }); */     
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