const getCarNumberDetails = require('../../config.js').getCarNumberDetails
const getPlateNumberListByNumber = require('../../config.js').getPlateNumberListByNumber
const getPlateNumberListByAwardNumber = require('../../config.js').getPlateNumberListByAwardNumber
const getPlateNumberListByCertificate = require('../../config.js').getPlateNumberListByCertificate
const app = getApp()

Page({
  data: {
  },
  onLoad: function () {
    app.getToken(this.backFu);
  },
  backFu: function (res) {
    app.globalData.token = res.data.token;
    console.log(res.data.token);
  },
  /**
   * 获取号牌详情
   */
  getCarNumberDetails: function (plateNumber) {
    let that = this;
    wx.request({
      url: `${getCarNumberDetails}?plateNumber=${plateNumber}&plateNumberType=02`,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'token_id': app.globalData.token
      },
      success: function (res) {
        if (res.statusCode == 200) {
          that.searchOne(res.data.number, res.data.engineNumber)
        } else if (res.statusCode == 404){

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
    wx.request({
      url: `${getPlateNumberListByNumber}?plateNumber=${plateNumber}&engineNumber=${engineNumber}`,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'token_id': app.globalData.token
      },
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {

      }
    })
  },

  /**
   * 根据 身份证号 查询
   */
  searchTwo: function () {
    wx.request({
      url: getPlateNumberListByAwardNumber,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'token_id': app.globalData.token
      },
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
      }
    })
  },

  /**
   * 根据裁决书编号查询
   */
  searchThree: function () {
    wx.request({
      url: getPlateNumberListByCertificate,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'token_id': app.globalData.token
      },
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
      }
    })
  },
})
