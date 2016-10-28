/**
 * Created by Jerry on 16/2/1.
 */

laAir.controller('laAir_HomePageCtl', ['$filter', '$document', '$scope', '$window', 'laUserService', 'laFlightService', 'laGlobalLocalService', function ($filter, $document, $scope, $window, laUserService, laFlightService, laGlobalLocalService) {

    $scope.title = "长龙航空官网";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

    $scope.SpecialTic;
    $scope.SpecialTiclist = new Array();

    $scope.AirplaneMenuList = laMapMenu_Airplane;
    $scope.CheckinTypeOptions = laEntityEnumfoIdTypeForCheckinOptions;
    $scope.QueryCheckinInfo = {"FoidType": 100, "Foid": "", "PassengerName": ""};
    //航班动态查询类型
    $scope.flidymFlag = 1;

    //新闻列表
    $scope.NewsList;
    //查询新闻
    laUserService.QueryNewList(function (dataBack, status) {
        $scope.NewsList = dataBack.newsList;
    }, {"PageIndex": 1, "PageSize": 5, "StartTime": "2016-01-01", "EndTime": "2100-12-31"});

    //大图列表
    $scope.IndexImageList;
    laUserService.QueryIndexImageList(function (dataBack, status) {
        $scope.IndexImageList = dataBack;
    });

    laUserService.FillCityAirportInfo(new Array("startCity", "endCity", "startCity1", "endCity1"), function () {
        var defCity = {"s": {"c": "HGH", "n": "杭州"}, "e": {"c": "PEK", "n": "北京"}};
        $("#startCity").attr("segnum", defCity.s.c);
        $("#startCity").val(defCity.s.n);
        $("#endCity").attr("segnum", defCity.e.c);
        $("#endCity").val(defCity.e.n);

        $("#startCity1").attr("segnum", defCity.s.c);
        $("#startCity1").val(defCity.s.n);
        $("#endCity1").attr("segnum", defCity.e.c);
        $("#endCity1").val(defCity.e.n);

        var td = new Date();
        td = new Date(td.setDate(td.getDate() + 1));
        var tdmm = (parseInt(td.getMonth() + 1)).toString();
        var tdday = td.getDate().toString();

        tdmm = (tdmm.length < 2) ? '0' + tdmm : tdmm;
        tdday = (tdday.length < 2) ? '0' + tdday : tdday;
        $("#startTime").val(td.getFullYear() + '-' + tdmm + '-' + tdday);
        $("#startTime2").val(td.getFullYear() + '-' + tdmm + '-' + tdday);
        $("#startTime3").val(td.getFullYear() + '-' + tdmm + '-' + tdday);
        $("#startTime").attr("date", td.getFullYear() + '-' + tdmm + '-' + tdday);
        $("#startTime2").attr("date", td.getFullYear() + '-' + tdmm + '-' + tdday);
        $("#startTime3").attr("date", td.getFullYear() + '-' + tdmm + '-' + tdday);
    });

    $("#startCity").attr("segnum", "");
    $("#endCity").attr("segnum", "");

    QuerySpecialTicket({"airportFromCode": "", "airportToCode": ""});

    $scope.btnQuerySpecialTicket = function () {
        var sCity = $("#startcity2").val();
        var sCityCode = laUserService.SearchCityCodeByCityName(sCity);

        QuerySpecialTicket({"airportFromCode": sCityCode, "airportToCode": ""});
    };

     var key_cookie_indexTip = "cookie_indexTip_galaxy";
     var cookieIndexTip = laGlobalLocalService.getCookie(key_cookie_indexTip);
     if (cookieIndexTip == undefined || cookieIndexTip == null || cookieIndexTip != "1") {
        $('.modal').modal('show');
    }

     $scope.btnCloseTipClick = function () {
        laGlobalLocalService.writeCookie(key_cookie_indexTip, "all", 0);
        $('.modal').modal('hide');
    };

    /**
     * 搜索机票按钮点击事件
     */
    $scope.btnQueryTicketClick = function () {
        var sCity = $("#startCity").val();
        var eCity = $("#endCity").val();
        var sCityCode = laUserService.SearchCityCodeByCityName(sCity);//$("#startCity").attr("segnum");
        var eCityCode = laUserService.SearchCityCodeByCityName(eCity);//$("#endCity").attr("segnum");
        var sTime = $("#startTime").val();
        var eTime = $("#endTime").val();

        $scope.qu_startCity = sCity;
        $scope.qu_endCity = eCity;
        $scope.qu_startCityCode = sCityCode;
        $scope.qu_endCityCode = eCityCode;
        $scope.qu_startTime = sTime;
        $scope.qu_endTime = eTime;

        //出发城市为空
        if (laGlobalLocalService.CheckStringIsEmpty($scope.qu_startCity)) {
            bootbox.alert('请选择出发城市');
            return;
        }
        //到达城市为空
        if (laGlobalLocalService.CheckStringIsEmpty($scope.qu_endCity)) {
            bootbox.alert('请选择到达城市');
            return;
        }

        //出发城市无效
        if (Vcity.allCityNamelist.indexOf('|' + $scope.qu_startCity + '|') < 0) {
            bootbox.alert('无效的出发城市');
            return;
        }
        //到达城市无效
        if (Vcity.allCityNamelist.indexOf('|' + $scope.qu_endCity + '|') < 0) {
            bootbox.alert('无效的到达城市');
            return;
        }
        if ($scope.qu_startCityCode == $scope.qu_endCityCode) {
            bootbox.alert('出发和到达城市不能相同');
            return;
        }

        //出发时间为空
        if (laGlobalLocalService.CheckStringIsEmpty($scope.qu_startTime)) {
            bootbox.alert('请选择出发时间');
            return;
        }
        if (!laGlobalLocalService.CheckDateFormat($scope.qu_startTime)) {
            bootbox.alert('请输入YYYY-MM-DD格式的日期');
            return;
        }
        //返程时间为空
        if ($scope.qu_mode == 1) {
            if (laGlobalLocalService.CheckStringIsEmpty($scope.qu_endTime)) {
                bootbox.alert('请选择返程时间');
                return;
            }
            if (!laGlobalLocalService.CheckDateFormat($scope.qu_endTime)) {
                bootbox.alert('请输入YYYY-MM-DD格式的日期');
                return;
            }
            if ($scope.qu_endTime < $scope.qu_startTime) {
                bootbox.alert('返程时间不能在去程时间之前');
                return;
            }
        }

        var fli = new laEntityFlight();
        fli.AirportFrom = $scope.qu_startCityCode;
        fli.AirportTo = $scope.qu_endCityCode;
        fli.AirportFromCH = $scope.qu_startCity;
        fli.AirportToCH = $scope.qu_endCity;
        fli.DepartureTime = $scope.qu_startTime;
        fli.RoundTripTime = $scope.qu_endTime;
        fli.RoundTrip = ($scope.qu_mode == 1) ? true : false;

        laGlobalLocalService.writeCookie(laGlobalProperty.laServiceConst_TransData_QueryTicket, JSON.stringify(fli), 0);
        $window.location.href = '/ETicket/AirlineList.html';
    };

    $scope.btnOnlineCheckInClick = function () {
        if (laGlobalLocalService.CheckStringIsEmpty($scope.QueryCheckinInfo.Foid)) {
            bootbox.alert('请输入查询号码');
            return;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.QueryCheckinInfo.PassengerName)) {
            bootbox.alert('请输入乘客姓名');
            return;
        }

        laUserService.QueryPassengerTravel($scope.QueryCheckinInfo.FoidType, $scope.QueryCheckinInfo.Foid, $scope.QueryCheckinInfo.PassengerName,
            function (backData, status) {
                if (backData.Code != laGlobalProperty.laServiceCode_Success) {
                    bootbox.alert(backData.Message);
                    return;
                } else {
                    $window.location.href = "/Member/CheckinList.html?param=" + new Base64().encode(JSON.stringify($scope.QueryCheckinInfo));
                }
            });
    };

    /*
     特价机票查询
     */
    $scope.btnSpeciTicketQuery = function (tic) {
        var fli = new laEntityFlight();
        fli.AirportFrom = tic.DepartureAirportCode;
        fli.AirportTo = tic.ArriveAirportCode;
        fli.AirportFromCH = tic.DepartureAirportCH;
        fli.AirportToCH = tic.ArriveAirportCH;
        fli.DepartureTime = $filter('date')(tic.FlightDate, 'yyyy-MM-dd');
        fli.RoundTripTime = "";
        fli.RoundTrip = false;

        laGlobalLocalService.writeCookie(laGlobalProperty.laServiceConst_TransData_QueryTicket, JSON.stringify(fli), 0);
        $window.location.href = '/ETicket/AirlineList.html';
    };

    /**
     * 航班动态
     */
    $scope.btnQueryFlightDynamic = function (qryFlag) {
        var sCity1 = $("#startCity1").val();
        var eCity1 = $("#endCity1").val();
        var sCityCode1 = laUserService.SearchCityCodeByCityName(sCity1);//$("#startCity1").attr("segnum");
        var eCityCode1 = laUserService.SearchCityCodeByCityName(eCity1);//$("#endCity1").attr("segnum");
        var sTime3 = $("#startTime3").val();

        var flightNum = $("#flightNum").val();
        var sTime2 = $("#startTime2").val();

        var sTime = "";

        $scope.flidymFlag = qryFlag;

        if ($scope.flidymFlag == 0) {  //如果按航班号
            if (laGlobalLocalService.CheckStringIsEmpty(flightNum)) {
                bootbox.alert('请输入航班号');
                return;
            }
            if (laGlobalLocalService.CheckStringIsEmpty(sTime2)) {
                bootbox.alert('请选择出发时间');
                return;
            }
            if (!laGlobalLocalService.CheckDateFormat(sTime2)) {
                bootbox.alert('请输入YYYY-MM-DD格式的日期');
                return;
            }
            sTime = sTime2;
        } else if ($scope.flidymFlag == 1) {  //按城市查询
            //出发城市为空
            if (laGlobalLocalService.CheckStringIsEmpty(sCity1)) {
                bootbox.alert('请选择出发城市');
                return;
            }
            //到达城市为空
            if (laGlobalLocalService.CheckStringIsEmpty(eCity1)) {
                bootbox.alert('请选择到达城市');
                return;
            }

            //出发城市无效
            if (Vcity.allCityNamelist.indexOf('|' + sCity1 + '|') < 0) {
                bootbox.alert('无效的出发城市');
                return;
            }
            //到达城市无效
            if (Vcity.allCityNamelist.indexOf('|' + eCity1 + '|') < 0) {
                bootbox.alert('无效的到达城市');
                return;
            }
            if (sCity1 == eCity1) {
                bootbox.alert('出发和到达城市不能相同');
                return;
            }

            //出发时间为空
            if (laGlobalLocalService.CheckStringIsEmpty(sTime3)) {
                bootbox.alert('请选择出发时间');
                return;
            }
            if (!laGlobalLocalService.CheckDateFormat(sTime3)) {
                bootbox.alert('请输入YYYY-MM-DD格式的日期');
                return;
            }
            sTime = sTime3;
        }

        var param = {"C1": sCityCode1, "C2": eCityCode1, "T": sTime, "F": flightNum, "Q": $scope.flidymFlag.toString()};
        $window.location.href = '/ETicket/FlightDynamic.html?param=' + new Base64().encode(JSON.stringify(param));
        //$window.location.href = '/ETicket/FlightDynamic.html?c1=' + param.C1 + '&c2=' + param.C2 + '&t=' + param.T + '&f=' + param.F + '&q=' + param.Q;
    };

    $scope.btnSpeciCityChange = function (c) {
        $("#li_city_" + c).addClass("active");
        $("#li_city_" + c).siblings().removeClass("active");
        $("#city_" + c).addClass("active").siblings().removeClass("active");
    };

    ////查询特价机票
    function QuerySpecialTicket(query) {
        laFlightService.QuerySpecialTicket(query.airportFromCode, query.airportToCode, function (dataBack, status) {
            var rs = dataBack;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.SpecialTic = rs;

                $scope.SpecialTiclist = new Array();
                var nSize = 12;
                var allSize = $scope.SpecialTic.AirLineList.length;
                var nPageCount = Math.ceil(allSize / nSize);
                for (var i = 0; i < nPageCount; i++) {
                    var tmpArr = new Array();
                    for (var n = 0; n < nSize; n++) {
                        if (((i * nSize) + n) < allSize) {
                            tmpArr[n] = $scope.SpecialTic.AirLineList[(i * nSize) + n];
                        } else {
                            tmpArr[n] = null
                        }
                    }
                    $scope.SpecialTiclist.push(tmpArr);
                }
            }
        });
    }
}]);