/**
 * Created by Jerry on 16/2/25.
 */

/**
 * Created by Jerry on 16/2/25.
 */

laAir.controller('laAir_Infomation_IndexPageCtl', ['$window', '$document', '$scope', function ($window, $document, $scope) {

    $scope.title = "旅客服务-长龙航空,长龙航空官网,长龙航空官方网站,特价机票,长龙航空机票预定";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isTravelNav = true;

	$scope.menuListRule = laMapMenu_Rule;
	$scope.menuListDCP = laMapMenu_DCP;
    $scope.menuList = laMapMenu_Transport;
    $scope.menuListPsgSvr = laMapMenu_PassengerSvr;

    var curHref = $window.location.href.split('?');
    if (curHref.length >= 2) {
        var params = curHref[1].split('&');
        for (var i = 0; i < params.length; i++) {
            var param = params[i].split('=');
            if (param.length >= 2) {
                if (param[0].toLowerCase() == 'index') {
                    $scope.ShowIndex = parseInt(param[1]);
                    break;
                }
            }
        }
    } else {
        $scope.ShowIndex = 1;
    }
    $("#content" + $scope.ShowIndex).css("display", "block");

    $scope.is_Transport_ClassFlag = $scope.ShowIndex;

    $scope.btnShowContent = function (idx) {
        $("#content" + idx).css("display", "block");
        $scope.ShowIndex = idx;

    }

}]);
