// pages/details/details.js
const pay = require('../../config.js').pay
const addOrders = require('../../config.js').addOrders
const dictionaries = require('dictionaries');
const utils = require('../../utils/util');
const app = getApp()
const sendMsgUrl = require('../../config.js').sendMsgUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPrompt: true,
    illegalList: [],
    Identification: '',
    totalPrice: 0,
    id: '',
    isFlag: ''
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
   * 批量点击选中
   */
  // selsct: function (e) {
  //     let that = this;
  //     const index = e.currentTarget.dataset.index;
  //     let illegalList = this.data.illegalList;
  //     if (illegalList[index].isLeeFee != 2) {                //没有滞纳金得才可以选中
  //         const isSelect = illegalList[index].isSelect;      // 获取当前商品的选中状态
  //         illegalList[index].isSelect = !isSelect;           // 改变状态
  //     }
  //     // const isSelect = illegalList[index].isSelect;      // 获取当前商品的选中状态
  //     // illegalList[index].isSelect = !isSelect;           // 改变状态

  //     that.setData({
  //         illegalList: illegalList
  //     });
  //     that.getTotalPrice();
  // },
  formSubmit: function (e) {
    var formId = e.detail.formId;
    console.log("formId=" + formId);
    this.addOrders(formId);
  },
  /**
    * 点击选中
    */
  selsct: function (e) {
    let that = this;
    const index = e.currentTarget.dataset.index;
    let illegalList = this.data.illegalList;
    let illegal = this.data.illegalList[index];
    if (illegalList[index].isLeeFee == 2) {                //有滞纳金不做操作
      return;
    } else {
      illegalList.forEach(function (val) {
        val.isSelect = false;
      })
      illegalList[index].isSelect = true;
    }

    that.setData({
      illegalList: illegalList,
    });
    that.getTotalPrice();
  },
  /**
   * 计算价格
   */
  getTotalPrice: function () {
    let that = this;
    let illegalList = that.data.illegalList;    // 获取购物车列表
    let total = 0;
    illegalList.forEach(function (val) {        // 循环列表得到每个数据
      if (val.isSelect) {
        total += val.penaltyAmount
      }
    });
    that.setData({
      totalPrice: total
    });
  },
  /**
   * 下单
   */
  addOrders: function (formId) {
    let that = this;
    let illegalList = this.data.illegalList;

    //批量处理的id
    // let id = '';
    // illegalList.forEach(function (val, index) {
    //   if (val.isSelect) {
    //     id += illegalList[index].id + ',';
    //     that.setData({
    //       id: id
    //     });
    //   }
    // });

    //单个处理的id
    let i;
    illegalList.forEach(function (val, index) {
      if (val.isSelect) {
        i = index;
        that.setData({
          id: illegalList[i].id
        });
      };
    })

    if (!that.data.id) {
      wx.showToast({
        icon: 'loading',
        title: '请选择违法',
        duration: 2000
      })
      return;
    } else {
      console.log(illegalList[i]);
      if (illegalList[i].awardNumber.substring(0, 4) != 6101) {
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
        // url: addOrders + '?payType=4&goodsIds=' + id,  //批量的
        url: addOrders + '?goodsIds=' + illegalList[i].id + '&formId=' + formId,
        method: 'POST',
        header: {
          'content-type': 'application/json',
          "token_id": app.globalData.token
        },
        success: function (res) {
          console.log(res);
          wx.hideLoading();
          if (res.statusCode == 200) {
            that.payment(formId, res.data.message);
          } else if (res.statusCode == 503) {
            wx.showModal({
              content: res.data.data.msg,
              showCancel: false,
              success: function (res) {
              }
            });

          } else if (res.statusCode == 400 || res.statusCode == 404) {
            let code = dictionaries.add_order_errorMessage[res.data.code];
            if (!code) {
              wx.showModal({
                content: '该笔违法超出自助处理范围，请到交管部门处理',
                showCancel: false,
                success: function (res) {
                }
              })
            } else {
              wx.showModal({
                content: code,
                showCancel: false,
                success: function (res) {
                }
              });
            }

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
            title: '系统当前繁忙',
            duration: 2000
          })
        }
      })
    }
  },
  /**
   * 立即支付
   */
  payment: function (formId, orderNumber) {
    let that = this;
    wx.showLoading();
    wx.request({
      url: pay,
      method: 'POST',
      data: {
        'orderNumber': orderNumber,
        'bankCode': '105',
        'subBankCode': '203'
      },
      header: {
        'content-type': 'application/json',
        "token_id": app.globalData.token,
        'accountId': app.globalData.accountId,
      },
      success: function (res) {
        console.log(res);
        wx.hideLoading();
        let _info = JSON.parse(res.data.result);
        console.log(_info)
        if (res.statusCode == 200) {
          wx.requestPayment({
            'timeStamp': _info.timeStamp,
            'nonceStr': _info.nonceStr,
            'package': _info.package,
            'signType': _info.signType,
            'paySign': _info.paySign,
            'success': function (res) {
              console.log(res);
              let illegalList = that.data.illegalList;
              let id = that.data.id;

              illegalList.forEach(function (val, index) {
                if (!val.isPay) {
                  val.isPay = false;
                }
                if (val.id === id) {
                  illegalList[index].isPay = true;
                };
              })
              //批量显示正在处理中
              // illegalList.forEach(function (val, index) {
              //   if (!val.isPay) {
              //     val.isPay = false;
              //   }
              //   if (val.isSelect) {
              //     val.isPay = true;
              //   }
              // });
              that.setData({
                illegalList: illegalList,
                isPrompt: true
              });
            },
            'fail': function (res) {

            },
            'complete': function () {
              // that.sendMsg(formId, orderNumber);
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
          title: '系统当前繁忙',
          duration: 2000
        })
      }
    })
  },
  sendMsg: function (formId, orderNumber) {
    wx.request({
      url: sendMsgUrl,
      data: {
        openid: app.globalData.openid,
        form_id: formId,
        orderNumber: orderNumber
      },
      method: 'POST',
      success: function (res) {
        console.log("发送消息结果 ：")
        console.log(res)
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
    illegalList.forEach(function (val) {
      val.createdAt = utils.formatTime(val.createdAt);
      val.awardAt = utils.formatTime(val.awardAt);
    })

    that.setData({
      illegalList: illegalList,
      isFlag: options.isFlag
    });

    console.log(illegalList)
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

  }
})