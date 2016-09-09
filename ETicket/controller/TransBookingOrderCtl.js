/**
 * Created by ssyufei on 16/8/2.
 */

laAir.controller('laAir_ETicket_TransBookingOrderPageCtl', ['$document', '$interval', '$filter', '$window', '$scope', 'laUserService', 'laOrderService', 'laGlobalLocalService', function ($document, $interval, $filter, $window, $scope, laUserService, laOrderService, laGlobalLocalService) {

    $scope.title = "填写信息,长龙航空,长龙航空官网,长龙航空官方网站,特价机票,长龙航空机票预定";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isSchTripNav = true;

    /**
     * 乘客类型和证件类型枚举
     * @type {*[]}
     */
    $scope.psgTypeOptions = laEntityEnumpsgTypeOptions;
    $scope.foIdTypeOptions = laEntityEnumfoIdTypeOptions;

    //机票和舱位信息供预定
    $scope.bookOrderInfo;
    $scope.flightInfo;
    $scope.cabinInfo;
    $scope.childcabinInfo;
    $scope.otherInfo;

    //当前用户
    $scope.UserInfo;
    $scope.orderInfo;
    $scope.passengerList = new Array();

    $scope.verifyCode = "";
    $scope.ImgVerifyCode

    //订单提交状态
    $scope.CommitOrder = false;
    $scope.CommitOrderStatus = true;
    $scope.CommitOrderStatusDesc = '';

    //联系人信息
    $scope.cAddr;
    $scope.cEmail;
    $scope.cMobile;
    $scope.cName;
    $scope.cTel;
    $scope.cZip;

    $scope.acceptClause = true;

    $scope.Param;

    var timer;

    //获取页面传值
    var curHref = $window.location.href.split('?');
    if (curHref.length >= 2) {
        var params = curHref[1].split('&');
        for (var i = 0; i < params.length; i++) {
            var param = params[i].split('=');
            if (param.length >= 2) {
                if (param[0].toLowerCase() == 'param') {
                    try {
                        $scope.Param = JSON.parse(new Base64().decode(params[i].substr(6)));
                    } catch (e) {

                    }
                    break;
                }
            }
        }
    }

    if ($scope.Param != undefined && $scope.Param != null) {
        $scope.bookOrderInfo = $scope.Param;
        $scope.flightInfo = $scope.bookOrderInfo.g.f;
        if ($scope.flightInfo.hasAdultPsg) {
            $scope.cabinInfo = $scope.bookOrderInfo.g.c;
        }
        if ($scope.flightInfo.hasChildPsg) {
            $scope.childcabinInfo = $scope.bookOrderInfo.g.c1;
        }
        $scope.otherInfo = $scope.bookOrderInfo.g.o;

        laOrderService.QueryOrderInfo($scope.flightInfo.OrderId, function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.orderInfo = rs;
                var psglist = $scope.orderInfo.Passengers;
                var chpsg = $scope.flightInfo.ChangePassenger;
                for (var i = 0; i < chpsg.length; i++) {
                    for (var n = 0; n < psglist.length; n++) {
                        if (chpsg[i].PassengerId == psglist[n].PassengerId) {
                            var chItem = {
                                "PassengerId": chpsg[i].PassengerId, "SegmentId": chpsg[i].SegmentId,
                                "TravellerType": psglist[n].TravellerType,
                                "TravellerTypeDisplay": psglist[n].TravellerTypeDisplay,
                                "PassengerName": psglist[n].PassengerName,
                                "FoidTypeDisplay": psglist[n].FoidTypeDisplay,
                                "Foid": psglist[n].Foid,
                                "Brithday": psglist[n].Brithday
                            };
                            $scope.passengerList.push(chItem);
                            break;
                        }
                    }
                }
            }
        });
        $("#divfliinfo").css({"display": "block"});
    }

    GetImageVerifyCode();

    QueryCurrentUserInfo();

    $("#divamountall").css("display", "block");
    $("#divamountdetail").css("display", "block");

    $scope.CheckConName = function () {
        var result = true;
        $("#conName").css("display", "none");
        if (laGlobalLocalService.CheckStringIsEmpty($scope.cName)) {
            $("#conName").css("display", "block");
            result = false;
        }
        return result;
    };

    $scope.CheckConMobile = function () {
        var result = true;
        $("#conMobile").css("display", "none");
        if (laGlobalLocalService.CheckStringIsEmpty($scope.cMobile) || !laGlobalLocalService.CheckStringLength($scope.cMobile, 11) || !laGlobalLocalService.CheckMobileCode($scope.cMobile)) {
            $("#conMobile").css("display", "block");
            result = false;
        }
        return result;
    };

    /**
     * 提交订单
     */
    $scope.btnCommitOrderClick = function () {

        if (!$scope.CheckConName()) {
            return;
        }
        if (!$scope.CheckConMobile()) {
            return;
        }

        var verifyCodeImg = $scope.verifyCode.replace(new RegExp(/ /g), '');
        if (laGlobalLocalService.CheckStringIsEmpty(verifyCodeImg)) {
            bootbox.alert('请输入验证码');
            return;
        }
        if (!$scope.acceptClause) {
            bootbox.alert('提交订单前请您选择接受此票价的购票、旅行安全运输的相关条款');
            return;
        }

        var hasAudit = false;
        var hasChild = false;
        var ordInfo = new laEntityOrderCreate();
        ordInfo.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        ordInfo.OrderId = $scope.flightInfo.OrderId;

        for (var i = 0; i < $scope.passengerList.length; i++) {
            var p = $scope.passengerList[i];
            if (p.TravellerType == 1) {
                ordInfo.TotalAmount += $scope.cabinInfo.HandleAmount + $scope.cabinInfo.TicketPriceDiff + $scope.flightInfo.AirportTaxDiff + $scope.flightInfo.FuelTaxDiff;
            }
            if (p.TravellerType == 2) {
                ordInfo.TotalAmount += $scope.childcabinInfo.HandleAmount + $scope.childcabinInfo.TicketPriceDiff + $scope.flightInfo.ChildAirportTaxDiff + $scope.flightInfo.ChildFuelTaxDiff;
            }

        }
        /**
         if ($scope.flightInfo.hasAdultPsg) {
            ordInfo.TotalAmount += $scope.flightInfo.ChangePassenger.length * ($scope.cabinInfo.HandleAmount + $scope.cabinInfo.TicketPriceDiff + $scope.flightInfo.AirportTaxDiff + $scope.flightInfo.FuelTaxDiff);
        }
         if ($scope.flightInfo.hasChildPsg) {
            ordInfo.TotalAmount += $scope.flightInfo.ChangePassenger.length * ($scope.childcabinInfo.HandleAmount + $scope.childcabinInfo.TicketPriceDiff + $scope.flightInfo.ChildAirportTaxDiff + $scope.flightInfo.ChildFuelTaxDiff);
        }
         */

        ordInfo.Passengers = $scope.flightInfo.ChangePassenger;
        ordInfo.Itinerary = "";
        ordInfo.VerifyCode = $scope.verifyCode;

        $scope.CommitOrder = true;
        $scope.CommitOrderStatus = true;
        $scope.CommitOrderStatusDesc = '';

        if (hasChild && !hasAudit) {
            ordInfo.ChildRecerveCabinPriceType = 1;
        }

        //添加航段信息
        var fli = new laEntityReserveFlight();
        fli.ArriveAirport = $scope.flightInfo.AirportTo;
        fli.CabinName = "";
        fli.ChildCabinName = "";
        if ($scope.flightInfo.hasAdultPsg) {
            fli.CabinName = $scope.cabinInfo.CabinName;
        }
        if ($scope.flightInfo.hasChildPsg) {
            fli.ChildCabinName = $scope.childcabinInfo.CabinName;
        }
        fli.DepartureAirport = $scope.flightInfo.AirportFrom;
        //必须转换成本地时间,否则JS会自动按照国际时间,会存在误差
        fli.DepartureTime = $filter('date')($scope.flightInfo.DepartureTime, 'yyyy-MM-dd HH:mm:ss');//$scope.flightInfo.DepartureTime;
        fli.FlightNum = $scope.flightInfo.FlightNum;
        ordInfo.Flights[0] = fli;

        //添加联系人信息
        var con = new laEntityContacts()
        con.ContactsAddress = ($scope.cAddr == undefined) ? '' : $scope.cAddr;
        con.ContactsEMail = ($scope.cEmail == undefined) ? '' : $scope.cEmail;
        con.ContactsMobile = ($scope.cMobile == undefined) ? '' : $scope.cMobile;
        con.ContactsName = ($scope.cName == undefined) ? '' : $scope.cName;
        con.ContactsPhone = ($scope.cTel == undefined) ? '' : $scope.cTel;
        con.ContactsZIP = ($scope.cZip == undefined) ? '' : $scope.cZip;

        ordInfo.Contacts = con;

        laOrderService.TransFlightOrder(ordInfo, function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.timeDown = 2;
                timer = $interval(function () {
                    $scope.timeDown = $scope.timeDown - 1;
                    if ($scope.timeDown <= 0) {
                        $interval.cancel(timer);
                        $scope.CommitOrder = true;
                        $scope.CommitOrderStatus = true;
                        var orderId = rs.Result.OrderId;
                        laGlobalLocalService.writeCookie(laGlobalProperty.laServiceConst_TransData_OrderIdForCreate, orderId, 0);
                        $window.location.href = 'PayOrder.html';
                    }
                }, 1000);
            } else {
                $scope.timeDown = 2;
                timer = $interval(function () {
                    $scope.timeDown = $scope.timeDown - 1;
                    if ($scope.timeDown <= 0) {
                        $interval.cancel(timer);
                        $scope.CommitOrder = false;
                        $scope.CommitOrderStatus = false;
                        $scope.CommitOrderStatusDesc = rs.Message;
                        GetImageVerifyCode();
                        bootbox.alert($scope.CommitOrderStatusDesc);
                    }
                }, 1000);
            }
        });
    };

    /**
     * 返回重新查询机票
     */
    $scope.btnBackForReQuery = function () {
        var queryFli = {
            "DepartureAirport": $scope.flightInfo.AirportFrom,
            "DepartureCityCH": $scope.otherInfo.sCity,
            "ArriveCityCH": $scope.otherInfo.eCity,
            "ArriveAirport": $scope.flightInfo.AirportTo,
            "DepartureTime": $scope.flightInfo.DepartureTime.split(' ')[0],
            "OrderId": $scope.flightInfo.OrderId,
            "ChangePassenger": $scope.flightInfo.ChangePassenger
        };


        $window.location.href = "/ETicket/TransAirlineList.html?param=" + new Base64().encode(JSON.stringify(queryFli));
    };

    $scope.btnChangeVerifyCode = function () {
        GetImageVerifyCode();
    };

    function GetImageVerifyCode() {
        $scope.ImgVerifyCode = '';
        laOrderService.ImageVerifyCodeForBookingTicketValidCode(function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.ImgVerifyCode = backData.ImageVerifyCode;
            }
        });
    }

    function QueryCurrentUserInfo() {
        laUserService.GetCurrentUserInfo(function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.UserInfo = rs;
                $scope.cName = $scope.UserInfo.Name;
                $scope.cMobile = $scope.UserInfo.Mobile;
            }
        })
    }
}]);