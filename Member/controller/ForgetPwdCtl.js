/**
 * Created by Jerry on 16/2/4.
 */

laAir.controller('laAir_MemberForgetPwdPageCtl', ['$document', '$window', '$scope', '$interval', 'laUserService', 'laGlobalLocalService', function ($document, $window, $scope, $interval, laUserService, laGlobalLocalService) {

    $scope.title = "找回密码";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

    $scope.mobile = '';
    $scope.mobileValidCode = '';
    $scope.foid = '';
    $scope.newPwd = '';
    $scope.newConPwd = '';

    $scope.mobileValid = true;
    $scope.foidValid = true;
    $scope.mobcodeValid = true;
    $scope.newpwdValid = true;
    $scope.newpwdconValid = true;

    $scope.isSaving = false;

    /**
     * 发送验证码
     */
    $scope.btnSendMobileValidCodeClick = function () {

        $scope.mobileValid = true;
        $scope.foidValid = true;
        if (laGlobalLocalService.CheckStringIsEmpty($scope.mobile) || !laGlobalLocalService.CheckStringLength($scope.mobile, 11)) {
            $scope.mobileValid = false;
            return;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.foid)) {
            $scope.foidValid = false;
            return;
        }
        laUserService.SendFindPasswordMobileCode($scope.mobile, $scope.foid, '', function (backData, status) {
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

    /**
     * 找回密码
     */
    $scope.btnFindPwdClick = function () {
        $scope.mobileValid = true;
        $scope.foidValid = true;
        $scope.mobcodeValid = true;
        $scope.newpwdValid = true;
        $scope.newpwdconValid = true;

        if (laGlobalLocalService.CheckStringIsEmpty($scope.mobile) || !laGlobalLocalService.CheckStringLength($scope.mobile, 11)) {
            $scope.mobileValid = false;
            return;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.foid)) {
            $scope.foidValid = false;
            return;
        }
        /**
        if (!laGlobalLocalService.IdentityCodeValid($scope.foid)) {
            $scope.foidValid = false;
            return;
        }
         */
        if (laGlobalLocalService.CheckStringIsEmpty($scope.mobileValidCode)) {
            $scope.mobcodeValid = false;
            return;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.newPwd) || !laGlobalLocalService.CheckStringLengthRange($scope.newPwd, 6)) {
            $scope.newpwdValid = false;
            return;
        }
        if (!laGlobalLocalService.CheckPassWord($scope.newPwd)){
            $scope.newPwdValid = false;
            return false;
        }
        if ($scope.newPwd != $scope.newConPwd) {
            $scope.newpwdconValid = false;
            return;
        }

        $scope.isSaving = true;
        $scope.timeDown = 1;
        laUserService.FindLoginPassword($scope.mobile, $scope.foid, $scope.newPwd, $scope.mobileValidCode, function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                var timer = $interval(function () {
                    $scope.timeDown = $scope.timeDown - 1;
                    if ($scope.timeDown <= 0) {
                        $interval.cancel(timer);
                        $scope.isSaving = false;
                        bootbox.alert('密码成功找回', function () {
                            $window.location.href = '/Member/Login.html';
                        });
                    }
                }, 1000);
            } else {
                var timer = $interval(function () {
                    $scope.timeDown = $scope.timeDown - 1;
                    if ($scope.timeDown <= 0) {
                        $interval.cancel(timer);
                        $scope.isSaving = false;
                        bootbox.alert('密码找回失败:' + rs.Message);
                    }
                }, 1000);

            }
        })
    };

}]);
