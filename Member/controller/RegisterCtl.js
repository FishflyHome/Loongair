/**
 * Created by Jerry on 16/2/4.
 */

laAir.controller('laAir_MemberRegisterPageCtl', ['$document', '$interval', '$window', '$scope', '$interval', 'laUserService', 'laGlobalLocalService', function ($document, $interval, $window, $scope, $interval, laUserService, laGlobalLocalService) {

    $scope.title = "会员注册";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

    $scope.userInfo = new laEntityUser();

    $scope.timeDown = 60;

    $scope.validMobile = true;
    $scope.validMobileVCode = true;
    $scope.validName = true;
    $scope.validFoid = true;
    $scope.validPwd = true;

    $scope.isRegisting = false;

    $scope.ImageVerifyCode = "";
    $scope.ImgVerifyData;
    $scope.SessionID;

    GetImgVerifyCode();

    $scope.btnChangeVerifyCode = function () {
        GetImgVerifyCode();
    };
    /**
     * 注册
     */
    $scope.btnRegisterClick = function () {

        if (!$scope.checkValidData()) {
            return;
        }

        $scope.isRegisting = true;
        $scope.timeDown = 1;
        laUserService.Register($scope.userInfo.Name, $scope.userInfo.Foid, $scope.userInfo.Password,
            $scope.userInfo.Mobile, $scope.userInfo.MobileValidCode, function (backData, status) {
                var rs = backData;
                $scope.timeDown = 1;
                if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                    var timer = $interval(function () {
                        $scope.timeDown = $scope.timeDown - 1;
                        if ($scope.timeDown <= 0) {
                            $interval.cancel(timer);
                            $scope.isRegisting = false;
                            bootbox.alert('注册成功', function () {
                                $window.location.href = '/B2C/home.html';
                                //自动登录
                                //laUserService.Login($scope.userInfo.Mobile, $scope.userInfo.Password, function (lbackData, lstatus) {});
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

    $scope.checkValidData = function () {
        $scope.validMobile = true;
        $scope.validMobileVCode = true;
        $scope.validName = true;
        $scope.validFoid = true;
        $scope.validPwd = true;

        if (!laGlobalLocalService.CheckStringIsEmpty($scope.userInfo.Foid)) {
            $scope.userInfo.Foid = $scope.userInfo.Foid.toUpperCase();
        }

        if (laGlobalLocalService.CheckStringIsEmpty($scope.userInfo.Mobile) || !laGlobalLocalService.CheckStringLength($scope.userInfo.Mobile, 11)) {
            $scope.validMobile = false;
            return false;
        }

        if (laGlobalLocalService.CheckStringIsEmpty($scope.userInfo.MobileValidCode)) {
            $scope.validMobileVCode = false;
            return false;
        }

        if (laGlobalLocalService.CheckStringIsEmpty($scope.userInfo.Name)) {
            $scope.validName = false;
            return false;
        }

        if (laGlobalLocalService.CheckStringIsEmpty($scope.userInfo.Foid)) {
            $scope.validFoid = false;
            return false;
        }
        if (!laGlobalLocalService.IdentityCodeValid($scope.userInfo.Foid)) {
            $scope.validFoid = false;
            return false;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.userInfo.Password) || !laGlobalLocalService.CheckStringLengthRange($scope.userInfo.Password, 6)) {
            $scope.validPwd = false;
            return false;
        }
        if ($scope.userInfo.Password != $scope.userInfo.ConPassword) {
            $scope.validPwd = false;
            return false;
        }
        return true;
    };

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
}]);
