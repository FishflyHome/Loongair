/**
 * Created by Jerry on 16/7/15.
 */

laAir.controller('laAir_Member_ClubPageCtl', ['$document', '$window', '$scope', 'laUserService', 'laGlobalLocalService', function ($document, $window, $scope, laUserService, laGlobalLocalService) {

    $scope.title = "会员俱乐部";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isClubNav = true;

    $scope.loginId;
    $scope.password;
    $scope.isAutoLogin = false;

    $scope.isLogined = false;

    laUserService.CheckLogin(function (dataBack, isLogined) {
        $scope.isLogined = isLogined;
    });

    //大图列表
    $scope.IndexImageList;
    laUserService.QueryIndexImageList(function (dataBack, status) {
        $scope.IndexImageList = dataBack;
    });

    $scope.LoginByPressEnterKey = function (e, l, p) {
        var keyCode = $window.event ? e.keyCode : e.which;
        if (keyCode == 13) {
            $scope.btnLoginClick(l, p);
        }
    };

    /**
     *
     * @param l 登录名
     * @param p 密码
     */
    $scope.btnLoginClick = function (l, p) {
        if (!laGlobalLocalService.CheckStringIsEmpty(l) && !laGlobalLocalService.CheckStringIsEmpty(p)) {
            laUserService.Login(l, p, '', function (backData, status) {
                var rs = backData;
                if (rs.Code == laGlobalProperty.laServiceCode_Success && status == true) {

                    laGlobalLocalService.writeCookie(laGlobalProperty.laServiceConst_TransData_isAutoLogin, $scope.isAutoLogin, 14);
                    if ($scope.isAutoLogin) {
                        laGlobalLocalService.writeCookie(laGlobalProperty.laServiceConst_TransData_AutoLoginId, l, 14);
                        laGlobalLocalService.writeCookie(laGlobalProperty.laServiceConst_TransData_AutoLoginPwd, p, 14);
                    }

                    $scope.isLogined = true;
                    laUserService.CheckLogin(function (dataBack, isLogined) {
                        if (isLogined) {
                            $scope.$broadcast("loginCheckCom", {"d": dataBack, "l": true});
                        }
                    });
                } else {
                    $scope.isLogined = false;
                    bootbox.alert(rs.Message);
                }
            });
        } else {
            bootbox.alert('请输入手机号和登录密码');
        }
    }

}]);