/**
 * Created by Jerry on 16/3/29.
 */
laAir.controller('laAir_News_NewsListPageCtl', ['$window', '$document', '$scope', 'laUserService', 'laGlobalLocalService', function ($window, $document, $scope, laUserService, laGlobalLocalService) {

    $scope.title = "长龙新闻";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

    $scope.NewsAll;
    $scope.NewsList;

    $scope.pageIndex = 1;
    $scope.pageSize = 10;
    $scope.totalPage = 0;
    $scope.pageIndexCnt = 5;
    $scope.pageIndexList = new Array();
    $scope.inputPageIndex = "";

    QueryNewslist();

    $scope.btnPrePageClick = function () {
        if ($scope.pageIndex == 1) {
            return;
        }
        $scope.pageIndex--;
        QueryNewslist();
    };

    $scope.btnNextPageClick = function () {
        if ($scope.pageIndex == $scope.totalPage) {
            return;
        }
        $scope.pageIndex++;
        QueryNewslist();
    };

    $scope.btnPageClick = function (p) {
        $scope.pageIndex = p;
        QueryNewslist();
    };

    $scope.btnGoPage = function () {

        $scope.inputPageIndex = $("#inputPindex").val();
        if (!laGlobalLocalService.IsNum($scope.inputPageIndex)) {
            bootbox.alert("页码请输入数字");
            return;
        }
        if ($scope.inputPageIndex < 1 || $scope.inputPageIndex > $scope.totalPage) {
            bootbox.alert("请输入正确的页码范围");
            return;
        }
        $scope.pageIndex = parseInt($scope.inputPageIndex);
        QueryNewslist();
    };

    function QueryNewslist() {
        $scope.inputPageIndex = $scope.pageIndex;
        laUserService.QueryNewList(function (dataBack, status) {
            $scope.NewsAll = dataBack;
            $scope.NewsList = dataBack.newsList;

            $scope.totalPage = $scope.NewsAll.PageInfo.TotalPage;

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
        }, {"PageIndex": $scope.pageIndex, "PageSize": $scope.pageSize, "StartTime": "2016-01-01", "EndTime": "2100-12-31"});
    }

}]);