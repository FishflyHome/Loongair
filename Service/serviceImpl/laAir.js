/**
 * Created by Jerry on 16/2/4.
 */

var laAir = angular.module('laAir', ['laUser', 'laOrder', 'laGlobal']);

laAir.run(function ($interval, $rootScope, $window, laUserService, laGlobalLocalService) {

    var curHref = $window.location.href;
    var curHrefLow = curHref.toLowerCase();

    $rootScope.isLogined = false;
    $rootScope.isLoginedData;

    laUserService.CheckLogin(function (dataBack, isLogined) {
        $rootScope.isLoginedData = dataBack;
        $rootScope.isLogined = isLogined;
        if (!isLogined) {
            //自动登录
            var isAutoLogin = laGlobalLocalService.getCookie(laGlobalProperty.laServiceConst_TransData_isAutoLogin);
            var loginId = laGlobalLocalService.getCookie(laGlobalProperty.laServiceConst_TransData_AutoLoginId);
            var pwd = laGlobalLocalService.getCookie(laGlobalProperty.laServiceConst_TransData_AutoLoginPwd);
            if (isAutoLogin == "true" || isAutoLogin == true) {
                if (loginId != undefined && pwd != undefined) {
                    laUserService.Login(loginId, pwd, '', function (lbackData, status) {
                        //if (lbackData.Code == laGlobalProperty.laServiceCode_Success) {
                        //}
                        $rootScope.isLoginedData = lbackData;
                        $rootScope.isLogined = status;
                        $rootScope.$broadcast("loginCheckCom", {
                            "d": $rootScope.isLoginedData,
                            "l": $rootScope.isLogined
                        });
                    });
                }
            }
        } else {
            $rootScope.$broadcast("loginCheckCom", {"d": $rootScope.isLoginedData, "l": $rootScope.isLogined});
        }
    });

    var NeedRememberUrl = true;
    var unNeedRememberBackUrl = new Array("/Login.", "/Register.", "/ForgetPassword.");
    for (var i = 0; i < unNeedRememberBackUrl.length; i++) {
        if (curHrefLow.indexOf(unNeedRememberBackUrl[i].toLowerCase(), 0) >= 0) {
            NeedRememberUrl = false;
            break;
        }
    }
    if (NeedRememberUrl){
        laGlobalLocalService.writeCookie(laGlobalProperty.laServiceConst_TransData_BackUrl, curHref, 0);
    }

    if (curHrefLow.indexOf('/member/', 0) > 0) {//检查用户中心类权限

        var isNeedCheckMember = true;
        var unCheckUserRight_Member = new Array("/ForgetPassword.", "/Login.", "/Register.", "/OnlineCheckin.", "/CheckinList.", "/Club.");
        for (var i = 0; i < unCheckUserRight_Member.length; i++) {
            if (curHrefLow.indexOf(unCheckUserRight_Member[i].toLowerCase(), 0) >= 0) {
                isNeedCheckMember = false;
                break;
            }
        }
        if (isNeedCheckMember) {
            var islogined = false;
            laUserService.CheckLogin(function (dataBack, isLogined) {
                islogined = isLogined;
                if (islogined) {
                    $rootScope.isLoginedData = dataBack;
                    $rootScope.isLogined = true;
                    $rootScope.$broadcast("loginCheckCom", {"d": $rootScope.isLoginedData, "l": $rootScope.isLogined});
                } else {
                    laGlobalLocalService.writeCookie(laGlobalProperty.laServiceConst_TransData_BackUrl, curHref, 0);
                    $window.location.href = '/Member/Login.html';
                }
            });
        }
    } else if (curHrefLow.indexOf('/eticket/', 0) > 0) { //检查ETicket类权限
        var isNeedCheckETicket = false;
        var CheckUserRight_ETicket = new Array("/BookingOrder.", "/TransOrder.", "/TransAirlineList.", "/TransBookingOrder.");//"/OrderDetail.", "/RefundOrder."
        for (var i = 0; i < CheckUserRight_ETicket.length; i++) {
            if (curHrefLow.indexOf(CheckUserRight_ETicket[i].toLowerCase(), 0) >= 0) {
                isNeedCheckETicket = true;
                break;
            }
        }
        if (isNeedCheckETicket) {
            var islogined = false;
            laUserService.CheckLogin(function (dataBack, isLogined) {
                islogined = isLogined;
                if (islogined) {
                    $rootScope.isLoginedData = dataBack;
                    $rootScope.isLogined = true;
                    $rootScope.$broadcast("loginCheckCom", {"d": $rootScope.isLoginedData, "l": $rootScope.isLogined});
                } else {
                    laGlobalLocalService.writeCookie(laGlobalProperty.laServiceConst_TransData_BackUrl, curHref, 0);
                    $window.location.href = '/Member/Login.html';
                }
            });
        }
    }

});

/**
 * 会员中心左边菜单Ctl
 */
laAir.controller('laAir_Member_LeftMenuCtl', ['$rootScope', '$scope', '$window', 'laUserService', 'laGlobalLocalService', function ($rootScope, $scope, $window, laUserService, laGlobalLocalService) {

    $scope.IsFrequentPassenger = false;
    laUserService.CheckLogin(function (dataBack, isLogined) {
        $scope.IsFrequentPassenger = dataBack.IsFrequentPassenger;
        $scope.$emit("MemberContentPage", {"IsFrequentPassenger": $scope.IsFrequentPassenger});
    });

}]);

/**
 * 网站页头Ctl
 */
laAir.controller('laAir_CommonHtmlHeaderCtl', ['$rootScope', '$scope', '$window', 'laUserService', 'laGlobalLocalService', function ($rootScope, $scope, $window, laUserService, laGlobalLocalService) {

    $scope.userInfo_C;
    $scope.UserLogined = false;
    $scope.IsFrequentPassenger = false;
    $scope.$on("loginCheckCom", function (e, data) {
        $scope.userInfo_C = data.d;
        $scope.UserLogined = data.l;
    });

    if (!$scope.UserLogined) {
        laUserService.CheckLogin(function (dataBack, isLogined) {
            $scope.userInfo_C = dataBack;
            $scope.UserLogined = isLogined;
        });
    }

    $scope.btnUserLogoutClick = function () {

        bootbox.confirm("您是否要退出?", function (result) {
            if (result) {
                laUserService.UserLogOut(function (backData, status) {
                    var rs = backData;
                    if (rs.Code == laGlobalProperty.laServiceCode_Success) {

                        $scope.UserLogined = false;
                        $scope.userInfo_C = null;

                        laGlobalLocalService.writeCookie(laGlobalProperty.laServiceConst_TransData_AutoLoginId, undefined, 1);
                        laGlobalLocalService.writeCookie(laGlobalProperty.laServiceConst_TransData_AutoLoginPwd, undefined, 1);

                        $window.location.href = $window.location.href;
                    }
                });
            }
        });
    };

    $scope.btnMyOrderClick = function () {
        laGlobalLocalService.writeCookie(laGlobalProperty.laServiceConst_TransData_BackUrl, '/Member/OrderList.html', 0);
        $window.location.href = '/Member/Login.html';
    };
}]);

/**
 * 网站页尾Ctl
 */
laAir.controller('laAir_CommonHtmlFooterCtl', ['$rootScope', '$scope', '$window', 'laUserService', 'laGlobalLocalService', function ($rootScope, $scope, $window, laUserService, laGlobalLocalService) {

    $scope.AirplaneMenuList = laMapMenu_Airplane;

}]);
