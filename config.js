var host = 'https://mobile.sxwinstar.net/wechat_access'
// var host = 'http://192.168.118.111:7000'
var config = {
  host,
  getTokenInfo: `${host}/api/user/account/`,//获取用户token
  getCarNumberDetails: `${host}/api/v1/platenumbers/plateNumberTypeSearch`,//查询号牌详情
  getPlateNumberListByNumber: `${host}/api/v1/illegals/plateNumberSearch`,//号牌违法查询
  getPlateNumberListByA: `${host}/api/v1/illegals/awardNumberSearch`,//根据裁决书编号查询违法
  getPlateNumberListByC: `${host}/api/v1/illegals/certificateSearch`,//根据身份证号查询违法
  addOrders: `${host}/api/v1/multiorders`, //下单
  pay: `${host}/api/v1/cashier/payOrder`,//支付
};
module.exports = config 