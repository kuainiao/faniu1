var app = getApp();
var config = require('../../config.js');
var util = require('../../utils/util.js');
let pageDefault = require('../../utils/default');
var citys = require('../../utils/citys.js');

//获取城市数据
var cityData = citys.getData();
//组合成picker组件需要的数据
var multiArray = citys.initCity(cityData);
var provinceIndex = 0;
var provinceArray = cityData;
var cityArray = provinceArray[provinceIndex].sub;
var multiArray = [provinceArray, cityArray];

Page(util.extend({}, pageDefault, {
  data: {
    areaCode: null,
    longitude: "",
    latitude: "",
    selectActive: '',
    //专长领域需要的数据
    tabList: [],
    tabIndex: 0,
    //地区需要的数据
    multiArray: multiArray,
    multiIndex: [0, 0],
    //provinceArray: cityData,
    //cityArray: cityData[0],
    //provinceIndex: 0,
    //cityIndex: 0,
    //律师列表
    lawyerList: [],
    //地区编码
    areaid: 0,
    //分类
    catid: '',
    //翻页
    p: 1,
    //是否下拉刷新
    pullDown: false,
    //是否上拉加载
    reachBottom: false,
    area: '地区',
    categorys: '专长领域'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var code = options.code;
    that.getCategorys();
    if(code){
      this.setData({
        longitude: options.longitude,
        latitude: options.latitude,
        areaid: code ? code : 0
      });

      that.getLawyerList({
        areaid: that.data.areaid,
        catid: that.data.catid,
        p: that.data.p,
        pullDown: that.data.pullDown,
        reachBottom: that.data.reachBottom
      });
    }else{
      app.getAreaCode().then((res)=>{
        let code = wx.getStorageSync('areaCode');
        this.setData({
          longitude: options.longitude,
          latitude: options.latitude,
          areaid: code ? code : 0
        });

        that.getLawyerList({
          areaid: that.data.areaid,
          catid: that.data.catid,
          p: that.data.p,
          pullDown: that.data.pullDown,
          reachBottom: that.data.reachBottom
        });
      });
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
    var that = this;
    that.setData({
      lawyerList: [],
      p: 1,
      pullDown: true,
      reachBottom: false
    });
    that.getLawyerList({
      areaid: that.data.areaid,
      catid: that.data.catid,
      p: that.data.p,
      pullDown: that.data.pullDown,
      reachBottom: that.data.reachBottom
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    that.setData({
      p: ++that.data.p,
      pullDown: false,
      reachBottom: true
    });
    that.getLawyerList({
      areaid: that.data.areaid,
      catid: that.data.catid,
      p: that.data.p,
      pullDown: that.data.pullDown,
      reachBottom: that.data.reachBottom
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /*跳转到律师详情页面*/
  gotoLawyerDetail: function (e) {
    //console.log(e);
    var isreg = e.currentTarget.dataset.isreg;
    var call_fee = e.currentTarget.dataset.callfee;
    var userid = e.currentTarget.dataset.userid;
    wx.navigateTo({
      url: '../lawyerDetail/lawyerDetail?userid=' + userid,
    });

  },
  /*跳转到办公位置地图页面*/
  gotomapOfficeAddress: function (e) {
    console.log(e);
    //wx.navigateTo({
    //   url: '../mapOfficeAddress/mapOfficeAddress',
    //});
    wx.openLocation({
      latitude: Number(e.currentTarget.dataset.latitude),
      longitude: Number(e.currentTarget.dataset.longitude),
      scale: 18,
      name: '',
      address: e.currentTarget.dataset.address,
      success: function (res) {
        //console.log(res);
      },
      fail: function (res) {
        //console.log(res);
      },
      complete: function (res) {
        //console.log(res);
      }
    })
  },
  /*跳转到电话咨询页面*/
  gotolawyerDetailCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
    /*
    var isreg = e.currentTarget.dataset.isreg;
    var call_fee = parseFloat(e.currentTarget.dataset.callfee);
    var openid = e.currentTarget.dataset.openid;
    
    if (isreg == 1 && call_fee > 0) {
      wx.navigateToMiniProgram({
        appId: 'wx35ecd8a63ca91af4',
        path: 'pages/call/post2?to=' + openid,
        extraData: {},
        //envVersion: 'develop',
        success(res) {
          // 打开成功
          console.log(res);
        }
      })
    } else {
      wx.navigateTo({
        url: '../ask/post',
      });
    }
    */
  },
  /*跳转到公开咨询或一对一咨询*/
  gotopostask: function (e) {
    wx.switchTab({
      url: '../ask/post'
    });
    /*
    var isreg = e.currentTarget.dataset.isreg;
    var call_fee = e.currentTarget.dataset.callfee;
    var openid = e.currentTarget.dataset.openid;
    console.log(isreg);
    console.log(call_fee);
    if (isreg == 1) {
      wx.navigateToMiniProgram({
        appId: 'wx35ecd8a63ca91af4',
        path: 'pages/ask/post2?to=' + openid,
        extraData: {},
        //envVersion: 'develop',
        success(res) {
          // 打开成功
          console.log(res);
        }
      });
    } else {
      wx.switchTab({
        url: '../ask/post'
      })
    }
    */
  },
  /*专长领域picker组件事件*/
  bindPickerChange: function (e) {
    //console.log(e);
    //console.log(this.data.tabList[e.detail.value].name);
    //console.log(this.data.tabList[e.detail.value].id);
    var that = this;
    that.setData({
      tabIndex: e.detail.value,
      lawyerList: [],
      catid: that.data.tabList[e.detail.value].id,
      p: 1,
      pullDown: false,
      reachBottom: false,
      categorys: that.data.tabList[e.detail.value].name
    });
    that.getLawyerList({
      areaid: that.data.areaid,
      catid: that.data.catid,
      p: that.data.p,
      pullDown: that.data.pullDown,
      reachBottom: that.data.reachBottom
    });
  },
  /*地区picker组件事件*/
  bindMultiPickerChange: function (e) {
    //console.log(e);
    //console.log(this.data.multiArray[0][e.detail.value[0]].name, this.data.multiArray[1][e.detail.value[1]].name);
    //console.log(this.data.multiArray[0][e.detail.value[0]].code, this.data.multiArray[1][e.detail.value[1]].code);
    var that = this;
    that.setData({
      lawyerList: [],
      areaid: that.data.multiArray[1][e.detail.value[1]].code,
      catid: '',
      p: 1,
      pullDown: false,
      reachBottom: false,
      area: that.data.multiArray[0][e.detail.value[0]].name + '-' + that.data.multiArray[1][e.detail.value[1]].name
    });
    that.getLawyerList({
      areaid: that.data.areaid,
      catid: that.data.catid,
      p: that.data.p,
      pullDown: that.data.pullDown,
      reachBottom: that.data.reachBottom
    });
  },
  /*地区picker组件事件*/
  bindMultiPickerColumnChange: function (e) {
    if (e.detail.column == 0) {
      provinceIndex = e.detail.value;
      cityArray = null;
      cityArray = provinceArray[provinceIndex].sub;
      multiArray = [provinceArray, cityArray];
      this.setData({
        multiArray: multiArray
      })
    }
  },
  /*请求专长领域方法*/
  getCategorys: function () {
    var that = this;
    app.getServerInfo("Lbs/Index/getCategorys", {}, function (res) {
      //console.log(res.data);
      if (res.data.errcode == 0) {
        that.setData({
          tabList: res.data.data
        });
      } else {
        wx.showModal({
          title: '错误提示',
          content: res.data.message,
        })
      }
    }, 'post');
  },
  /*请求列表方法*/
  getLawyerList: function (obj) {
    //console.log(obj);
    wx.showNavigationBarLoading();//刷新加载
    var that = this;
    app.getServerInfo("Lbs/Index/lawyerList?areaid=" + obj.areaid + '&catid=' + obj.catid + '&p=' + obj.p, {}, function (res) {
      //console.log(res)
      //console.log(res.data.list);
      if (res) {
        wx.hideNavigationBarLoading() //完成停止加载
        if (obj.pullDown) {
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        if (res.data.errcode == 0) {
          //console.log(that.data.lawyerList);
          that.setData({
            lawyerList: that.data.lawyerList.concat(res.data.list)
          });
          //console.log(that.data.lawyerList);
        } else {
          wx.showModal({
            title: '错误提示',
            content: res.data.message,
          })
        }
      }
    }, 'get');
  }
}
));