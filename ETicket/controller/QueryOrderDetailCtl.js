/**
 * Created by Jerry on 16/3/1.
 */

laAir.controller('laAir_ETicket_QueryOrderDetailPageCtl', ['$window', '$document', '$scope', 'laOrderService', 'laGlobalLocalService', function ($window, $document, $scope, laOrderService, laGlobalLocalService) {

    $scope.title = "订单查询";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isSchTripNav = true;

    $scope.orderId;
    $scope.sessionId;

    $scope.ImgVerifyCode = '';
    GetImageVerifyCode();

    $scope.btnChangeVerifyCode = function () {
        GetImageVerifyCode();
    };

    $scope.btnQueryOrderInfoWithoutLogin = function () {
        if (laGlobalLocalService.CheckStringIsEmpty($scope.orderId)) {
            bootbox.alert('请输入要查询的订单号');
            return;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.mobile) || !laGlobalLocalService.CheckStringLength($scope.mobile, 11)) {
            bootbox.alert('请输入11位联系人手机号码');
            return;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.verifyCode)) {
            bootbox.alert('请输入图片验证码');
            return;
        }

        var param = {
            "ordid": $scope.orderId,
            "mobile": $scope.mobile,
            "verifycode": $scope.verifyCode,
            "sessionId": $scope.sessionId
        };
        $window.location.href = '/ETicket/OrderDetail.html?param=' + new Base64().encode(JSON.stringify(param));
    };

    function GetImageVerifyCode() {
        $scope.ImgVerifyCode = '';
        laOrderService.ImageVerifyCodeForQueryOrderInfoWithoutLogin(function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.ImgVerifyCode = backData.ImageVerifyCode;
                $scope.sessionId = rs.SessionID;
            }
        });
    }

}]);
