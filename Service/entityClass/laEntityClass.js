/**
 * 所有业务实体类对象定义
 * Created by Jerry on 15/12/26.
 */

var laEntityEnumCabinTypename = new Array("", "头等舱", "商务舱", "超级经济舱", "经济舱");
var laEntityEnumOrderStatus = {1: "新订单", 2: "取消订单", 3: "订单完成"};
var laEntityEnumPayStatus = {1: "未支付", 2: "已支付", 3: "未退款", 4: "已退款"};
/**
 * 乘客类型和证件类型枚举
 * @type {*[]}
 */
var laEntityEnumpsgTypeOptions = [{v: 1, t: '成人(12岁以上)'}, {v: 2, t: '儿童(2-12岁)'}];
var laEntityEnumfoIdTypeOptions = [{v: 1, t: '身份证'}, {v: 2, t: '护照'}, {v: 100, t: '其他'}];
var laEntityEnumfoIdTypeForCheckinOptions = [{v: 100, t: '票号'}, {v: 1, t: '身份证'}, {v: 2, t: '护照'}];//, {v: 3, t: '台胞证'}, {v: 4, t: '港澳通行证'}
var laEntityEnumrefundTypeOptions = [{v: 2, t: '自愿退票'}, {v: 3, t: '非自愿退票'}, {v: 6, t: '补退'}];

/**
 * 网站地图等公用菜单定义

 var laMapMenu_Transport = [{i: 0, t: "旅客须知", u: "/Travel/Transport/PassengerInfo.html", c: "passengerinfo", s: true},
 {i: 1, t: "运输总条件", u: "/Travel/Transport/Rule.html", c: "rule", s: true},
 {i: 2, t: "超售公示说明", u: "/Travel/Transport/Overbooking.html", c: "overbooking", s: true}];

 var laMapMenu_PassengerSvr = [{i: 0, t: "旅客购票及旅行须知", f: 1, s: true},
 {i: 1, t: "安全运输须知", f: 2, s: false},
 {i: 2, t: "网上值机", f: 3, s: false},
 {i: 3, t: "行李须知", f: 4, s: true},
 {i: 4, t: "售票及机场信息", f: 5, s: true},
 {i: 5, t: "电子客票行程单邮寄说明", f: 6, s: true},
 {i: 6, t: "值机柜台", f: 7, s: true},
 {i: 7, t: "航线", f: 8, s: true},
 {i: 8, t: "医生诊断说明书", f: 9, s: true}];
 */
var laMapMenu_Transport = [{i: 0, t: "行李须知", u: "/Infomation/index.html?index=4", c: "package", s: true},
    {i: 1, t: "特殊旅客运输须知", u: "/Infomation/Travelnotes/SpecialPassenger.html", c: "SpecialPassenger", s: true},
    {i: 2, t: "售票及机场信息", u: "/Infomation/index.html?index=5", c: "saleticketandairport", s: true},
    {i: 3, t: "值机柜台", u: "/Infomation/index.html?index=7", c: "checkinstation", s: true},
    {i: 4, t: "电子客票行程单邮寄说明", u: "/Infomation/index.html?index=6", c: "eticketpost", s: true},
    {i: 5, t: "运输总条件", u: "/Travel/Transport/Rule.html", c: "rule", s: true}];

var laMapMenu_PassengerSvr = [{i: 0, t: "超售公示说明", u: "/Travel/Transport/Overbooking.html", c: "overbooking", s: true},
    {i: 1, t: "旅客须知", u: "/Infomation/Travelnotes/Passenger.html", c: "Passenger", s: true},
    {i: 2, t: "航线", u: "/Infomation/index.html?index=8", c: "airline", s: true},
    {i: 3, t: "医生诊断说明书", u: "/Infomation/index.html?index=9", c: "doctor", s: true}];

var laMapMenu_Airplane = [{i: 0, t: "超级经济舱", u: "/Others/News/News.html?ID=29", s: true},///Others/AirPlane/SuperEconomyClass.html
    {i: 1, t: "经济舱", u: "/Others/AirPlane/EconomyClass.html", s: true},
    {i: 2, t: "机上娱乐", u: "/Others/AirPlane/Entertainment.html", s: true},
    {i: 3, t: "餐食", u: "/Others/AirPlane/Meals.html", s: true}];

