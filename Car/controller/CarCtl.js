/**
 * Created by Jerry on 16/2/25.
 */

laAir.controller('laAir_Car_CarPageCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "用车-长龙航空,长龙航空官网,长龙航空官方网站,特价机票,长龙航空机票预定";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isCarReserveNav = true;

}]);