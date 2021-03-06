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
      if (msg.length <= 8) {
        if (msg.substring(0, 2) != "陕A") {
          wx.showToast({
            icon: 'loading',
            title: '仅支持陕A牌',
          })
          return;
        }
        that.getCarNumberDetails(msg)
      } else if (msg.length > 16 && msg.length <= 18) {
        that.searchTwo(msg)
      } else if (msg.length == 15) {
        that.searchThree(msg)
      } else if (msg.length == 16) {
        that.searchThree(msg.substring(0, 15))
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

    let _plateNumber = encodeURI(plateNumber);
    let that = this;
    wx.request({
      url: `${getCarNumberDetails}?plateNumber=${_plateNumber}&plateNumberType=02`,
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
    let _plateNumber = encodeURI(plateNumber);
    wx.request({
      url: `${getPlateNumberListByNumber}?plateNumber=${_plateNumber}&engineNumber=${engineNumber}`,
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
            title: '信息输入有误',
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
    var _b4 = awardNumber.substring(0, 4);
    if (_b4 != 6101) {
      wx.showModal({
        content: '该笔违法超出自助处理范围，请到交管部门处理',
        showCancel: false,
        success: function (res) {
        }
      })
      return;
    }
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
          // 判断如果不是处理过的违法，则显示。否则不显示
          if (res.data[0].status !== 2) {
            wx.setStorageSync('illegalList', res.data);
          } else {
            wx.setStorageSync('illegalList', []);
          }
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

  linkQuestion: function () {
    wx.navigateTo({
      url: '/pages/index/question/question',
    })
  }
})
