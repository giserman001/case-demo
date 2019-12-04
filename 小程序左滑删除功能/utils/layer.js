var tip = function () {
  wx.showModal({
    content: arguments[0] || '加载失败',
    showCancel: false,
    success: arguments[1] || function (res) { }
  });
}

module.exports = {
  tip: tip
}