/**
 * 订单业务类
 * Created by Jerry on 16/1/11.
 */

var laOrder = angular.module('laOrder', ['laGlobal']);

/**
 * 机票操作类
 */
laOrder.factory('laFlightService', ['$http', 'laGlobalHTTPService', 'laGlobalLocalService', function ($http, laGlobalHTTPService, laGlobalLocalService) {

    var laFlightService = {};
    /**
     * 查询机票信息
     * @param fliInfo
     * @param callBack
     * @constructor
     */
    laFlightService.QueryFlight = function (fliInfo, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_SearchFlight;
        requestParam.SessionId = '';
        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.AirportFrom = fliInfo.AirportFrom;
        requestBody.AirportTo = fliInfo.AirportTo;
        requestBody.DepartureTime = fliInfo.DepartureTime;
        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                var fli = data;
                var flightList = new laEntityFlightList();
                flightList.Code = fli.Code;
                flightList.Message = fli.Message;

                if (status == true && flightList.Code == laGlobalProperty.laServiceCode_Success) {
                    var flightInfo = fli.Result;

                    var nFlis = flightInfo.FlightInfos.length;
                    for (var n = 0; n < nFlis; n++) {
                        var flightData = new laEntityFlight();
                        flightData.FlightNum = flightInfo.FlightInfos[n].FlightNum;
                        flightData.AirportFrom = flightInfo.FlightInfos[n].AirportFrom;
                        flightData.AirportFromCH = flightInfo.FlightInfos[n].AirportFromCH;
                        flightData.AirportTo = flightInfo.FlightInfos[n].AirportTo;
                        flightData.AirportToCH = flightInfo.FlightInfos[n].AirportToCH;
                        flightData.Distance = flightInfo.FlightInfos[n].Distance;
                        flightData.DepartureTime = new Date(flightInfo.FlightInfos[n].DepartureTime.replace(/-/g, "/"));
                        flightData.ArriveTime = new Date(flightInfo.FlightInfos[n].ArriveTime.replace(/-/g, "/"));
                        flightData.AirportTax = flightInfo.FlightInfos[n].AirportTax;
                        flightData.FuelTax = flightInfo.FlightInfos[n].FuelTax;
                        flightData.OtherTax = flightInfo.FlightInfos[n].OtherTax;
                        flightData.ChildAirportTax = flightInfo.FlightInfos[n].ChildAirportTax;
                        flightData.ChildFuelTax = flightInfo.FlightInfos[n].ChildFuelTax;
                        flightData.ChildOtherTax = flightInfo.FlightInfos[n].ChildOtherTax;
                        flightData.JiXing = flightInfo.FlightInfos[n].JiXing;
                        flightData.JingTing = flightInfo.FlightInfos[n].JingTing;

                        var nCarBinLength = flightInfo.FlightInfos[n].CabinInfos.length;
                        for (var i = 0; i < nCarBinLength; i++) {
                            var cabinData = flightInfo.FlightInfos[n].CabinInfos[i];

                            var cabinInfo = new laEntityCabinInfo();
                            cabinInfo.CabinName = cabinData.CabinName;
                            cabinInfo.CabinType = cabinData.CabinType;
                            cabinInfo.CabinTypeName = laEntityEnumCabinTypename[cabinData.CabinType];
                            cabinInfo.ChildCabinName = cabinData.ChildCabinName;
                            cabinInfo.LeftCount = cabinData.LeftCount;
                            cabinInfo.Discount = cabinData.Discount;
                            cabinInfo.Price = cabinData.Price;
                            cabinInfo.ChildPrice = cabinData.ChildPrice;
                            cabinInfo.SalePrice = cabinData.SalePrice;
                            cabinInfo.ChildSalePrice = cabinData.ChildSalePrice;
                            cabinInfo.PriceBase = cabinData.PriceBase;
                            cabinInfo.ChildPriceBase = cabinData.ChildPriceBase;
                            cabinInfo.RefundRule = cabinData.RefundRule;
                            cabinInfo.ChangeRule = cabinData.ChangeRule;
                            cabinInfo.SignedTransfer = cabinData.SignedTransfer;
                            cabinInfo.SignedTransferDisplay = cabinData.SignedTransferDisplay;
                            cabinInfo.AccidentInsurancePrice = cabinData.AccidentInsurancePrice;
                            cabinInfo.AccidentSumInsured = cabinData.AccidentSumInsured;
                            cabinInfo.AccidentInsuranceTktPriceDiscount = cabinData.AccidentInsuranceTktPriceDiscount;
                            cabinInfo.AccidentInsuranceCanBuyCount = cabinData.AccidentInsuranceCanBuyCount;
                            cabinInfo.DelayInsurancePrice = cabinData.DelayInsurancePrice;
                            cabinInfo.DelaySumInsured = cabinData.DelaySumInsured;
                            cabinInfo.DelayInsuranceTktPriceDiscount = cabinData.DelayInsuranceTktPriceDiscount;
                            cabinInfo.DelayInsuranceCanBuyCount = cabinData.DelayInsuranceCanBuyCount;

                            flightData.CabinInfoList[i] = cabinInfo;
                        }

                        flightList.FlightList[n] = flightData;
                    }

                    if (flightInfo.LowPriceFlights != undefined) {
                        var nLowPrice = flightInfo.LowPriceFlights.length;
                        for (var l = 0; l < nLowPrice; l++) {
                            var lowPrice = new laEntityLowPriceFlights();
                            var cd = new Date(flightInfo.LowPriceFlights[l].FlightDate.replace(/-/g, "/"));
                            lowPrice.FlightDate = cd.getFullYear() + "-" + (cd.getMonth() + 1) + "-" + cd.getDate();
                            lowPrice.LowPrice = flightInfo.LowPriceFlights[l].LowPrice;

                            flightList.LowPriceFlights[l] = lowPrice;
                        }
                    }
                }
                callBack(flightList, status);
            }
        )
    };

    /**
     * 查询特价机票
     * @param airportFromCode 出发城市机场编码
     * @param airportToCode 到达城市机场编码
     * @param callBack
     * @constructor
     */
    laFlightService.QuerySpecialTicket = function (airportFromCode, airportToCode, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_QuerySpecialTicket;
        requestParam.SessionId = '';
        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.DepartureAirportCode = airportFromCode;
        requestBody.ArriveAirportCode = airportToCode;
        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                var rs = {};
                rs.Code = data.Code;
                rs.Message = data.Message;
                rs.CityList = new Array();
                rs.AirLineList = new Array();
                if (data.Code == laGlobalProperty.laServiceCode_Success) {
                    var n = data.Result.SpecialOfferTicketsInfo.length;
                    var nCity = 0;
                    for (var i = 0; i < n; i++) {
                        var airLine = data.Result.SpecialOfferTicketsInfo[i];

                        var blCity = false;
                        for (var l = 0; l < rs.CityList.length; l++) {
                            if (rs.CityList[l].c == airLine.DepartureAirportCode) {
                                blCity = true;
                                break;
                            }
                        }
                        if (!blCity) {
                            var aircity = {"c": airLine.DepartureAirportCode, "n": airLine.DepartureAirportCH};
                            rs.CityList[nCity] = aircity;

                            nCity++;
                        }
                        rs.AirLineList[i] = {
                            "DepartureAirportCode": airLine.DepartureAirportCode,
                            "DepartureAirportCH": airLine.DepartureAirportCH,
                            "ArriveAirportCode": airLine.ArriveAirportCode,
                            "ArriveAirportCH": airLine.ArriveAirportCH,
                            "FlightDate": airLine.FlightDate,
                            "FlightWeekName": laGlobalLocalService.getWeekName(new Date(airLine.FlightDate.toString().substr(0, 10).replace(/-/g, "/"))),
                            "Price": airLine.Price,
                            "Index": airLine.Index
                        };
                    }
                }
                callBack(rs, status);
            }
        )
    };

    /**
     * 查询航班动态
     * @param dCityCode 出发城市编码
     * @param aCityCode 到达城市编码
     * @param dTime 出发日期yyyy-MM-dd
     * @param fliNumber 航班号
     * @param qryFlag 0:使用航班号查询;1:使用城市查询;
     * @param callBack
     * @constructor
     */
    laFlightService.QueryFlightDynamic = function (dCityCode, aCityCode, dTime, fliNumber, qryFlag, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_QueryFlightDynamic;
        requestParam.SessionId = '';
        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.DepartureCity = dCityCode;
        requestBody.ArriveCity = aCityCode;
        requestBody.DepartureTime = dTime;
        requestBody.FlightNumber = fliNumber;
        requestBody.CityFlag = qryFlag;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                var rs = new laEntityBase();
                rs.Code = data.Code;
                rs.Message = data.Message;
                rs.DynamicsResultInfo = data.Result.DynamicsResultInfo;
                callBack(rs, status);
            }
        )

    };

    /**
     * 查询机票价格日历
     * @param departureAirportCode 出发机场
     * @param arriveAirportCode 到达机场
     * @param callBack
     * @constructor
     */
    laFlightService.QueryPriceCalendar = function (departureAirportCode, arriveAirportCode, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_QueryPriceCalendar;
        requestParam.SessionId = '';
        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.DepartureAirport = departureAirportCode;
        requestBody.ArriveAirport = arriveAirportCode;
        //requestBody.DepartureTime = departureDay;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);
        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                var rs = {};
                rs.Code = data.Code;
                rs.Message = data.Message;
                rs.LowPrices = data.Result.LowPrices;
                callBack(rs, status);
            }
        )
    };

    /**
     * 改期航班查询
     * @param departureTime YYYY-MM-DD
     * @param orderId
     * @param changePassengerList
     * @param callBack
     * @constructor
     */
    laFlightService.QueryFlightForTrans = function (departureTime, orderId, changePassengerList, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_QueryFlightForTrans;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();
        ;
        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.DepartureTime = departureTime;
        requestBody.OrderId = orderId;
        requestBody.ChangePassengers = changePassengerList;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )

    };

    return laFlightService;
}]);

