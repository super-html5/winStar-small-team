const getCarNumberDetails = require('../../config.js').getCarNumberDetails
const getPlateNumberListByNumber = require('../../config.js').getPlateNumberListByNumber
const getPlateNumberListByAwardNumber = require('../../config.js').getPlateNumberListByAwardNumber
const getPlateNumberListByCertificate = require('../../config.js').getPlateNumberListByCertificate
const app = getApp()

Page({
  data: {
    plateList: {},
  },
  onLoad: function () {
    app.getToken(this.backFu);
  },
  backFu: function (res) {
    app.globalData.token = res.data.token;
    //this.searchThree("610103198909172037")
    //this.getCarNumberDetails("陕A3UW53")
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
      } else if (msg.length > 7 && msg.length <= 18) {
        that.searchTwo(msg)
      } else {
        that.searchThree(msg)
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
          wx.setStorageSync('illegalList', res.data);
        } else if (res.data.code == 'illegal.NotFound') {
          wx.setStorageSync('illegalList', null);
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
      url: `${getPlateNumberListByCertificate}?certificateNumber=${certificateNumber}&certificateType=A`,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'token_id': app.globalData.token
      },
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          wx.setStorageSync('illegalList', res.data);
        } else if (res.data.code == 'illegal.NotFound') {
          wx.setStorageSync('illegalList', null);
        } else if (res.data.code == 'certificateNumberOrType.InvalidParameter') {
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
      url: `${getPlateNumberListByAwardNumber}?awardNumber=${awardNumber}`,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'token_id': app.globalData.token
      },
      success: function (res) {
        console.log(res);
        if (res.statusCode == 200) {
          wx.setStorageSync('illegalList', res.data);
        } else if (res.data.code == 'illegal.NotFound') {
          wx.setStorageSync('illegalList', null);
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
})
