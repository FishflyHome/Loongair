/**
 * Created by Jerry on 16/2/14.
 */

laAir.controller('laAir_ETicket_RefundOrderPageCtl', ['$sce', '$document', '$interval', '$filter', '$window', '$scope', 'laUserService', 'laOrderService', 'laGlobalLocalService', function ($sce, $document, $interval, $filter, $window, $scope, laUserService, laOrderService, laGlobalLocalService) {

    $scope.title = "退票";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isSchTripNav = true;

    $scope.RefundTypeOptions = laEntityEnumrefundTypeOptions;

    //订单信息
    $scope.orderInfo;
    $scope.ordId;
    //$scope.CanRefund = false;

    $scope.Param;

    //选中的退票乘机人
    $scope.checkedPsg = new Array();
    //退票联系人
    $scope.contactInfo = new laEntityContacts();

    $scope.refund = new laEntityRefundOrder();
    $scope.refund.RefundType = 2;

    $scope.isRefunding = false;
    $scope.CanRefundPsgCnt = 0;

    var curHref = $window.location.href.split('?');
    if (curHref.length >= 2) {
        var params = curHref[1].split('&');
        for (var i = 0; i < params.length; i++) {
            var param = params[i].split('=');
            if (param.length >= 2) {
                if (param[0].toLowerCase() == 'ordid') {
                    $scope.ordId = param[1];
                    break;
                }
                if (param[0].toLowerCase() == 'param') {   //表示根据参数未登录查订单信息
                    try {
                        //$scope.Param = JSON.parse(new Base64().decode(param[1]));
                        $scope.Param = JSON.parse(new Base64().decode(params[i].substr(6)));
                    } catch (e) {

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
        getOrderInfoWithoutLogin();
    }

    $scope.btnChooseRefundType = function () {
        if ($scope.refund.RefundType == 2) {
            $("#divRefundNote").hide();
            $scope.contactInfo.Note = "";
            return;
        }
        if ($scope.refund.RefundType == 3 || $scope.refund.RefundType == 6) {
            $("#divRefundNote").show();
            return;
        }
    };

    /**
     * 判断乘机人是否可以退票
     * @param psg
     */
    $scope.psgCanRefund = function (psg) {
        var result = false;
        var flist = psg.Flights;
        var n = flist.length;
        for (var i = 0; i < n; i++) {
            var item = flist[i];
            if (item.CanRefund == true || item.CanErrorRefund == true || item.CanInvoluntary == true) {
                result = true;
                break;
            }
        }
        if (result){
            $scope.CanRefundPsgCnt++;
        }
        return result;
    };
    $scope.createTGQHtml = function getTGQHtml(flipsg) {
        var insHtml = "";
        //var nF = psg.Flights.length;

        var fli = flipsg;
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
            "<tr><td style='text-align: right;'>说明</td><td style='text-align: left;color: orange;' colspan='2'>签转条件:" + carbin.SignedTransfer + "</td></tr>" +
            "</table></div>";

        return $sce.trustAsHtml(insHtml);
    };

    /**
     * 退票
     */
    $scope.btnRefundClick = function () {
        if ($scope.orderInfo.PayStatus == 2) {// && $scope.CanRefund
            bootbox.confirm('您是否要退票?', function (result) {
                if (result) {

                    if (laGlobalLocalService.CheckStringIsEmpty($scope.contactInfo.ContactsName)) {
                        bootbox.alert('请填写退票联系人姓名');
                        return;
                    }
                    if (laGlobalLocalService.CheckStringIsEmpty($scope.contactInfo.ContactsMobile) || !laGlobalLocalService.CheckStringLength($scope.contactInfo.ContactsMobile, 11)) {
                        bootbox.alert('请填写11位退票联系人手机');
                        return;
                    }
                    if (($scope.refund.RefundType == 3 || $scope.refund.RefundType == 6) && laGlobalLocalService.CheckStringIsEmpty($scope.contactInfo.Note)) {
                        bootbox.alert('非自愿退票请填写退票原因');
                        return;
                    }

                    //var refund = new laEntityRefundOrder();
                    $scope.refund.OrderId = $scope.orderInfo.OrderId;
                    $scope.refund.Note = ($scope.contactInfo.Note == undefined) ? '' : $scope.contactInfo.Note;
                    $scope.refund.ContactsName = $scope.contactInfo.ContactsName;
                    $scope.refund.ContactsEMail = ($scope.contactInfo.ContactsEMail) ? '' : $scope.contactInfo.ContactsEMail;
                    $scope.refund.ContactsMobile = $scope.contactInfo.ContactsMobile;
                    $scope.refund.RefundAmount = 0;

                    for (var i = 0; i < $scope.checkedPsg.length; i++) {
                        if ($scope.checkedPsg[i] != 0 && !laGlobalLocalService.CheckStringIsEmpty($scope.checkedPsg[i])) {
                            for (var n = 0; n < $scope.orderInfo.Passengers.length; n++) {
                                if ($scope.checkedPsg[i] == $scope.orderInfo.Passengers[n].PassengerId) {
                                    var psg = new laEntityRefundOrderPassenger();
                                    for (var l = 0; l < $scope.orderInfo.Passengers[n].Flights.length; l++) {
                                        psg.FlightIds[l] = $scope.orderInfo.Passengers[n].Flights[l].FlightId;
                                        if ($scope.refund.RefundType == 2) {
                                            if ($scope.orderInfo.Passengers[n].Flights[l].CanRefund == false) {
                                                bootbox.alert('乘机人:' + $scope.orderInfo.Passengers[n].PassengerName +
                                                    ',行程:' + $scope.orderInfo.Passengers[n].Flights[l].DepartureCityCH +
                                                    '-' + $scope.orderInfo.Passengers[n].Flights[l].ArriveCityCH + ' 不允许自愿退票:' +
                                                    $scope.orderInfo.Passengers[n].Flights[l].CanNotRefundNote);
                                                return;
                                            }
                                        }
                                        if ($scope.refund.RefundType == 3) {
                                            if ($scope.orderInfo.Passengers[n].Flights[l].CanInvoluntary == false) {
                                                bootbox.alert('乘机人:' + $scope.orderInfo.Passengers[n].PassengerName +
                                                    ',行程:' + $scope.orderInfo.Passengers[n].Flights[l].DepartureCityCH +
                                                    '-' + $scope.orderInfo.Passengers[n].Flights[l].ArriveCityCH + ' 不允许非自愿退票:' +
                                                    $scope.orderInfo.Passengers[n].Flights[l].CanNotInvoluntaryNote);
                                                return;
                                            }
                                        }
                                        if ($scope.refund.RefundType == 6) {
                                            if ($scope.orderInfo.Passengers[n].Flights[l].CanErrorRefund == false) {
                                                bootbox.alert('乘机人:' + $scope.orderInfo.Passengers[n].PassengerName +
                                                    ',行程:' + $scope.orderInfo.Passengers[n].Flights[l].DepartureCityCH +
                                                    '-' + $scope.orderInfo.Passengers[n].Flights[l].ArriveCityCH + ' 不允许补退:' +
                                                    $scope.orderInfo.Passengers[n].Flights[l].CanNotErrorRefundNote);
                                                return;
                                            }
                                        }
                                    }
                                    psg.PassengerId = $scope.checkedPsg[i];

                                    //$scope.refund.Passengers[i] = psg;
                                    $scope.refund.Passengers[$scope.refund.Passengers.length] = psg;
                                }

                            }
                        }
                    }

                    if ($scope.refund.Passengers.length <= 0) {
                        bootbox.alert('请选择要退票的乘机人');
                    } else {
                        $scope.isRefunding = true;
                        $scope.timeDown = 1;
                        if ($scope.ordId != undefined && $scope.ordId != null) {
                            laOrderService.RefundOrder($scope.refund, function (backData, status) {
                                var rs = backData;
                                if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                                    var timer = $interval(function () {
                                        $scope.timeDown = $scope.timeDown - 1;
                                        if ($scope.timeDown <= 0) {
                                            $interval.cancel(timer);
                                            $scope.isRefunding = false;
                                            bootbox.alert('退票成功', function () {
                                                $window.location.href = "/ETicket/OrderDetail.html?ordId=" + $scope.orderInfo.OrderId;
                                            });
                                        }
                                    }, 1000);
                                } else {
                                    var timer = $interval(function () {
                                        $scope.timeDown = $scope.timeDown - 1;
                                        if ($scope.timeDown <= 0) {
                                            $interval.cancel(timer);
                                            $scope.isRefunding = false;
                                            bootbox.alert(rs.Message, function () {
                                            });
                                        }
                                    }, 1000);
                                }
                            });
                        }
                        if ($scope.Param != undefined && $scope.Param != null) {
                            $scope.refund.sessionId = $scope.Param.sessionId;
                            $scope.refund.SignKey = $scope.orderInfo.SignKey;
                            laOrderService.RefundOrderWithoutLogin($scope.refund, function (backData, status) {
                                var rs = backData;
                                if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                                    var timer = $interval(function () {
                                        $scope.timeDown = $scope.timeDown - 1;
                                        if ($scope.timeDown <= 0) {
                                            $interval.cancel(timer);
                                            $scope.isRefunding = false;
                                            bootbox.alert('退票成功', function () {
                                                $window.location.href = "/ETicket/OrderDetail.html?ordId=" + $scope.orderInfo.OrderId;
                                            });
                                        }
                                    }, 1000);
                                } else {
                                    var timer = $interval(function () {
                                        $scope.timeDown = $scope.timeDown - 1;
                                        if ($scope.timeDown <= 0) {
                                            $interval.cancel(timer);
                                            $scope.isRefunding = false;
                                            bootbox.alert(rs.Message, function () {
                                            });
                                        }
                                    }, 1000);
                                }
                            });
                        }
                    }
                }
            })
        } else {
            bootbox.alert('该订单不能退票,只有已支付的订单且有未退票的航段才可以退票');
        }
    };

    $scope.btnChangeClick = function () {
        bootbox.alert("因线上改签仍在开发中，如需改签请致电客服0571-89999999", function () {
        });
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
                /*
                psgloop:
                    for (var i = 0; i < $scope.orderInfo.Passengers.length; i++) {
                        for (var n = 0; n < $scope.orderInfo.Passengers[i].Flights.length; n++) {
                            if ($scope.orderInfo.Passengers[i].Flights[n].CanRefund) {
                                $scope.CanRefund = true;
                                break psgloop;
                            }
                        }
                    }
*/
                $scope.contactInfo.ContactsName = rs.Contacts.ContactsName;
                $scope.contactInfo.ContactsMobile = rs.Contacts.ContactsMobile;
                $scope.contactInfo.ContactsEMail = (laGlobalLocalService.CheckStringIsEmpty(rs.Contacts.ContactsEMail)) ? '' : rs.Contacts.ContactsEMail;

                for (var i = 0; i < $scope.orderInfo.Passengers.length; i++) {
                    $scope.checkedPsg[i] = 0;
                }
            }
        });
    }

    function getOrderInfoWithoutLogin() {
        laOrderService.QueryOrderInfoWithoutLogin($scope.Param.ordid, $scope.Param.mobile, $scope.Param.verifycode, $scope.Param.sessionId, function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.orderInfo = rs;
                /*
                psgloop:
                    for (var i = 0; i < $scope.orderInfo.Passengers.length; i++) {
                        for (var n = 0; n < $scope.orderInfo.Passengers[i].Flights.length; n++) {
                            if ($scope.orderInfo.Passengers[i].Flights[n].CanRefund) {
                                $scope.CanRefund = true;
                                break psgloop;
                            }
                        }
                    }
*/
                $scope.contactInfo.ContactsName = rs.Contacts.ContactsName;
                $scope.contactInfo.ContactsMobile = rs.Contacts.ContactsMobile;
                $scope.contactInfo.ContactsEMail = (laGlobalLocalService.CheckStringIsEmpty(rs.Contacts.ContactsEMail)) ? '' : rs.Contacts.ContactsEMail;

                for (var i = 0; i < $scope.orderInfo.Passengers.length; i++) {
                    $scope.checkedPsg[i] = 0;
                }
            }
        });
    }

}]);
