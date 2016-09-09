/**
 * Created by Jerry on 16/7/4.
 */

laAir.controller('laAir_MemberETicketsDetailPageCtl', ['$interval', '$document', '$window', '$scope', 'laUserService', 'laGlobalLocalService', function ($interval, $document, $window, $scope, laUserService, laGlobalLocalService) {

    $scope.title = "电子券消费明细查询";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isMyInfoNav = true;

    $scope.isMem_ETicketsDetail = true;

    $scope.is_ETicket_Submenu = "block";

}]);

