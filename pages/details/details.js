// pages/details/details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPrompt: true,
    illegalList: [{}],
    Identification:'',
    money:0
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
   * 立即支付
   */
  payment:function(){
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let illegalList=wx.getStorageSync('illegalList');
    console.log(illegalList);
    that.setData({
      illegalList: illegalList
    });
    if (options.isFlag==1){
      that.setData({
        Identification: options.plateNumber
      });
    } else if (options.isFlag == 2){
      that.setData({
        Identification: options.plateNumber
      });
    } else if (options.isFlag == 3){

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