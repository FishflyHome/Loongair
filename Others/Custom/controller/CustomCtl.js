/**
 * Created by Jerry on 16/2/23.
 */

laAir.controller('laAir_Custom_ETicketVerifyPageCtl', ['$interval', '$document', '$scope', 'laOrderService', 'laGlobalLocalService', function ($interval, $document, $scope, laOrderService, laGlobalLocalService) {

    $scope.title = "机票验真";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

    $scope.tic1 = "891";
    $scope.tic2 = "";
    $scope.TicketNum = "";
    $scope.PassengerName;
    $scope.ImgVerifyCode;
    $scope.ValidCode = "";
    $scope.sessionId;
    $scope.isCommitQuery = false;
    $scope.CheckedDesc = "";

    GetImgVerifyCode();

    $scope.btnChangeVerifyCode = function () {
        GetImgVerifyCode();
    };

    $scope.btnTicPartChange = function () {
        $scope.TicketNum = $scope.tic1 + "-" + $scope.tic2;
        if ($scope.tic1.length == 3) {
            $("#tic2").focus();
        }
    };

    $scope.btnCheckTicket = function () {
        if (laGlobalLocalService.CheckStringIsEmpty($scope.TicketNum)) {
            bootbox.alert('请输入电子票号');
            return;
        }
        if (!laGlobalLocalService.CheckStringLength($scope.TicketNum, 14)) {
            bootbox.alert('请输入13位电子票号');
            return;
        }

        var ticFormatDesc = "请输入格式正确的电子票号";
        var tic = $scope.TicketNum.split('-');
        if (tic.length != 2) {
            bootbox.alert(ticFormatDesc);
            return;
        }
        for (var i = 0; i < tic.length; i++) {
            if (!laGlobalLocalService.IsNum(tic[i])) {
                bootbox.alert(ticFormatDesc);
                return;
            }
        }

        if (laGlobalLocalService.CheckStringIsEmpty($scope.PassengerName)) {
            bootbox.alert('请输入旅客姓名');
            return;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.ValidCode)) {
            bootbox.alert('请输入图片验证码');
            return;
        }

        $scope.isCommitQuery = true;
        $scope.CheckedDesc = "";
        laOrderService.CheckTicket($scope.TicketNum, $scope.PassengerName, $scope.ValidCode, $scope.sessionId, function (dataBack, status) {
            var rs = dataBack;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.timeDown = 1;
                timer = $interval(function () {
                    $scope.timeDown = $scope.timeDown - 1;
                    if ($scope.timeDown <= 0) {
                        $interval.cancel(timer);

                        $scope.ValidCode = "";
                        GetImgVerifyCode();

                        $scope.isCommitQuery = false;
                        $scope.CheckedDesc = "经查验，存在客票号 [" + $scope.TicketNum + "] 的乘机人 [" + $scope.PassengerName + "]。感谢您选择长龙航空。";
                    }
                }, 1000);
            } else {
                $scope.timeDown = 2;
                timer = $interval(function () {
                    $scope.timeDown = $scope.timeDown - 1;
                    if ($scope.timeDown <= 0) {
                        $interval.cancel(timer);

                        $scope.ValidCode = "";
                        GetImgVerifyCode();

                        $scope.isCommitQuery = false;
                        //$scope.CheckedDesc = "对不起，经查验客票号 [" + $scope.TicketNum + "] 的乘机人 [" + $scope.PassengerName + "] 不存在," + rs.Message + "。请核对信息是否正确输入。";
                        bootbox.alert("验证失败:" + rs.Message);
                    }
                }, 1000);
            }
        })
    };

    function GetImgVerifyCode() {
        $scope.ImgVerifyCode = '';
        laOrderService.ImageVerifyCodeForCheckTicket(function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.ImgVerifyCode = backData.ImageVerifyCode;
                $scope.sessionId = rs.SessionID;
            }
        });
    }

}]);

laAir.controller('laAir_Custom_ProblemPageCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "常见问题";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

}]);

laAir.controller('laAir_Custom_RefundRulePageCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "退改签规定";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

}]);

laAir.controller('laAir_Custom_RefundApplyPageCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "申请退票";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

}]);
