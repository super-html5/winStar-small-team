// pages/details/details.js
const pay = require('../../config.js').pay
const addOrders = require('../../config.js').addOrders
const dictionaries = require('dictionaries');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPrompt: false,
    illegalList: [],
    Identification: '',
    money: 0,
    id: ''
  },
  /**
   * 关闭提示
   */
  close: function () {
    this.setData({
      isPrompt: false
    });
  },
  /**
   * 点击选中
   */
  selsct: function (e) {
    let that = this;
    const index = e.currentTarget.dataset.index;
    let illegalList = this.data.illegalList;
    let illegal = this.data.illegalList[index];
    illegalList.forEach(function (val) {
      val.isSelect = false;
    })
    illegalList[index].isSelect = true;
    that.setData({
      illegalList: illegalList,
      money: illegal.penaltyAmount
    });
  },
  /**
   * 下单
   */
  addOrders: function () {
    let that = this;
    let illegalList = this.data.illegalList;
    let i;
    illegalList.forEach(function (val, index) {
      if (val.isSelect) {
        i = index;
        that.setData({
          id: illegalList[i].id
        });
      };
    })
    console.log(!i)

    if (!that.data.id) {
      wx.showToast({
        icon: 'loading',
        title: '请选择违法',
        duration: 2000
      })
      return;
    } else {
      wx.showLoading();
      wx.request({
        url: addOrders + '?goodsIds=' + illegalList[i].id,
        method: 'POST',
        header: {
          'content-type': 'application/json',
          "token_id": app.globalData.token
        },
        success: function (res) {
          console.log(res);
          wx.hideLoading();
          if (res.statusCode == 200) {
            that.payment(res.data.message);
          } else if (res.statusCode == 503) {
            wx.showToast({
              icon: 'loading',
              title: '缴费业务维护中，给您带来不便请谅解',
              duration: 2000
            })
          } else if (res.statusCode == 400 || res.statusCode == 404) {
            let code = dictionaries.add_order_errorMessage[res.data.code];
            if(!code){
              wx.showToast({
                icon: 'loading',
                title: '该笔违法超出自助处理范围，请交管部门处理',
                duration: 2000
              })
            }
           console.log(code);
            wx.showModal({
              content: code,
              showCancel: false,
              success: function (res) {
              }
            });

          } else {
            wx.showToast({
              icon: 'loading',
              title: '系统当前繁忙',
              duration: 2000
            })
          }
        },
        fail: function (error) {
          wx.showToast({
            icon: 'loading',
            title: 系统当前繁忙,
            duration: 2000
          })
        },
        complete: function () {
         
        }
      })
    }
  },
  /**
   * 立即支付
   */
  payment: function (orderNumber) {
    let that = this;
    wx.showLoading();
    wx.request({
      url: pay,
      method: 'POST',
      data: {
        'orderNumber': orderNumber,
        'subBankCode': '203'
      },
      header: {
        'content-type': 'application/json',
        "token_id": app.globalData.token,
        'accountId': app.globalData.accountId,
      },
      success: function (res) {
        wx.hideLoading();
        let _info = JSON.parse(res.data.result);
        console.log(_info)
        if (res.statusCode == 200) {
          wx.requestPayment({
            'timeStamp': _info.timeStamp,
            'nonceStr': _info.nonceStr,
            'package': _info.package,
            'signType': 'MD5',
            'paySign': _info.paySign,
            'success': function (res) {
              console.log(res);
              let illegalList = that.data.illegalList;
              let id = that.data.id;
              illegalList.forEach(function (val, index) {
                val.isPay = false;
                if (val.id === id) {
                  illegalList[index].isPay = true;
                };
              })
              that.setData({
                illegalList: illegalList,
                isPrompt:true
              });
            },
            'fail': function (res) {

            }
          })
        } else {
          wx.showToast({
            icon: 'loading',
            title: '系统当前繁忙',
            duration: 2000
          })
        }

      },
      fail: function (error) {
        wx.showToast({
          icon: 'loading',
          title: 系统当前繁忙,
          duration: 2000
        })
      },
      complete: function () {
       
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let illegalList = wx.getStorageSync('illegalList');
    console.log(options);
    that.setData({
      illegalList: illegalList
    });

    if (options.isFlag == 1) {
      that.setData({
        Identification: '车牌号: ' + options.plateNumber
      });
    } else if (options.isFlag == 2) {
      that.setData({
        Identification: '证件号码: ' + options.certificateNumber.substring(0, 6) + '****' +
        options.certificateNumber.substring(14)
      });
    } else if (options.isFlag == 3) {
      that.setData({
        Identification: '裁决书编号: ' + options.awardNumber
      });
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    // let that = this;
    // let illegalList = that.data.illegalList;
    // let id = that.data.id;
    // illegalList.forEach(function (val, index) {
    //   if (val.isPay) {
    //     that.setData({
    //       isPrompt: true
    //     });
    //   };
    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})