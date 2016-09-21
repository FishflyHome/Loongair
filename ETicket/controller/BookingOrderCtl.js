/**
 * Created by Jerry on 16/2/4.
 */

laAir.controller('laAir_ETicket_BookingOrderPageCtl', ['$document', '$interval', '$filter', '$window', '$scope', 'laUserService', 'laOrderService', 'laGlobalLocalService', function ($document, $interval, $filter, $window, $scope, laUserService, laOrderService, laGlobalLocalService) {

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
    $scope.AccInsurMaxCnt = new Array();
    $scope.DelayInsurMaxCnt = new Array();
    $scope.ExpressListOpt = new Array();

    //快递渠道列表
    $scope.expressList = null;
    //机票和舱位信息供预定
    $scope.bookOrderInfo;
    $scope.flightInfo;
    $scope.cabinInfo;
    $scope.otherInfo;
    $scope.flightInfoback;
    $scope.cabinInfoback;
    $scope.otherInfoback;
    //是否有返程
    $scope.isRoundtrip = 0;

    //当前用户
    $scope.UserInfo;

    $scope.verifyCode = "";
    $scope.ImgVerifyCode

    //订单提交状态
    $scope.CommitOrder = false;
    $scope.CommitOrderStatus = true;
    $scope.CommitOrderStatusDesc = '';

    //常用乘机人列表
    $scope.stationPassengerList;

    $scope.acceptClause = true;

    //行程单信息
    $scope.ItineraryType = "0";
    $scope.Itinerary = new laEntityReserveItinerary();

    var timer;

    //获取页面传值
    var bookOrderInfo = laGlobalLocalService.getCookie(laGlobalProperty.laServiceConst_TransData_BookOrder);
    if (bookOrderInfo != undefined) {
        $scope.bookOrderInfo = JSON.parse(bookOrderInfo);
        $scope.flightInfo = $scope.bookOrderInfo.g.f;
        $scope.cabinInfo = $scope.bookOrderInfo.g.c;
        $scope.otherInfo = $scope.bookOrderInfo.g.o;
        $scope.isRoundtrip = $scope.bookOrderInfo.roundtrip;
        $("#divfliinfo").css({"display": "block"});
        if ($scope.isRoundtrip == 1) {
            $scope.flightInfoback = $scope.bookOrderInfo.b.f;
            $scope.cabinInfoback = $scope.bookOrderInfo.b.c;
            $scope.otherInfoback = $scope.bookOrderInfo.b.o;
            $("#divfliinfoback").css({"display": "block"});
        }

        if ($scope.cabinInfo.AccidentInsuranceCanBuyCount > 0) {
            $scope.AccInsurMaxCnt[0] = {"v": 0, "t": "不需要"};
            for (var i = 1; i <= $scope.cabinInfo.AccidentInsuranceCanBuyCount; i++) {
                var acc = {"v": i, "t": i + "份"};
                $scope.AccInsurMaxCnt[i] = acc;
            }
        }
        if ($scope.cabinInfo.DelayInsuranceCanBuyCount > 0) {
            $scope.DelayInsurMaxCnt[0] = {"v": 0, "t": "不需要"};
            for (var i = 1; i <= $scope.cabinInfo.DelayInsuranceCanBuyCount; i++) {
                var del = {"v": i, "t": i + "份"};
                $scope.AccInsurMaxCnt[i] = del;
            }
        }
    }

    GetImageVerifyCode();

    //乘机人列表
    $scope.passengerList = new Array();
    $scope.passengerList[0] = initReservePassenger();

    /**
     * 获取常用乘机人信息
     */
    QueryStationPassengerList();

    QueryCurrentUserInfo();

    QueryExpressList();

    $("#divamountall").css("display", "block");
    $("#divamountdetail").css("display", "block");

    $scope.FilterAccidentInsurancePsg = function (psgList) {
        return psgList.InsuranceInfo.AccidentInsuranceCount > 0;
    };
    $scope.FilterDelayInsurancePsg = function (psgList) {
        return psgList.InsuranceInfo.DelayInsuranceCount > 0;
    };
    $scope.getAccidentInsuranceCnt = function (psgList) {
        var result = 0;
        for (var i = 0; i < psgList.length; i++) {
            result += parseInt(psgList[i].InsuranceInfo.AccidentInsuranceCount);
        }
        return result;
    };
    $scope.getDelayInsuranceCnt = function (psgList) {
        var result = 0;
        for (var i = 0; i < psgList.length; i++) {
            result += parseInt(psgList[i].InsuranceInfo.DelayInsuranceCount);
        }
        return result;
    };

    /**
     * 常用乘机人点击
     */
    $scope.btnStdPassengerClick = function (idx, psg) {
        if ($("#" + idx).hasClass("active")) {
            $("#" + idx).removeClass("active");
            $("#" + idx).css({"color": "black", "background-color": "white"});
            removePassengerByStation(psg);
        } else {
            $("#" + idx).addClass("active");
            $("#" + idx).css({"color": "white", "background-color": "#F99569"});
            addPassengerByStation(psg);
        }
    };
    /**
     * 添加乘机人按钮点击
     */
    $scope.btnAddPassengerClick = function () {
        //$scope.passengerList.splice(-1, 0, initReservePassenger());
        $scope.passengerList[$scope.passengerList.length] = initReservePassenger();
    };

    /**
     * 删除乘机人按钮点击
     * @param idx
     */
    $scope.btnRemovePassengerClick = function (idx) {
        var psg = $scope.passengerList[idx];
        var n = $scope.stationPassengerList.length;
        for (var i = 0; i < n; i++) {
            var stdPsg = $scope.stationPassengerList[i];
            if (psg.PassengerName == stdPsg.FlierName && psg.Foid == stdPsg.Foid) {
                $("#stdPsg_" + i).removeClass("active");
                $("#stdPsg_" + i).css({"color": "black", "background-color": "white"});
                break;
            }
        }

        $scope.passengerList.splice(idx, 1);
    };

    /**
     * 清空第一个乘机人数据
     * @param idx
     */
    $scope.btnClearPassengerClick = function (idx) {
        var psg = $scope.passengerList[idx];
        $scope.passengerList[idx] = initReservePassenger();
        var n = $scope.stationPassengerList.length;
        for (var i = 0; i < n; i++) {
            var stdPsg = $scope.stationPassengerList[i];
            if (psg.PassengerName == stdPsg.FlierName && psg.Foid == stdPsg.Foid) {
                $("#stdPsg_" + i).removeClass("active");
                $("#stdPsg_" + i).css({"color": "black", "background-color": "white"});
                break;
            }
        }
    };

    /**
     * 航意险复选框勾选
     * @param idx
     */
    $scope.btnAccCheck = function (idx) {
        var chk = $("#psgAccChk_" + idx);
        var acc = $("#psgAcc_" + idx);
        if (chk.is(":checked")) {
            acc.attr("disabled", false);
            $scope.passengerList[idx].InsuranceInfo.AccidentInsuranceCount = 1;
        } else {
            $scope.passengerList[idx].InsuranceInfo.AccidentInsuranceCount = 0;
            acc.attr("disabled", true);
        }

    };

    /**
     * 航意险下拉框份数变化
     * @param idx
     */
    $scope.chkInsuranceCntChange = function (idx) {
        var insCnt = $scope.passengerList[idx].InsuranceInfo.AccidentInsuranceCount;
        if (insCnt > 0) {
            //chk.attr("checked", "true");
            document.getElementById("psgAccChk_" + idx).checked = true;
        } else {
            //chk.attr("checked", "false");
            document.getElementById("psgAccChk_" + idx).checked = false;
        }
    };

    /**
     * 航意险详情鼠标上悬
     * @param idx
     */
    $scope.btnAccidentDetMouseOver = function (idx) {
        var box = $("<div class='roles table-fli' style='padding: 5px; width:500px;'><br><span style='font-weight:bold'>保险产品介绍:</span><br>" +
                "<span>保险名称:中银三星航空旅行保障计划</span><br>" +
                "<span>承保公司:中银三星人寿保险有限公司</span><br>" +
                "<span>产品介绍:30元/份/航段</span><br>" +
                "<span>保险有效期:当次航班。自被保险人持有效身份证件到达机场通过安全检查时始，至被保险人抵达目的港走出所乘航班班机的舱门时止</span><br>" +
                "<span>投保年龄:本产品暂不支持婴儿购买</span><br><br>" +
                "<table style='width:100%;'><tr><td style='text-align: center;'>保险责任</td><td style='text-align: center;'>赔偿限额</td></tr>" +
                "<tr><td style='background:#FFFFFF;text-align: center;'>航空意外身故/残疾</td><td style='background:#FFFFFF;text-align: center;'>150万元人民币</td></tr>" +
                "<tr><td style='background:#FFFFFF;text-align: center;'>航空意外伤害住院医疗</td><td style='background:#FFFFFF;text-align: center;'>6万元人民币</td></tr>" +
                "</table><br>" +
                "<span>电话验真:致电航联全国客服电话400-810-2688或者中银三星人寿保险有限公司全国客服电话400-810-1888进行验真</span><br>" +
                "<span>网自助验真:登录中银三星人寿保险有限公司网址：<a href='http://www.boc-samsunglife.cn' target='_blank'>http://www.boc-samsunglife.cn</a> </span><br>" +
                "<span>特别申明:</span><br>" +
                "<span>1.航意险只连同机票一起退还</span><br>" +
                "<span>2.官网购买机票和保险，保险不支持签转改期</span><br>" +
                "</div>");

        $("#" + idx).css({"background-color":"#e17a00","color":"white"});

        $("body").append(box);
        box.css({top: $("#" + idx).offset().top, left: $("#" + idx).offset().left});
    };
    /**
     * 航意险详情鼠标移开效果
     * @param idx
     */
    $scope.btnAccidentDetMouseOut = function (idx) {
        $("#" + idx).css({"background-color":"white","color":"black"});
        $(".roles").remove();
    };

    /**
     * 行程单单选
     */
    $scope.radItineraryChange = function (v) {
        if (v == "0") {
            $("#divitineexp").css({"display": "none"});
        } else if (v == "1") {
            $("#divitineexp").css({"display": "block"});
            if (laGlobalLocalService.CheckStringIsEmpty($scope.Itinerary.Name)) {
                $scope.Itinerary.Name = $scope.cName;
            }
            if (laGlobalLocalService.CheckStringIsEmpty($scope.Itinerary.Mobile)) {
                $scope.Itinerary.Mobile = $scope.cMobile;
            }
            if ($scope.ExpressListOpt.length >= 1) {
                $scope.Itinerary.ExpressType = $scope.ExpressListOpt[0].v;
            }
        }
    };
    /**
     * 航延险复选框勾选
     * @param idx
     */
    $scope.btnDelayCheck = function (idx) {
        var chk = $("#psgDelayChk_" + idx);
        var delay = $("#psgDelay_" + idx);
        if (chk.is(":checked")) {
            delay.attr("disabled", false);
            $scope.passengerList[idx].InsuranceInfo.DelayInsuranceCount = 1;
        } else {
            $scope.passengerList[idx].InsuranceInfo.DelayInsuranceCount = 0;
            delay.attr("disabled", true);
        }
    };
    /**
     * 身份证解析生日
     * @param idx
     * @constructor
     */
    $scope.IdentityChange = function (idx) {
        $scope.passengerList[idx].Foid = $scope.passengerList[idx].Foid.toUpperCase();
        if ($scope.passengerList[idx].FoidType == 1) {
            $scope.passengerList[idx].Brithday = laGlobalLocalService.ParseBirthdayByIdCode($scope.passengerList[idx].Foid);
        }
    };

    /**
     * 检查姓名
     * @param idx
     * @returns {boolean}
     * @constructor
     */
    $scope.CheckPsgName = function (idx) {
        var result = true;
        $("#msgName_" + idx).css("display", "none");
        if (laGlobalLocalService.CheckStringIsEmpty($scope.passengerList[idx].PassengerName)) {
            $("#msgName_" + idx).css("display", "block");
            result = false;
        }

        $("#msgNamelen_" + idx).css("display", "none");
        if (laGlobalLocalService.getChineseStringCnt($scope.passengerList[idx].PassengerName) > 0) {
            if (laGlobalLocalService.getStringLength($scope.passengerList[idx].PassengerName) < 4) {
                $("#msgNamelen_" + idx).css("display", "block");
                result = false;
            }
        }
        if (laGlobalLocalService.getChineseStringCnt($scope.passengerList[idx].PassengerName) <= 0) {
            if (laGlobalLocalService.getStringLength($scope.passengerList[idx].PassengerName) < 3) {
                $("#msgNamelen_" + idx).css("display", "block");
                result = false;
            }
        }

        return result;
    };

    /**
     * 检查身份证
     * @param idx
     * @constructor
     */
    $scope.CheckPsgFoid = function (idx) {
        var result = true;
        $("#msgFoid_" + idx).css("display", "none");
        if (laGlobalLocalService.CheckStringIsEmpty($scope.passengerList[idx].Foid)) {
            $("#msgFoid_" + idx).css("display", "block");
            result = false;
        } else {
            $scope.passengerList[idx].Foid = $scope.passengerList[idx].Foid.toUpperCase();
            if ($scope.passengerList[idx].FoidType == 1) {
                if (!laGlobalLocalService.CheckStringLengthRange($scope.passengerList[idx].Foid, 15)) {
                    $("#msgFoid_" + idx).css("display", "block");
                    result = false;
                }
                if (!laGlobalLocalService.IdentityCodeValid($scope.passengerList[idx].Foid)) {
                    $("#msgFoid_" + idx).css("display", "block");
                    result = false;
                }
            }
            if ($scope.passengerList[idx].FoidType == 2) {
                if (!laGlobalLocalService.CheckPassportFormat($scope.passengerList[idx].Foid)) {
                    $("#msgFoid_" + idx).css("display", "block");
                    result = false;
                }
            }
        }
        return result;
    };

    /**
     * 检查生日
     * @param idx
     * @returns {boolean}
     * @constructor
     */
    $scope.CheckPsgBirtyday = function (idx) {
        $scope.passengerList[idx].Brithday = $("#psgBirth_" + idx).val();
        var result = true;
        $("#msgBirthday_" + idx).css("display", "none");
        if (laGlobalLocalService.CheckStringIsEmpty($scope.passengerList[idx].Brithday)) {
            $("#msgBirthday_" + idx).css("display", "block");
            result = false;
        } else if (!laGlobalLocalService.CheckDateFormat($scope.passengerList[idx].Brithday)) {
            $("#msgBirthday_" + idx).css("display", "block");
            result = false;
        }
        return result;
    };

    $scope.CheckConName = function () {
        var result = true;
        $("#conName").css("display", "none");
        if (laGlobalLocalService.CheckStringIsEmpty($scope.cName)) {
            $("#conName").css("display", "block");
            result = false;
        }
        return result;
    };

    $scope.CheckItName = function () {
        if ($scope.ItineraryType == "0") {
            return true;
        }
        var result = true;
        $("#itName").css("display", "none");
        if (laGlobalLocalService.CheckStringIsEmpty($scope.Itinerary.Name)) {
            $("#itName").css("display", "block");
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

    $scope.CheckItMobile = function () {
        if ($scope.ItineraryType == "0") {
            return true;
        }
        var result = true;
        $("#itMobile").css("display", "none");
        if (laGlobalLocalService.CheckStringIsEmpty($scope.Itinerary.Mobile) || !laGlobalLocalService.CheckStringLength($scope.Itinerary.Mobile, 11) || !laGlobalLocalService.CheckMobileCode($scope.Itinerary.Mobile)) {
            $("#itMobile").css("display", "block");
            result = false;
        }
        return result;
    };

    $scope.CheckItProvince = function () {
        if ($scope.ItineraryType == "0") {
            return true;
        }
        var result = true;
        $("#itProvince").css("display", "none");
        if (laGlobalLocalService.CheckStringIsEmpty($scope.Itinerary.Province)) {
            $("#itProvince").css("display", "block");
            result = false;
        }
        return result;
    };

    $scope.CheckItCity = function () {
        if ($scope.ItineraryType == "0") {
            return true;
        }
        var result = true;
        $("#itCity").css("display", "none");
        if (laGlobalLocalService.CheckStringIsEmpty($scope.Itinerary.City)) {
            $("#itCity").css("display", "block");
            result = false;
        }
        return result;
    };

    $scope.CheckItDetailAddress = function () {
        if ($scope.ItineraryType == "0") {
            return true;
        }
        var result = true;
        $("#itDetailAddress").css("display", "none");
        if (laGlobalLocalService.CheckStringIsEmpty($scope.Itinerary.DetialAddress)) {
            $("#itDetailAddress").css("display", "block");
            result = false;
        }
        return result;
    };

    /**
     * 检查整个订单数据
     */
    $scope.validOrderData = function () {
        var result = true;
        var nlen = $scope.passengerList.length;
        for (var i = 0; i < nlen; i++) {
            if (!$scope.CheckPsgName(i)) {
                result = false;
            }
            if (!$scope.CheckPsgFoid(i)) {
                result = false;
            }
            if (!$scope.CheckPsgBirtyday(i)) {
                result = false;
            }
        }

        if (!$scope.CheckConName()) {
            result = false;
        }
        if (!$scope.CheckConMobile()) {
            result = false;
        }

        if ($scope.ItineraryType == "1") {
            if (!$scope.CheckItName()) {
                result = false;
            }
            if (!$scope.CheckItMobile()) {
                result = false;
            }
            if (!$scope.CheckItProvince()) {
                result = false;
            }
            if (!$scope.CheckItCity()) {
                result = false;
            }
            if (!$scope.CheckItDetailAddress()) {
                result = false;
            }
        }

        return result;
    };

    $scope.getExpressFee = function () {
        if ($scope.ItineraryType == "0") {
            return 0;
        }
        if ($scope.expressList.length > 0) {
            if ($scope.Itinerary.ExpressType != null && $scope.Itinerary.ExpressType != undefined) {
                var n = $scope.expressList.length;
                for (var i = 0; i < n; i++) {
                    var item = $scope.expressList[i];
                    if (item.ExpressType == $scope.Itinerary.ExpressType) {
                        return item.ExpressAmount;
                    }
                }
            }
        }
    };

    /**
     * 提交订单
     */
    $scope.btnCommitOrderClick = function () {
        if (!$scope.validOrderData()) {
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
        ordInfo.ChildRecerveCabinPriceType = 2;
        ordInfo.TotalAmount = 0;
        ordInfo.VerifyCode = $scope.verifyCode;

        var blAllBuyInsurance = new Array();
        //识别舱位及计算总价并添加乘机人信息
        var n = $scope.passengerList.length;
        for (var i = 0; i < n; i++) {
            $scope.passengerList[i].Brithday = $("#psgBirth_" + i).val();
            if ($scope.passengerList[i].TravellerType == 1) {
                hasAudit = true;
                ordInfo.TotalAmount += $scope.cabinInfo.SalePrice + $scope.flightInfo.AirportTax
                    + $scope.flightInfo.FuelTax + $scope.flightInfo.OtherTax;
                if ($scope.isRoundtrip == 1) {
                    ordInfo.TotalAmount += $scope.cabinInfoback.SalePrice + $scope.flightInfoback.AirportTax
                        + $scope.flightInfoback.FuelTax + $scope.flightInfoback.OtherTax;
                }
            }
            if ($scope.passengerList[i].TravellerType == 2) {
                hasChild = true;
                ordInfo.TotalAmount += $scope.cabinInfo.ChildSalePrice + $scope.flightInfo.ChildAirportTax
                    + $scope.flightInfo.ChildFuelTax + $scope.flightInfo.ChildOtherTax;
                if ($scope.isRoundtrip == 1) {
                    ordInfo.TotalAmount += $scope.cabinInfoback.ChildSalePrice + $scope.flightInfoback.ChildAirportTax
                        + $scope.flightInfoback.ChildFuelTax + $scope.flightInfoback.ChildOtherTax;
                }
            }

            if ($scope.passengerList[i].InsuranceInfo.AccidentInsuranceCount > 0) {
                blAllBuyInsurance.push(true);
            } else {
                blAllBuyInsurance.push(false);
            }

            if ($scope.passengerList[i].InsuranceInfo.AccidentInsuranceCount > 0) {
                ordInfo.TotalAmount += ($scope.cabinInfo.AccidentInsurancePrice * $scope.passengerList[i].InsuranceInfo.AccidentInsuranceCount) - $scope.cabinInfo.AccidentInsuranceTktPriceDiscount;
            }
            if ($scope.passengerList[i].InsuranceInfo.DelayInsuranceCount > 0) {
                ordInfo.TotalAmount += ($scope.cabinInfo.DelayInsurancePrice * $scope.passengerList[i].InsuranceInfo.DelayInsuranceCount) - $scope.cabinInfo.DelayInsuranceTktPriceDiscount;
            }

            ordInfo.Passengers[i] = $scope.passengerList[i];
        }

        if (blAllBuyInsurance.length > 1) {
            var blBuyInsurance = blAllBuyInsurance[0];
            for (var i = 1; i < blAllBuyInsurance.length; i++) {
                if (blBuyInsurance != blAllBuyInsurance[i]) {
                    bootbox.alert("根据运价调整规则,所有乘机人都必须全部购买(或不购买)航意险");
                    return;
                }
            }
        }

        $scope.CommitOrder = true;
        $scope.CommitOrderStatus = true;
        $scope.CommitOrderStatusDesc = '';

        if (hasChild && !hasAudit) {
            ordInfo.ChildRecerveCabinPriceType = 1;
        }

        //添加航段信息
        var fli = new laEntityReserveFlight();
        fli.ArriveAirport = $scope.flightInfo.AirportTo;
        fli.CabinName = $scope.cabinInfo.CabinName;
        fli.ChildCabinName = $scope.cabinInfo.ChildCabinName;
        fli.DepartureAirport = $scope.flightInfo.AirportFrom;

        //必须转换成本地时间,否则JS会自动按照国际时间,会存在误差
        fli.DepartureTime = $filter('date')($scope.flightInfo.DepartureTime, 'yyyy-MM-dd HH:mm:ss');//$scope.flightInfo.DepartureTime;
        fli.FlightNum = $scope.flightInfo.FlightNum;

        ordInfo.Flights[0] = fli;
        if ($scope.isRoundtrip == 1) {
            var fliback = new laEntityReserveFlight();
            fliback.ArriveAirport = $scope.flightInfoback.AirportTo;
            fliback.CabinName = $scope.cabinInfoback.CabinName;
            fliback.ChildCabinName = $scope.cabinInfoback.CabinName;
            fliback.DepartureAirport = $scope.flightInfoback.AirportFrom;
            fliback.DepartureTime = $scope.flightInfoback.DepartureTime;
            fliback.FlightNum = $scope.flightInfoback.FlightNum;
            ordInfo.Flights[1] = fliback;
        }
        //添加联系人信息
        var con = new laEntityContacts()
        con.ContactsAddress = ($scope.cAddr == undefined) ? '' : $scope.cAddr;
        con.ContactsEMail = ($scope.cEmail == undefined) ? '' : $scope.cEmail;
        con.ContactsMobile = ($scope.cMobile == undefined) ? '' : $scope.cMobile;
        con.ContactsName = ($scope.cName == undefined) ? '' : $scope.cName;
        con.ContactsPhone = ($scope.cTel == undefined) ? '' : $scope.cTel;
        con.ContactsZIP = ($scope.cZip == undefined) ? '' : $scope.cZip;

        ordInfo.Contacts = con;

        if ($scope.ItineraryType == '0') {
            ordInfo.Itinerary = new laEntityReserveItinerary();
        } else {
            ordInfo.Itinerary = $scope.Itinerary;
        }

        ordInfo.TotalAmount += $scope.getExpressFee();

        laOrderService.CreateOrder(ordInfo, function (backData, status) {
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
        var fli = new laEntityFlight();
        fli.AirportFrom = $scope.flightInfo.AirportFrom;
        fli.AirportTo = $scope.flightInfo.AirportTo;
        fli.AirportFromCH = $scope.otherInfo.sCity;
        fli.AirportToCH = $scope.otherInfo.eCity;
        fli.DepartureTime = $filter('date')($scope.flightInfo.DepartureTime, 'yyyy-MM-dd');
        fli.RoundTripTime = '';
        fli.RoundTrip = false;
        if ($scope.isRoundtrip == 1) {
            fli.RoundTripTime = $filter('date')($scope.flightInfoback.DepartureTime, 'yyyy-MM-dd');
            fli.RoundTrip = true;
        }

        laGlobalLocalService.writeCookie(laGlobalProperty.laServiceConst_TransData_QueryTicket, JSON.stringify(fli), 0);
        $window.location.href = 'AirlineList.html';
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

    /**
     *
     * @constructor
     */
    function QueryStationPassengerList() {
        laUserService.QueryStationPassengers(1, 1000, '', '', function (backData, status) {
            $scope.stationPassengerList;
            if (status) {
                $scope.stationPassengerList = backData;
                $("#divpsglist").css({"display": "block"});
            }
        });
    }

    /**
     * 初始化一个乘机人实例
     * @returns {laEntityReservePassenger}
     */
    function initReservePassenger() {
        var psg = new laEntityReservePassenger();
        psg.TravellerType = 1;
        psg.FoidType = 1;
        psg.InsuranceInfo = new laEntityReserveInsuranceInfo();
        psg.InsuranceInfo.AccidentInsuranceCount = 0;
        psg.InsuranceInfo.DelayInsuranceCount = 0;
        if ($scope.cabinInfo.AccidentInsuranceCanBuyCount > 0) {
            psg.InsuranceInfo.AccidentInsuranceCount = 1;
        }
        if ($scope.cabinInfo.DelayInsuranceCanBuyCount > 0) {
            psg.InsuranceInfo.DelayInsuranceCount = 1;
        }
        return psg;
    }

    /**
     * 从常用乘机人添加乘客
     * @param psg
     */
    function addPassengerByStation(psg) {
        var added = false;
        var n = $scope.passengerList.length;
        for (var i = 0; i < n; i++) {
            if ((laGlobalLocalService.CheckStringIsEmpty($scope.passengerList[i].PassengerName)) &&
                (laGlobalLocalService.CheckStringIsEmpty($scope.passengerList[i].Foid))) {
                $scope.passengerList[i].TravellerType = psg.TravellerType;
                $scope.passengerList[i].PassengerName = psg.FlierName;
                $scope.passengerList[i].FoidType = psg.FoidType;
                $scope.passengerList[i].Foid = psg.Foid;
                $scope.passengerList[i].Brithday = psg.Brithday;

                added = true;
                break;
            }
        }
        if (!added) {
            var newPsg = initReservePassenger();
            newPsg.TravellerType = psg.TravellerType;
            newPsg.PassengerName = psg.FlierName;
            newPsg.FoidType = psg.FoidType;
            newPsg.Foid = psg.Foid;
            newPsg.Brithday = psg.Brithday;
            //$scope.passengerList.splice(-1, 0, newPsg);
            $scope.passengerList[$scope.passengerList.length] = newPsg;
        }
    }

    /**
     * 从常用乘机人删除乘客
     * @param psg
     */
    function removePassengerByStation(psg) {
        var n = $scope.passengerList.length;

        for (var i = 0; i < n; i++) {
            if ($scope.passengerList[i].PassengerName == psg.FlierName &&
                $scope.passengerList[i].Foid == psg.Foid) {

                if (n > 1) {
                    $scope.passengerList.splice(i, 1);
                } else {
                    $scope.passengerList[i].PassengerName = '';
                    $scope.passengerList[i].Foid = '';
                    $scope.passengerList[i].Brithday = '';
                }

                break;
            }
        }
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

    function QueryExpressList() {
        laUserService.QueryExpressList(function (backData, status) {
            if (backData.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.expressList = backData.Result;
                var nExp = $scope.expressList.length;
                for (var i = 0; i < nExp; i++) {
                    var expItem = $scope.expressList[i];
                    $scope.ExpressListOpt[i] = {
                        "v": expItem.ExpressType,
                        "t": expItem.ExpressTypeDisplay + "  ¥" + expItem.ExpressAmount
                    };
                }
            }
        })
    }

    /*****************************************************
     *    常用乘机人部分
     *****************************************************/
    $scope.psgNameValid = true;
    $scope.psgFoidValid = true;
    $scope.psgMobileValid = true;
    $scope.psgEMailValid = true;
    $scope.psgBirthdayValid = true;

    $scope.Passenger = InitNewPassenger();

    $scope.CheckFlierName = function () {
        $scope.psgNameValid = true;
        if (laGlobalLocalService.CheckStringIsEmpty($scope.Passenger.FlierName)) {
            $scope.psgNameValid = false;
            return false;
        } else if (laGlobalLocalService.getChineseStringCnt($scope.Passenger.FlierName) > 0) {
            if (laGlobalLocalService.getStringLength($scope.Passenger.FlierName) < 4) {
                $scope.psgNameValid = false;
                return false;
            }
        } else if (laGlobalLocalService.getChineseStringCnt($scope.Passenger.FlierName) <= 0) {
            if (laGlobalLocalService.getStringLength($scope.Passenger.FlierName) < 3) {
                $scope.psgNameValid = false;
                return false;
            }
        } else {
            return true;
        }
    };

    $scope.CheckFoid = function () {
        $scope.psgFoidValid = true;
        if (laGlobalLocalService.CheckStringIsEmpty($scope.Passenger.Foid)) {
            $scope.psgFoidValid = false;
            return false;
        }
        $scope.Passenger.Foid = $scope.Passenger.Foid.toUpperCase();
        if ($scope.Passenger.FoidType == 1) {
            if (!laGlobalLocalService.IdentityCodeValid($scope.Passenger.Foid)) {
                $scope.psgFoidValid = false;
                return false;
            } else {
                $scope.Passenger.Brithday = laGlobalLocalService.ParseBirthdayByIdCode($scope.Passenger.Foid);
                return true;
            }
        } else if ($scope.Passenger.FoidType == 2) {
            if (!laGlobalLocalService.CheckPassportFormat($scope.Passenger.Foid)) {
                $scope.psgFoidValid = false;
                return false;
            }
        }
        return true;
    };

    $scope.CheckMobile = function () {
        $scope.psgMobileValid = true;
        if (laGlobalLocalService.CheckStringIsEmpty($scope.Passenger.Mobile)) {
            return true;
        }
        if (!laGlobalLocalService.CheckStringLength($scope.Passenger.Mobile, 11)) {
            $scope.psgMobileValid = false;
            return false;
        } else {
            return true;
        }
    };

    $scope.CheckEMail = function () {
        $scope.psgEMailValid = true;
        if (laGlobalLocalService.CheckStringIsEmpty($scope.Passenger.EMail)) {
            return true;
        }
        if (!laGlobalLocalService.CheckEMailFormat($scope.Passenger.EMail)) {
            $scope.psgEMailValid = false;
            return false;
        } else {
            return true;
        }
    };

    $scope.CheckBirthday = function () {
        $scope.psgBirthdayValid = true;
        if (laGlobalLocalService.CheckStringIsEmpty($scope.Passenger.Brithday) || !laGlobalLocalService.CheckDateFormat($scope.Passenger.Brithday)) {
            $scope.psgBirthdayValid = false;
            return false;
        } else {
            return true;
        }
    };

    $scope.btnAddMyPassengerClick = function () {

        $scope.Passenger.Brithday = $("#psgBirthday").val();

        if (!$scope.CheckFlierName()) {
            return;
        }
        if (!$scope.CheckFoid()) {
            return;
        }
        if (!$scope.CheckMobile()) {
            return;
        }
        if (!$scope.CheckEMail()) {
            return;
        }
        if (!$scope.CheckBirthday()) {
            return;
        }

        laUserService.MaintainStationPassengers($scope.Passenger, function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $('.modal').modal('hide');
                QueryStationPassengerList();

                $scope.Passenger = InitNewPassenger();

            } else {
                bootbox.alert('添加常旅客信息失败:' + rs.Message, function () {
                    //callback
                });
            }

        })

    };

    function InitNewPassenger() {
        var result = new laEntityStationPassenger();
        result.TravellerType = 1;
        result.FoidType = 1;
        result.Tid = 0; //0表示添加
        return result;
    }
}]);