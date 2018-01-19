//app.js
const getTokenInfo = require('./config.js').getTokenInfo
App({
  onLaunch: function () {

  },
  getToken: function (backFn) {
    let that = this;
    if (that.globalData.token) {
      return;
    }
    wx.login({
      success: res => {
        wx.request({
          url: getTokenInfo + res.code + '/0/getTokenInfo',
          method: 'GET',
          success: function (_res) {
            if (typeof backFn == 'function') {
              backFn(_res);
            }
          },
          fail: function (res) {
            console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
          }
        })
      }
    })
  },
  globalData: {
    token: null
  }
})