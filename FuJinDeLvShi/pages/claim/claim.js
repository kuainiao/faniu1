var app = getApp(), page;
var config = require('../../config.js');
var util = require('../../utils/util.js');
let pageDefault = require('../../utils/default');
var citys = require('../../utils/citys.js');

//获取城市数据
var cityData = citys.getData();
//组合成picker组件需要的数据
var multiArray = cityData[0].sub;
/*省市区接口请求方法*/
var provinceArray ,cityArray,areaArray;
function getProvinceCityArea() {
  var that = this;
  app.getServerInfo("Lbs/Index/getAreas", {}, function (res) {
    var province = [];
    var city = [];
    var area = [];
    var data;
    var i, k, v;
    if (res.data.errcode == 0) {
      data = res.data.data;
      for (i = 0; i < data.length; i++) {
        if (data[i].level == 1) {
          data[i].children = [];
          province.push(data[i]);
        }
        if (data[i].level == 2) {
          data[i].children = [];
          city.push(data[i]);
        }
        if (data[i].level == 3) {
          area.push(data[i]);
        }
      }
      for (v = 0; v < area.length; v++) {
        for (k = 0; k < city.length; k++) {
          if (area[v].parent == city[k].code) {
            city[k].children.push(area[v]);
          }
        }
      }
      for (v = 0; v < city.length; v++) {
        for (k = 0; k < province.length; k++) {
          if (city[v].parent == province[k].code) {
            province[k].children.push(city[v]);
          }
        }
      }
      //console.log(province)
      provinceArray = province;
      cityArray = provinceArray[0].children;
      areaArray = cityArray[0].children;
    }
  });
}
getProvinceCityArea();

