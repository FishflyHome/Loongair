/**
 * Created by Jerry on 16/2/16.
 */

laAir.controller('laAir_MemberChangePwdPageCtl', ['$document', '$interval', '$window', '$scope', 'laUserService', 'laGlobalLocalService', function ($document, $interval, $window, $scope, laUserService, laGlobalLocalService) {

    $scope.title = "修改密码";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isMyInfoNav = true;

    $scope.isMem_ChangePwd = true;

    //当前用户信息
    $scope.UserInfo;

    $scope.oldPwd;
    $scope.newPwd;
    $scope.newConPwd;

    $scope.oldPwdValid = true;
    $scope.newPwdValid = true;
    $scope.newConPwdValid = true;

    $scope.isSaving = false;

    var timer;

    QueryCurrentUserInfo();

    $scope.btnChangePwdClick = function () {
        $scope.oldPwdValid = true;
        $scope.newPwdValid = true;
        $scope.newConPwdValid = true;
        if (laGlobalLocalService.CheckStringIsEmpty($scope.oldPwd)) {
            $scope.oldPwdValid = false;
            return;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.newPwd) || !laGlobalLocalService.CheckStringLengthRange($scope.newPwd, 6)) {
            $scope.newPwdValid = false;
            return;
        }
        if ($scope.newPwd != $scope.newConPwd) {
            $scope.newConPwdValid = false;
            return;
        }

        $scope.isSaving = true;
        $scope.timeDown = 1;
        laUserService.ChangeUserPassword($scope.oldPwd, $scope.newPwd, function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                timer = $interval(function () {
                    $scope.timeDown = $scope.timeDown - 1;
                    if ($scope.timeDown <= 0) {
                        $interval.cancel(timer);
                        $scope.isSaving = false;
                        $scope.oldPwd = '';
                        $scope.newPwd = '';
                        $scope.newConPwd = '';
                        bootbox.alert('密码修改成功');
                    }
                }, 1000);

            } else {
                timer = $interval(function () {
                    $scope.timeDown = $scope.timeDown - 1;
                    if ($scope.timeDown <= 0) {
                        $interval.cancel(timer);
                        $scope.isSaving = false;
                        bootbox.alert(rs.Message);
                    }
                }, 1000);

            }
        })
    };

    function QueryCurrentUserInfo() {
        laUserService.GetCurrentUserInfo(function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.UserInfo = rs;
            }
        })
    }

}]);
