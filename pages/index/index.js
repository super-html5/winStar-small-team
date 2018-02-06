const getCarNumberDetails = require('../../config.js').getCarNumberDetails
const getPlateNumberListByNumber = require('../../config.js').getPlateNumberListByNumber
const getPlateNumberListByA = require('../../config.js').getPlateNumberListByA
const getPlateNumberListByC = require('../../config.js').getPlateNumberListByC

const app = getApp()

Page({
    data: {
        plateList: {},
        inputValue: ''
    },
    onLoad: function () {
        app.getToken(this.backFu);
        app.getUserInfo();
    },
    backFu: function (res) {
        app.globalData.token = res.data.token;
        app.globalData.accountId = res.data.accountId;
    },

    searchBox: function (e) {
        let that = this;
        let _msg = e.detail.value.massage;
        if (!_msg) {
            wx.showToast({
                icon: 'loading',
                title: '请输入信息',
                duration: 2000
            })
        } else {
            let msg = _msg.toUpperCase();
            console.log(msg);
            if (msg.length <= 7) {
                if (msg.substring(0, 2) != "陕A") {
                    wx.showToast({
                        icon: 'loading',
                        title: '仅支持陕A牌',
                    })
                    return;
                }
                that.getCarNumberDetails(msg)
            } else if (msg.length > 15 && msg.length <= 18) {
                that.searchTwo(msg)
            } else if (msg.length == 15) {
                that.searchThree(msg)
            } else {
                wx.showToast({
                    icon: 'loading',
                    title: '输入信息有误',
                    duration: 2000
                })
            }
        }
    },
    /**
     * 获取号牌详情
     */
    getCarNumberDetails: function (plateNumber) {
        wx.showLoading();
        let that = this;
        wx.request({
            url: `${getCarNumberDetails}?plateNumber=${plateNumber}&plateNumberType=02`,
            method: 'GET',
            header: {
                'content-type': 'application/json',
                'token_id': app.globalData.token
            },
            success: function (res) {
                console.log(res);
                if (res.statusCode == 200) {
                    that.searchOne(res.data.number, res.data.engineNumber)
                } else if (res.data.code == 'plateNumber.NotFound') {
                    wx.showToast({
                        icon: 'loading',
                        title: '号牌输入错误',
                        duration: 2000
                    })
                } else {
                    wx.showToast({
                        icon: 'loading',
                        title: '系统当前繁忙',
                        duration: 2000
                    })
                }
            },
            fail: function (res) {
                wx.showToast({
                    icon: 'loading',
                    title: '系统当前繁忙',
                    duration: 2000
                })
            }
        })
    },
    /**
     * 根据号牌 发动机后六位 查询
     */
    searchOne: function (plateNumber, engineNumber) {
        let that = this;
        wx.request({
            url: `${getPlateNumberListByNumber}?plateNumber=${plateNumber}&engineNumber=${engineNumber}`,
            method: 'GET',
            header: {
                'content-type': 'application/json',
                'token_id': app.globalData.token
            },
            success: function (res) {
                console.log(res);
                if (res.statusCode == 200) {
                    let _r = [];
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].status == 1) {
                            _r.push(res.data[i])
                        }
                    }
                    let _t = new Date().getTime();

                    for (let i = 0; i < _r.length; i++) {
                        if (_t - _r[i].awardAt >= 1296000000) {
                            _r[i].isLeeFee = 2
                        } else {
                            _r[i].isLeeFee = 1
                        }
                    }
                    wx.hideLoading();
                    wx.setStorageSync('illegalList', _r);
                    wx.navigateTo({
                        url: `/pages/details/details?isFlag=1&plateNumber=${plateNumber}&engineNumber=${engineNumber}`,
                    })
                } else if (res.data.code == 'illegal.NotFound') {
                    wx.hideLoading();
                    wx.setStorageSync('illegalList', []);
                    wx.navigateTo({
                        url: `/pages/details/details?isFlag=1&plateNumber=${plateNumber}&engineNumber=${engineNumber}`,
                    })
                } else {
                    wx.showToast({
                        icon: 'loading',
                        title: '系统当前繁忙',
                        duration: 2000
                    })
                }
            },
            fail: function (res) {
                wx.showToast({
                    icon: 'loading',
                    title: '系统当前繁忙',
                    duration: 2000
                })
            }
        })
    },

    /**
     * 根据 身份证号 查询
     */
    searchTwo: function (certificateNumber) {
        wx.showLoading();
        wx.request({
            url: `${getPlateNumberListByC}?certificateNumber=${certificateNumber}&certificateType=A`,
            method: 'GET',
            header: {
                'content-type': 'application/json',
                'token_id': app.globalData.token
            },
            success: function (res) {
                console.log(res)
                if (res.statusCode == 200) {
                    let _t = new Date().getTime();
                    for (let i = 0; i < res.data.length; i++) {
                        if (_t - res.data[i].awardAt >= 1296000000) {
                            res.data[i].isLeeFee = 2
                        } else {
                            res.data[i].isLeeFee = 1
                        }
                    }
                    console.log(res.data);
                    wx.hideLoading();
                    wx.setStorageSync('illegalList', res.data);
                    wx.navigateTo({
                        url: `/pages/details/details?isFlag=2&certificateNumber=${certificateNumber}&certificateType=A`,
                    })
                } else if (res.data.code == 'illegal.NotFound') {
                    wx.hideLoading();
                    wx.setStorageSync('illegalList', []);
                    wx.navigateTo({
                        url: `/pages/details/details?isFlag=2&certificateNumber=${certificateNumber}&certificateType=A`,
                    })
                } else if (res.data.code == 'certificateNumberOrType.InvalidParameter' || res.statusCode == 400) {
                    wx.showToast({
                        icon: 'loading',
                        title: '身份证号有误',
                        duration: 2000
                    })
                } else {
                    wx.showToast({
                        icon: 'loading',
                        title: '系统当前繁忙',
                        duration: 2000
                    })
                }
            },
            fail: function (res) {
                wx.showToast({
                    icon: 'loading',
                    title: '系统当前繁忙',
                    duration: 2000
                })
            }
        })
    },

    /**
     * 根据裁决书编号查询
     */
    searchThree: function (awardNumber) {
        wx.showLoading();
        wx.request({
            url: `${getPlateNumberListByA}?awardNumber=${awardNumber}`,
            method: 'GET',
            header: {
                'content-type': 'application/json',
                'token_id': app.globalData.token
            },
            success: function (res) {
                console.log(res);
                if (res.statusCode == 200) {
                    let _t = new Date().getTime();
                    if (_t - res.data[0].awardAt >= 1296000000) {
                        res.data[0].isLeeFee = 2
                    } else {
                        res.data[0].isLeeFee = 1
                    }
                    wx.hideLoading();
                    wx.setStorageSync('illegalList', res.data);
                    wx.navigateTo({
                        url: `/pages/details/details?isFlag=3&awardNumber=${awardNumber}`,
                    })
                } else if (res.data.code == 'illegal.NotFound') {
                    wx.hideLoading();
                    wx.setStorageSync('illegalList', []);
                    wx.navigateTo({
                        url: `/pages/details/details?isFlag=3&awardNumber=${awardNumber}`,
                    })
                } else {
                    wx.showToast({
                        icon: 'loading',
                        title: '系统当前繁忙',
                        duration: 2000
                    })
                }
            },
            fail: function (res) {
                wx.showToast({
                    icon: 'loading',
                    title: '系统当前繁忙',
                    duration: 2000
                })
            }
        })
    },
    /**
     * 转大写
     */
    cValue: function (e) {
        this.setData({
            inputValue: e.detail.value.toUpperCase(),
        })
    },

    linkQuestion:function(){
      wx.navigateTo({
        url: '/pages/index/question/question',
      })
    }
})
