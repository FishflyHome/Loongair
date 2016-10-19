/**
 * Created by Jerry on 16/7/4.
 */

laAir.controller('laAir_MemberMyVipInfoPageCtl', ['$interval', '$document', '$window', '$scope', 'laUserService', 'laGlobalLocalService', function ($interval, $document, $window, $scope, laUserService, laGlobalLocalService) {

    $scope.$on("MemberContentPage", function (event, data) {
        var IsFrequentPassenger = data.IsFrequentPassenger;
        if (!IsFrequentPassenger) {
            $window.location.href = "MyInfo.html";
        }
    });

    $scope.title = "我的信息";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isMyInfoNav = true;

    $scope.isMem_MyInfo = true;

    $scope.isFoidFull = true;
    $scope.countrylist = new Array();
    $scope.citylist = new Array();

    $scope.foIdTypeOptions = laEntityEnumfoIdTypeOptions;
    $scope.nativeOptions = laEntityEnumnationaityOptions;
    $scope.jobOptions = laEntityEnumjob;
    $scope.positionOptions = laEntityEnumjobPosition;
    $scope.languageOptions = laEntityEnumlanguageHope;
    $scope.contactHopeOptions = laEntityEnumcontactHope;

    $scope.ContactHopeCH = "";
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

    $scope.ValidCodeBase = "";
    $scope.ValidCodeDet = "";

    $scope.SaveInfoType;

    $scope.UserInfo;
    $scope.UserInfoBk;

    FillChecklist();
    QueryCurrentUserInfo();
    QueryProvinceList();

    $("#li_detinfo_foid").css({"height": $scope.foIdTypeOptions.length * 32});

    /**
     * 修改基本信息按钮点击
     */
    $scope.btnModiBaseInfo = function () {
        $("#info-show").hide();
        $("#info-edit").show();
        $("#infoeditbutton").hide();

        $scope.SaveInfoType = 1;

        /*
         if ($scope.UserInfo.Sex == undefined || $scope.UserInfo.Sex == 0) {
         $scope.UserInfo.Sex = 1;
         }
         */
    };

    /**
     * 修改详细信息按钮点击
     */
    $scope.btnModiDetailInfo = function () {
        $("#extra-show").hide();
        $("#extra-edit").show();
        $("#editbutton").hide();

        $scope.SaveInfoType = 2;

        /*
         if ($scope.UserInfo.Nationaity == undefined || $scope.UserInfo.Nationaity == 0) {
         $scope.UserInfo.Nationaity = 1;
         }
         if ($scope.UserInfo.ContactAddressHope == undefined || $scope.UserInfo.ContactAddressHope == 0) {
         $scope.UserInfo.ContactAddressHope = 1;
         }
         if ($scope.UserInfo.HomeAddressCountry == undefined || $scope.UserInfo.HomeAddressCountry == 0) {
         $scope.UserInfo.HomeAddressCountry = 1;
         }
         if ($scope.UserInfo.CompanyAddressCountry == undefined || $scope.UserInfo.CompanyAddressCountry == 0) {
         $scope.UserInfo.CompanyAddressCountry = 1;
         }
         if ($scope.UserInfo.Job == undefined || $scope.UserInfo.Job == 0) {
         $scope.UserInfo.Job = 6;
         }
         if ($scope.UserInfo.Position == undefined || $scope.UserInfo.Position == 0) {
         $scope.UserInfo.Position = 7;
         }
         if ($scope.UserInfo.LanguageHope == undefined || $scope.UserInfo.LanguageHope == 0) {
         $scope.UserInfo.LanguageHope = 1;
         }
         if ($scope.UserInfo.ContactHope == undefined || $scope.UserInfo.ContactHope == 0) {
         $scope.UserInfo.ContactHope = 2;
         }
         */
    };

    /**
     * 取消保存基本信息按钮点击
     */
    $scope.btnCancelSaveInfoBase = function () {
        $scope.UserInfo = $scope.UserInfoBk;
        $("#info-show").show();
        $("#info-edit").hide();
        $("#infoeditbutton").show();
    };

    /**
     * 取消保存详细信息按钮点击
     */
    $scope.btnCancelSaveExtraInfoDet = function () {
        $scope.UserInfo = $scope.UserInfoBk;
        $("#extra-show").show();
        $("#extra-edit").hide();
        $("#editbutton").show();
    };

    /**
     * 保存基本信息按钮点击
     */
    $scope.btnSaveInfoBase = function () {
        /*
         if (laGlobalLocalService.CheckStringIsEmpty($scope.UserInfo.SecondNameCn)) {
         bootbox.alert("请输入中文姓");
         return;
         }
         if (laGlobalLocalService.CheckStringIsEmpty($scope.UserInfo.FirstNameCn)) {
         bootbox.alert("请输入中文名");
         return;
         }
         */

        if ($scope.isFoidFull) {
            $("#info-show").show();
            $("#info-edit").hide();
            $("#infoeditbutton").show();
            return;
        }

        var msgInputFoid = "请输入正确的证件号码";
        $scope.UserInfo.IDInfoList = new Array();
        var n = $scope.foIdTypeOptions.length;
        for (var i = 0; i < n; i++) {

            var item = $scope.foIdTypeOptions[i];
            var foidItem = {"Foid": $("#CertNum" + item.v).val(), "FoidType": item.v};

            if (item.v == 1 && !laGlobalLocalService.CheckStringIsEmpty(foidItem.Foid)) {
                if (!laGlobalLocalService.CheckStringLengthRange(foidItem.Foid, 15)) {
                    bootbox.alert(msgInputFoid);
                    return;
                }
                if (!laGlobalLocalService.IdentityCodeValid(foidItem.Foid)) {
                    bootbox.alert(msgInputFoid);
                    return;
                }
            }
            if (item.v == 2 && !laGlobalLocalService.CheckStringIsEmpty(foidItem.Foid)) {
                if (!laGlobalLocalService.CheckPassportFormat(foidItem.Foid)) {
                    bootbox.alert(msgInputFoid);
                    return;
                }
            }

            $scope.UserInfo.IDInfoList.push(foidItem);
        }

        if (laGlobalLocalService.CheckStringIsEmpty($scope.ValidCodeBase)) {
            bootbox.alert("请输入手机验证码");
            return;
        }

        $scope.UserInfo.MobileValidCode = $scope.ValidCodeBase;
        SaveCurrentUserInfo();
    };

    /**
     * 保存详细信息按钮点击
     */
    $scope.btnSaveExtraInfoDet = function () {
        if (!laGlobalLocalService.CheckStringIsEmpty($scope.UserInfo.EMail)) {
            if (!laGlobalLocalService.CheckEMailFormat($scope.UserInfo.EMail)) {
                bootbox.alert("请输入正确的邮箱地址");
                return;
            }
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.ValidCodeDet)) {
            bootbox.alert("请输入手机验证码");
            return;
        }

        $scope.UserInfo.MobileValidCode = $scope.ValidCodeDet;
        SaveCurrentUserInfo();
    };

    $scope.btnSendMobileValidCodeClick = function (objid) {

        laUserService.SendModifyUserInfoMobileCode(function (backData, status) {
            var rs = backData;
            if (rs.Code != laGlobalProperty.laServiceCode_Success) {
                bootbox.alert(rs.Message);
            } else {
                $scope.timeDown = 60;
                var timer = $interval(function () {
                    $("#" + objid).attr("disabled", true);
                    $("#" + objid).addClass('btn-gray');
                    $("#" + objid).val('重新发送(' + $scope.timeDown + ')');
                    $scope.timeDown = $scope.timeDown - 1;
                    if ($scope.timeDown <= 0) {
                        $interval.cancel(timer);
                        $("#" + objid).attr("disabled", false);
                        $("#" + objid).removeClass('btn-gray');
                        $("#" + objid).val('发送验证码');
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

    function SearchFoidByType(foidType) {
        var v = "";
        if ($scope.UserInfo.IDInfoList != null && $scope.UserInfo.IDInfoList != undefined && $scope.UserInfo.IDInfoList != "null") {
            var n = $scope.UserInfo.IDInfoList.length;
            for (var i = 0; i < n; i++) {
                var item = $scope.UserInfo.IDInfoList[i];
                if (item.FoidType == foidType) {
                    v = item.Foid;
                    break;
                }
            }
            if (v == undefined) {
                v = "";
            }
        }
        return v;
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

    /**
     * 查询当前用户信息
     * @constructor
     */
    function QueryCurrentUserInfo() {
        laUserService.GetCurrentUserInfo(function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.UserInfo = rs;
                $scope.UserInfoBk = rs;

                var n = $scope.foIdTypeOptions.length;
                for (var i = 0; i < n; i++) {
                    var item = $scope.foIdTypeOptions[i];
                    var fv = SearchFoidByType(item.v);
                    if (laGlobalLocalService.CheckStringIsEmpty(fv)) {
                        $scope.isFoidFull = false;
                    }
                    document.getElementById("lblCertNum" + item.v).innerHTML = fv;
                    document.getElementById("CertNum" + item.v).value = fv;
                    document.getElementById("CertNumlbl" + item.v).innerHTML = fv;
                    if (fv != undefined && fv != null && fv != "") {
                        document.getElementById("divcertnum" + item.v).style.display = "none";
                    } else {
                        document.getElementById("divcertlbl" + item.v).style.display = "none";
                    }
                }

                var food = $scope.UserInfo.PPMeals;
                var seat = $scope.UserInfo.PPSeats;
                var dis = $scope.UserInfo.PPDiscount;
                var buy = $scope.UserInfo.PPChannel;
                var pay = $scope.UserInfo.PPPaymentMethod;
                var conhope = $scope.UserInfo.ContactHope;

                if (food != undefined && food != null) {
                    var fl = food.split(",");
                    var foodlist = document.getElementsByName("food");
                    for (var i = 0; i < foodlist.length; i++) {
                        for (var n = 0; n < fl.length; n++) {
                            if (fl[n] == foodlist[i].value) {
                                foodlist[i].checked = true;
                                break;
                            }
                        }
                    }
                }
                if (seat != undefined && seat != null) {
                    var sl = seat.split(",");
                    var seatlist = document.getElementsByName("seatreal");
                    for (var i = 0; i < seatlist.length; i++) {
                        for (var n = 0; n < sl.length; n++) {
                            if (sl[n] == seatlist[i].value) {
                                seatlist[i].checked = true;
                                break;
                            }
                        }
                    }
                }
                if (dis != undefined && dis != null) {
                    var dl = dis.split(",");
                    var dislist = document.getElementsByName("seat");
                    for (var i = 0; i < dislist.length; i++) {
                        for (var n = 0; n < dl.length; n++) {
                            if (dl[n] == dislist[i].value) {
                                dislist[i].checked = true;
                                break;
                            }
                        }
                    }
                }
                if (buy != undefined && buy != null) {
                    var bl = buy.split(",");
                    var buylist = document.getElementsByName("buy");
                    for (var i = 0; i < buylist.length; i++) {
                        for (var n = 0; n < bl.length; n++) {
                            if (bl[n] == buylist[i].value) {
                                buylist[i].checked = true;
                                break;
                            }
                        }
                    }
                }
                if (pay != undefined && pay != null) {
                    var pl = pay.split(",");
                    var paylist = document.getElementsByName("pay");
                    for (var i = 0; i < paylist.length; i++) {
                        for (var n = 0; n < pl.length; n++) {
                            if (pl[n] == paylist[i].value) {
                                paylist[i].checked = true;
                                break;
                            }
                        }
                    }
                }
                if (conhope != undefined && conhope != null) {
                    var cl = conhope.split(",");

                    var conhopelist = document.getElementsByName("contacthope");
                    for (var i = 0; i < conhopelist.length; i++) {
                        for (var n = 0; n < cl.length; n++) {
                            if (cl[n] == conhopelist[i].value) {
                                conhopelist[i].checked = true;
                                break;
                            }
                        }
                    }

                    for (var i = 0; i < $scope.contactHopeOptions.length; i++) {
                        for (var n = 0; n < cl.length; n++) {
                            if ($scope.contactHopeOptions[i].v == cl[n]) {
                                $scope.ContactHopeCH += $scope.contactHopeOptions[i].t;
                            }
                        }
                    }
                }

            }
        })
    }

    /**
     * 修改当前用户信息
     * @constructor
     */
    function SaveCurrentUserInfo() {
        //$scope.UserInfo.FoidTypeCH = $("#foIdType").find("option:selected").text();

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
        $scope.UserInfo.PPMeals = food;

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
        $scope.UserInfo.PPSeats = seat;

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
        $scope.UserInfo.PPDiscount = dis;

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
        $scope.UserInfo.PPChannel = buy;

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
        $scope.UserInfo.PPPaymentMethod = pay;

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
        $scope.UserInfo.ContactHope = conhope;

        laUserService.ModifyFrequentUserInfo($scope.UserInfo, function (dataBack, status) {
            var rs = dataBack;
            if (rs.Code != laGlobalProperty.laServiceCode_Success) {
                bootbox.alert("修改会员信息失败:" + rs.Message);
            } else {
                if ($scope.SaveInfoType == 1) {
                    $("#info-show").show();
                    $("#info-edit").hide();
                    $("#infoeditbutton").show();
                } else if ($scope.SaveInfoType == 2) {
                    $("#extra-show").show();
                    $("#extra-edit").hide();
                    $("#editbutton").show();
                }

                QueryCurrentUserInfo();
            }
        });
    }

}]);
