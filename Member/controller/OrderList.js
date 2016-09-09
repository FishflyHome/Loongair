/**
 * Created by Jerry on 16/2/14.
 */

laAir.controller('laAir_MemberOrderListPageCtl', ['$document', '$interval', '$filter', '$scope', 'laOrderService', 'laGlobalLocalService', function ($document, $interval, $filter, $scope, laOrderService, laGlobalLocalService) {

    $scope.title = "订单列表";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isMyInfoNav = true;

    /**
     * 设置会员中心左边菜单选中
     * @type {boolean}
     */
    $scope.isMem_OrderList = true;

    var today = new Date();
    $scope.endTime = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.startTime = $filter('date')(new Date(today.setDate(today.getDate() - 30)), 'yyyy-MM-dd');

    $scope.pageIndex = 1;
    $scope.pageSize = 6;
    $scope.totalPage = 0;

    $scope.isQuerying = false;

    var timer;

    $scope.rs;
    $scope.ordList;

    $scope.orderDetTarget = "_blank";
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf("msie 8.0") >= 0) {
        $scope.orderDetTarget = "_self";
    }

    queryOrderList();

    $scope.btnQueryClick = function () {
        $scope.pageIndex = 1;
        $scope.startTime = $("#startTime").val();
        $scope.endTime = $("#endTime").val();

        queryOrderList();

    };

    $scope.btnPrePageClick = function () {
        $scope.pageIndex--;
        queryOrderList();
    };

    $scope.btnNextPageClick = function () {
        $scope.pageIndex++;
        queryOrderList();
    };
    /**
     * 查询订单
     */
    function queryOrderList() {

        if (laGlobalLocalService.CheckStringIsEmpty($scope.startTime)) {
            bootbox.alert('请选择起始日期');
            return;
        }
        if (!laGlobalLocalService.CheckDateFormat($scope.startTime)) {
            bootbox.alert('请输入YYYY-MM-DD格式的日期');
            return;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.endTime)) {
            bootbox.alert('请选择结束日期');
            return;
        }
        if (!laGlobalLocalService.CheckDateFormat($scope.endTime)) {
            bootbox.alert('请输入YYYY-MM-DD格式的日期');
            return;
        }
        if ($scope.endTime < $scope.startTime) {
            bootbox.alert('结束时间不能在起始时间之前');
            return;
        }

        $("#orderlist").hide();
        $("#noOrder").hide();

        $scope.isQuerying = true;
        laOrderService.QueryOrderList($scope.pageIndex, $scope.pageSize, $scope.startTime, $scope.endTime, function (backData, status) {
            $scope.rs = backData;
            if ($scope.rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.totalPage = $scope.rs.TotalPage;
                $scope.ordList = $scope.rs.OrderList;

                $scope.timeDown = 1;
                timer = $interval(function () {
                    $scope.timeDown = $scope.timeDown - 1;
                    if ($scope.timeDown <= 0) {
                        $interval.cancel(timer);
                        $("#orderlist").show();
                        $("#noOrder").show();
                        $scope.isQuerying = false;
                    }
                }, 1000);
            } else {
                $("#orderlist").show();
                $("#noOrder").show();
                $scope.isQuerying = false;
            }
        })
    }

}]);
