/**
 * Created by Jerry on 16/7/4.
 */

laAir.controller('laAir_MemberMallPageCtl', ['$interval', '$document', '$window', '$scope', 'laUserService', 'laGlobalLocalService', function ($interval, $document, $window, $scope, laUserService, laGlobalLocalService) {

    $scope.$on("MemberContentPage", function (event, data) {
        var IsFrequentPassenger = data.IsFrequentPassenger;
        if (!IsFrequentPassenger) {
            $window.location.href = "MyInfo.html";
        }
    });

    $scope.title = "积分商城";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isMyInfoNav = true;

    $scope.isMem_Mall = true;

}]);
