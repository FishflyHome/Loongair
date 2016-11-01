/**
 * Created by Jerry on 16/2/25.
 */

laAir.controller('laAir_Info_Travelnotes_TravelnotesPageCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "旅客购票及旅行须知";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isInfoSvrNav = true;

    $scope.menuListRule = laMapMenu_Rule;
    $scope.menuListDCP = laMapMenu_DCP;
    $scope.menuList = laMapMenu_Transport;
    $scope.menuListPsgSvr = laMapMenu_PassengerSvr;

    $scope.is_Transport_ClassFlag = "Travelnotes";
}]);

laAir.controller('laAir_Info_Travelnotes_SpecialPsgPageCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "特殊旅客运输须知";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isInfoSvrNav = true;

    $scope.menuListRule = laMapMenu_Rule;
    $scope.menuListDCP = laMapMenu_DCP;
    $scope.menuList = laMapMenu_Transport;
    $scope.menuListPsgSvr = laMapMenu_PassengerSvr;

    $scope.is_Transport_ClassFlag = "SpecialPassenger";

}]);

laAir.controller('laAir_Info_Travelnotes_PassengerPageCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "运输旅客须知";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isInfoSvrNav = true;

    $scope.menuListRule = laMapMenu_Rule;
    $scope.menuListDCP = laMapMenu_DCP;
    $scope.menuList = laMapMenu_Transport;
    $scope.menuListPsgSvr = laMapMenu_PassengerSvr;
    $scope.is_Transport_ClassFlag = "Passenger";

}]);
