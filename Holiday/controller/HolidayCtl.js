/**
 * Created by jerry on 16/9/12.
 */

laAir.controller('laAir_Holiday_HolidayPageCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "会员假期-长龙航空,长龙航空官网,长龙航空官方网站,特价机票,长龙航空机票预定";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHolidayNav = true;

}]);
