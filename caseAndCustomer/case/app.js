//app.js
var config = require('./config');
var util = require('./utils/util');
var login = require('./utils/login');
var Session = require('./utils/session');
var request = require('./utils/request');
var mapApi;
App({
    onLaunch: function (options) {
        this.getServerInfo("WeApp/Index/launch");
    },
    onShow: function (options) {
        this.checkOS();
        this.expires();
    },
    getUserInfo: function () {
        return new Promise((resolve, reject) => {
            var that = this
            if (this.globalData.userInfo) {
                resolve(resolve);
            } else {
                login.login({
                    success: function (res) {
                        that.globalData.userInfo = res;
                        resolve(resolve);
                    },
                    fail: function (res) {
                        console.log(res)
                    }
                });
            }
        });
    },
    getServerInfo: function (uri, data, callback, method = 'get') {
        request.request({
            url: config.host + uri,
            data: data,
            method: method,
            success: function (resp) {
                typeof (callback) == 'function' && callback(resp);
            }
        })
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
        userInfo: null,
    }
})