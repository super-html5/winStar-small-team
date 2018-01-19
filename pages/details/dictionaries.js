/**
 * Created by Mr.Chen on 2017/1/23.
 */

/**
 * 驾驶证
 * @type {Array}
 */
var card_dic = new Array();
card_dic["A"] = "正常";
card_dic["B"] = "超分";
card_dic["C"] = "转出";
card_dic["D"] = "暂扣";
card_dic["E"] = "撤销";
card_dic["F"] = "吊销";
card_dic["G"] = "注销";
card_dic["H"] = "违法未处理";
card_dic["I"] = "事故未处理";
card_dic["J"] = "停止使用";
card_dic["K"] = "扣押";
card_dic["L"] = "锁定";
card_dic["M"] = "逾期未换证";
card_dic["N"] = "延期换证";
card_dic["P"] = "过期体检";
card_dic["R"] = "注销可恢复";
card_dic["S"] = "逾期未审验";
card_dic["T"] = "延期肾炎";
card_dic["U"] = "扣留";
/**
 * 车辆
 * @type {Array}
 */
var car_dic = new Array();
car_dic["A"] = "正常";
car_dic["B"] = "转出";
car_dic["C"] = "被盗抢";
car_dic["D"] = "停驶";
car_dic["E"] = "注销";
car_dic["G"] = "违法未处理";
car_dic["H"] = "海关监管";
car_dic["I"] = "事故未处理";
car_dic["J"] = "嫌疑车";
car_dic["K"] = "查封";
car_dic["L"] = "扣留";
car_dic["M"] = "达到报废标准";
car_dic["N"] = "事故逃逸";
car_dic["O"] = "锁定";
car_dic["P"] = "达到报废标准公告牌证作废";
car_dic["Q"] = "逾期未检验";

/**
 * 车辆 信息卡 error 字典
 */
var car_errorMessage = new Array();
car_errorMessage["CARD_IS_NOT_EXIST.USER.NotRule"] = "交通安全信息卡卡号不正确";
car_errorMessage["CARD_IS_BINDED.USER.NotRule"] = "交通安全信息卡已被其他用户捆绑认证";
car_errorMessage["INVALID_VERIFY.USER.NotRule"] = "手机短信验证码验证失败";
car_errorMessage["USER_ACCOUNT_NOT_FOUND.USER.NotFound"] = "用户证件号码不存在或错误，请查验后重新输入";
car_errorMessage["DRIVERLICENSE_NOT_AUTHENTICATION.USER.NotFound"] = "驾驶证未认证，请绑定交通安全信息卡，认证驾驶证";
car_errorMessage["USER_DRIVERLICENSE_BINDED_ERROR.USER.NotRule"] = "用户驾驶证信息绑定失败，请稍后再试";
car_errorMessage["DRIVERlINCENSE_NOT_BIND.USER.NotRule"] = "驾驶证未认证";
car_errorMessage["INFOCARD_NOT_BIND.USER.NotRule"] = "交通安全信息卡已经取消认证";
car_errorMessage["CAR_INFO_NOT_EXIST.USER.NotFound"] = "车辆信息不存在";
car_errorMessage["VEHICLE_REACH_UPPER_LIMIT.USER.NotRule"] = "绑定车辆到达上限，最高绑定3辆机动车";
car_errorMessage["CAR_ALREADY_ADD.USER.NotRule"] = "该车辆已添加";
car_errorMessage["USER_CAR_INFO_NOT_EXIST.USER.NotRule"] = "用户数据不存在";
car_errorMessage["EACH_ACCOUNT_CAN_ONLY_AUTHENTICATE_ONE_CAR.USER.NotRule"] = "很抱歉，您只能认证一辆车，如需认证该车辆，请删除之前认证车辆的信息";
car_errorMessage["CAR_IS_ALREADY_BINDED.USER.NotRule"] = "该车辆已被认证";


/**
 * 添加订单，缴费时 error状态
 */
