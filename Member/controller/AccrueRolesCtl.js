/**
 * Created by Jerry on 16/7/4.
 */

laAir.controller('laAir_MemberAccrueRolesPageCtl', ['$interval', '$document', '$window', '$scope', 'laUserService', 'laGlobalLocalService', function ($interval, $document, $window, $scope, laUserService, laGlobalLocalService) {

    $scope.title = "累积规则";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isMyInfoNav = true;

    $scope.isMem_AccrueRoles = true;

}]);
