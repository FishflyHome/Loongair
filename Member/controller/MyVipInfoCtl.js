/**
 * Created by Jerry on 16/7/4.
 */

laAir.controller('laAir_MemberMyVipInfoPageCtl', ['$interval', '$document', '$window', '$scope', 'laUserService', 'laGlobalLocalService', function ($interval, $document, $window, $scope, laUserService, laGlobalLocalService) {

    $scope.title = "我的信息";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isMyInfoNav = true;

    $scope.isMem_MyInfo = true;

    $scope.foIdTypeOptions = laEntityEnumfoIdTypeOptions;
    $scope.nativeOptions = laEntityEnumnationaityOptions;
    $scope.jobOptions = laEntityEnumjob;
    $scope.positionOptions = laEntityEnumjobPosition;
    $scope.languageOptions = laEntityEnumlanguageHope;

    $scope.ValidCodeBase = "";
    $scope.ValidCodeDet = "";

    $scope.SaveInfoType;

    $scope.UserInfo;
    $scope.UserInfoBk;

    QueryCurrentUserInfo();

    $("#li_detinfo_foid").css({"height": $scope.foIdTypeOptions.length * 32});

    /**
     * 修改基本信息按钮点击
     */
    $scope.btnModiBaseInfo = function () {
        $("#info-show").hide();
        $("#info-edit").show();
        $("#infoeditbutton").hide();

        $scope.SaveInfoType = 1;

        $scope.UserInfoBk = $scope.UserInfo;

        if ($scope.UserInfo.Sex == undefined || $scope.UserInfo.Sex == 0) {
            $scope.UserInfo.Sex = 1;
        }
    };

    /**
     * 修改详细信息按钮点击
     */
    $scope.btnModiDetailInfo = function () {
        $("#extra-show").hide();
        $("#extra-edit").show();
        $("#editbutton").hide();

        $scope.SaveInfoType = 2;

        $scope.UserInfoBk = $scope.UserInfo;

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
        if (laGlobalLocalService.CheckStringIsEmpty($scope.UserInfo.SecondNameCn)) {
            bootbox.alert("请输入中文姓");
            return;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.UserInfo.FirstNameCn)) {
            bootbox.alert("请输入中文名");
            return;
        }
        var msgInputFoid = "请输入正确的证件号码";
        if ($scope.UserInfo.FoidType == 1 && !laGlobalLocalService.CheckStringIsEmpty($scope.UserInfo.Foid)) {
            if (!laGlobalLocalService.CheckStringLengthRange($scope.UserInfo.Foid, 15)) {
                bootbox.alert(msgInputFoid);
                return;
            }
            if (!laGlobalLocalService.IdentityCodeValid($scope.UserInfo.Foid)) {
                bootbox.alert(msgInputFoid);
                return;
            }
        }
        if ($scope.UserInfo.FoidType == 2 && !laGlobalLocalService.CheckStringIsEmpty($scope.UserInfo.Foid)) {
            if (!laGlobalLocalService.CheckPassportFormat($scope.UserInfo.Foid)) {
                bootbox.alert(msgInputFoid);
                return;
            }
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

    /**
     * 查询当前用户信息
     * @constructor
     */
    function QueryCurrentUserInfo() {
        laUserService.GetCurrentUserInfo(function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.UserInfo = rs;
            }
        })
    }

    /**
     * 修改当前用户信息
     * @constructor
     */
    function SaveCurrentUserInfo() {
        //$scope.UserInfo.FoidTypeCH = $("#foIdType").find("option:selected").text();

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
            }
        });
    }

}]);
