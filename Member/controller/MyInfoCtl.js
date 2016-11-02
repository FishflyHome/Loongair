/**
 * Created by Jerry on 16/2/16.
 */
laAir.controller('laAir_MemberMyInfoPageCtl', ['$interval', '$document', '$window', '$scope', 'laUserService', 'laGlobalLocalService', function ($interval, $document, $window, $scope, laUserService, laGlobalLocalService) {

    $scope.$on("MemberContentPage", function (event, data) {
        var IsFrequentPassenger = data.IsFrequentPassenger;
        if (IsFrequentPassenger) {
            $window.location.href = "MyVipInfo.html";
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

    $scope.foIdTypeOptions = laEntityEnumfoIdTypeOptions;

    //当前用户信息
    $scope.UserInfo;
    $scope.UserInfoStr;

    $scope.ValidCode = "";

    QueryCurrentUserInfo();

    $scope.btnShowEditUserInfoClick = function () {
        $("#div_userInfoModi").css("display", "block");
        $("#div_userInfo").css("display", "none");

        $scope.ValidCode = "";
        if (laGlobalLocalService.CheckStringIsEmpty($scope.UserInfo.FoidType)) {
            $scope.UserInfo.FoidType = 1;
        }
    };
    $scope.btnShowEditUserInfoCancelClick = function () {
        $("#div_userInfoModi").css("display", "none");
        $("#div_userInfo").css("display", "block");
        $scope.UserInfo = JSON.parse(new Base64().decode($scope.UserInfoStr));
    };
    $scope.btnShowEditUserInfoSaveClick = function () {
        if (laGlobalLocalService.CheckStringIsEmpty($scope.ValidCode)) {
            bootbox.alert("请输入手机验证码");
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

        if (!laGlobalLocalService.CheckStringIsEmpty($scope.UserInfo.EMail)) {
            if (!laGlobalLocalService.CheckEMailFormat($scope.UserInfo.EMail)) {
                bootbox.alert("请输入正确的邮箱地址");
                return;
            }
        }

        $scope.UserInfo.Brithday = $("#brithday").val();
        var u = {
            "Foid": $scope.UserInfo.Foid,
            "FoidType": $scope.UserInfo.FoidType,
            "Brithday": $scope.UserInfo.Brithday,
            "Address": $scope.UserInfo.Address,
            "Email": $scope.UserInfo.EMail,
            "ValidCode": $scope.ValidCode
        };
        $scope.UserInfo.FoidTypeCH = $("#foIdType").find("option:selected").text();

        laUserService.ModifyUserInfo(u, function (dataBack, status) {
            var rs = dataBack;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $("#div_userInfoModi").css("display", "none");
                $("#div_userInfo").css("display", "block");
            } else {
                bootbox.alert("修改会员信息失败:" + rs.Message);
            }
        });


    };

    $scope.btnSendMobileValidCodeClick = function () {

        laUserService.SendModifyUserInfoMobileCode(function (backData, status) {
            var rs = backData;
            if (rs.Code != laGlobalProperty.laServiceCode_Success) {
                bootbox.alert(rs.Message);
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

    $scope.IdentityChange = function () {
        $scope.UserInfo.Foid = $scope.UserInfo.Foid.toUpperCase();
        if ($scope.UserInfo.FoidType == 1) {
            $scope.UserInfo.Brithday = laGlobalLocalService.ParseBirthdayByIdCode($scope.UserInfo.Foid);
        }
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
                $scope.UserInfoStr = new Base64().encode(JSON.stringify(rs));
            }
        })
    }

}]);