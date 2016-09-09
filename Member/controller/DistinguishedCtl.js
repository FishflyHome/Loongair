/**
 * Created by jerry on 16/8/16.
 */

laAir.controller('laAir_MemberDistinguishedPageCtl', ['$interval', '$document', '$window', '$scope', 'laUserService', 'laGlobalLocalService', function ($interval, $document, $window, $scope, laUserService, laGlobalLocalService) {

    $scope.$on("MemberContentPage", function (event, data) {
        var IsFrequentPassenger = data.IsFrequentPassenger;
        if (!IsFrequentPassenger) {
            $window.location.href = "MyInfo.html";
        }
    });

    $scope.title = "贵宾尊享";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isMyInfoNav = true;

    $scope.isMem_Distinguished = true;

}]);
