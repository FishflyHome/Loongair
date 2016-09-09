/**
 * Created by Jerry on 16/3/4.
 */

laAir.controller('laAir_MemberMyMileagePageCtl', ['$document', '$window', '$scope', 'laUserService', 'laGlobalLocalService', function ($document, $window, $scope, laUserService, laGlobalLocalService) {

    $scope.title = "我的里程";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isMyInfoNav = true;

    $scope.isMem_MyMileage = true;

}]);
