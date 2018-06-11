var config = require('./config');
var util = require('./utils/util');
var login = require('./utils/login');
var Session = require('./utils/session');
var request = require('./utils/request');
var QQMapWX = require('./utils/qqmap-wx-jssdk.min');
var mapApi;
App({
  onLaunch: function (options) {
    /*
    this.getServerInfo("WeApp/Index/launch");
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum,scope.userLocation',
            success() {
              console.log('授权成功')
            }
          })
        }
        //获取地理位置授权
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              console.log('授权成功')
            }
          })
        }
      }
    })
    */
  },
  onShow: function (options) {
    var app = this;
    this.checkOS();
    this.expires();

    //静默登录
    login.login({
      success: (res) => {
        this.globalData.wxid = res.wxid;
        this.globalData.userinfo = res;
        if (this.afterLoginCall) this.afterLoginCall(res);
      },
      fail: (res) => {
        this.globalData.wxid = 0;
        if (this.afterLoginCall) this.afterLoginCall();
      },
      flush: true,
      silent: true,
    });
  },
  onHide: function () {
    wx.setStorage({
      key: 'markersStorage',
      data: '{}',
    })
  },
  islogin: function (res) {
    let gd = this.globalData;
    if (gd.wxid !== null) {
      if (gd.wxid === 0) {
        res();
      } else {
        res(gd.userinfo);
      }
    } else {
      this.afterLoginCall = res;
    }
  },
  getAreaCode: function (refresh = false) {
    return new Promise((resolve, reject) => {
      if (refresh || wx.getStorageSync('areaCode') == '') {
        wx.getLocation({
          'success': function (res) {
            mapApi = new QQMapWX({ key: config.qqMapKey });
            mapApi.reverseGeocoder({
              location: {
                latitude: res.latitude,
                longitude: res.longitude
              },
              success: function (res) {
                var areaCode = 370100;
                if (res.status == 0 && res.result.ad_info.adcode) {
                  var codeMap = { '110101': '110100', '110102': '110200', '110105': '110300', '110106': '110400', '110107': '110500', '110108': '110600', '110109': '110700', '110111': '110800', '110112': '110900', '110113': '111100', '110114': '111200', '110115': '111300', '110116': '111400', '110117': '111500', '110118': '111600', '110119': '111700', '120101': '120100', '120102': '120200', '120103': '120300', '120104': '120400', '120105': '120500', '120106': '120600', '120110': '120700', '120111': '120800', '120112': '120900', '120113': '121100', '120114': '121200', '120115': '121300', '120116': '121400', '120117': '121500', '120118': '121600', '310101': '310100', '310104': '310200', '310105': '310300', '310106': '310400', '310107': '310500', '310108': '310600', '310109': '310700', '310110': '310800', '310112': '310900', '310113': '311100', '310114': '311200', '310115': '311300', '310116': '311400', '310117': '311500', '310118': '311600', '310120': '311700', '310151': '312300', '500101': '500100', '500102': '500200', '500103': '500300', '500104': '500400', '500105': '500500', '500106': '500600', '500107': '500700', '500108': '500800', '500109': '500900', '500110': '501100', '500111': '501200', '500112': '501300', '500113': '501400', '500114': '501500', '500115': '501600', '500116': '501700', '500117': '501800', '500118': '501900', '500119': '502000', '500120': '502100', '500151': '502200', '500152': '502300', '500153': '502400', '500228': '502500', '500229': '502600', '500230': '502700', '500231': '502800', '500232': '502900', '500233': '503000', '500234': '503100', '500235': '503200', '500236': '503300', '500237': '503400', '500238': '503500', '500240': '503600', '500241': '503700', '500242': '503800', '500243': '503900' };
                  var code = res.result.ad_info.adcode;
                  if (codeMap[code]) {
                    areaCode = codeMap[code];
                  } else {
                    areaCode = code.substr(0, 4) + '00';
                  }
                }
                wx.setStorageSync('areaCode', areaCode);
                resolve();
              },
              fail: function (res) {
                wx.setStorageSync('areaCode', '370100');
                resolve();
              },
            });
          },
          'fail': function () {
            wx.setStorageSync('areaCode', '370100');
            resolve(resolve);
          }
        });
      } else {
        resolve();
      }
    });
  },
  getCategorys: function () {
    var that = this, date = new Date();
    return new Promise((resolve, reject) => {
      if (!wx.getStorageSync('categorys') || that.expires('categorys') <= date.getTime()) {
        that.getServerInfo("WeApp/Index/getCategorys", {}, function (res) {
          if (res.data.errcode == 0) {
            wx.setStorageSync('categorys', res.data.data);
            that.expires('categorys', date.getTime() + 86400000);
          }
          resolve();
        }, 'post');
      } else {
        resolve();
      }
    });
  },
  getServerInfo: function (uri, data, callback, method = 'get', header = { 'content': 'application/x-www-form-urlencoded' }) {
    return new Promise((resolve, reject) => {
      request.request({
        url: config.host + uri,
        data: data,
        method: method,
        header: header,
        success: function (resp) {
          callback(resp);
          return resolve(resp);
        },
        fail: () => {
          reject();
        }
      })
    });

  },
  init: function (page) {
    var data = { siteTel: config.tel };
    page.setData(data);
    page.call2Site = () => {
      wx.makePhoneCall({
        phoneNumber: config.tel
      })
    },
      page.bindAlert = (e) => {
        var msg = e.currentTarget.dataset.message;
        wx.showModal({
          title: '提示',
          content: msg,
          showCancel: false,
        })
      }
  },
  session: function (key) {
    var sessions = Session.get();
    return sessions && key ? sessions[key] : sessions;
  },
  expires: function (key = null, val = null) {
    var expires = wx.getStorageSync('EXPIRES_STORAGE') || {};
    if (key === null) {
      var t = new Date().getTime();
      for (var i in expires) {
        if (expires[i] <= t) {
          wx.removeStorageSync(i);
        }
      }
    } else {
      if (val === null) {
        return expires[key];
      } else {
        expires[key] = val;
        wx.setStorageSync('EXPIRES_STORAGE', expires);
        return val;
      }
    }
  },
  pay: function (options) {
    options.paytype = 6;
    wx.showLoading({
      title: '正在请求支付数据...',
      mask: true
    });
    this.getServerInfo('Pay/Index/index', { 'type': options.type, 'for': options.for, paytype: options.paytype }, (res) => {
      var data = res.data, payParms = data.jsApiParameters;
      wx.hideLoading();
      if (data.errcode === 0) {
        payParms.success = (pRes) => {
          wx.showLoading({
            title: '正在获取支付结果...',
            mask: true
          });
          this.getServerInfo('Pay/Index/checkstatus', { 'orderid': data.orderid, 'paytype': options.paytype }, (res) => {
            wx.hideLoading();
            if (res.data.errcode == 0) {
              wx.showToast({
                title: '支付成功',
                success: () => {
                  setTimeout(() => {
                    typeof (options.success) == 'function' && options.success({ 'message': pRes.errMsg, options: options });
                  }, 2000);
                }
              })
            } else {
              data = res.data;
              data.options = options;
              wx.showModal({
                title: '支付失败',
                content: data.message,
                showCancel: false,
                success: () => {
                  typeof (options.fail) == 'function' && options.fail(data);
                }
              })
            }
          });
        };
        payParms.fail = (pRes) => {
          wx.showModal({
            title: '支付失败',
            content: '支付失败，是否重试?',
            success: (res) => {
              if (res.confirm) {
                this.pay(options);
              } else {
                typeof (options.fail) == 'function' && options.fail({ 'message': pRes.errMsg, options: options });
              }
            }
          })
        };
        wx.requestPayment(payParms);
      } else {
        data.options = options;
        wx.showModal({
          title: '支付失败',
          content: data.message ? data.message : '系统错误，请稍后重试！',
          showCancel: false,
          success: () => {
            typeof (options.fail) == 'function' && options.fail(data);
          }
        })
      }
    });
  },
  checkOS: function () {
    let sys = wx.getSystemInfoSync()['system'].split(' '), osOut = false;
    if (sys instanceof Array && sys.length == 2) {
      sys[0] = sys[0].toLocaleLowerCase();
      sys[1] = parseFloat(sys[1]);
      switch (sys[0]) {
        case 'ios':
          if (sys[1] < 9) osOut = true;
          break;
        case 'android':
          if (sys[1] < 4) osOut = true;
          break;
      }
      if (osOut) {
        console.log(osOut);
        wx.showModal({
          title: '警告',
          content: '你的手机系统版本太旧，请升级你的手机系统',
          showCancel: true,
          success: (res) => {
            wx.navigateBack();
          }
        });
      }
    }
  },
  globalData: {
    wxid: null,
    userinfo: null,
    selectAreaCode: false,
  }
})