/**
 * Created by Jerry on 16/2/4.
 */

laAir.controller('laAir_MemberLoginPageCtl', ['$document', '$window', '$scope', 'laUserService', 'laGlobalLocalService', function ($document, $window, $scope, laUserService, laGlobalLocalService) {

    $scope.title = "会员登录";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

    $scope.loginId;
    $scope.password;
    $scope.isAutoLogin = false;

    //大图列表
    $scope.IndexImageList;
    laUserService.QueryIndexImageList(function (dataBack, status) {
        $scope.IndexImageList = dataBack;
    });

    var isAutoLogin = laGlobalLocalService.getCookie(laGlobalProperty.laServiceConst_TransData_isAutoLogin);
    if (isAutoLogin == "true" || isAutoLogin == true) {
        $scope.isAutoLogin = true;
    }

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

                    var backUrl = laGlobalLocalService.getCookie(laGlobalProperty.laServiceConst_TransData_BackUrl);
                    if (backUrl != undefined) {
                        if (backUrl.toLowerCase().indexOf('/member/login.html', 0) >= 0) {
                            $window.location.href = '/B2C/home.html';
                        } else {
                            $window.location.href = backUrl;
                        }
                    } else {
                        $window.location.href = '/B2C/home.html';
                    }
                } else {
                    bootbox.alert(rs.Message);
                }
            });
        } else {
            bootbox.alert('请输入手机号和登录密码');
        }
    }

}]);