Page(util.extend({}, pageDefault,{

  /**
   * 页面的初始数据
   */
  data: {
    userid: null,
    detailMsg: null,
    //擅长领域数据
    tabList: null,
    //表单提交数据
    formData: {
      userid: '',
      name: '',
      mobile: '',
      email: '',
      no: '',
      firm: '',
      areaid: '',
      address: '',
      catids: '',
      fileurl: '',
      intro: '',
      imgSrc: '',
      imgshow: 'hide'
    },
    //picker数据
    provinceArray: null,
    cityArray: null,
    areaArray: null,
    provinceIndex: 0,
    cityIndex: 0,
    areaIndex:0,
    provinceCityArea: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      userid: options.userid,
      provinceArray: provinceArray,
      cityArray: cityArray,
      //areaArray: areaArray
    });
    that.data.formData.userid = options.userid;
    if(options.userid != undefined){
      that.request();
    }
    that.getCategorys();
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
    page.checkLogin();
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
  /**
   * 选择图片
   */
  updataImg: function(){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed '],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        for(var i=0;i<tempFilePaths.length;i++){
          (function(i){
            wx.saveFile({
              tempFilePath: tempFilePaths[i],
              success: function (re) {
                var savedFilePath = re.savedFilePath;
                wx.uploadFile({
                  url: 'https://www.faniuwenda.com/Lbs/Upload/image',
                  filePath: savedFilePath,
                  name: 'file',
                  formData: {  },
                  success: function (r) {
                    var data = r.data;
                    that.data.formData.fileurl = JSON.parse(data).url;
                    that.setData({
                      imgSrc: JSON.parse(data).url,
                      imgshow: 'show'
                    });
                    wx.showModal({
                      title: '提示',
                      content: '上传成功',
                    })
                  }
                })
              }
            });
          })(i)
        }
        
      }
    })
  },
  getCategorys: function(){
    var that = this;
    app.getServerInfo("Lbs/Index/getCategorys", {}, function (resb) {
      if (resb.data.errcode == 0) {
        that.setData({
          tabList: resb.data.data
        });
      } else {
        wx.showModal({
          title: '错误提示',
          content: res.data.message,
        })
      }
    })
  },
  /*请求所需数据*/
  request: function(){
    var that = this;
    app.getServerInfo("Lbs/Index/getCategorys", {}, function (resb) {
      //console.log(resb.data);
      app.getServerInfo("Lbs/Index/lawyerDetail?userid=" + that.data.userid, {}, function (res) {
        //console.log(res);
        var ind,v;
        if (resb.data.errcode == 0&&res.data.errcode==0) {
          for (var i = 0; i < resb.data.data.length; i++) {
            var name1 = resb.data.data[i].name;
            var name2 = res.data.data.cats[Number(resb.data.data[i].id)];
            if (name1 == name2) {
              resb.data.data[i].checked = true;
            } else {
              resb.data.data[i].checked = false;
            }
          }
          that.setData({
            tabList: resb.data.data,
            detailMsg: res.data.data
          });
          for (ind = 0; ind < cityData.length; ind++) {
            if (cityData[ind].code.slice(0, 2) == that.data.detailMsg.areaid.slice(0, 2)) {
              for (v = 0; v < cityData[ind].sub.length; v++) {
                if (cityData[ind].sub[v].code.slice(0,4) == that.data.detailMsg.areaid.slice(0,4)) {
                  that.setData({
                    provinceIndex: ind,
                    cityIndex: v,
                    cityArray: cityData[ind].sub
                  });
                }
              }
            }
          }
        } else {
          wx.showModal({
            title: '错误提示',
            content: res.data.message,
          })
        }
      }, 'get');
    }, 'post');
  },
  //地区选择
  bindProvinceChange: function (e) {
    console.log(e)
    var that = this;
    that.setData({
      provinceIndex: e.detail.value,
      cityArray: that.data.provinceArray[e.detail.value].children,
      cityIndex: 0,
      areaArray: that.data.provinceArray[e.detail.value].children[0].children,
      areaIndex: 0
    });
    //that.data.formData.areaid = ;
  },
  bindCityChange: function (e) {
    var that = this;
    console.log(e)
    that.setData({
      cityIndex: e.detail.value,
      areaArray: that.data.cityArray[e.detail.value].children,
      areaIndex: 0
    })
  },
  bindAreaChange: function (e) {
    var that = this;
    console.log(e)
    that.setData({
      areaIndex: e.detail.value
    })
  },
  /*表单提交*/
  formSubmit: function(e){
    //console.log(e);
    var reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/; 
    var that = this;
    var data = e.detail.value;
    //console.log(e.detail.value);
    that.data.formData.name = data.name;
    that.data.formData.mobile = data.mobile;
    that.data.formData.email = data.email;
    that.data.formData.no = data.no;
    that.data.formData.firm = data.firm;
    if (!!that.data.provinceArray[that.data.provinceIndex].code){
      that.data.formData.areaid = that.data.provinceArray[that.data.provinceIndex].code;
    }
    if (!!that.data.cityArray[that.data.cityIndex].code){
      that.data.formData.areaid = that.data.cityArray[that.data.cityIndex].code;
    }
    if (!!that.data.areaArray){
      that.data.formData.areaid = that.data.areaArray[that.data.areaIndex].code;
    }
    that.data.formData.address = data.address;
    that.data.formData.catids = data.catids.join(',');
    that.data.formData.intro = data.intro;
    console.log(that.data.formData)
    if(that.data.formData.name==''){
      wx.showModal({
        title: '提示',
        content: '姓名不能为空',
      })
      return;
    }
    if (that.data.formData.mobile == '') {
      wx.showModal({
        title: '提示',
        content: '手机号码不能为空',
      })
      return;
    }
    if (!/^1[0-9]{10}/.test(that.data.formData.mobile)) {
      wx.showModal({
        title: '提示',
        content: '手机号码输入格式不正确',
      })
      return;
    }
    if (that.data.formData.email == '') {
      wx.showModal({
        title: '提示',
        content: '电子邮箱不能为空',
      })
      return;
    }
    if (!reg.test(that.data.formData.email)) {
      wx.showModal({
        title: '提示',
        content: '电子邮箱格式不正确',
      })
      return;
    }
    if (that.data.formData.no == '') {
      wx.showModal({
        title: '提示',
        content: '执业证号不能为空',
      })
      return;
    }
    if (that.data.formData.firm == '') {
      wx.showModal({
        title: '提示',
        content: '执业律所不能为空',
      })
      return;
    }
    if (that.data.formData.areaid == '') {
      wx.showModal({
        title: '提示',
        content: '所在地区不能为空',
      })
      return;
    }
    if (that.data.formData.address == '') {
      wx.showModal({
        title: '提示',
        content: '详细地址不能为空',
      })
      return;
    }
    if (that.data.formData.catids == '') {
      wx.showModal({
        title: '提示',
        content: '擅长领域不能为空',
      })
      return;
    }
    if (that.data.formData.fileurl == '') {
      wx.showModal({
        title: '提示',
        content: '执业证书必传',
      })
      return;
    }
    if (that.data.formData.intro == '') {
      wx.showModal({
        title: '提示',
        content: '简介不能为空',
      })
      return;
    }
    app.getServerInfo("Lbs/Index/register", that.data.formData, function (res) {
      console.log(res);
      if(res.data.errcode == 0){
        wx.showModal({
          title: '提示',
          content: '保存成功',
        })
      } else {
        wx.showModal({
          title: '错误提示',
          content: res.data.message,
        })
      }
    },'post');
  }
}
));