var add_order_errorMessage = new Array();
add_order_errorMessage["reachLimit.order.NotRule"] = "今日缴费人数过多，请稍后处理或次日处理";
add_order_errorMessage["illegal.order.NotFound"] = "查询违法不存在";
add_order_errorMessage["driverLicense.order.NotFound"] = "查询驾驶证不存在";
add_order_errorMessage["driverLicenseNotBinding.order.NotRule"] = "驾驶证未绑定，无法处理本次违法";
add_order_errorMessage["driverLicenseError.order.NotRule"] = "驾驶证有误，无法处理本次违法";
add_order_errorMessage["handled.order.NotRule"] = "该违法已经处理成功，请稍后查询验证";
add_order_errorMessage["othersPaid.order.NotRule"] = "该违法已缴费成功，正在处理";
add_order_errorMessage["paid.order.NotRule"] = "该违法已缴费成功，正在处理";
add_order_errorMessage["mishandled.order.NotRule"] = "该笔违法超出自助处理范围，请交管部门处理";
add_order_errorMessage["awardedAndPaid.order.NotRule"] = "该违法已经处理完毕";
add_order_errorMessage["awardedNot610.order.NotRule"] = "该笔违法超出自助处理范围，请交管部门处理";
add_order_errorMessage["awardedPass14days.order.NotRule"] = "该笔违法超出自助处理范围，请交管部门处理";
add_order_errorMessage["beyondSelfHelp.order.NotRule"] = "该笔违法超出自助处理范围，请交管部门处理";
add_order_errorMessage["greaterThan6.order.NotRule"] = "该笔违法记分大于6分，超出自助处理范围，请交管部门处理";
add_order_errorMessage["greaterThan200.order.NotRule"] = "该笔违法罚款大于200元，超出自助处理范围，请交管部门处理";
add_order_errorMessage["driverLicenseGreaterThan11.order.NotRule"] = "驾驶证记分大于11分,继续处理会导致驾驶证超分，本次违法无法处理";
add_order_errorMessage["driverLicenseStateError.order.NotRule"] = "当前驾驶证状态异常，请到交管部门处理";
add_order_errorMessage["quasiDrivingModelNotConfirm.order.NotRule"] = "驾驶证准驾车型和当前处理车辆的车型不符";
add_order_errorMessage["oneCycleCanHandle3Cars.order.NotRule"] = "驾驶证在一个记分周期内仅可处理3辆机动车";
add_order_errorMessage["oneCycleCanHandle24Points.order.NotRule"] = "驾驶证一个计分周期内最高不得累计超过24分";
add_order_errorMessage["illegalTimeBeforeCertificateTime.order.NotRule"] = "违法时间早于领证日期，无法处理本次违法";
add_order_errorMessage["thisAndBeforeGreaterThan11.order.NotRule"] = "累计分数大于11分，无法缴费";
add_order_errorMessage["orderPersistError.order.NotRule"] = "添加订单失败";
add_order_errorMessage["cashier.order.ServiceUnavailable"] = "违法处理已启动，申请付款失败，正在联系银行，请稍后重试";
add_order_errorMessage["order.order.NotRule"] = "查询单个订单出现异常";
add_order_errorMessage["orders.order.NotRule"] = "本次缴费失败，正在联系银行，请稍后再试";
add_order_errorMessage["orders.order.NotFound"] = "本次缴费失败，正在联系银行，请稍后再试";
add_order_errorMessage["openId.order.NotFound"] = "本次缴费失败，正在联系银行，请稍后再试";
add_order_errorMessage["user.order.ServiceUnavailable"] = "本次缴费失败，正在联系银行，请稍后再试";
add_order_errorMessage["moneyEqualZero.order.NotRule"] = "单个违法罚款金额为0元，请到交管部门处理";
add_order_errorMessage["errorTime.order.NotRule"] = "系统维护时间为（23:30--0:30）,请在其他时间处理违法，给您带来不便，请谅解";
add_order_errorMessage["payTypeNotCorrect.order.NotRule"] = "付款类型参数值错误，请稍后再试";

module.exports = {
  add_order_errorMessage: add_order_errorMessage
}