/**
 <li ng-class="{true:'active',false:''}[ShowIndex==1]"><a href="javascript:;" ng-click="btnShowContent(1);">旅客购票及旅行须知</a></li>
 <!--<li ng-class="{true:'active',false:''}[ShowIndex==2]"><a href="javascript:;" ng-click="btnShowContent(2);">安全运输须知</a></li>-->
 <!--<li ng-class="{true:'active',false:''}[ShowIndex==3]"><a href="javascript:;" ng-click="btnShowContent(3);">网上值机</a></li>-->
 <li ng-class="{true:'active',false:''}[ShowIndex==4]"><a href="javascript:;" ng-click="btnShowContent(4);">行李</a></li>
 <li ng-class="{true:'active',false:''}[ShowIndex==5]"><a href="javascript:;" ng-click="btnShowContent(5);">售票及机场信息</a></li>
 <li ng-class="{true:'active',false:''}[ShowIndex==6]"><a href="javascript:;" ng-click="btnShowContent(6);">电子客票行程单邮寄说明</a></li>
 <li ng-class="{true:'active',false:''}[ShowIndex==7]"><a href="javascript:;" ng-click="btnShowContent(7);">值机柜台</a></li>
 <li ng-class="{true:'active',false:''}[ShowIndex==8]"><a href="javascript:;" ng-click="btnShowContent(8);">航线</a></li>
 <li ng-class="{true:'active',false:''}[ShowIndex==9]"><a href="javascript:;" ng-click="btnShowContent(9);">医生诊断说明书</a></li>
 */

function laEntityBase() {
    this.Code = '';
    this.Message = '';
    this.SessionID = '';
}

/*
 用户信息类
 */
function laEntityUser() {
    this.Name;
    this.Foid;
    this.FoidType;
    this.FoidTypeCH;
    this.Sex;
    this.SexCH;
    this.Brithday;
    this.Password;
    this.ConPassword;
    this.Mobile;
    this.MobileValidCode;
    this.Address;
    this.EMail;
    this.Zip;
    this.Tel;
    this.UserName;
    this.SessionOut;
}
laEntityUser.prototype = new laEntityBase();

//*********************************************
/**
 *
 */
function laEntityFlightList() {
    this.FlightList = new Array();
    this.LowPriceFlights = new Array();
}
laEntityFlightList.prototype = new laEntityBase();
/**
 航班信息表-查询
 */
function laEntityFlight() {
    this.FlightNum;
    this.AirportFrom;
    this.AirportFromCH;
    this.AirportTo;
    this.AirportToCH;
    this.Distance;
    this.DepartureTime;
    //是否是往返true|false
    this.RoundTrip;
    //返程时间
    this.RoundTripTime;
    this.ArriveTime;
    this.AirportTax;
    this.FuelTax;
    this.OtherTax;
    this.ChildAirportTax;
    this.ChildFuelTax;
    this.ChildOtherTax;
    this.JiXing;
    this.JingTing;

    this.CabinInfoList = new Array();
    this.ChildCabinInfos = new Array();
}
laEntityFlight.prototype = new laEntityBase();

function laEntityCabinInfo() {
    this.CabinName;
    this.CabinType;
    this.CabinTypeName;
    this.ChildCabinName;
    this.LeftCount;
    this.Price;
    this.Discount;
    this.ChildPrice;
    this.SalePrice;
    this.ChildSalePrice;
    this.PriceBase;
    this.ChildPriceBase;
    this.RefundRule;
    this.ChangeRule;
    this.SignedTransfer;
    this.SignedTransferDisplay;
    this.AccidentInsurancePrice; //航意险金额
    this.AccidentSumInsured;  //航意险保额
    this.AccidentInsuranceTktPriceDiscount;  //航意险票价折扣
    this.AccidentInsuranceCanBuyCount; //航意险可购买份数
    this.DelayInsurancePrice;  //航延险金额
    this.DelaySumInsured;  //航延险保额
    this.DelayInsuranceTktPriceDiscount;  //航延险票价折扣
    this.DelayInsuranceCanBuyCount;  //航延险可购买份数
    this.EI;
    this.RMK;
}
laEntityCabinInfo.prototype = new laEntityFlight();