/**
 * 订单操作类
 */
laOrder.factory('laOrderService', ['$http', 'laGlobalHTTPService', 'laGlobalLocalService', function ($http, laGlobalHTTPService, laGlobalLocalService) {

    var laOrderService = {};

    /**
     * 预定订单
     * @param ordInfo 订单信息
     * @param callBack
     * @constructor
     */
    laOrderService.CreateOrder = function (ordInfo, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_CreateOrder;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = ordInfo.SaleChannel;
        requestBody.ChildRecerveCabinPriceType = ordInfo.ChildRecerveCabinPriceType;
        requestBody.Contacts = ordInfo.Contacts;
        requestBody.Flights = ordInfo.Flights;
        requestBody.Passengers = ordInfo.Passengers;
        requestBody.VerifyCode = ordInfo.VerifyCode;

        /*
         requestBody.Passengers = {};
         for (var i = 0; i < ordInfo.Passengers.length; i++) {
         requestBody.Passengers[i] = ordInfo.Passengers[i];
         }
         */
        requestBody.TotalAmount = ordInfo.TotalAmount;
        requestBody.Address = ordInfo.Itinerary;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                //{"Result":{"Amount":790,"OrderId":1930272531004402},"Code":"0000","Message":"预定成功"}
                callBack(data, status);
            }
        )
    };

    /**
     * 机票改期
     * @param ordInfo
     * @param callBack
     * @constructor
     */
    laOrderService.TransFlightOrder = function (ordInfo, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_TransFlight;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = ordInfo.SaleChannel;
        requestBody.ChangeOrderId = ordInfo.OrderId;
        requestBody.Contacts = ordInfo.Contacts;
        requestBody.Flights = ordInfo.Flights;
        requestBody.Passengers = ordInfo.Passengers;
        requestBody.Address = ordInfo.Itinerary;
        requestBody.TotalAmount = ordInfo.TotalAmount;
        requestBody.VerifyCode = ordInfo.VerifyCode;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 获取订单支付方式
     * @param callBack
     * @constructor
     */
    laOrderService.GetPayChannel = function (callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_GetPayChannelList;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                var channelList = {};
                channelList.Code = data.Code;
                channelList.Message = data.Message;
                if (status == true && channelList.Code == laGlobalProperty.laServiceCode_Success) {

                    var n = data.Result.length;
                    channelList.PayPlat = new Array();
                    channelList.BankList = new Array();

                    var bl = 0;

                    for (var i = 0; i < n; i++) {
                        var channel = data.Result[i];
                        channelList.PayPlat[i] = {
                            "PayPlatCode": channel.PayPlatCode,
                            "PayPlatName": channel.PayPlatCodeDisplay
                        };

                        var l = channel.BankInfos.length;
                        for (var j = 0; j < l; j++) {
                            channelList.BankList[bl] = {
                                "PayPlatCode": channel.PayPlatCode,
                                "BankCode": channel.BankInfos[j].BankCode,
                                "BankName": channel.BankInfos[j].BankName,
                                "Index": channel.BankInfos[j].DisplayIndex
                            };
                            bl++;
                        }
                    }
                }
                callBack(channelList, status);
            }
        )
    };

    /**
     * 查询订单列表
     * @param newPageIndex 查询第几页
     * @param pageSize 每页记录数
     * @param createTimeStart 开始时间
     * @param createTimeEnd 结束时间
     * @param callBack
     * @constructor
     */
    laOrderService.QueryOrderList = function (newPageIndex, pageSize, createTimeStart, createTimeEnd, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_OrderList;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.NewPageIndex = newPageIndex;
        requestBody.OnePageCount = pageSize;
        requestBody.CreateTimeStart = createTimeStart;
        requestBody.CreateTimeEnd = createTimeEnd;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                var rs = data;
                var ordList = new laEntityOrderList();
                ordList.Code = rs.Code;
                ordList.Message = rs.Message;
                if (status == true && ordList.Code == laGlobalProperty.laServiceCode_Success) {
                    ordList.NowPageIndex = rs.Result.NowPageIndex;
                    ordList.TotalPage = rs.Result.TotalPage;
                    ordList.OnePageCount = rs.Result.OnePageCount;
                    ordList.DataCount = rs.Result.DataCount;

                    var nlen = rs.Result.OrderList.length;
                    for (var i = 0; i < nlen; i++) {
                        var ordDet = laOrderService.ParseSimOrderInfo(rs.Result.OrderList[i]);
                        ordList.OrderList[i] = ordDet;
                    }
                }
                callBack(ordList, status);
            }
        )
    };

    /**
     * 把订单信息解析成对象
     * @param orderInfoJson
     * @constructor
     */
    laOrderService.ParseSimOrderInfo = function (orderInfoJson) {
        var ordDet = orderInfoJson;
        var ordInfo = new laEntityOrderInfoDetail();

        ordInfo.OrderStatus = ordDet.OrderStatus;
        ordInfo.OrderStatusCH = ordDet.OrderStatusCH;
        ordInfo.PayStatus = ordDet.PayStatus;
        ordInfo.PayStatusCH = ordDet.PayStatusCH;
        ordInfo.CreateTime = ordDet.CreateTime;
        ordInfo.OrderType = ordDet.OrderType;
        ordInfo.OrderTypeCH = ordDet.OrderTypeCH;
        ordInfo.IntegralType = ordDet.IntegralType;
        ordInfo.IntegralTypeCH = ordDet.IntegralTypeCH;
        ordInfo.PayTime = ordDet.PayTime;
        ordInfo.PayPlat = ordDet.PayPlat;
        ordInfo.OrderId = ordDet.Tid;
        ordInfo.Contacts.ContactsAddress = ordDet.Contacts.ContactsAddress;
        ordInfo.Contacts.ContactsEMail = ordDet.Contacts.ContactsEMail;
        ordInfo.Contacts.ContactsMobile = ordDet.Contacts.ContactsMobile;
        ordInfo.Contacts.ContactsName = ordDet.Contacts.ContactsName;
        ordInfo.Contacts.ContactsPhone = ordDet.Contacts.ContactsPhone;
        ordInfo.Contacts.ContactsZIP = ordDet.Contacts.ContactsZIP;
        ordInfo.Address = ordDet.Address;
        if (ordDet.Address != null && ordDet.Address != undefined) {
            if (ordDet.Address.ExpressChange != null && ordDet.Address.ExpressChange != undefined) {
                ordInfo.OrderAmountWithTax += ordDet.Address.ExpressChange;
            }
        }

        var flightId = '';
        var nFlilen = 0;
        var nPsg = ordDet.Passengers.length;
        for (var i = 0; i < nPsg; i++) {
            var psg = new laEntityOrderInfoDetPassengers();
            var tmpPsg = ordDet.Passengers[i];
            psg.PassengerId = tmpPsg.PassengerId;
            psg.PassengerName = tmpPsg.PassengerName;
            psg.Foid = tmpPsg.Foid;
            psg.FoidType = tmpPsg.FoidType;
            psg.FoidTypeDisplay = tmpPsg.FoidTypeDisplay;
            psg.TravellerType = tmpPsg.TravellerType;
            psg.TravellerTypeDisplay = tmpPsg.TravellerTypeDisplay;
            psg.Brithday = tmpPsg.Brithday;

            var nFli = ordDet.Passengers[i].Flights.length;
            for (var n = 0; n < nFli; n++) {
                var fli = new laEntityOrderInfoDetPsgFlights();
                var tmpFli = ordDet.Passengers[i].Flights[n];
                fli.FlightId = tmpFli.FlightId;
                fli.FlightNum = tmpFli.FlightNum;
                fli.DepartureAirport = tmpFli.DepartureAirport;
                fli.DepartureAirportCH = tmpFli.DepartureAirportCH;
                fli.DepartureCity = tmpFli.DepartureCity;
                fli.DepartureCityCH = tmpFli.DepartureCityCH;
                fli.ArriveAirport = tmpFli.ArriveAirport;
                fli.ArriveAirportCH = tmpFli.ArriveAirportCH;
                fli.ArriveCity = tmpFli.ArriveCity;
                fli.ArriveCityCH = tmpFli.ArriveCityCH;
                fli.DepartureTime = tmpFli.DepartureTime;
                fli.ArriveTime = tmpFli.ArriveTime;
                fli.Cabin = tmpFli.Cabin;
                fli.SaleTicketPrice = tmpFli.SaleTicketPrice;
                fli.SaleIntegral = tmpFli.SaleIntegral;
                fli.TicketPrice = tmpFli.TicketPrice;
                fli.FuelTax = tmpFli.FuelTax;
                fli.AirportTax = tmpFli.AirportTax;
                fli.OtherTax = tmpFli.OtherTax;
                fli.ChangeHandleFee = tmpFli.ChangeHandleFee;
                fli.ETKT = tmpFli.ETKT;
                fli.JiXing = tmpFli.JiXing;
                fli.JingTing = tmpFli.JingTing;
                fli.CabinType = tmpFli.CabinType;
                fli.PriceBase = tmpFli.PriceBase;
                fli.RefundRule = tmpFli.RefundRule;
                fli.ChangeRule = tmpFli.ChangeRule;
                fli.SignedTransfer = tmpFli.SignedTransfer;
                fli.CanRefund = tmpFli.CanRefund;
                fli.CanErrorRefund = tmpFli.CanErrorRefund;
                fli.CanInvoluntary = tmpFli.CanInvoluntary;
                fli.CanNotRefundNote = tmpFli.CanNotRefundNote;
                fli.CanNotErrorRefundNote = tmpFli.CanNotErrorRefundNote;
                fli.CanNotInvoluntaryNote = tmpFli.CanNotInvoluntaryNote;
                fli.CanTrans = tmpFli.CanTrans;
                fli.RefundStatus = tmpFli.RefundStatus;
                fli.RefundAmountStatus = tmpFli.RefundAmountStatus;
                fli.RefundIntegralStatus = tmpFli.RefundIntegralStatus;
                fli.RefundIntegral = tmpFli.RefundIntegral;
                fli.WaitRefundIntegral = tmpFli.WaitRefundIntegral;
                fli.TicketRefundAmount = tmpFli.TicketRefundAmount;
                fli.InsuranceAmount = tmpFli.InsuranceAmount;
                fli.WaitTicketRefundAmount = tmpFli.WaitTicketRefundAmount;
                fli.WaitInsuranceAmount = tmpFli.WaitInsuranceAmount;
                fli.RefundFirstAduitStatus = tmpFli.RefundFirstAduitStatus;
                fli.RefundSecondAduitStatus = tmpFli.RefundSecondAduitStatus;
                fli.RefundFirstNote = tmpFli.RefundFirstNote;
                fli.RefundSecondNote = tmpFli.RefundSecondNote;
                fli.RefundAduitTime = tmpFli.RefundAduitTime;
                fli.Insurances = tmpFli.Insurances;

                var chFee = 0;
                if (tmpFli.ChangeHandleFee != undefined && tmpFli.ChangeHandleFee != null) {
                    chFee = tmpFli.ChangeHandleFee;
                }
                ordInfo.OrderAmountWithTax += tmpFli.SaleTicketPrice + tmpFli.FuelTax + tmpFli.AirportTax + tmpFli.OtherTax + chFee;
                for (var x = 0; x < fli.Insurances.length; x++) {
                    var ins = fli.Insurances[x];
                    ordInfo.OrderAmountWithTax += ins.InsuranceAmount;
                }

                ordInfo.OrderIntegral += tmpFli.SaleIntegral;

                psg.AllTktAmount += tmpFli.SaleTicketPrice;
                psg.AllTktIntegral += tmpFli.SaleIntegral;
                psg.AllAirportAmount += tmpFli.AirportTax;
                psg.AllFuelAmount += tmpFli.FuelTax;
                psg.AllOtherAmount += tmpFli.OtherTax;
                psg.AllChangeHandleFee += (tmpFli.ChangeHandleFee == undefined || tmpFli.ChangeHandleFee == null) ? 0 : tmpFli.ChangeHandleFee;
                for (var s = 0; s < tmpFli.Insurances.length; s++) {
                    var inam = 0;
                    if (tmpFli.Insurances[s].InsuranceAmount != undefined && tmpFli.Insurances[s].InsuranceAmount != null) {
                        inam = tmpFli.Insurances[s].InsuranceAmount;
                    }
                    fli.InsAmount += inam;
                    psg.AllInsurancesAmount += inam;
                }

                psg.Flights[n] = fli;

                if (flightId.indexOf(tmpFli.FlightNum + ',' + tmpFli.DepartureTime, 0) < 0) {
                    var fliSim = new laEntityOrderInfoDetFlights();
                    fliSim.FlightId = tmpFli.FlightId;
                    fliSim.FlightNum = tmpFli.FlightNum;
                    fliSim.DepartureAirport = tmpFli.DepartureAirport;
                    fliSim.DepartureAirportCH = tmpFli.DepartureAirportCH;
                    fliSim.DepartureCity = tmpFli.DepartureCity;
                    fliSim.DepartureCityCH = tmpFli.DepartureCityCH;
                    fliSim.ArriveAirport = tmpFli.ArriveAirport;
                    fliSim.ArriveAirportCH = tmpFli.ArriveAirportCH;
                    fliSim.ArriveCity = tmpFli.ArriveCity;
                    fliSim.ArriveCityCH = tmpFli.ArriveCityCH;
                    fliSim.DepartureTime = tmpFli.DepartureTime;
                    fliSim.ArriveTime = tmpFli.ArriveTime;
                    fliSim.JiXing = tmpFli.JiXing;
                    fliSim.JingTing = tmpFli.JingTing;
                    fliSim.Cabin = tmpFli.Cabin;
                    fliSim.CabinType = tmpFli.CabinType;

                    ordInfo.FlightList[nFlilen] = fliSim;

                    flightId += '|' + tmpFli.FlightNum + ',' + tmpFli.DepartureTime + '|';
                    nFlilen++;
                }
            }

            ordInfo.Passengers[i] = psg;
        }

        var nPay = ordDet.PaymentMethods.length;
        var channelList = {};
        channelList.PayPlat = new Array();
        channelList.BankList = new Array();
        var bl = 0;

        for (var i = 0; i < nPay; i++) {
            var channel = ordDet.PaymentMethods[i];
            channelList.PayPlat[i] = {
                "PayPlatCode": channel.PayPlatCode,
                "PayPlatName": channel.PayPlatCodeDisplay
            };

            var l = channel.BankInfos.length;
            for (var j = 0; j < l; j++) {
                channelList.BankList[bl] = {
                    "PayPlatCode": channel.PayPlatCode,
                    "BankCode": channel.BankInfos[j].BankCode,
                    "BankName": channel.BankInfos[j].BankName,
                    "Index": channel.BankInfos[j].DisplayIndex
                };
                bl++;
            }
        }
        ordInfo.PaymentMethods = channelList;

        return ordInfo;
    };
    /**
     * 查询订单详细信息
     * @param orderId
     * @param callBack
     * @constructor
     */
    laOrderService.QueryOrderInfo = function (orderId, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_OrderInfo;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.OrderId = orderId;
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                var ord = data;
                var ordInfo = new laEntityOrderInfoDetail();
                if (status == true && ord.Code == laGlobalProperty.laServiceCode_Success) {
                    ordInfo = laOrderService.ParseSimOrderInfo(ord.Result);
                    ordInfo.Code = ord.Code;
                    ordInfo.Message = ord.Message;
                }
                callBack(ordInfo, status);

                /*
                 var ord = data;
                 var ordInfo = new laEntityOrderInfoDetail();
                 ordInfo.Code = ord.Code;
                 ordInfo.Message = ord.Message;
                 if (status == true && ordInfo.Code == laGlobalProperty.laServiceCode_Success) {
                 var ordDet = ord.Result;
                 ordInfo.OrderStatus = ordDet.OrderStatus;
                 ordInfo.OrderStatusCH = ordDet.OrderStatusCH;
                 ordInfo.PayStatus = ordDet.PayStatus;
                 ordInfo.PayStatusCH = ordDet.PayStatusCH;
                 ordInfo.CreateTime = ordDet.CreateTime;
                 ordInfo.OrderType = ordDet.OrderType;
                 ordInfo.OrderTypeCH = ordDet.OrderTypeCH;
                 ordInfo.PayTime = ordDet.PayTime;
                 ordInfo.PayPlat = ordDet.PayPlat;
                 ordInfo.OrderId = ordDet.Tid;
                 ordInfo.Contacts.ContactsAddress = ordDet.Contacts.ContactsAddress;
                 ordInfo.Contacts.ContactsEMail = ordDet.Contacts.ContactsEMail;
                 ordInfo.Contacts.ContactsMobile = ordDet.Contacts.ContactsMobile;
                 ordInfo.Contacts.ContactsName = ordDet.Contacts.ContactsName;
                 ordInfo.Contacts.ContactsPhone = ordDet.Contacts.ContactsPhone;
                 ordInfo.Contacts.ContactsZIP = ordDet.Contacts.ContactsZIP;

                 var flightId = '';
                 var nFlilen = 0;
                 var nPsg = ordDet.Passengers.length;
                 for (i = 0; i < nPsg; i++) {
                 var psg = new laEntityOrderInfoDetPassengers();
                 var tmpPsg = ordDet.Passengers[i];
                 psg.PassengerId = tmpPsg.PassengerId;
                 psg.PassengerName = tmpPsg.PassengerName;
                 psg.Foid = tmpPsg.Foid;
                 psg.FoidType = tmpPsg.FoidType;
                 psg.FoidTypeDisplay = tmpPsg.FoidTypeDisplay;
                 psg.TravellerType = tmpPsg.TravellerType;
                 psg.TravellerTypeDisplay = tmpPsg.TravellerTypeDisplay;
                 psg.Brithday = tmpPsg.Brithday;

                 var nFli = ordDet.Passengers[i].Flights.length;
                 for (n = 0; n < nFli; n++) {
                 var fli = new laEntityOrderInfoDetPsgFlights();
                 var tmpFli = ordDet.Passengers[i].Flights[n];
                 fli.FlightId = tmpFli.FlightId;
                 fli.FlightNum = tmpFli.FlightNum;
                 fli.DepartureAirport = tmpFli.DepartureAirport;
                 fli.DepartureAirportCH = tmpFli.DepartureAirportCH;
                 fli.DepartureCity = tmpFli.DepartureCity;
                 fli.DepartureCityCH = tmpFli.DepartureCityCH;
                 fli.ArriveAirport = tmpFli.ArriveAirport;
                 fli.ArriveAirportCH = tmpFli.ArriveAirportCH;
                 fli.ArriveCity = tmpFli.ArriveCity;
                 fli.ArriveCityCH = tmpFli.ArriveCityCH;
                 fli.DepartureTime = tmpFli.DepartureTime;
                 fli.ArriveTime = tmpFli.ArriveTime;
                 fli.Cabin = tmpFli.Cabin;
                 fli.SaleTicketPrice = tmpFli.SaleTicketPrice;
                 fli.TicketPrice = tmpFli.TicketPrice;
                 fli.FuelTax = tmpFli.FuelTax;
                 fli.AirportTax = tmpFli.AirportTax;
                 fli.OtherTax = tmpFli.OtherTax;
                 fli.ETKT = tmpFli.ETKT;
                 fli.JiXing = tmpFli.JiXing;
                 fli.JingTing = tmpFli.JingTing;
                 fli.CabinType = tmpFli.CabinType;
                 fli.PriceBase = tmpFli.PriceBase;
                 fli.RefundRule = tmpFli.RefundRule;
                 fli.ChangeRule = tmpFli.ChangeRule;
                 fli.SignedTransfer = tmpFli.SignedTransfer;
                 fli.CanRefund = tmpFli.CanRefund;
                 fli.CanTrans = tmpFli.CanTrans;
                 fli.RefundStatus = tmpFli.RefundStatus;
                 fli.RefundAmountStatus = tmpFli.RefundAmountStatus;

                 ordInfo.OrderAmountWithTax += tmpFli.SaleTicketPrice + tmpFli.FuelTax + tmpFli.AirportTax + tmpFli.OtherTax;

                 psg.AllTktAmount += tmpFli.SaleTicketPrice;
                 psg.AllAirportAmount += tmpFli.AirportTax;
                 psg.AllFuelAmount += tmpFli.FuelTax;
                 psg.AllOtherAmount += tmpFli.OtherTax;

                 psg.Flights[n] = fli;

                 if (flightId.indexOf(tmpFli.FlightId, 0) < 0) {
                 var fliSim = new laEntityOrderInfoDetFlights();
                 fliSim.FlightId = tmpFli.FlightId;
                 fliSim.FlightNum = '';
                 fliSim.DepartureAirport = tmpFli.DepartureAirport;
                 fliSim.DepartureAirportCH = tmpFli.DepartureAirportCH;
                 fliSim.DepartureCity = tmpFli.DepartureCity;
                 fliSim.DepartureCityCH = tmpFli.DepartureCityCH;
                 fliSim.ArriveAirport = tmpFli.ArriveAirport;
                 fliSim.ArriveAirportCH = tmpFli.ArriveAirportCH;
                 fliSim.ArriveCity = tmpFli.ArriveCity;
                 fliSim.ArriveCityCH = tmpFli.ArriveCityCH;
                 fliSim.DepartureTime = tmpFli.DepartureTime;
                 fliSim.ArriveTime = tmpFli.ArriveTime;
                 fliSim.JiXing = tmpFli.JiXing;
                 fliSim.JingTing = tmpFli.JingTing;
                 fliSim.Cabin = tmpFli.Cabin;
                 fliSim.CabinType = tmpFli.CabinType;
                 ordInfo.FlightList[nFlilen] = fliSim;

                 flightId += '|' + tmpFli.FlightId + '|';
                 nFlilen++;
                 }
                 }

                 ordInfo.Passengers[i] = psg;
                 }
                 }
                 callBack(ordInfo, status);
                 */
            }
        )
    };

    /**
     * 未登录状态下查询订单信息的查询验证码
     * @param callBack
     * @constructor
     */
    laOrderService.ImageVerifyCodeForQueryOrderInfoWithoutLogin = function (callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_OrderInfoImgVerifyCode;
        requestParam.SessionId = '';

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 未登录状态下查询订单信息
     * @param orderId
     * @param mobile
     * @param imageVerifyCode
     * @param sessionId
     * @param callBack
     * @constructor
     */
    laOrderService.QueryOrderInfoWithoutLogin = function (orderId, mobile, imageVerifyCode, sessionId, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_OrderInfoWithoutLogin;
        requestParam.SessionId = sessionId;

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.ChuanDaOrderId = orderId;
        requestBody.Mobile = mobile;
        requestBody.ImageVerifyCode = imageVerifyCode;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                var ord = data;
                var ordInfo = new laEntityOrderInfoDetail();
                if (status == true && ord.Code == laGlobalProperty.laServiceCode_Success) {
                    ordInfo = laOrderService.ParseSimOrderInfo(ord.Result);
                    ordInfo.Code = ord.Code;
                    ordInfo.Message = ord.Message;
                    ordInfo.SignKey = ord.SignKey;
                }
                callBack(ordInfo, status);
            }
        )
    };

    /**
     * 获取支付链接
     * @param orderId 订单号
     * @param payPlatCode 支付平台编码
     * @param bankCode 银行代码
     * @param payUrlType Url类型 1:url;2:form
     * @param callBack
     * @constructor
     */
    laOrderService.GetPayUrl = function (orderId, payPlatCode, bankCode, payUrlType, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_PayUrl;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.OrderId = orderId;
        requestBody.PayPlatCode = payPlatCode;
        requestBody.BankCode = bankCode;
        requestBody.PayUrlType = payUrlType;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 取消订单
     * @param orderId
     * @param callBack
     * @constructor
     */
    laOrderService.CancelOrder = function (orderId, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_CancelOrder;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.OrderId = orderId;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 退票
     * @param r 退票信息
     * @param callBack
     * @constructor
     */
    laOrderService.RefundOrder = function (r, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_RefundOrder;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.OrderId = r.OrderId;
        requestBody.RefundType = r.RefundType;
        requestBody.Note = r.Note;
        requestBody.ContactsName = r.ContactsName;
        requestBody.ContactsEMail = r.ContactsEMail;
        requestBody.ContactsMobile = r.ContactsMobile;
        requestBody.Passengers = r.Passengers;
        requestBody.RefundAmount = r.RefundAmount;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 未登录状态下退票
     * @param r
     * @param callBack
     * @constructor
     */
    laOrderService.RefundOrderWithoutLogin = function (r, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_RefundOrderWithoutLogin;
        requestParam.SessionId = r.sessionId;

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.OrderId = r.OrderId;
        requestBody.RefundType = r.RefundType;
        requestBody.Note = r.Note;
        requestBody.ContactsName = r.ContactsName;
        requestBody.ContactsEMail = r.ContactsEMail;
        requestBody.ContactsMobile = r.ContactsMobile;
        requestBody.Passengers = r.Passengers;
        requestBody.RefundAmount = r.RefundAmount;
        requestBody.SignKey = r.SignKey;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 客票验真图片验证码
     * @param callBack
     * @constructor
     */
    laOrderService.ImageVerifyCodeForCheckTicket = function (callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_CheckTicketImgVerifyCode;
        requestParam.SessionId = '';

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 客票验真
     * @param ticketNum 票号
     * @param passengerName 旅客姓名
     * @param imageVerifyCode 图片验证码
     * @param sessionId
     * @param callBack
     * @constructor
     */
    laOrderService.CheckTicket = function (ticketNum, passengerName, imageVerifyCode, sessionId, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_CheckTicket;
        requestParam.SessionId = sessionId;

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.Sno = ticketNum;
        requestBody.Name = passengerName;
        requestBody.ImageCode = imageVerifyCode;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {

                callBack(data, status);
            }
        )
    };

    /**
     * 获取预定机票时的验证码
     * @param callBack
     * @constructor
     */
    laOrderService.ImageVerifyCodeForBookingTicketValidCode = function (callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_BookingTicketValidCode;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    laOrderService.QueryRefundOrderInfo = function (callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_RefundOrderInfo;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {

            }
        )
    };

    laOrderService.QueryRefundOrderList = function (callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_RefundOrderList;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {

            }
        )
    };

    laOrderService.QueryRefundOrderPassenger = function (callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_RefundOrderPassenger;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {

            }
        )
    };

    return laOrderService;
}]);