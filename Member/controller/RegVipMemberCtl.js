/**
 * Created by Jerry on 16/7/10.
 */

laAir.controller('laAir_MemberRegVipMemberPageCtl', ['$document', '$interval', '$window', '$scope', '$interval', 'laUserService', 'laGlobalLocalService', function ($document, $interval, $window, $scope, $interval, laUserService, laGlobalLocalService) {

    $scope.$on("MemberContentPage", function (event, data) {
        var IsFrequentPassenger = data.IsFrequentPassenger;
        if (IsFrequentPassenger) {
            $window.location.href = "MyVipInfo.html";
        }
    });

    $scope.title = "升级成为常旅客";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isMyInfoNav = true;

    $scope.foIdTypeOptions = laEntityEnumfoIdTypeOptions;
    $scope.nativeOptions = laEntityEnumnationaityOptions;
    $scope.jobOptions = laEntityEnumjob;
    $scope.positionOptions = laEntityEnumjobPosition;
    $scope.languageOptions = laEntityEnumlanguageHope;

    $scope.checkmealTypelist = laEntityEnummealType;
    $scope.checkseatTypelist = laEntityEnumseatType;
    $scope.checkseatrealTypelist = laEntityEnumseatrealType;
    $scope.checksaleTypelist = laEntityEnumsaleChannelType;
    $scope.checkpayTypelist = laEntityEnumpayPlatType;
    $scope.MealTypelist = new Array();
    $scope.SeatTypelist = new Array();
    $scope.SeatRealTypelist = new Array();
    $scope.SaleTypelist = new Array();
    $scope.PayTypelist = new Array();

    $scope.userInfo = new laEntityUser();

    $scope.timeDown = 60;

    $scope.isRegisting = false;

    $scope.ImageVerifyCode = "";
    $scope.ImgVerifyData;
    $scope.SessionID;

    $scope.countrylist = new Array();
    $scope.citylist = new Array();

    FillChecklist();
    QueryCurrentUserInfo();
    QueryProvinceList();

    GetImgVerifyCode();

    $scope.getChinesePYXing = function(){
        laUserService.getChinesePinYin($scope.userInfo.SecondNameCn, function(backData, status){
            if (backData.Code == laGlobalProperty.laServiceCode_Success){
                if (!laGlobalLocalService.CheckStringIsEmpty(backData.PinYin)){
                    $scope.userInfo.SecondNameCnPinYin = backData.PinYin;
                }
            }
        });
    };

    $scope.getChinesePYMing = function(){
        laUserService.getChinesePinYin($scope.userInfo.FirstNameCn, function(backData, status){
            if (backData.Code == laGlobalProperty.laServiceCode_Success){
                if (!laGlobalLocalService.CheckStringIsEmpty(backData.PinYin)){
                    $scope.userInfo.FirstNameCnPinYin = backData.PinYin;
                }
            }
        });
    };

    $scope.btnChangeVerifyCode = function () {
        GetImgVerifyCode();
    };
    /**
     * 申请成为常旅客
     */
    $scope.btnRegisterClick = function () {

        if (!$scope.checkValidData()) {
            return;
        }

        var food = "";
        var foodlist = document.getElementsByName("food");
        for (var i = 0; i < foodlist.length; i++) {
            if (foodlist[i].checked) {
                food += foodlist[i].value + ",";
            }
        }
        if (!laGlobalLocalService.CheckStringIsEmpty(food)) {
            food = food.substr(0, food.length - 1);
        }
        $scope.userInfo.PPMeals = food;

        var seat = "";
        var seatlist = document.getElementsByName("seatreal");
        for (var i = 0; i < seatlist.length; i++) {
            if (seatlist[i].checked) {
                seat += seatlist[i].value + ",";
            }
        }
        if (!laGlobalLocalService.CheckStringIsEmpty(seat)) {
            seat = seat.substr(0, seat.length - 1);
        }
        $scope.userInfo.PPSeats = seat;

        var dis = "";
        var dislist = document.getElementsByName("seat");
        for (var i = 0; i < dislist.length; i++) {
            if (dislist[i].checked) {
                dis += dislist[i].value + ",";
            }
        }
        if (!laGlobalLocalService.CheckStringIsEmpty(dis)) {
            dis = dis.substr(0, dis.length - 1);
        }
        $scope.userInfo.PPDiscount = dis;

        var buy = "";
        var buylist = document.getElementsByName("buy");
        for (var i = 0; i < buylist.length; i++) {
            if (buylist[i].checked) {
                buy += buylist[i].value + ",";
            }
        }
        if (!laGlobalLocalService.CheckStringIsEmpty(buy)) {
            buy = buy.substr(0, buy.length - 1);
        }
        $scope.userInfo.PPChannel = buy;

        var pay = "";
        var paylist = document.getElementsByName("pay");
        for (var i = 0; i < paylist.length; i++) {
            if (paylist[i].checked) {
                pay += paylist[i].value + ",";
            }
        }
        if (!laGlobalLocalService.CheckStringIsEmpty(pay)) {
            pay = pay.substr(0, pay.length - 1);
        }
        $scope.userInfo.PPPaymentMethod = pay;

        var conhope = "";
        var conhopelist = document.getElementsByName("contacthope");
        for (var i = 0; i < conhopelist.length; i++) {
            if (conhopelist[i].checked) {
                conhope += conhopelist[i].value + ",";
            }
        }
        if (!laGlobalLocalService.CheckStringIsEmpty(conhope)) {
            conhope = conhope.substr(0, conhope.length - 1);
        }
        $scope.userInfo.ContactHope = conhope;

        $scope.userInfo.VerifyCode = $scope.ImageVerifyCode;

        $scope.isRegisting = true;
        $scope.timeDown = 1;
        laUserService.RegisterFrequent($scope.userInfo, function (backData, status) {
            var rs = backData;
            $scope.timeDown = 1;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                var timer = $interval(function () {
                    $scope.timeDown = $scope.timeDown - 1;
                    if ($scope.timeDown <= 0) {
                        $interval.cancel(timer);
                        $scope.isRegisting = false;
                        bootbox.alert('注册成功', function () {
                            //$window.location.href = '/Member/MyVipInfo.html';

                            laUserService.UserLogOut(function (backData, status) {
                                var rsout = backData;
                                if (rsout.Code == laGlobalProperty.laServiceCode_Success) {
                                    $window.location.href = '/Member/Login.html';
                                }
                            });
                        });
                    }
                }, 1000);
            } else {
                var timer = $interval(function () {
                    $scope.timeDown = $scope.timeDown - 1;
                    if ($scope.timeDown <= 0) {
                        $interval.cancel(timer);
                        $scope.isRegisting = false;
                        bootbox.alert(rs.Message);
                    }
                }, 1000);
            }
        })
    };

    $scope.checkValidData = function () {

        if (!laGlobalLocalService.CheckStringIsEmpty($scope.userInfo.Foid)) {
            $scope.userInfo.Foid = $scope.userInfo.Foid.toUpperCase();
        }

        /*
        if (laGlobalLocalService.CheckStringIsEmpty($scope.userInfo.MobileValidCode)) {
            bootbox.alert("请输入短信验证码");
            return false;
        }
        */

        if (laGlobalLocalService.CheckStringIsEmpty($scope.userInfo.SecondNameCn)) {
            bootbox.alert("请输入中文姓");
            return false;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.userInfo.FirstNameCn)) {
            bootbox.alert("请输入中文名");
            return false;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.userInfo.SecondNameCnPinYin)) {
            bootbox.alert("请输入中文姓的拼音");
            return false;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.userInfo.FirstNameCnPinYin)) {
            bootbox.alert("请输入中文名的拼音");
            return false;
        }

        /*
        if (laGlobalLocalService.CheckStringIsEmpty($scope.userInfo.Foid)) {
            bootbox.alert("请输入证件号码");
            return false;
        }
        if ($scope.userInfo.FoidType == 1) {
            if (!laGlobalLocalService.IdentityCodeValid($scope.userInfo.Foid)) {
                bootbox.alert("请输入正确的身份证号码");
                return false;
            }
        }

        if (laGlobalLocalService.CheckStringIsEmpty($scope.userInfo.BirthDay)) {
            bootbox.alert("请输入出生日期");
            return false;
        }
        if (!laGlobalLocalService.CheckDateFormat($scope.userInfo.BirthDay)) {
            bootbox.alert("请按照YYYY-MM-DD填写出生日期");
            return false;
        }
        */

        /*
        if (!laGlobalLocalService.CheckStringIsEmpty($scope.userInfo.Password) && !laGlobalLocalService.CheckStringLengthRange($scope.userInfo.Password, 6)) {
            bootbox.alert("请输入至少6位长度的密码");
            return false;
        }
        if ($scope.userInfo.Password != $scope.userInfo.ConPassword) {
            bootbox.alert("前后两次密码输入不一致,请核对后再输");
            return false;
        }
        */

        if (laGlobalLocalService.CheckEMailFormat($scope.userInfo.EMail)){
            bootbox.alert("请输入格式正确的电邮地址");
            return false;
        }

        if (!document.getElementById("IsBookMag").checked) {
            bootbox.alert("成为常旅客必须同意长龙会员服务条款");
            return false;
        }
        return true;
    };

    $scope.SearchFoidByType = function (foidType) {
        var v = "";
        if ($scope.userInfo.IDInfoList != null && $scope.userInfo.IDInfoList != undefined && $scope.userInfo.IDInfoList != "null") {
            var n = $scope.userInfo.IDInfoList.length;
            for (var i = 0; i < n; i++) {
                var item = $scope.userInfo.IDInfoList[i];
                if (item.FoidType == foidType) {
                    v = item.Foid;
                    break;
                }
            }
            if (v == undefined) {
                v = "";
            }
        }
        $scope.userInfo.Foid = v;
    };

    $scope.UpperCaseInfoSecondName = function () {
        $scope.userInfo.SecondNameCnPinYin = $scope.userInfo.SecondNameCnPinYin.toUpperCase();
    };
    $scope.UpperCaseInfoFirstName = function () {
        $scope.userInfo.FirstNameCnPinYin = $scope.userInfo.FirstNameCnPinYin.toUpperCase();
    };

    /**
     * 发送验证码
     */
    $scope.btnSendMobileValidCodeClick = function () {

        if (laGlobalLocalService.CheckStringIsEmpty($scope.userInfo.Mobile) || !laGlobalLocalService.CheckStringLength($scope.userInfo.Mobile, 11) || !laGlobalLocalService.CheckMobileCode($scope.userInfo.Mobile)) {
            bootbox.alert("请输入11位正确的手机号码");
            return;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.ImageVerifyCode)) {
            bootbox.alert("发送手机验证码前请先输入图片验证码");
            return;
        }
        laUserService.SendRegisterMobileCode($scope.userInfo.Mobile, $scope.ImageVerifyCode, $scope.SessionID, function (backData, status) {
            var rs = backData;
            if (rs.Code != laGlobalProperty.laServiceCode_Success) {
                bootbox.alert(rs.Message, function () {
                    //callback
                });
            } else {
                $scope.timeDown = 60;
                var timer = $interval(function () {
                    $("#btnGetSMS").attr("disabled", true);
                    $("#btnGetSMS").addClass('btn-gray');
                    $("#btnGetSMS").val('重新发送(' + $scope.timeDown + ')');
                    $scope.timeDown = $scope.timeDown - 1;
                    if ($scope.timeDown <= 0) {
                        $interval.cancel(timer);
                        $("#btnGetSMS").attr("disabled", false);
                        $("#btnGetSMS").removeClass('btn-gray');
                        $("#btnGetSMS").val('发送验证码');
                    }
                }, 1000);
            }
        })
    };

    function FillChecklist() {
        for (var i = 0; i < $scope.checkmealTypelist.length; i++) {
            var item = $scope.checkmealTypelist[i];
            var chk = {"v": item.v, "t": item.t, "s": false};
            $scope.MealTypelist.push(chk);
        }
        for (var i = 0; i < $scope.checkseatTypelist.length; i++) {
            var item = $scope.checkseatTypelist[i];
            var chk = {"v": item.v, "t": item.t, "s": false};
            $scope.SeatTypelist.push(chk);
        }
        for (var i = 0; i < $scope.checkseatrealTypelist.length; i++) {
            var item = $scope.checkseatrealTypelist[i];
            var chk = {"v": item.v, "t": item.t, "s": false};
            $scope.SeatRealTypelist.push(chk);
        }
        for (var i = 0; i < $scope.checksaleTypelist.length; i++) {
            var item = $scope.checksaleTypelist[i];
            var chk = {"v": item.v, "t": item.t, "s": false};
            $scope.SaleTypelist.push(chk);
        }
        for (var i = 0; i < $scope.checkpayTypelist.length; i++) {
            var item = $scope.checkpayTypelist[i];
            var chk = {"v": item.v, "t": item.t, "s": false};
            $scope.PayTypelist.push(chk);
        }
    }

    function QueryProvinceList() {
        //$scope.countrylist.push({"v": "", "t": "==请选择=="});
        laUserService.QueryProvinceList(1, function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                for (var i = 0; i < rs.Province.length; i++) {
                    var p = {"v": rs.Province[i].Tid, "t": rs.Province[i].ProvinceName};
                    $scope.countrylist.push(p);
                }
            }

        })
    }

    function QueryCityList(provinceId) {
        laUserService.QueryCityList(provinceId, function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                for (var i = 0; i < rs.City.length; i++) {
                    var p = {"v": rs.City[i].Tid, "t": rs.City[i].CityName};
                    $scope.citylist.push(p);
                }
            }

        })
    }

    function GetImgVerifyCode() {
        $scope.ImageVerifyCode = '';
        laUserService.ImageVerifyCodeForRegisterSendMobileValid(function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.ImgVerifyData = backData.ImageVerifyCode;
                $scope.SessionID = backData.SessionID;
            }
        });
    }

    /**
     * 查询当前用户信息
     * @constructor
     */
    function QueryCurrentUserInfo() {
        laUserService.GetCurrentUserInfo(function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.userInfo = rs;


                if ($scope.userInfo.Sex == undefined || $scope.userInfo.Sex == 0) {
                    $scope.userInfo.Sex = 1;
                }
                /*
                if ($scope.userInfo.Nationaity == undefined || $scope.userInfo.Nationaity == 0) {
                    $scope.userInfo.Nationaity = 1;
                }
                if ($scope.userInfo.ContactAddressHope == undefined || $scope.userInfo.ContactAddressHope == 0) {
                    $scope.userInfo.ContactAddressHope = 1;
                }
                if ($scope.userInfo.HomeAddressCountry == undefined || $scope.userInfo.HomeAddressCountry == 0) {
                    $scope.userInfo.HomeAddressCountry = 1;
                }
                if ($scope.userInfo.CompanyAddressCountry == undefined || $scope.userInfo.CompanyAddressCountry == 0) {
                    $scope.userInfo.CompanyAddressCountry = 1;
                }
                if ($scope.userInfo.Job == undefined || $scope.userInfo.Job == 0) {
                    $scope.userInfo.Job = 6;
                }
                if ($scope.userInfo.Position == undefined || $scope.userInfo.Position == 0) {
                    $scope.userInfo.Position = 7;
                }
                if ($scope.userInfo.LanguageHope == undefined || $scope.userInfo.LanguageHope == 0) {
                    $scope.userInfo.LanguageHope = 1;
                }
                if ($scope.userInfo.ContactHope == undefined || $scope.userInfo.ContactHope == 0) {
                    $scope.userInfo.ContactHope = 2;
                }
                */
            }
        })
    }
}]);
