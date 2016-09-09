/**
 * Created by Jerry on 16/7/4.
 */

laAir.controller('laAir_MemberMyMessagePageCtl', ['$interval', '$document', '$window', '$scope', 'laUserService', 'laGlobalLocalService', function ($interval, $document, $window, $scope, laUserService, laGlobalLocalService) {

    $scope.$on("MemberContentPage", function (event, data) {
        var IsFrequentPassenger = data.IsFrequentPassenger;
        if (!IsFrequentPassenger) {
            $window.location.href = "MyInfo.html";
        }
    });

    $scope.title = "我的消息";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isMyInfoNav = true;

    $scope.isMem_MyMessage = true;

    $scope.curMsg;

    $scope.MessageList;

    $scope.pageIndex = 1;
    $scope.pageSize = 10;
    $scope.totalPage = 0;

    QueryMessageList();

    $scope.showMsgContent = function (msg) {
        $scope.curMsg = msg;

        new PopupLayer({
            trigger: "#tr" + msg.Tid, popupBlk: "#divmsgcontent", closeBtn: "#divclosemsgcontent"
        });
    };

    $scope.btnPrePageClick = function () {
        if ($scope.pageIndex == 1) {
            return;
        }
        $scope.pageIndex--;
        QueryMessageList();
    };

    $scope.btnNextPageClick = function () {
        if ($scope.pageIndex == $scope.totalPage) {
            return;
        }
        $scope.pageIndex++;
        QueryMessageList();
    };

    $scope.btnDelMessage = function () {
        var arrMsg = new Array();
        var chklist = document.getElementsByName('messageCheck');

        for (var i = 0; i < chklist.length; i++) {
            if (chklist[i].checked) {
                arrMsg.push(chklist[i].value);
            }
        }
        if (arrMsg.length<=0){
            bootbox.alert("请选择要删除的信息");
            return;
        }

        bootbox.confirm('您是否要删除这些消息?', function (result) {
            if (result) {
                laUserService.DelMyMessagelist(arrMsg, function (backData, status) {
                    var rs = backData;
                    if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                        bootbox.alert("删除成功");
                        for (var i = 0; i < arrMsg.length; i++) {
                            $("#tr" + arrMsg[i]).css({"display": "none"});
                        }
                    } else {
                        bootbox.alert(rs.Message);
                    }
                })
            }
        })
    };

    function QueryMessageList() {
        laUserService.QueryMyMessagelist($scope.pageIndex, $scope.pageSize, function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.MessageList = rs.result;
                $scope.totalPage = rs.PageCount;
            }
        })
    }

}]);
