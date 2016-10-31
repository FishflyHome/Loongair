/**
 * Created by Jerry on 16/5/11.
 */

laAir.controller('laAir_Transport_PassengerInfoCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "运输旅客须知";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isTravelNav = true;

    $scope.menuList = laMapMenu_Transport;
    $scope.menuListPsgSvr = laMapMenu_PassengerSvr;

    $scope.is_Transport_ClassFlag = "Passenger";

}]);

laAir.controller('laAir_Transport_OverbookingCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "超售公示说明";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isTravelNav = true;

    $scope.menuList = laMapMenu_Transport;
    $scope.menuListPsgSvr = laMapMenu_PassengerSvr;

    $scope.is_Transport_ClassFlag = "overbooking";

}]);

laAir.controller('laAir_Transport_RuleCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "国内运输总条件";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isTravelNav = true;

    $scope.menuList = laMapMenu_Transport;
    $scope.menuListPsgSvr = laMapMenu_PassengerSvr;

    $scope.is_Transport_ClassFlag = "rule";

}]);

laAir.controller('laAir_Transport_RuleIntelCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "国际运输总条件";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isTravelNav = true;

    $scope.menuList = laMapMenu_Transport;
    $scope.menuListPsgSvr = laMapMenu_PassengerSvr;

    $scope.is_Transport_ClassFlag = "ruleintel";

}]);

laAir.controller('laAir_Transport_RuleIntelEnCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "国际运输总条件";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isTravelNav = true;

    $scope.menuList = laMapMenu_Transport;
    $scope.menuListPsgSvr = laMapMenu_PassengerSvr;

    $scope.is_Transport_ClassFlag = "ruleintelen";

}]);
