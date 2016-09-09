/**
 * Created by Jerry on 16/7/4.
 */

laAir.controller('laAir_MemberMemberCardPageCtl', ['$interval', '$document', '$window', '$scope', 'laUserService', 'laGlobalLocalService', function ($interval, $document, $window, $scope, laUserService, laGlobalLocalService) {

    $scope.$on("MemberContentPage", function (event, data) {
        var IsFrequentPassenger = data.IsFrequentPassenger;
        if (!IsFrequentPassenger) {
            $window.location.href = "MyInfo.html";
        }
    });

    $scope.title = "会员卡打印";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isMyInfoNav = true;

    $scope.isMem_MemberCard = true;

    $scope.cardInfo;

    laUserService.QueryMemberCardInfo(function (backData, status) {
        var rs = backData;
        if (rs.Code == laGlobalProperty.laServiceCode_Success && status == true) {
            $scope.cardInfo = rs;
        }
    });

    $scope.btnSendCardNoToMobile = function () {
        laUserService.SendCardNoToMobile($scope.cardInfo.CardNo, $scope.cardInfo.Name, function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                bootbox.alert("短信发送成功")
            } else {
                bootbox.alert(rs.Message);
            }
        })
    };

}]);

