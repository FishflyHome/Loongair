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
    $scope.pageIndexCnt = 5;
    $scope.pageIndexList = new Array();
    $scope.inputPageSize = "";

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

    $scope.btnPageClick = function (p) {
        $scope.pageIndex = p;
        QueryMessageList();
    };

    $scope.btnGoPage = function () {
        if (!laGlobalLocalService.IsNum($scope.inputPageSize)) {
            bootbox.alert("页码请输入数字");
            return;
        }
        if ($scope.inputPageSize < 1 || $scope.inputPageSize > $scope.totalPage) {
            bootbox.alert("请输入正确的页码范围");
            return;
        }
        $scope.pageIndex = $scope.inputPageSize;
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
        if (arrMsg.length <= 0) {
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

                $scope.pageIndexList = new Array();
                if ($scope.totalPage <= $scope.pageIndexCnt) {
                    for (var i = 0; i < $scope.totalPage; i++) {
                        var pitem = {"p": (i + 1), "t": (i + 1), "s": false};
                        if ($scope.pageIndex == (i + 1)) {
                            pitem.s = true;
                        }
                        $scope.pageIndexList.push(pitem);
                    }
                } else {
                    var headCurPage = parseInt($scope.pageIndex / $scope.pageIndexCnt);
                    var subCurPage = $scope.pageIndex % $scope.pageIndexCnt;
                    if (subCurPage == 0) {
                        headCurPage--;
                    }
                    if (headCurPage < 0) {
                        headCurPage = 0;
                    }

                    for (var i = headCurPage * $scope.pageIndexCnt + 1; i <= (headCurPage + 1) * $scope.pageIndexCnt; i++) {
                        var pitem = {"p": i, "t": i, "s": false};
                        if (i == $scope.pageIndex) {
                            pitem.s = true;
                        }
                        if (i <= $scope.totalPage) {
                            $scope.pageIndexList.push(pitem);
                        }
                    }
                }
            }
        })
    }

}]);