function laEntityLowPriceFlights() {
    this.FlightDate;
    this.LowPrice;
}
laEntityLowPriceFlights.prototype = new laEntityBase();
//***********************************************************

//***********************************************************
/**
 * 订单信息-预定
 */
function laEntityOrderCreate() {
    this.SaleChannel;
    this.ChildRecerveCabinPriceType;  //票价类型 1:儿童票, 儿童只能买Y舱;2:成人票,如果既有儿童又有成人则填2
    this.Contacts;//联系人
    this.Flights = new Array();//航段信息
    this.Passengers = new Array();//乘客信息
    this.TotalAmount = 0;//订单总价
    this.Itinerary;//行程单
    this.VerifyCode;
}
laEntityOrderCreate.prototype = new laEntityBase();

/**
 * 订单预定乘客信息表
 */
function laEntityReservePassenger() {
    this.Tid;
    this.Brithday;//YYYY-MM-DD
    this.Foid;//身份证
    this.FoidType;//身份证类型：1身份证，2护照，100其他
    this.PassengerName;//乘客名字
    this.TravellerType;//乘客类型，1成人，2儿童
    this.InsuranceInfo; //保险信息
}
laEntityReservePassenger.prototype = new laEntityOrderCreate();

/**
 * 保险信息
 */
function laEntityReserveInsuranceInfo() {
    this.AccidentInsuranceCount; //航意险份数
    this.DelayInsuranceCount; //航延险份数
}
laEntityReserveInsuranceInfo.prototype = new laEntityReservePassenger();
/**
 * 订单预定航段信息表
 */
function laEntityReserveFlight() {
    this.ArriveAirport;//到达机场
    this.CabinName;//选择舱位
    this.ChildCabinName;//儿童选择舱位
    this.DepartureAirport;//出发机场
    this.DepartureTime;//出发时间 YYYY-MM-DD HH:MM
    this.FlightNum;//出发航班号
}
laEntityReserveFlight.prototype = new laEntityOrderCreate();

/**
 * 订单预定行程单信息
 */
function laEntityReserveItinerary() {
    this.Name;
    this.Mobile;
    this.Phone;
    this.Province;
    this.City;
    this.District;
    this.DetialAddress;
    this.ExpressType;
}
laEntityReserveItinerary.prototype = new laEntityOrderCreate();

/**
 * 订单预定联系人信息表
 */
function laEntityContacts() {
    this.ContactsAddress;//联系人地址
    this.ContactsEMail;//联系人邮箱
    this.ContactsMobile;//联系人手机
    this.ContactsName;//联系人姓名
    this.ContactsPhone;//联系人电话
    this.ContactsZIP;//联系人邮编
    this.Note;
}
laEntityContacts.prototype = new laEntityOrderCreate();
//***********************************************************

//***********************************************************
/**
 * 退票订单-请求
 */
function laEntityRefundOrder() {
    this.SaleChannel;
    this.OrderId;
    this.RefundType;//退票类型，2自愿退票，3非自愿退票, 6补退
    this.Note;//备注
    this.ContactsName;
    this.ContactsEMail;
    this.ContactsMobile;
    this.Passengers = new Array();
    this.RefundAmount;
}
laEntityRefundOrder.prototype = new laEntityBase();

/**
 * 退票订单-乘客
 */
function laEntityRefundOrderPassenger() {
    this.PassengerId;
    this.FlightIds = new Array();
}
laEntityRefundOrderPassenger.prototype = new laEntityRefundOrder();
//***********************************************************

/**
 * 常用乘机人信息
 */
function laEntityStationPassenger() {
    this.FlierName;//姓名
    this.Foid;//身份证
    this.FoidType;//证件类型：1身份证，2护照，100其他
    this.FoidTypeCH;
    this.TravellerType;//乘客类型：1成人，2儿童
    this.TravellerTypeCH;
    this.Mobile;//手机号
    this.EMail;//邮箱
    this.Brithday;//生日，儿童必须要有生日，可从身份证解析，
    this.Tid;//Tid为0则是添加，Tid不为了0为修改
}
laEntityStationPassenger.prototype = new laEntityBase();
//***********************************************************

/**
 * 多个订单信息
 */
