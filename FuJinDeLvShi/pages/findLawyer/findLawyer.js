var app = getApp();
var config = require('../../config');
var util = require('../../utils/util.js');
let pageDefault = require('../../utils/default');

var list;
var longitude = '', latitude = '';
var map;
let loading = false;
let isToggleArea = false;
let lat1, lng1, lat2, lng2;
var distance;
var EARTH_RADIUS = 6378137.0;    //单位M
var PI = Math.PI;
let flag = false;
let timeout;
let i = 0;
let page;
function getRad(d) {
  return d * PI / 180.0;
}
function getFlatternDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = getRad(lat1);
  var radLat2 = getRad(lat2);

  var a = radLat1 - radLat2;
  var b = getRad(lng1) - getRad(lng2);

  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000.0;

  return s;
}

Page(util.extend({}, pageDefault, {

  /**
   * 页面的初始数据
   */
  data: {
    longitude: "",
    latitude: "",
    mapLaclNum: 0,
    controls: [],
    markers: [],
    covers: [],
    areaCode: '',
    scale: null,
    radius: 5,
    methodtId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = this;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    map = wx.createMapContext('map', this);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    lat1 = undefined, lng1 = undefined, lat2 = undefined, lng2 = undefined;

    page.data.areaCode = wx.getStorageSync('areaCode');

    this.getMapApi().then((success) => {
      page.handlingData();
    }).catch((fail) => {
      console.log(fail);
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    console.log(options)
  },
  /**
   * 跳转到律师列表页面
   */
  gotolawyerList: function () {
    var that = this;
    let longitude = this.data.longitude;
    let latitude = this.data.latitude;
    app.getAreaCode().then((res) => {
      let code = wx.getStorageSync('areaCode');
      wx.navigateTo({
        url: '../lawyerList/lawyerList?areaCode=' + code + '&longitude=' + longitude + '&latitude=' + latitude
      });
    });
  },
  /**
   * 跳转到地区选择页面
   */
  togochooseArea: function () {
    wx.navigateTo({
      url: '../chooseProvince/chooseProvince',
    })
  },
  /**
  * 请求地区接口
  */
  getMapApi: function () {
    var that = this;
    //用定位还是用页面跳转来的areaCode
    return new Promise((resolve, reject) => {
      if (!app.globalData.selectAreaCode) {
        wx.getLocation({
          type: 'gcj02', //返回可以用于wx.openLocation的经纬度
          success: function (res) {
            flag = false;
            that.setData({
              longitude: res.longitude,
              latitude: res.latitude,
            });
            longitude = res.longitude;
            latitude = res.latitude;
            return resolve(1);
          }
        });
      } else {
        flag = false;
        isToggleArea = true;
        app.getServerInfo("Lbs/Index/index?areaid=" + that.data.areaCode, {}, function (res) {
          that.setData({
            latitude: res.data.location.lat,
            longitude: res.data.location.lng
          });
          return resolve(2);
        }, 'get');
      }
    });
  },
  /*markers点击事件*/
  markertap: function (e) {
    var userid = list[e.markerId].userid;
    wx.navigateTo({
      url: '../lawyerDetail/lawyerDetail?userid=' + userid,
    });
  },
  /*函数节流*/
  throttle: function (method, context, map) {
    clearTimeout(context.data.methodtId);
    context.data.methodtId = setTimeout(function () {
      method.call(context, map);
    }, 2000)
  },
  getScale: function () {
    return new Promise((resolve, reject) => {
      map.getScale({
        success: function (re) {
          let scale = Math.round(re.scale);
          page.data.radius = 5 * Math.pow(2, (18 - scale));
          page.data.scale = scale;
          if (scale < 8) {
            return reject({ scale: 2 });
          }
          return resolve({ scale: 1 });
        },
      });
    })

  },
  getLocation: function () {
    return new Promise((resolve, reject) => {
      map.getCenterLocation({
        success: function (res) {

          page.data.longitude = res.longitude;
          page.data.latitude = res.latitude;


          if (lat1 == undefined || lng1 == undefined) {
            lat1 = res.latitude;
            lng1 = res.longitude;
            return resolve(1);
          }
          distance = getFlatternDistance(lat1, lng1, res.latitude, res.longitude);
          lat1 = res.latitude;
          lng1 = res.longitude;
          distance = distance / 1000;
          if (distance > 5) {
            return resolve({ center: 2 });
          }
          return reject({ center: 1 });
        }
      })
    })
  },
  regionchange: function (e) {
    if (e.type == 'begin') {
      console.log('begin' + i);
      flag = false;
      i = 0;
    }
    i++;
    if (i > 2) {
      return;
    }
    if (e.type == 'end') {
      if (flag) {
        return;
      }
      
      flag = true;

      Promise.all([this.getScale(), this.getLocation()]).then((PA) => {
        page.handlingData();
      }).catch((fail) => {
        flag = false;
      });
    }
  },

  handlingData: function () {
    let that = this;
    let markers = [];
    let markersStorage = {};
    new Promise((resolve, reject) => {
      let req = {};
      req.lng = this.data.longitude;
      req.lat = this.data.latitude;
      req.radius = this.data.radius;
      req.areaid = this.data.areaCode;
      wx.showLoading({
        title: '律师查找中...',
        mask:true
      })
      
      app.getServerInfo('Lbs/Index/index', req, (res) => {
        wx.hideLoading();
        wx.setStorage({
          key: 'markersStorage',
          data: JSON.stringify(markersStorage),
        });
        if (res.data.errcode != 0) {
          return reject(1);
        }
        if (res.data.errcode == 0) {
          latitude = res.data.location.lat;
          longitude = res.data.location.lng;
          if (isToggleArea == true && loading == false) {
            isToggleArea = false;
            i++;
            that.setData({
              latitude: res.data.location.lat,
              longitude: res.data.location.lng
            })
          }
          list = res.data.list;
          if (list.length == 0) {
            return reject(2);
          }
          return resolve(list);
        }
      }, 'get')
    }).then((list) => {
      return new Promise((resolve, reject) => {
        for (var k = 0; k < list.length; k++) {
          markers.push({
            iconPath: '../../img/flag.png',
            id: k,
            latitude: list[k].location[1],
            longitude: list[k].location[0],
            width: 17,
            height: 25,
            callout: {
              content: list[k].name + '律师',
              color: '#ffffff',
              fontSize: '16',
              borderRadius: '8',
              bgColor: '#f01351',
              padding: '6',
              display: 'ALWAYS',
              textAlign: 'center'
            }
          });
        }
        wx.hideLoading();
        return resolve(list);
      });

    }).then((list) => {
      page.setData({
        markers: markers
      });

      flag = false;
      return this.PromiseForEach(list, (obj, i) => {
        return new Promise((resolve, reject) => {
          if (obj.avatar) {
            let avatar = obj.avatar;
            if (avatar.indexOf('http://static.faniuwenda.com') > -1) {
              avatar = avatar.replace('http://static.faniuwenda.com', 'https://faniuwenda.oss-cn-beijing.aliyuncs.com') + '@100w';
            }
            if (avatar.indexOf('http://www.faniuwenda.com') > -1) {
              avatar = avatar.replace('http://www.faniuwenda.com', 'https://www.faniuwenda.com');
            }
            wx.getStorage({
              key: 'markersStorage',
              success: function (response) {
                if (JSON.parse(response.data)[obj.userid]) {

                  return resolve({
                    iconPath: '../../img/flag.png',
                    id: i,
                    latitude: obj.location[1],
                    longitude: obj.location[0],
                    width: 17,
                    height: 25,
                    callout: {
                      content: obj.name + '律师',
                      color: '#ffffff',
                      fontSize: '16',
                      borderRadius: '8',
                      bgColor: '#f01351',
                      padding: '6',
                      display: 'ALWAYS',
                      textAlign: 'center'
                    }
                  });
                } else {
                  wx.downloadFile({
                    url: avatar,
                    success: function (res) {
                      if (res.statusCode === 200) {
                        markersStorage[[obj.userid]] = res.tempFilePath;
                        wx.setStorage({
                          key: 'markersStorage',
                          data: JSON.stringify(markersStorage),
                        });
                        return resolve({
                          iconPath: res.tempFilePath,
                          id: i,
                          latitude: obj.location[1],
                          longitude: obj.location[0],
                          width: 50,
                          height: 50,
                          callout: {
                            content: obj.name + '律师',
                            color: '#ffffff',
                            fontSize: '16',
                            borderRadius: '8',
                            bgColor: '#f01351',
                            padding: '6',
                            display: 'ALWAYS',
                            textAlign: 'center'
                          }
                        });
                      } else {

                        return resolve({
                          iconPath: '../../img/flag.png',
                          id: i,
                          latitude: obj.location[1],
                          longitude: obj.location[0],
                          width: 50,
                          height: 50,
                          callout: {
                            content: obj.name + '律师',
                            color: '#ffffff',
                            fontSize: '16',
                            borderRadius: '8',
                            bgColor: '#f01351',
                            padding: '6',
                            display: 'ALWAYS',
                            textAlign: 'center'
                          }
                        });
                      }
                    }
                  })
                }
              }
            })
          } else {
            return resolve({
              iconPath: '../../img/flag.png',
              id: i,
              latitude: obj.location[1],
              longitude: obj.location[0],
              width: 50,
              height: 50,
              callout: {
                content: obj.name + '律师',
                color: '#ffffff',
                fontSize: '16',
                borderRadius: '8',
                bgColor: '#f01351',
                padding: '6',
                display: 'ALWAYS',
                textAlign: 'center'
              }
            });
          }
        });
      })
    }).then((PF) => {
      page.setData({
        markers: PF
      });
    }).catch((fail) => {
      if (fail == 1) {
        wx.showModal({
          title: '错误提示',
          content: "网络错误",
        });
      }
      if (fail == 2) {
        wx.showModal({
          title: '错误提示',
          content: '返回数据为空',
        });
      }
    })
  },
  PromiseForEach: (arr, cb) => {
    let realResult = []
    let result = Promise.resolve()
    arr.forEach((a, index) => {
      result = result.then(() => {
        return cb(a, index).then((res) => {
          realResult.push(res)
        })
      })
    })
    return result.then(() => {
      return realResult
    })
  }
}
));