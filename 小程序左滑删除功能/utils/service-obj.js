var config = require('config.js')
var layer = require('layer.js')
var app = getApp();
var formatterData = function (obj) {
  var query = '';
  var name, value, fullSubName, subName, subValue, innerObj, i;
  for (name in obj) {
    value = obj[name];
    if (value instanceof Array) {
      for (i = 0; i < value.length; ++i) {
        subValue = value[i];
        fullSubName = name + '[' + i + ']';
        innerObj = {};
        innerObj[fullSubName] = subValue;
        query += formatterData(innerObj) + '&';
      }
    } else if (value instanceof Object) {
      for (subName in value) {
        subValue = value[subName];
        //fullSubName = name + '[' + subName + ']';
        fullSubName = name + '.' + subName;
        innerObj = {};
        innerObj[fullSubName] = subValue;
        query += formatterData(innerObj) + '&';
      }
    } else if (value !== undefined && value !== null) {
      query += name + '=' + encodeURIComponent(value) + '&';
    }
  }
  return query.length ? query.substr(0, query.length - 1) : query;
};

var http = function (options) {
  var obj = {
    url: '',
    method: 'POST',
    data: {},
    success: function () { },
    fail: function () { },
    complete: function () { },
    hasNext: false,
    showLoading: true,
    tipMsg: '',
    showTip: true,
    header: {}
  };
  for (var key in options) {
    obj[key] = options[key];
  }
  obj.url = config.systemData.uri + obj.url;
  if (obj.method.toUpperCase() == 'PUT' || obj.method.toUpperCase() == 'GET') {
    var paramStr = '';
    obj.data = formatterData(obj.data);
    if (obj.data) {
      obj.url = obj.url + '?' + obj.data;
      obj.data = {};
    }
  }
  if (obj.showLoading) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
  }
  obj.header['token'] = wx.getStorageSync('token')
  wx.request({
    method: obj.method,
    url: obj.url,
    // data: (typeof obj.data == 'object' && String(obj.data) !== '[object File]' ? formatterData(obj.data) : obj.data),
    data: obj.data,
    header: obj.header,
    success: function (res) {
      if (config.systemData.tokenTimeoutCode && config.systemData.tokenTimeoutCode == res.data.code) {
        wx.reLaunch({ url: "/pages/index/index" });
      } else if (res.data.errorcode == 'E11001') {
        // wx.navigateTo({ url: "/pages/login/verify/verify" });
        app.isLogin()
      } else {
        wx.hideLoading();
        if (res.data.status || res.data.result == 'success') {
          if (obj.success)
            obj.success(res);
        } else {
          if (obj.showTip){
            layer.tip(res.data.message || res.data.msg);
          }
        }
      }
    },
    fail: function () {
      wx.hideLoading();
      layer.tip('系统错误');
      if (obj.fail)
        obj.fail();
    },
    complete: function (res) {
      if (obj.complete)
        obj.complete(res);
    }
  })
}


module.exports = {
  http: http
}