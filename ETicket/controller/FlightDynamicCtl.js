/**
 * Created by Jerry on 16/3/9.
 */

laAir.controller('laAir_ETicket_FlightDynamicPageCtl', ['$document', '$filter', '$window', '$scope', 'laUserService', 'laFlightService', 'laGlobalLocalService', function ($document, $filter, $window, $scope, laUserService, laFlightService, laGlobalLocalService) {

    $scope.title = "航班动态";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isSchTripNav = true;

    $scope.Param = {"C1": "", "C2": "", "T": "", "F": "", "Q": ""};
    $scope.FliDynamic;

    var curHref = $window.location.href.split('?');
    if (curHref.length >= 2) {
        var params = curHref[1].split('&');
        for (var i = 0; i < params.length; i++) {
            var param = params[i].split('=');
            if (param.length >= 2) {
                if (param[0].toLowerCase() == "param") {
                    try {
                        $scope.Param = JSON.parse(new Base64().decode(params[i].substr(6)));
                    } catch (e) {

                    }

                    break;
                }
                /*
                if (param[0].toLowerCase() == 'c1') {
                    $scope.Param.C1 = param[1];
                }
                if (param[0].toLowerCase() == 'c2') {
                    $scope.Param.C2 = param[1];
                }
                if (param[0].toLowerCase() == 't') {
                    $scope.Param.T = param[1];
                }
                if (param[0].toLowerCase() == 'f') {
                    $scope.Param.F = param[1];
                }
                if (param[0].toLowerCase() == 'q') {
                    $scope.Param.Q = param[1];
                }
                */
            }
        }
    }

    if ($scope.Param != undefined && $scope.Param != null) {
        QueryFlightDynamic();
    }

    /**
     * 查询订单信息-未登录状态
     * @param ordId
     * @param mobile
     * @param verifycode
     * @param sessionId
     */
    function QueryFlightDynamic() {
        var p = $scope.Param;
        laFlightService.QueryFlightDynamic(p.C1, p.C2, p.T, p.F, p.Q, function (dataBack, status) {
            $scope.FliDynamic = dataBack;
            if ($scope.FliDynamic.Code == laGlobalProperty.laServiceCode_Success && $scope.FliDynamic.DynamicsResultInfo.length > 0) {
                $("#flidynamicInfo").css("display", "block");
            } else {
                $("#noflidynamicInfo").css("display", "block");
            }
        });
    }

}]);
