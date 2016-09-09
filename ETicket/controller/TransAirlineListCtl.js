/**
 * Created by ssyufei on 16/8/1.
 */

laAir.controller('laAir_ETicket_TransAirlineListPageCtl', ['$document', '$interval', '$filter', '$scope', '$window', 'laFlightService', 'laUserService', 'laGlobalLocalService', function ($document, $interval, $filter, $scope, $window, laFlightService, laUserService, laGlobalLocalService) {

    $scope.title = "机票改期";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isSchTripNav = true;

    //最终选定的航班信息
    $scope.bookOrderInfo;

    $scope.Param;

    //航班查询结果
    $scope.flightResult;
    //航班低价列表
    $scope.lowPriceList;

    $scope.hasAdultPsg = false;
    $scope.hasChildPsg = false;
    $scope.hasAllFliInfo;
    $scope.hasAllAdultCabin;
    $scope.hasAllChildCabin;

    $scope.validloginDataCheck = true;
    $scope.loginSuccess = true;

    var timer;

    $(".noflights").hide();
    $(".airline").hide();
    $(".dates").hide();
    $(".loading").hide();
    $(".table-fli").hide();

    //预定查询信息
    $scope.queryFliInfo;

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
        $scope.queryFliInfo = $scope.Param;

        for (var i = 0; i < $scope.queryFliInfo.ChangePassenger.length; i++) {
            if ($scope.queryFliInfo.ChangePassenger[i].TravellerType == 1) {
                $scope.hasAdultPsg = true;
            }
            if ($scope.queryFliInfo.ChangePassenger[i].TravellerType == 2) {
                $scope.hasChildPsg = true;
            }
        }
        QueryTicket($scope.queryFliInfo);
    }

    /**
     * 搜索机票按钮点击事件
     */
    $scope.btnQueryTicketClick = function () {
        var sTime = $("#startTime").val();
        $scope.queryFliInfo.DepartureTime = sTime;

        //出发时间为空
        if (laGlobalLocalService.CheckStringIsEmpty($scope.queryFliInfo.DepartureTime)) {
            bootbox.alert('请选择出发时间');
            return;
        }
        if (!laGlobalLocalService.CheckDateFormat($scope.queryFliInfo.DepartureTime)) {
            bootbox.alert('请输入YYYY-MM-DD格式的日期');
            return;
        }

        $(".table-fli").hide();
        QueryTicket($scope.queryFliInfo);
    };

    $scope.btnCalendarPriceClick = function (d) {
        var tmp = new Date(d.replace(/-/g, "/"));
        tmp = $filter('date')(tmp, 'yyyy-MM-dd');
        $('#startTime').val(tmp);

        var sTime = $("#startTime").val();

        $scope.queryFliInfo.DepartureTime = sTime;

        $(".table-fli").hide();
        QueryTicket($scope.queryFliInfo);
    };

    /**
     * 退改签效果
     * @param Fidx
     */
    $scope.btnTgqMouseOver = function (Fidx) {
        var carbin = JSON.parse($("#" + Fidx).attr("data-tips"));
        var reRule = carbin.RefundRule.split('-');
        var chRule = carbin.ChangeRule.split('-');
        var reRuleJSON = {"b": {"p": "", "a": ""}, "a": {"p": "", "a": ""}};
        var chRuleJSON = {"b": {"p": "", "a": ""}, "a": {"p": "", "a": ""}};
        if (reRule.length >= 3) {
            if (laGlobalLocalService.IsNum(reRule[0])) {
                var am = Math.round((reRule[0] / carbin.SalePrice) * 100);
                reRuleJSON.b.p = (reRule[0] > 0) ? am.toString() + "%" : "";
                reRuleJSON.b.a = (reRule[0] > 0) ? "(" + reRule[0].toString() + "元)" : reRule[0].toString() + "元";
            } else {
                reRuleJSON.b.p = reRule[0];
            }
            if (laGlobalLocalService.IsNum(reRule[2])) {
                var am = Math.round((reRule[2] / carbin.SalePrice) * 100);
                reRuleJSON.a.p = (reRule[2] > 0) ? am.toString() + "%" : "";
                reRuleJSON.a.a = (reRule[2] > 0) ? "(" + reRule[2].toString() + "元)" : reRule[2].toString() + "元";
            } else {
                reRuleJSON.a.p = reRule[2];
            }
        }
        if (chRule.length >= 3) {
            if (laGlobalLocalService.IsNum(chRule[0])) {
                var am = Math.round((chRule[0] / carbin.SalePrice) * 100);
                chRuleJSON.b.p = (chRule[0] > 0) ? am.toString() + "%" : "";
                chRuleJSON.b.a = (chRule[0] > 0) ? "(" + chRule[0].toString() + "元)" : chRule[0].toString() + "元";
            } else {
                chRuleJSON.b.p = chRule[0];
            }
            if (laGlobalLocalService.IsNum(chRule[2])) {
                var am = Math.round((chRule[2] / carbin.SalePrice) * 100);
                chRuleJSON.a.p = (chRule[2] > 0) ? am.toString() + "%" : "";
                chRuleJSON.a.a = (chRule[2] > 0) ? "(" + chRule[2].toString() + "元)" : chRule[2].toString() + "元";
            } else {
                chRuleJSON.a.p = chRule[2];
            }
        }
        var box = $("<div class='roles table-fli'><br><span style='font-weight:bold'>票面价:</span>￥" +
            carbin.SalePrice + "&nbsp;&nbsp;<span style='font-weight:bold'>舱位:</span>" + carbin.CabinTypeName + "(" + carbin.CabinName + ")" +
            "<table style='width:100%;'><tr><td>类型</td><td>起飞前2小时前</td><td>起飞前2小时后</td></tr>" +
            "<tr><td style='background:#FFFFFF;text-align: right;'>退票手续费</td><td style='background:#FFFFFF;text-align: left;'>" + reRuleJSON.b.p + reRuleJSON.b.a + "</td><td style='background:#FFFFFF;text-align: left;'>" + reRuleJSON.a.p + reRuleJSON.a.a + "</td></tr>" +
            "<tr><td style='background:#FFFFFF;text-align: right;'>同舱改期收费</td><td style='background:#FFFFFF;text-align: left;'>" + chRuleJSON.b.p + chRuleJSON.b.a + "</td><td style='background:#FFFFFF;text-align: left;'>" + chRuleJSON.a.p + chRuleJSON.a.a + "</td></tr>" +
            "<tr><td style='background:#FFFFFF;text-align: right;'>说明</td><td style='background:#FFFFFF;text-align: left;' colspan='2'>签转条件:" + carbin.SignedTransferDisplay + "</td></tr>" +
            "</table></div>");

        $("#" + Fidx).css({"background-color": "#e17a00", "color": "white"});

        $("body").append(box);
        box.css({top: $("#" + Fidx).offset().top, left: $("#" + Fidx).offset().left});
    };
    /**
     * 退改签效果
     * @param idx
     */
    $scope.btnTgqMouseOut = function (Fidx) {
        $("#" + Fidx).css({"background-color": "white", "color": "black"});
        $(".roles").remove();
    };

    $scope.getMinAmountTG = function (Fidx, re, ch) {
        var result = "";
        var blRe = true;
        var blCh = true;
        var defMaxAmt = 100000;
        var minAmt = defMaxAmt;
        //var carbin = JSON.parse($("#" + Fidx).attr("data-tips"));
        var reRule = re.split('-');//carbin.RefundRule.split('-');
        var chRule = ch.split('-');//carbin.ChangeRule.split('-');
        if (reRule.length >= 3) {
            if (laGlobalLocalService.IsNum(reRule[0])) {
                if (reRule[0] < minAmt) {
                    minAmt = reRule[0];
                }
            }
            if (laGlobalLocalService.IsNum(reRule[2])) {
                if (reRule[2] < minAmt) {
                    minAmt = reRule[2];
                }
            }
        } else {
            blRe = false;
        }
        if (chRule.length >= 3) {
            if (laGlobalLocalService.IsNum(chRule[0])) {
                if (chRule[0] < minAmt) {
                    minAmt = chRule[0];
                }
            }
            if (laGlobalLocalService.IsNum(chRule[2])) {
                if (chRule[2] < minAmt) {
                    minAmt = chRule[2];
                }
            }
        } else {
            blCh = false;
        }

        if (blCh || blRe) {
            result = "退改¥" + minAmt + "元起";
        }
        if (minAmt >= defMaxAmt) {
            result = "";
        }

        return result;
    };

    $scope.chooseCabin = function (psgType, fliInfo, cabinInfo) {
        $scope.hasAllFliInfo = fliInfo;
        if (psgType == "0") {
            $scope.hasAllAdultCabin = cabinInfo;
        }
        if (psgType == "1") {
            $scope.hasAllChildCabin = cabinInfo;
        }
    };

    $scope.btnBookingOrderAllClick = function () {
        if ($scope.hasAllAdultCabin == undefined || $scope.hasAllAdultCabin == null) {
            bootbox.alert("请选择成人舱位");
            return;
        }
        if ($scope.hasAllChildCabin == undefined || $scope.hasAllChildCabin == null) {
            bootbox.alert("请选择儿童舱位");
            return;
        }
        var fliInfo = $scope.hasAllFliInfo;
        var tmpFli = {
            "OrderId": $scope.queryFliInfo.OrderId,
            "ChangePassenger": $scope.queryFliInfo.ChangePassenger,
            "AirportFrom": fliInfo.AirportFrom,
            "AirportFromCH": fliInfo.AirportFromCH,
            "AirportTax": fliInfo.AirportTax,
            "AirportTo": fliInfo.AirportTo,
            "AirportToCH": fliInfo.AirportToCH,
            "ArriveTime": fliInfo.ArriveTime,
            "ChildAirportTax": fliInfo.ChildAirportTax,
            "ChildFuelTax": fliInfo.ChildFuelTax,
            "ChildOtherTax": fliInfo.ChildOtherTax,
            "DepartureTime": fliInfo.DepartureTime,
            "Distance": fliInfo.Distance,
            "FlightNum": fliInfo.FlightNum,
            "FuelTax": fliInfo.FuelTax,
            "JiXing": fliInfo.JiXing,
            "JingTing": fliInfo.JingTing,
            "OtherTax": fliInfo.OtherTax,
            "AirportTaxDiff": fliInfo.AirportTaxDiff,
            "FuelTaxDiff": fliInfo.FuelTaxDiff,
            "ChildAirportTaxDiff": fliInfo.ChildAirportTaxDiff,
            "ChildFuelTaxDiff": fliInfo.ChildFuelTaxDiff,
            "hasAdultPsg": $scope.hasAdultPsg,
            "hasChildPsg": $scope.hasChildPsg
        };

        var tmpCabAdult = $scope.hasAllAdultCabin;
        tmpCabAdult.SignedTransferDisplay = null;
        var tmpCabChild = $scope.hasAllChildCabin;
        tmpCabChild.SignedTransferDisplay = null;

        var otherInfo = {
            "sCity": $scope.queryFliInfo.DepartureCityCH,
            "eCity": $scope.queryFliInfo.ArriveCityCH,
            "sCityCode": $scope.queryFliInfo.DepartureAirport,
            "eCityCode": $scope.queryFliInfo.ArriveAirport,
            "week": laGlobalLocalService.getWeekName(new Date(fliInfo.DepartureTime.replace(/-/g, "/")))
        };
        $scope.bookOrderInfo_g = {"f": tmpFli, "c": tmpCabAdult, "c1": tmpCabChild, "o": otherInfo};

        $scope.bookOrderInfo = {"g": $scope.bookOrderInfo_g};
        laUserService.GetCurrentUserInfo(function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success && rs.SessionOut == false) {
                $window.location.href = "/ETicket/TransBookingOrder.html?param=" + new Base64().encode(JSON.stringify($scope.bookOrderInfo));
            } else {
                $('.modal').modal('show');
            }
        });
    };

    /**
     * 订单预定按钮点击
     * @param fliInfo
     * @param cabinInfo
     */
    $scope.btnBookingOrderClick = function (fliInfo, cabinInfo) {
        var tmpFli = {
            "OrderId": $scope.queryFliInfo.OrderId,
            "ChangePassenger": $scope.queryFliInfo.ChangePassenger,
            "AirportFrom": fliInfo.AirportFrom,
            "AirportFromCH": fliInfo.AirportFromCH,
            "AirportTax": fliInfo.AirportTax,
            "AirportTo": fliInfo.AirportTo,
            "AirportToCH": fliInfo.AirportToCH,
            "ArriveTime": fliInfo.ArriveTime,
            "ChildAirportTax": fliInfo.ChildAirportTax,
            "ChildFuelTax": fliInfo.ChildFuelTax,
            "ChildOtherTax": fliInfo.ChildOtherTax,
            "DepartureTime": fliInfo.DepartureTime,
            "Distance": fliInfo.Distance,
            "FlightNum": fliInfo.FlightNum,
            "FuelTax": fliInfo.FuelTax,
            "JiXing": fliInfo.JiXing,
            "JingTing": fliInfo.JingTing,
            "OtherTax": fliInfo.OtherTax,
            "AirportTaxDiff": fliInfo.AirportTaxDiff,
            "FuelTaxDiff": fliInfo.FuelTaxDiff,
            "ChildAirportTaxDiff": fliInfo.ChildAirportTaxDiff,
            "ChildFuelTaxDiff": fliInfo.ChildFuelTaxDiff,
            "hasAdultPsg": $scope.hasAdultPsg,
            "hasChildPsg": $scope.hasChildPsg
        };

        var tmpCab = cabinInfo;
        tmpCab.SignedTransferDisplay = null;
        var otherInfo = {
            "sCity": $scope.queryFliInfo.DepartureCityCH,
            "eCity": $scope.queryFliInfo.ArriveCityCH,
            "sCityCode": $scope.queryFliInfo.DepartureAirport,
            "eCityCode": $scope.queryFliInfo.ArriveAirport,
            "week": laGlobalLocalService.getWeekName(new Date(fliInfo.DepartureTime.replace(/-/g, "/")))
        };
        $scope.bookOrderInfo_g = {"f": tmpFli, "c": tmpCab, "o": otherInfo};

        $scope.bookOrderInfo = {"g": $scope.bookOrderInfo_g};
        laUserService.GetCurrentUserInfo(function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success && rs.SessionOut == false) {
                $window.location.href = "/ETicket/TransBookingOrder.html?param=" + new Base64().encode(JSON.stringify($scope.bookOrderInfo));
            } else {
                $('.modal').modal('show');
            }
        });
    };

    /**
     * 会员登录预定点击
     */
    $scope.btnBookingByLoginUserClick = function () {

        if (!$scope.CheckBookingLoginData()) {
            return;
        }

        laUserService.Login($scope.loginUserId, $scope.loginPwd, '', function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.loginSuccess = true;
                $window.location.href = "/ETicket/TransBookingOrder.html?param=" + new Base64().encode(JSON.stringify($scope.bookOrderInfo));
            } else {
                $scope.loginSuccess = false;
            }
        });
    };

    /**
     * 登录预定-回车键触发
     */
    $scope.btnPressEnterToLoginBuy = function (e) {
        var keyCode = $window.event ? e.keyCode : e.which;
        if (keyCode == 13) {
            $scope.btnBookingByLoginUserClick();
        }
    };

    $scope.CheckBookingLoginData = function () {
        var result = true;
        $scope.validloginDataCheck = true;
        $scope.loginSuccess = true;
        if (laGlobalLocalService.CheckStringIsEmpty($scope.loginUserId)) {
            $scope.validloginDataCheck = false;
            result = false;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.loginPwd)) {
            $scope.validloginDataCheck = false;
            result = false;
        }
        return result;
    };

    /**
     * 低价机票点击
     * @param liId
     */
    $scope.btnLowPriceClick = function (idx) {
        $(".table-fli").hide();
        $scope.queryFliInfo.DepartureTime = $filter('date')($scope.lowPriceList[idx].d, 'yyyy-MM-dd');
        $("#startTime").attr("date", $scope.queryFliInfo.DepartureTime);
        QueryTicket($scope.queryFliInfo);
    };

    /**
     * 根据当前查询日期\最低价生成价格日期列表
     * @param sCityCode
     * @param eCityCode
     * @param qryDate
     * @returns {Array}
     */
    function GetFlightDaylist(sCityCode, eCityCode, qryDate) {
        var dayList = new Array();
        var prices = new Array();
        var nStep = 0;
        var nScrollStep = 9;
        var nScrollDayNum = 368; //最好能保证 nScrollDayNum+1 能被 nScrollStep 整除
        var nScrollDefIndex = 0;
        var nScrollFix = 0;

        var idate = qryDate.getFullYear() + "-" + laGlobalLocalService.PadString((qryDate.getMonth() + 1).toString(), 2) + "-" + laGlobalLocalService.PadString(qryDate.getDate().toString(), 2);
        var today = new Date();
        var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        var startDateStr = startDate.getFullYear() + "-" + laGlobalLocalService.PadString((startDate.getMonth() + 1).toString(), 2) + "-" + laGlobalLocalService.PadString(startDate.getDate().toString(), 2);

        var endDate = new Date();
        //var endDateStr = (startDate.getFullYear() + 1) + "-" + laGlobalLocalService.PadString((startDate.getMonth() + 1).toString(), 2) + "-" + laGlobalLocalService.PadString(startDate.getDate().toString(), 2);
        //endDate = new Date(endDateStr.replace(/-/g, "/"));
        endDate = new Date(startDateStr.replace(/-/g, "/"));
        endDate = new Date(endDate.setDate(endDate.getDate() + nScrollDayNum));

        if (!Array.indexOf) {
            Array.prototype.indexOf = function (obj) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] == obj) {
                        return i;
                    }
                }
                return -1;
            }
        }

        laFlightService.QueryPriceCalendar(sCityCode, eCityCode, function (dataBack, status) {
            var rs = dataBack;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {

                var tmpday = new Date(startDateStr.toString().replace(/-/g, "/"));
                tmpday = new Date(tmpday.setDate(tmpday.getDate() - 1));
                while (true) {
                    tmpday = new Date(tmpday.setDate(tmpday.getDate() + 1));
                    if (tmpday > endDate) {
                        break;
                    }

                    var tmpArr = {"d": "", "w": "", "p": "", "s": false};//new Array();
                    tmpArr.d = tmpday.getFullYear() + "-" + laGlobalLocalService.PadString((tmpday.getMonth() + 1).toString(), 2) + "-" + laGlobalLocalService.PadString(tmpday.getDate().toString(), 2);
                    tmpArr.w = laGlobalLocalService.getWeekName(tmpday);
                    tmpArr.p = '-';
                    tmpArr.s = false;
                    if (idate == tmpArr.d) {
                        tmpArr.s = true;
                        nScrollDefIndex = nStep + 1;
                        if ((nScrollDefIndex + nScrollStep) % nScrollStep == 0) {
                            nScrollFix = -parseInt(nScrollStep / 2);
                        } else {
                            nScrollFix = (parseInt(nScrollStep / 2) + 1) - (nScrollDefIndex + nScrollStep) % nScrollStep;
                        }

                        if (nScrollDefIndex % nScrollStep != 1) {
                            while (true) {
                                nScrollDefIndex--;
                                if (nScrollDefIndex % nScrollStep == 1) {
                                    break;
                                }
                            }
                        }
                    }

                    var priFliList = rs.LowPrices;
                    for (n = 0; n < priFliList.length; n++) {
                        if (priFliList[n].DepartureDay.length < 10) {
                            break;
                        }
                        var fDate = priFliList[n].DepartureDay.substr(0, 10).split("-");
                        if (fDate.length < 3) {
                            continue;
                        }
                        if (tmpArr.d == fDate[0] + "-" + laGlobalLocalService.PadString(fDate[1], 2) + "-" + laGlobalLocalService.PadString(fDate[2], 2)) {
                            tmpArr.p = priFliList[n].LowPrice;

                            var priced = new Date(priFliList[n].DepartureDay.toString().substr(0, 10).replace(/-/g, "/"));
                            var price = {
                                "p": priFliList[n].LowPrice,
                                "d": priced.getFullYear() + "-" + (priced.getMonth() + 1) + "-" + priced.getDate()
                            };
                            prices.push(price);

                            break;
                        }
                    }
                    tmpArr.d = new Date(tmpArr.d.replace(/-/g, "/"));
                    dayList[nStep] = tmpArr;

                    nStep++;
                }
                $filter('orderBy')(dayList, 'd');
                $scope.lowPriceList = dayList;

                //var prices = [{p:600,d:"2016-3-13"},{p:400,d:"2016-3-14"},{p:580,d:"2016-3-15"},{p:700,d:"2016-3-16"},{p:700,d:"2016-3-17"},{p:700,d:"2016-3-18"},{p:700,d:"2016-3-19"},{p:700,d:"2016-3-20"},{p:700,d:"2016-3-21"}];
                $(".a_calendar").attr("date", idate);
                $(".a_calendar").click(function (e) {
                    calendar.show({
                        id: this,
                        minDay: today.getFullYear() + "-" + parseInt(today.getMonth() + 1) + "-" + today.getDate(),
                        para: prices,
                        //mode: "double",
                        ok: function () {

                        }
                    });
                });

                var divInnerHTML = "<ul class=\"JQ-slide-content\">";
                var nlowPricelist = $scope.lowPriceList.length;
                for (var i = 0; i < nlowPricelist; i++) {

                    var obj = $scope.lowPriceList[i];
                    var liClass = (obj.s == true) ? "selected" : "";
                    var liHTML = "<li id='li_lowPrice" + i + "'" +
                        " onclick='javascript:_btnLowPriceClick(" + i + ");'" +
                        " class='" + liClass + "'> " +
                        "<a href=\"javascript:;\" data-date='" + obj.p + "'>" +
                        "<span>" + $filter('date')(obj.d, 'MM-dd') + "&nbsp;" + obj.w + "</span>" +
                        "<b class=\"f-rmb\">¥&nbsp;" + obj.p + "</b>" +
                        "</a>" +
                        "</li>";
                    divInnerHTML += liHTML;
                }
                divInnerHTML += "</ul>";
                document.getElementById("divCalendarPrice").innerHTML = divInnerHTML;

                $(".dates-picker").Slide({
                    autoPlay: false,
                    effect: "scroolX",
                    speed: "normal",
                    loop: false,
                    timer: 9000,
                    defIndex: nScrollDefIndex,
                    steps: nScrollStep,
                    scrollFix: nScrollFix
                });
            }
        });


    }

    /**
     * 查询机票
     * @constructor
     */
    function QueryTicket(queryFliInfo) {
        $(".noflights").hide();
        $(".airline").hide();
        $(".loading").show();
        $(".dates").hide();

        $scope.flightResult = null;

        laFlightService.QueryFlightForTrans(queryFliInfo.DepartureTime, queryFliInfo.OrderId, queryFliInfo.ChangePassenger, function (backData, status) {
            var rs = backData;
            /**
             {
    "Result": {
        "FlightInfos": [
            {
                "FlightNum": "GJ8887",
                "AirportFrom": "HGH",
                "AirportFromCH": "杭州萧山国际机场",
                "AirportTo": "PEK",
                "AirportToCH": "北京首都机场",
                "Distance": 0,
                "DepartureTime": "2016-08-03 19:05",
                "ArriveTime": "2016-08-03 21:25",
                "AirportTax": 50,
                "FuelTax": 0,
                "OtherTax": 0,
                "ChildAirportTax": 0,
                "ChildFuelTax": 0,
                "ChildOtherTax": 0,
                "JiXing": "320",
                "JingTing": false,
                "CabinInfos": [
                    {
                        "CabinName": "V",
                        "CabinType": 4,
                        "LeftCount": 11,
                        "Price": 930,
                        "SalePrice": 930,
                        "PriceBase": "V",
                        "RefundRule": "605-2-930",
                        "ChangeRule": "419-2-605",
                        "SignedTransfer": 2,
                        "SignedTransferDisplay": "不得签转",
                        "Discount": 0.5,
                        "EI": "",
                        "RMK": null
                    },
                    {
                        "CabinName": "G",
                        "CabinType": 4,
                        "LeftCount": 11,
                        "Price": 1020,
                        "SalePrice": 1020,
                        "PriceBase": "G",
                        "RefundRule": "357-2-459",
                        "ChangeRule": "255-2-357",
                        "SignedTransfer": 2,
                        "SignedTransferDisplay": "不得签转",
                        "Discount": 0.55,
                        "EI": "",
                        "RMK": null
                    },
                    {
                        "CabinName": "Q",
                        "CabinType": 4,
                        "LeftCount": 11,
                        "Price": 1120,
                        "SalePrice": 1120,
                        "PriceBase": "Q",
                        "RefundRule": "392-2-504",
                        "ChangeRule": "280-2-392",
                        "SignedTransfer": 2,
                        "SignedTransferDisplay": "不得签转",
                        "Discount": 0.6,
                        "EI": "",
                        "RMK": null
                    },
                    {
                        "CabinName": "P",
                        "CabinType": 4,
                        "LeftCount": 11,
                        "Price": 1210,
                        "SalePrice": 1210,
                        "PriceBase": "P",
                        "RefundRule": "424-2-545",
                        "ChangeRule": "303-2-424",
                        "SignedTransfer": 2,
                        "SignedTransferDisplay": "不得签转",
                        "Discount": 0.65,
                        "EI": "",
                        "RMK": null
                    },
                    {
                        "CabinName": "L",
                        "CabinType": 4,
                        "LeftCount": 11,
                        "Price": 1300,
                        "SalePrice": 1300,
                        "PriceBase": "L",
                        "RefundRule": "260-2-390",
                        "ChangeRule": "130-2-260",
                        "SignedTransfer": 2,
                        "SignedTransferDisplay": "不得签转",
                        "Discount": 0.7,
                        "EI": "",
                        "RMK": null
                    },
                    {
                        "CabinName": "K",
                        "CabinType": 4,
                        "LeftCount": 11,
                        "Price": 1400,
                        "SalePrice": 1400,
                        "PriceBase": "K",
                        "RefundRule": "280-2-420",
                        "ChangeRule": "140-2-280",
                        "SignedTransfer": 2,
                        "SignedTransferDisplay": "不得签转",
                        "Discount": 0.75,
                        "EI": "",
                        "RMK": null
                    },
                    {
                        "CabinName": "H",
                        "CabinType": 4,
                        "LeftCount": 11,
                        "Price": 1490,
                        "SalePrice": 1490,
                        "PriceBase": "",
                        "RefundRule": "298-2-447",
                        "ChangeRule": "149-2-298",
                        "SignedTransfer": 2,
                        "SignedTransferDisplay": "不得签转",
                        "Discount": 0.8,
                        "EI": "",
                        "RMK": null
                    },
                    {
                        "CabinName": "M",
                        "CabinType": 4,
                        "LeftCount": 11,
                        "Price": 1580,
                        "SalePrice": 1580,
                        "PriceBase": "M",
                        "RefundRule": "316-2-474",
                        "ChangeRule": "158-2-316",
                        "SignedTransfer": 2,
                        "SignedTransferDisplay": "不得签转",
                        "Discount": 0.85,
                        "EI": "",
                        "RMK": null
                    },
                    {
                        "CabinName": "B",
                        "CabinType": 4,
                        "LeftCount": 11,
                        "Price": 1670,
                        "SalePrice": 1670,
                        "PriceBase": "B",
                        "RefundRule": "334-2-501",
                        "ChangeRule": "167-2-334",
                        "SignedTransfer": 2,
                        "SignedTransferDisplay": "不得签转",
                        "Discount": 0.9,
                        "EI": "",
                        "RMK": null
                    },
                    {
                        "CabinName": "S",
                        "CabinType": 4,
                        "LeftCount": 11,
                        "Price": 1860,
                        "SalePrice": 1860,
                        "PriceBase": "YQJ",
                        "RefundRule": "186-2-372",
                        "ChangeRule": "93-2-186",
                        "SignedTransfer": 2,
                        "SignedTransferDisplay": "不得签转",
                        "Discount": 1,
                        "EI": "不得自愿签转",
                        "RMK": null
                    }
                ],
                "ChildCabinInfos": []
            }
        ]
    },
    "Code": "0000",
    "Message": "查询成功"
}
             */
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {

                $scope.timeDown = 1;
                timer = $interval(function () {
                    $scope.timeDown = $scope.timeDown - 1;
                    if ($scope.timeDown <= 0) {
                        $interval.cancel(timer);
                        $(".loading").hide();
                        $(".noflights").hide();
                        $(".airline").show();
                        $(".dates").show();

                        $scope.flightResult = new laEntityFlightList();
                        $scope.flightResult.Code = rs.Code;
                        $scope.flightResult.Message = rs.Message;
                        //$scope.flightResult.LowPriceFlights = rs.LowPriceFlights;
                        var n = rs.Result.FlightInfos.length;
                        for (var i = 0; i < n; i++) {
                            //if (rs.Result.FlightInfos[i].CabinInfos.length > 0) {
                            $scope.flightResult.FlightList[i] = rs.Result.FlightInfos[i];
                            //}
                        }

                        if ($scope.flightResult.FlightList.length <= 0) {
                            $(".noflights").show();
                            $(".airline").hide();
                        }
                    }
                }, 1000);
            } else {
                $scope.timeDown = 1;
                timer = $interval(function () {
                    $scope.timeDown = $scope.timeDown - 1;
                    if ($scope.timeDown <= 0) {
                        $interval.cancel(timer);

                        $(".loading").hide();
                        $(".noflights").show();
                        $(".airline").hide();
                        $(".dates").show();
                    }
                }, 1000);
            }

            GetFlightDaylist(queryFliInfo.DepartureAirport, queryFliInfo.ArriveAirport, new Date(queryFliInfo.DepartureTime.replace(/-/g, "/")));
        });
    }
}]);