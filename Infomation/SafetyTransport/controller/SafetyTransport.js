/**
 * Created by Jerry on 16/2/25.
 */

laAir.controller('laAir_Info_Safety_DangerousGoodsPageCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "危险品运输规定";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isInfoSvrNav = true;

}]);

laAir.controller('laAir_Info_Safety_LithiumBatteryPageCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "长龙航空锂电池乘机须知";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isInfoSvrNav = true;

}]);

laAir.controller('laAir_Info_Safety_SafetyTransportPageCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "安全运输须知";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isInfoSvrNav = true;

}]);
