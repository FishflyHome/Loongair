/**
 * Created by Jerry on 16/2/14.
 */

laAir.controller('laAir_ETicket_OrderDetailPageCtl', ['$sce', '$document', '$filter', '$window', '$scope', 'laUserService', 'laOrderService', 'laGlobalLocalService', function ($sce, $document, $filter, $window, $scope, laUserService, laOrderService, laGlobalLocalService) {

    $scope.title = "订单详情";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isQueryOrderNav = true;

    //订单信息
    $scope.orderInfo;
    $scope.ordId;
    $scope.CanRefund = false;
    $scope.hasRefund = false;

    $scope.Param;

    $scope.PassengerFlightList = new Array();

    var curHref = $window.location.href.split('?');
    if (curHref.length >= 2) {
        var params = curHref[1].split('&');
        for (var i = 0; i < params.length; i++) {
            var param = params[i].split('=');
            if (param.length >= 2) {
                if (param[0].toLowerCase() == 'ordid') {  //表示正常查订单信息
                    $scope.ordId = param[1];
                    break;
                }
                if (param[0].toLowerCase() == 'param') {   //表示根据参数未登录查订单信息
                    try {
                        //$scope.Param = JSON.parse(new Base64().decode(param[1]));
                        $scope.Param = JSON.parse(new Base64().decode(params[i].substr(6)));
                    }
                    catch (e) {

                    }
                    break;
                }

            }
        }
    }

    if ($scope.ordId != undefined && $scope.ordId != null) {
        getOrderInfo($scope.ordId);
    }
    if ($scope.Param != undefined && $scope.Param != null) {
        getOrderInfoWithoutLogin($scope.Param.ordid, $scope.Param.mobile, $scope.Param.verifycode, $scope.Param.sessionId);
    }

    /**
     * 去支付页面
     */
    $scope.btnGoPayment = function () {
        laGlobalLocalService.writeCookie(laGlobalProperty.laServiceConst_TransData_OrderIdForCreate, $scope.ordId, 0);
        $window.location.href = 'PayOrder.html';
    };

    /**
     * 取消订单
     */
    $scope.btnCancelOrder = function () {
        bootbox.confirm("您确定要取消该订单吗?", function (result) {
            if (result) {
                laOrderService.CancelOrder($scope.ordId, function (backData, status) {
                    var rs = backData;
                    if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                        $window.location.href = $window.location.href;
                    } else {
                        bootbox.alert(rs.Message);
                    }
                })
            }
        });
    };

    /**
     * 退票
     */
    $scope.btnRefundOrder = function () {
        if ($scope.ordId != undefined && $scope.ordId != null) {
            $window.location.href = 'RefundOrder.html?ordId=' + $scope.ordId;
        }
        if ($scope.Param != undefined && $scope.Param != null) {
            $window.location.href = 'RefundOrder.html?param=' + new Base64().encode(JSON.stringify($scope.Param));
        }
    };

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

    $scope.createTGQHtml = function getTGQHtml(psg) {
        var insHtml = "";
        var nF = psg.Flights.length;
        for (var i = 0; i < nF; i++) {
            var fli = psg.Flights[i];
            var carbin = fli;
            var reRule = carbin.RefundRule.split('-');
            var chRule = carbin.ChangeRule.split('-');
            var reRuleJSON = {"b": {"p": "", "a": ""}, "a": {"p": "", "a": ""}};
            var chRuleJSON = {"b": {"p": "", "a": ""}, "a": {"p": "", "a": ""}};
            if (reRule.length >= 3) {
                if (laGlobalLocalService.IsNum(reRule[0])) {
                    var am = parseInt((reRule[0] / carbin.SaleTicketPrice) * 100);
                    reRuleJSON.b.p = (reRule[0] > 0) ? am.toString() + "%" : "";
                    reRuleJSON.b.a = (reRule[0] > 0) ? "(" + reRule[0].toString() + "元)" : reRule[0].toString() + "元";
                } else {
                    reRuleJSON.b.p = reRule[0];
                }
                if (laGlobalLocalService.IsNum(reRule[2])) {
                    var am = parseInt((reRule[2] / carbin.SaleTicketPrice) * 100);
                    reRuleJSON.a.p = (reRule[2] > 0) ? am.toString() + "%" : "";
                    reRuleJSON.a.a = (reRule[2] > 0) ? "(" + reRule[2].toString() + "元)" : reRule[2].toString() + "元";
                } else {
                    reRuleJSON.a.p = reRule[2];
                }
            }
            if (chRule.length >= 3) {
                if (laGlobalLocalService.IsNum(chRule[0])) {
                    var am = parseInt((chRule[0] / carbin.SaleTicketPrice) * 100);
                    chRuleJSON.b.p = (chRule[0] > 0) ? am.toString() + "%" : "";
                    chRuleJSON.b.a = (chRule[0] > 0) ? "(" + chRule[0].toString() + "元)" : chRule[0].toString() + "元";
                } else {
                    chRuleJSON.b.p = chRule[0];
                }
                if (laGlobalLocalService.IsNum(chRule[2])) {
                    var am = parseInt((chRule[2] / carbin.SaleTicketPrice) * 100);
                    chRuleJSON.a.p = (chRule[2] > 0) ? am.toString() + "%" : "";
                    chRuleJSON.a.a = (chRule[2] > 0) ? "(" + chRule[2].toString() + "元)" : chRule[2].toString() + "元";
                } else {
                    chRuleJSON.a.p = chRule[2];
                }
            }
            insHtml = "<div><table style='width:100%;' cellpadding='0' cellspacing='0'><tr><td style='text-align: right;'>类型</td><td style='text-align: left;'>起飞前2小时前</td><td style='text-align: left;'>起飞前2小时后</td></tr>" +
                "<tr><td style='text-align: right;'>退票手续费</td><td style='text-align: left;color: orange;'>" + reRuleJSON.b.p + reRuleJSON.b.a + "</td><td style='text-align: left;color: orange;'>" + reRuleJSON.a.p + reRuleJSON.a.a + "</td></tr>" +
                "<tr><td style='text-align: right;'>同舱改期收费</td><td style='text-align: left;color: orange;'>" + chRuleJSON.b.p + chRuleJSON.b.a + "</td><td style='text-align: left;color: orange;'>" + chRuleJSON.a.p + chRuleJSON.a.a + "</td></tr>" +
                "<tr><td style='text-align: right;'>说明</td><td style='text-align: left;color: orange;' colspan='2'>签转条件:" + carbin.SignedTransfer + "<br>如自愿要求变更或退票，按优惠前公布运价(" + carbin.TicketPrice + "元)收取手续费</td></tr>" +
                "</table></div>";
        }
        return $sce.trustAsHtml(insHtml);
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
                psgloop:
                    for (var i = 0; i < $scope.orderInfo.Passengers.length; i++) {
                        for (var n = 0; n < $scope.orderInfo.Passengers[i].Flights.length; n++) {
                            if ($scope.orderInfo.Passengers[i].Flights[n].CanRefund ||
                                $scope.orderInfo.Passengers[i].Flights[n].CanErrorRefund ||
                                $scope.orderInfo.Passengers[i].Flights[n].CanInvoluntary) {
                                $scope.CanRefund = true;
                                break psgloop;
                            }
                        }
                    }

                getPassengerFlightList();
            }
        });
    }

    /**
     * 查询订单信息-未登录状态
     * @param ordId
     * @param mobile
     * @param verifycode
     * @param sessionId
     */
    function getOrderInfoWithoutLogin(ordId, mobile, verifycode, sessionId) {
        laOrderService.QueryOrderInfoWithoutLogin(ordId, mobile, verifycode, sessionId, function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.orderInfo = rs;
                psgloop:
                    for (var i = 0; i < $scope.orderInfo.Passengers.length; i++) {
                        for (var n = 0; n < $scope.orderInfo.Passengers[i].Flights.length; n++) {
                            if ($scope.orderInfo.Passengers[i].Flights[n].CanRefund ||
                                $scope.orderInfo.Passengers[i].Flights[n].CanErrorRefund ||
                                $scope.orderInfo.Passengers[i].Flights[n].CanInvoluntary) {
                                $scope.CanRefund = true;
                                break psgloop;
                            }
                        }
                    }

                getPassengerFlightList();
            }
        });
    }

    function getPassengerFlightList() {
        if ($scope.orderInfo != null && $scope.orderInfo != undefined) {
            var psgList = $scope.orderInfo.Passengers;
            var n = psgList.length;
            for (var i = 0; i < n; i++) {
                var psg = psgList[i];
                var flis = psg.Flights;
                var j = flis.length;
                for (var x = 0; x < j; x++) {
                    var fli = flis[x];
                    if (fli.RefundStatus != "") {
                        $scope.hasRefund = true;
                    }
                    var psgfli = {
                        "fli": fli,
                        "passengerName": psg.PassengerName,
                        "travelType": psg.TravellerTypeDisplay,
                        "foidType": psg.FoidTypeDisplay,
                        "foid": psg.Foid
                    };
                    $scope.PassengerFlightList.push(psgfli);
                }
            }
        }
    }

}]);
