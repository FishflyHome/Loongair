/**
 * Created by Jerry on 16/7/4.
 */

laAir.controller('laAir_MemberPointsPageCtl', ['$filter', '$interval', '$document', '$window', '$scope', 'laUserService', 'laGlobalLocalService', function ($filter, $interval, $document, $window, $scope, laUserService, laGlobalLocalService) {

    $scope.title = "会员积分";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isMyInfoNav = true;

    $scope.isMem_Points = true;

    var today = new Date();
    $scope.endTime = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.startTime = $filter('date')(new Date(today.setDate(today.getDate() - 180)), 'yyyy-MM-dd');
    $scope.approved;

    $scope.PointsList;

    QueryPointsList();


    function QueryPointsList(){
        laUserService.QueryPointsList($scope.startTime, $scope.endTime, $scope.approved, function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.PointsList = rs;
            }
        })
    }

}]);

