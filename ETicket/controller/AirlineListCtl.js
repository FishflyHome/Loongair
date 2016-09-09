/**
 * Created by Jerry on 16/2/3.
 */

laAir.controller('laAir_ETicket_AirlineListPageCtl', ['$document', '$interval', '$filter', '$scope', '$window', 'laFlightService', 'laUserService', 'laGlobalLocalService', function ($document, $interval, $filter, $scope, $window, laFlightService, laUserService, laGlobalLocalService) {

    $scope.title = "机票预定";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isSchTripNav = true;

    //是否是往返程
    $scope.qu_mode = 0;
    //最终选定的航班信息
    $scope.bookOrderInfo;
    $scope.bookOrderInfo_g;
    $scope.bookOrderInfo_b;

    //航班查询结果
    $scope.flightResult;
    //航班低价列表
    $scope.lowPriceList;
    //是否是查询返程
    $scope.isQueryBTrip = false;

    $scope.validloginDataCheck = true;
    $scope.loginSuccess = true;

    $scope.city1name = "";
    $scope.city2name = "";

    $("#startCity").attr("segnum", "");
    $("#endCity").attr("segnum", "");

    var timer;

    $(".noflights").hide();
    $(".airline").hide();
    $(".dates").hide();
    $(".loading").hide();
    $(".table-fli").hide();

    laUserService.FillCityAirportInfo(new Array("startCity", "endCity"), function () {
        var sv = $("#startCity").val();
        if (sv == undefined || sv == '') {
            var defCity = {"s": {"c": "HGH", "n": "杭州"}, "e": {"c": "PEK", "n": "北京"}};
            $("#startCity").attr("segnum", defCity.s.c);
            $("#startCity").val(defCity.s.n);
            $("#endCity").attr("segnum", defCity.e.c);
            $("#endCity").val(defCity.e.n);
        }

        var st = $("#startTime").val();
        if (st == undefined || st == '') {
            var td = new Date();
            td = new Date(td.setDate(td.getDate() + 1));
            var tdmm = (parseInt(td.getMonth() + 1)).toString();
            tdmm = (tdmm.length < 2) ? '0' + tdmm : tdmm;
            var tdday = td.getDate().toString();
            tdday = (tdday.length < 2) ? '0' + tdday : tdday;
            $("#startTime").val(td.getFullYear() + '-' + tdmm + '-' + tdday);
            $("#startTime").attr("date", td.getFullYear() + '-' + tdmm + '-' + tdday);
        } else {
            $("#startTime").attr("date", st);
        }
    });

    //去程预定查询信息
    $scope.queryFliInfo = new laEntityFlight();
    //返程预定查询信息
    $scope.queryFliInfoBack = new laEntityFlight();

    var cookieQueryFli = laGlobalLocalService.getCookie(laGlobalProperty.laServiceConst_TransData_QueryTicket);
    if (cookieQueryFli != undefined) {
        $scope.queryFliInfo = JSON.parse(cookieQueryFli);

        $("#startCity").attr("segnum", $scope.queryFliInfo.AirportFrom);
        $("#endCity").attr("segnum", $scope.queryFliInfo.AirportTo);
        $scope.city1name = $scope.queryFliInfo.AirportFromCH;
        $scope.city2name = $scope.queryFliInfo.AirportToCH;

        var isRoundTrip = $scope.queryFliInfo.RoundTrip;
        if (isRoundTrip) {
            $("#endTime").removeAttr("readonly");
        }

        $scope.qu_mode = (isRoundTrip == true) ? 1 : 0;

        QueryTicket($scope.queryFliInfo);
    }
    chooseRoundTrip($scope.qu_mode);

    /**
     * 单程往返选择点击事件
     * @param v
     */
    $scope.btnChooseRoundTripClick = function (v) {
        chooseRoundTrip(v);

    };
    /**
     * 搜索机票按钮点击事件
     */
    $scope.btnQueryTicketClick = function () {
        var sCity = $("#startCity").val();
        var eCity = $("#endCity").val();
        //var sCityCode = $("#startCity").attr("segnum");
        //var eCityCode = $("#endCity").attr("segnum");
        var sCityCode = laUserService.SearchCityCodeByCityName(sCity);//$("#startCity1").attr("segnum");
        var eCityCode = laUserService.SearchCityCodeByCityName(eCity);//$("#endCity1").attr("segnum");
        var sTime = $("#startTime").val();
        var eTime = $("#endTime").val();

        $scope.queryFliInfo.AirportFromCH = sCity;
        $scope.queryFliInfo.AirportToCH = eCity;
        $scope.queryFliInfo.AirportFrom = sCityCode;
        $scope.queryFliInfo.AirportTo = eCityCode;
        $scope.queryFliInfo.DepartureTime = sTime;
        $scope.queryFliInfo.RoundTripTime = eTime;

        //出发城市为空
        if (laGlobalLocalService.CheckStringIsEmpty($scope.queryFliInfo.AirportFromCH)) {
            bootbox.alert('请选择出发城市');
            return;
        }
        //到达城市为空
        if (laGlobalLocalService.CheckStringIsEmpty($scope.queryFliInfo.AirportToCH)) {
            bootbox.alert('请选择到达城市');
            return;
        }

        //出发城市无效
        if (Vcity.allCityNamelist.indexOf('|' + $scope.queryFliInfo.AirportFromCH + '|') < 0) {
            bootbox.alert('无效的出发城市');
            return;
        }
        //到达城市无效
        if (Vcity.allCityNamelist.indexOf('|' + $scope.queryFliInfo.AirportToCH + '|') < 0) {
            bootbox.alert('无效的到达城市');
            return;
        }
        if ($scope.queryFliInfo.AirportFrom == $scope.queryFliInfo.AirportTo) {
            bootbox.alert('出发和到达城市不能相同');
            return;
        }

        //出发时间为空
        if (laGlobalLocalService.CheckStringIsEmpty($scope.queryFliInfo.DepartureTime)) {
            bootbox.alert('请选择出发时间');
            return;
        }
        if (!laGlobalLocalService.CheckDateFormat($scope.queryFliInfo.DepartureTime)) {
            bootbox.alert('请输入YYYY-MM-DD格式的日期');
            return;
        }
        //返程时间为空
        if ($scope.qu_mode == 1) {
            if (laGlobalLocalService.CheckStringIsEmpty($scope.queryFliInfo.RoundTripTime)) {
                bootbox.alert('请选择返程时间');
                return;
            }
            if (!laGlobalLocalService.CheckDateFormat($scope.queryFliInfo.RoundTripTime)) {
                bootbox.alert('请输入YYYY-MM-DD格式的日期');
                return;
            }
            if ($scope.queryFliInfo.RoundTripTime < $scope.queryFliInfo.DepartureTime) {
                bootbox.alert('返程时间不能在去程时间之前');
                return;
            }
        }

        $scope.city1name = sCity;
        $scope.city2name = eCity;

        $(".table-fli").hide();
        $scope.isQueryBTrip = false;
        QueryTicket($scope.queryFliInfo);
    };

    $scope.btnCalendarPriceClick = function (d) {
        var tmp = new Date(d.replace(/-/g, "/"));
        tmp = $filter('date')(tmp, 'yyyy-MM-dd');
        $('#startTime').val(tmp);

        var sCity = $("#startCity").val();
        var eCity = $("#endCity").val();
        var sCityCode = $("#startCity").attr("segnum");
        var eCityCode = $("#endCity").attr("segnum");
        var sTime = $("#startTime").val();
        var eTime = $("#endTime").val();

        $scope.queryFliInfo.AirportFromCH = sCity;
        $scope.queryFliInfo.AirportToCH = eCity;
        $scope.queryFliInfo.AirportFrom = sCityCode;
        $scope.queryFliInfo.AirportTo = eCityCode;
        $scope.queryFliInfo.DepartureTime = sTime;
        $scope.queryFliInfo.RoundTripTime = eTime;

        $(".table-fli").hide();
        $scope.isQueryBTrip = false;
        QueryTicket($scope.queryFliInfo);
    };

    /**
     * 根据出发/到达城市文本查找城市代码
     * @param inputId
     * @param v
     */
    $scope.searchCityCodeByVal = function (inputId) {
        var cityName = $("#" + inputId).val();
        if (cityName != null && cityName.length >= 2) {
            var n = Vcity.allCity.length;
            for (var i = 0; i < n; i++) {
                var item = Vcity.allCity[i].split("|");
                if (item[0] == cityName) {
                    $("#" + inputId).attr("segnum", item[3]);
                    break;
                }
            }
        }
    };

    /**
     * 航班列表展开/隐藏
     * @param idx
     */
    $scope.btnShowMoreClick = function (idx) {
        if ($("#prices" + idx).height() != 80) {
            $("#prices" + idx).animate({height: "80px"});
            $("#showmore" + idx).html("<b>+</b>展开");
        } else {
            $("#prices" + idx).css({height: "auto"});
            $("#showmore" + idx).html("<b>-</b>收起")
        }
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

        $("#" + Fidx).css({"background-color":"#e17a00","color":"white"});

        $("body").append(box);
        box.css({top: $("#" + Fidx).offset().top, left: $("#" + Fidx).offset().left});
    };
    /**
     * 退改签效果
     * @param idx
     */
    $scope.btnTgqMouseOut = function (Fidx) {
        $("#" + Fidx).css({"background-color":"white","color":"black"});
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
                if (reRule[0] < minAmt){
                    minAmt = reRule[0];
                }
            }
            if (laGlobalLocalService.IsNum(reRule[2])) {
                if (reRule[2] < minAmt){
                    minAmt = reRule[2];
                }
            }
        } else{
            blRe = false;
        }
        if (chRule.length >= 3) {
            if (laGlobalLocalService.IsNum(chRule[0])) {
                if (chRule[0] < minAmt){
                    minAmt = chRule[0];
                }
            }
            if (laGlobalLocalService.IsNum(chRule[2])) {
                if (chRule[2] < minAmt){
                    minAmt = chRule[2];
                }
            }
        } else{
            blCh = false;
        }

        if (blCh || blRe) {
            result = "退改¥" + minAmt + "元起";
        }
        if (minAmt >= defMaxAmt){
            result = "";
        }

        return result;
    };

    /**
     * 订单预定按钮点击
     * @param fliInfo
     * @param cabinInfo
     */
    $scope.btnBookingOrderClick = function (fliInfo, cabinInfo) {
        var tmpFli = {
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
            "OtherTax": fliInfo.OtherTax
        };
        //tmpFli.CabinInfoList = null;
        var tmpCab = cabinInfo;
        tmpCab.SignedTransferDisplay = null;
        var otherInfo;
        if ($scope.qu_mode == 0) {
            otherInfo = {
                "sCity": $("#startCity").val(),
                "eCity": $("#endCity").val(),
                "sCityCode": $("#startCity").attr("segnum"),
                "eCityCode": $("#endCity").attr("segnum"),
                "week": laGlobalLocalService.getWeekName(fliInfo.DepartureTime)
            };
            $scope.bookOrderInfo_g = {"f": tmpFli, "c": tmpCab, "o": otherInfo};
            $scope.bookOrderInfo_b = {};
        } else if ($scope.qu_mode == 1) {
            otherInfo = {
                "sCity": $("#endCity").val(),
                "eCity": $("#startCity").val(),
                "sCityCode": $("#endCity").attr("segnum"),
                "eCityCode": $("#startCity").attr("segnum"),
                "week": laGlobalLocalService.getWeekName(fliInfo.DepartureTime)
            };
            $scope.bookOrderInfo_b = {"f": tmpFli, "c": tmpCab, "o": otherInfo};
        }
        $scope.bookOrderInfo = {"g": $scope.bookOrderInfo_g, "b": $scope.bookOrderInfo_b, "roundtrip": $scope.qu_mode};
        laUserService.GetCurrentUserInfo(function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success && rs.SessionOut == false) {
                laGlobalLocalService.writeCookie(laGlobalProperty.laServiceConst_TransData_BookOrder, JSON.stringify($scope.bookOrderInfo), 0);
                $window.location.href = 'BookingOrder.html';
            } else {
                $('.modal').modal('show');
            }
        });
    };

    /**
     * 航班选定按钮点击
     * @param fliInfo
     * @param cabinInfo
     */
    $scope.btnChooseFlightClick = function (fliInfo, cabinInfo) {
        var tmpFli = {
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
            "OtherTax": fliInfo.OtherTax
        };
        //tmpFli.CabinInfoList = null;
        var tmpCab = cabinInfo;
        tmpCab.SignedTransferDisplay = null;
        var otherInfo = {
            "sCity": $("#startCity").val(),
            "eCity": $("#endCity").val(),
            "sCityCode": $("#startCity").attr("segnum"),
            "eCityCode": $("#endCity").attr("segnum"),
            "week": laGlobalLocalService.getWeekName(fliInfo.DepartureTime)
        };
        $scope.bookOrderInfo_g = {"f": tmpFli, "c": tmpCab, "o": otherInfo};
        $(".table-fli").show();

        //查询返程
        fillFlightBackQueryInfo();
        $scope.isQueryBTrip = true;
        QueryTicket($scope.queryFliInfoBack);
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
                laGlobalLocalService.writeCookie(laGlobalProperty.laServiceConst_TransData_BookOrder, JSON.stringify($scope.bookOrderInfo), 0);
                $window.location.href = 'BookingOrder.html';
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
        if ($scope.isQueryBTrip) { //如果是查询返程
            fillFlightBackQueryInfo();
            $scope.queryFliInfoBack.DepartureTime = $filter('date')($scope.lowPriceList[idx].d, 'yyyy-MM-dd');
            QueryTicket($scope.queryFliInfoBack);
        } else {
            $(".table-fli").hide();
            $scope.queryFliInfo.DepartureTime = $filter('date')($scope.lowPriceList[idx].d, 'yyyy-MM-dd');
            $("#startTime").attr("date", $scope.queryFliInfo.DepartureTime);
            QueryTicket($scope.queryFliInfo);
        }
    };

    /**
     * 设置返程查询信息
     */
    function fillFlightBackQueryInfo() {
        var sCity = $("#startCity").val();
        var eCity = $("#endCity").val();
        var sCityCode = $("#startCity").attr("segnum");
        var eCityCode = $("#endCity").attr("segnum");
        var sTime = $("#startTime").val();
        var eTime = $("#endTime").val();

        $scope.queryFliInfoBack.AirportFromCH = eCity;
        $scope.queryFliInfoBack.AirportToCH = sCity;
        $scope.queryFliInfoBack.AirportFrom = eCityCode;
        $scope.queryFliInfoBack.AirportTo = sCityCode;
        $scope.queryFliInfoBack.DepartureTime = eTime;
        $scope.queryFliInfoBack.RoundTripTime = sTime;
    }

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
                $(".a_calendar").click(function (e){
                    calendar.show({
                        id: this,
                        minDay: today.getFullYear() + "-" + parseInt(today.getMonth() + 1) + "-" + today.getDate(),
                        para: prices,
                        //mode: "double",
                        ok: function (){

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

        laFlightService.QueryFlight(queryFliInfo, function (backData, status) {
            var rs = backData;
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

                        //$scope.flightResult = rs;
                        $scope.flightResult = new laEntityFlightList();
                        $scope.flightResult.Code = rs.Code;
                        $scope.flightResult.Message = rs.Message;
                        $scope.flightResult.LowPriceFlights = rs.LowPriceFlights;
                        var n = rs.FlightList.length;
                        var cabinNum = 0;
                        for (var i = 0; i < n; i++) {
                            if (rs.FlightList[i].CabinInfoList.length > 0) {
                                $scope.flightResult.FlightList[cabinNum] = rs.FlightList[i];
                                cabinNum++;
                            }
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
            GetFlightDaylist(queryFliInfo.AirportFrom, queryFliInfo.AirportTo, new Date(queryFliInfo.DepartureTime.replace(/-/g, "/")));
        });
    }

    /**
     * 单程往返选择
     * @param v
     */
    function chooseRoundTrip(v) {
        $scope.qu_mode = v;
        if (v == 0) {
            $("#lblsrode").addClass("active");
            $("#lbldrode").removeClass("active");
            $("#endTime").val("").attr("readonly", true);
        } else if (v == 1) {
            $("#lbldrode").addClass("active");
            $("#lblsrode").removeClass("active");
            $("#endTime").removeAttr("readonly");
        }
    }
}]);