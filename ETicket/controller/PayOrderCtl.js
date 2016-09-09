/**
 * Created by Jerry on 16/2/14.
 */

laAir.controller('laAir_ETicket_PayOrderPageCtl', ['$sce', '$document', '$filter', '$window', '$scope', 'laUserService', 'laOrderService', 'laGlobalLocalService', function ($sce, $document, $filter, $window, $scope, laUserService, laOrderService, laGlobalLocalService) {

    $scope.title = "支付机票";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isSchTripNav = true;

    //订单信息
    $scope.orderInfo;
    $scope.orderPayUrl;
    $scope.canPay;
    $scope.canPayDesc = "请选择支付方式";

    $scope.channelList;

    var orderId = laGlobalLocalService.getCookie(laGlobalProperty.laServiceConst_TransData_OrderIdForCreate);
    if (orderId != undefined) {
        getOrderInfo(orderId);
    }

    //getPayChannel();

    $scope.btnGoPayment = function () {
        if (!laGlobalLocalService.CheckStringIsEmpty($scope.canPayDesc)) {
            bootbox.alert($scope.canPayDesc);
            return;
        }
        if ($scope.canPay) {
            $('.modal').modal('show');
        }
    };

    /**
     *
     * @param p 支付平台
     * @param b 支付银行
     */
    $scope.btnChoosePayType = function (p, b) {
        getOrderPayUrl(orderId, p, b);
    };
    /**
     * 查询订单信息
     * @param ordId
     */
    function getOrderInfo(ordId) {
        laOrderService.QueryOrderInfo(ordId, function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.orderInfo = rs;
                $scope.channelList = rs.PaymentMethods;
            }
        });
    }

    $scope.createInsuranceHtml = function getInsuranceHtml(psg) {
        var insHtml = "";
        var nF = psg.Flights.length;
        for (var i = 0; i < nF; i++) {
            var fli = psg.Flights[i];
            var nN = fli.Insurances.length;
            for (var n = 0; n < nN; n++) {
                var ins = fli.Insurances[n];
                insHtml += "<div>" + ins.InsuranceTypeCH + "：<span style='color:orange; margin-left: 3px;'>￥" + ins.InsuranceAmount + "</span></div>"
            }
        }
        return $sce.trustAsHtml(insHtml);
    };

    /**
     * 获取订单支付URL
     * @param ordId
     * @param p
     * @param b
     */
    function getOrderPayUrl(ordId, p, b) {
        $scope.orderPayUrl = '';
        $scope.canPayDesc = '';
        laOrderService.GetPayUrl(ordId, p, b, 1, function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.canPay = true;
                $scope.orderPayUrl = backData.Result.PayUrlInfo;
            } else {
                $scope.canPay = false;
                $scope.canPayDesc = rs.Message;
            }

        });
    }

    function getPayChannel() {
        laOrderService.GetPayChannel(function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.channelList = rs;
            }
        })
    }

    /*
     {
     "Result": {
     "OrderStatus": 2,
     "OrderStatusCH": "已取消",
     "PayStatus": 1,
     "PayStatusCH": "未支付",
     "CreateTime": "2016-02-14T13:24:54",
     "OrderType": 1,
     "OrderTypeCH": "普通订单",
     "PayTime": "1900-01-01T00:00:00",
     "PayPlat": "",
     "Tid": 1931522941004302,
     "Contacts": {
     "ContactsAddress": null,
     "ContactsEMail": "",
     "ContactsMobile": "13988888888",
     "ContactsName": "yu",
     "ContactsPhone": "13988888888",
     "ContactsZIP": null
     },
     "Passengers": [
     {
     "Flights": [
     {
     "FlightId": 1931054891004402,
     "FlightNum": "GJ8855",
     "DepartureAirport": "HGH",
     "DepartureAirportCH": "杭州萧山国际机场",
     "DepartureCity": "HGH",
     "DepartureCityCH": "杭州",
     "ArriveAirport": "CKG",
     "ArriveAirportCH": "重庆江北国际机场",
     "ArriveCity": null,
     "ArriveCityCH": "重庆",
     "DepartureTime": "2016-02-16T12:10:00",
     "ArriveTime": "2016-02-16T16:00:00",
     "Cabin": "U",
     "SaleTicketPrice": 680,
     "TicketPrice": 680,
     "FuelTax": 0,
     "AirportTax": 50,
     "OtherTax": 0,
     "ChangeHandleFee": 0,
     "ETKT": "000-0000000000",
     "JiXing": "",
     "JingTing": "",
     "CabinType": "经济舱",
     "PriceBase": null,
     "RefundRule": "340-2-680",
     "ChangeRule": "204-2-340",
     "SignedTransfer": "不得签转",
     "CanRefund": true,
     "CanTrans": false,
     "RefundStatus": "",
     "RefundAmountStatus": ""
     },
     {
     "FlightId": 1931054891004602,
     "FlightNum": "GJ8855",
     "DepartureAirport": "CKG",
     "DepartureAirportCH": "重庆江北国际机场",
     "DepartureCity": "CKG",
     "DepartureCityCH": "重庆",
     "ArriveAirport": "HGH",
     "ArriveAirportCH": "杭州萧山国际机场",
     "ArriveCity": null,
     "ArriveCityCH": "杭州",
     "DepartureTime": "2016-02-17T21:50:00",
     "ArriveTime": "2016-02-18T00:05:00",
     "Cabin": "Y",
     "SaleTicketPrice": 1510,
     "TicketPrice": 1510,
     "FuelTax": 0,
     "AirportTax": 50,
     "OtherTax": 0,
     "ETKT": "000-0000000000",
     "JiXing": "",
     "JingTing": "",
     "CabinType": "经济舱",
     "PriceBase": null,
     "RefundRule": "76-2-151",
     "ChangeRule": "0-2-76",
     "SignedTransfer": "签转补差价",
     "CanRefund": true,
     "CanTrans": false,
     "RefundStatus": "",
     "RefundAmountStatus": ""
     }
     ],
     "PassengerId": 1931054891004502,
     "PassengerName": "王飞",
     "Foid": "2001",
     "FoidType": 0,
     "FoidTypeDisplay": "其他",
     "TravellerType": 0,
     "TravellerTypeDisplay": "成人",
     "Brithday": "0001-01-01T00:00:00"
     },
     {
     "Flights": [
     {
     "FlightId": 1931054891004402,
     "FlightNum": "GJ8855",
     "DepartureAirport": "HGH",
     "DepartureAirportCH": "杭州萧山国际机场",
     "DepartureCity": "HGH",
     "DepartureCityCH": "杭州",
     "ArriveAirport": "CKG",
     "ArriveAirportCH": "重庆江北国际机场",
     "ArriveCity": null,
     "ArriveCityCH": "重庆",
     "DepartureTime": "2016-02-16T12:10:00",
     "ArriveTime": "2016-02-16T16:00:00",
     "Cabin": "U",
     "SaleTicketPrice": 680,
     "TicketPrice": 680,
     "FuelTax": 0,
     "AirportTax": 50,
     "OtherTax": 0,
     "ETKT": "000-0000000000",
     "JiXing": "",
     "JingTing": "",
     "CabinType": "经济舱",
     "PriceBase": null,
     "RefundRule": "340-2-680",
     "ChangeRule": "204-2-340",
     "SignedTransfer": "不得签转",
     "CanRefund": true,
     "CanTrans": false,
     "RefundStatus": "",
     "RefundAmountStatus": ""
     },
     {
     "FlightId": 1931054891004602,
     "FlightNum": "GJ8855",
     "DepartureAirport": "CKG",
     "DepartureAirportCH": "重庆江北国际机场",
     "DepartureCity": "CKG",
     "DepartureCityCH": "重庆",
     "ArriveAirport": "HGH",
     "ArriveAirportCH": "杭州萧山国际机场",
     "ArriveCity": null,
     "ArriveCityCH": "杭州",
     "DepartureTime": "2016-02-17T21:50:00",
     "ArriveTime": "2016-02-18T00:05:00",
     "Cabin": "Y",
     "SaleTicketPrice": 1510,
     "TicketPrice": 1510,
     "FuelTax": 0,
     "AirportTax": 50,
     "OtherTax": 0,
     "ETKT": "000-0000000000",
     "JiXing": "",
     "JingTing": "",
     "CabinType": "经济舱",
     "PriceBase": null,
     "RefundRule": "76-2-151",
     "ChangeRule": "0-2-76",
     "SignedTransfer": "签转补差价",
     "CanRefund": true,
     "CanTrans": false,
     "RefundStatus": "",
     "RefundAmountStatus": ""
     }
     ],
     "PassengerId": 1931054891004702,
     "PassengerName": "于菲",
     "Foid": "3701",
     "FoidType": 0,
     "FoidTypeDisplay": "其他",
     "TravellerType": 0,
     "TravellerTypeDisplay": "成人",
     "Brithday": "0001-01-01T00:00:00"
     }
     ]
     },
     "Code": "0000",
     "Message": "获取成功"
     }

     */

}]);