function laEntityOrderList() {
    this.NowPageIndex;
    this.TotalPage;
    this.OnePageCount;
    this.DataCount;
    this.OrderList = new Array();
}
laEntityOrderList.prototype = new laEntityBase();
/**
 * 查询机票订单详情
 */
function laEntityOrderInfoDetail() {
    this.OrderId;
    this.OrderStatus;// 待支付/已取消
    this.OrderStatusCH;
    this.PayStatus;//未支付/已支付
    this.PayStatusCH;
    this.CreateTime;
    this.OrderType;//普通订单
    this.OrderTypeCH;
    this.PayTime;
    this.PayPlat;//支付宝
    this.OrderAmountWithTax = 0;//总金额含税
    this.OrderIntegral = 0; //总积分
    //联系人信息
    this.Contacts = new laEntityContacts();
    //乘机人信息
    this.Passengers = new Array();
    //单独的航段信息
    this.FlightList = new Array();
    //可以使用的支付方式
    this.PaymentMethods;
    //行程单信息
    this.Address;
}
laEntityOrderInfoDetail.prototype = new laEntityBase();

/**
 * 订单信息中的纯航段信息
 */
function laEntityOrderInfoDetFlights() {
    this.FlightId;
    this.FlightNum;
    this.DepartureAirport;
    this.DepartureAirportCH;
    this.DepartureCity;
    this.DepartureCityCH;
    this.ArriveAirport;
    this.ArriveAirportCH;
    this.ArriveCity;
    this.ArriveCityCH;
    this.DepartureTime;
    this.ArriveTime;
    this.JiXing;
    this.JingTing;
    this.Cabin;
    this.CabinType;
}
laEntityOrderInfoDetFlights.prototype = new laEntityOrderInfoDetail();
/**
 * 订单详情中乘机人信息
 */
function laEntityOrderInfoDetPassengers() {
    this.PassengerId;
    this.PassengerName;
    this.Foid;
    this.FoidType;
    this.FoidTypeDisplay;
    this.TravellerType;
    this.TravellerTypeDisplay;
    this.Brithday;
    //乘客的航段信息
    this.Flights = new Array();
    this.AllTktAmount = 0;
    this.AllAirportAmount = 0;
    this.AllFuelAmount = 0;
    this.AllOtherAmount = 0;
    this.AllInsurancesAmount = 0;
    this.AllChangeHandleFee = 0;
}
laEntityOrderInfoDetPassengers.prototype = new laEntityOrderInfoDetail();

/**
 * 乘机人航段信息
 */
function laEntityOrderInfoDetPsgFlights() {
    this.FlightId;
    this.FlightNum;
    this.DepartureAirport;
    this.DepartureAirportCH;
    this.DepartureCity;
    this.DepartureCityCH;
    this.ArriveAirport;
    this.ArriveAirportCH;
    this.ArriveCity;
    this.ArriveCityCH;
    this.DepartureTime;
    this.ArriveTime;
    this.Cabin;
    this.SaleTicketPrice = 0;
    this.TicketPrice = 0;
    this.FuelTax = 0;
    this.AirportTax = 0;
    this.OtherTax = 0;
    this.ChangeHandleFee = 0;
    this.ETKT;
    this.JiXing;
    this.JingTing;
    this.CabinType;
    this.PriceBase;
    this.RefundRule;
    this.ChangeRule;
    this.SignedTransfer;
    this.CanRefund;
    this.CanErrorRefund;
    this.CanInvoluntary;
    this.CanNotRefundNote;
    this.CanNotErrorRefundNote;
    this.CanNotInvoluntaryNote;
    this.CanTrans;
    this.TicketRefundAmount;
    this.InsuranceAmount;
    this.WaitTicketRefundAmount;
    this.WaitInsuranceAmount;
    this.RefundFirstAduitStatus; //3:审核通过;4:拒绝;5:申请中，待审核;
    this.RefundSecondAduitStatus;//3:审核通过;4:拒绝;5:申请中，待审核;
    this.RefundStatus;
    this.RefundAmountStatus;
    this.RefundFirstNote;
    this.RefundSecondNote;
    this.RefundAduitTime;
    //保险信息
    this.Insurances;
    //保险总金额
    this.InsAmount = 0;
}
laEntityOrderInfoDetPsgFlights.prototype = new laEntityOrderInfoDetPassengers();