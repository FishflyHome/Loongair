/**
 * Created by jerry on 16/9/12.
 */

laAir.controller('laAir_ETicket_CheckinPageCtl', ['$window', '$document', '$scope', 'laUserService', 'laGlobalLocalService', function ($window, $document, $scope, laUserService, laGlobalLocalService) {

    $scope.title = "办理值机";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isSchTripNav = true;

    $scope.CheckinTypeOptions = laEntityEnumfoIdTypeForCheckinOptions;
    $scope.QueryCheckinInfo = {"Foid": "", "PassengerName": ""};

    $scope.btnOnlineCheckInClick = function () {
        if (laGlobalLocalService.CheckStringIsEmpty($scope.QueryCheckinInfo.Foid)) {
            bootbox.alert('请输入身份证号/护照号/票号');
            return;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.QueryCheckinInfo.PassengerName)) {
            bootbox.alert('请输入乘客姓名');
            return;
        }

        laUserService.QueryPassengerTravel($scope.QueryCheckinInfo.Foid, $scope.QueryCheckinInfo.PassengerName,
            function (backData, status) {
                if (backData.Code != laGlobalProperty.laServiceCode_Success) {
                    bootbox.alert(backData.Message);
                    return;
                } else {
                    $window.location.href = "/Member/CheckinList.html?param=" + new Base64().encode(JSON.stringify($scope.QueryCheckinInfo));
                }
            });
    };

}]);

