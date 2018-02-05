//app.js
const getTokenInfo = require('./config.js').getTokenInfo
const getOpenIdUrl = require('./config.js').getOpenIdUrl
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
                console.log(res);
        wx.request({
            url: getTokenInfo + res.code + '/0/getTokenInfo',
            method: 'GET',
            success: function (_res) {
                console.log(_res)
                if (typeof backFn == 'function') {
                    backFn(_res);
                }
            },
            fail: function (res) {
                console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
            }
        });

    }
    })
    },

    globalData: {
        token: null,
        accountId: null,
        personInfo:null,
        openid:null
    },
    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.personInfo) {
            typeof cb == "function" && cb(this.globalData.personInfo)
        } else {
            wx.login({
                success: function (res) {
                    console.log("code=" + res.code);
                    wx.request({
                        //获取openid接口
                        url: getOpenIdUrl,
                        data: {
                            js_code: res.code
                        },
                        method: 'GET',
                        success: function (res) {
                            that.globalData.openid = res.data.openid
                            console.log("openid=" + that.globalData.openid)
                        }
                    })

                }
            })
        }
    }
})