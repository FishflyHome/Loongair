/**
 * Created by Jerry on 16/2/23.
 */

laAir.controller('laAir_AirPlane_SuperEconomyClassPageCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "超级经济舱";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

}]);

laAir.controller('laAir_AirPlane_EconomyClassPageCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "超级经济舱";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

}]);

laAir.controller('laAir_AirPlane_EntertainmentPageCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "机上娱乐";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

}]);

laAir.controller('laAir_AirPlane_MealsPageCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "机上娱乐";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

}]);