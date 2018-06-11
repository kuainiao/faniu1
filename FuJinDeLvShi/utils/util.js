var config = require('../config');
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function formatDateTime(timestamp, dateformat) {
  var newDate = new Date();
  Date.prototype.format = function (format) {
    var date = {
      "M+": this.getMonth() + 1,
      "d+": this.getDate(),
      "h+": this.getHours(),
      "m+": this.getMinutes(),
      "s+": this.getSeconds(),
      "q+": Math.floor((this.getMonth() + 3) / 3),
      "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
      format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1
          ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
      }
    }
    return format;
  }
  newDate.setTime(timestamp * 1000);
  dateformat = dateformat || 'yyyy-MM-dd hh:mm:ss';
  return newDate.format(dateformat);
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function isEmpty(obj) {
  for (var name in obj) {
    return false;
  }
  return true;

}
function bd_decrypt(bd_lon, bd_lat) {
  var X_PI = Math.PI * 3000.0 / 180.0;
  var x = bd_lon - 0.0065;
  var y = bd_lat - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
  var gg_lon = z * Math.cos(theta);
  var gg_lat = z * Math.sin(theta);
  return {
    gg_lon: gg_lon,
    gg_lat: gg_lat
  }
}
function bd_encrypt(gg_lon, gg_lat) {
  var X_PI = Math.PI * 3000.0 / 180.0;
  var x = gg_lon, y = gg_lat;
  var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
  var bd_lon = z * Math.cos(theta) + 0.0065;
  var bd_lat = z * Math.sin(theta) + 0.006;
  return {
    bd_lat: bd_lat,
    bd_lon: bd_lon
  };
}

function isMobile(str) {
  return /^1[3|4|5|7|8]{1}[0-9]{9}$/.test(str);
}

function addHost(url) {
  if (url && url.indexOf('://') < 0) {
    url = config.host + (url.indexOf('/') === 0 ? url.substr(1) : url);
  }
  return url;
}

function vipIcon(groupid) {
  var icon = '';
  switch (groupid) {
    case '10':
      icon = 'http://static.faniuwenda.com/weapp/images/vip.png';
      break;
    case '20':
      icon = 'http://static.faniuwenda.com/weapp/images/svip.png';
      break;
    case '30':
      icon = 'http://static.faniuwenda.com/weapp/images/vvip.png';
      break;
  }
  return icon;
}

/**
 * 拓展对象
 */

module.exports = {
  formatTime: formatTime,
  isEmpty: isEmpty,
  bd_decrypt: bd_decrypt,//百度转火星
  bd_encrypt: bd_encrypt,//火星转百度
  formatDateTime: formatDateTime,
  isMobile: isMobile,
  addHost: addHost,
  vipIcon: vipIcon,
  extend: function extend(target) {
    var sources = Array.prototype.slice.call(arguments, 1);

    for (var i = 0; i < sources.length; i += 1) {
      var source = sources[i];
      for (var key in source) {
        if (source.hasOwnProperty(key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  }
}
