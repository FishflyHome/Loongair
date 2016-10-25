/**
 * Created by Jerry on 16/2/24.
 */

laAir.controller('laAir_News_NewsPageCtl', ['$sce', '$window', '$document', '$scope', 'laUserService', function ($sce, $window, $document, $scope, laUserService) {

    $scope.title = "新闻";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

    $scope.NewsId = 0;
    $scope.NewsDetail;
    $scope.NewsContent;
    $scope.queryFromLocal = false;

    var curHref = $window.location.href.toLowerCase().split('?');
    if (curHref.length >= 2) {
        var params = curHref[1].split('&');
        for (var i = 0; i < params.length; i++) {
            var param = params[i].split('=');
            if (param.length >= 2) {
                if (param[0] == 'id') {
                    $scope.NewsId = param[1];

                    laUserService.QueryNewList(function (dataBack, status) {
                        var NewsList = dataBack.newsList;
                        var n = NewsList.length;
                        for (var i = 0; i < n; i++) {
                            var nw = NewsList[i];
                            if (nw.n == $scope.NewsId) {
                                $document[0].title = nw.t;
                                $scope.queryFromLocal = true;
                                $("#divnewslocal").css("display", "block");
                                break;
                            }
                        }
                        if (!$scope.queryFromLocal) {
                            laUserService.QueryNewsDetail($scope.NewsId, function (dataBack, status) {
                                $scope.NewsDetail = dataBack.Result;
                                $document[0].title = $scope.NewsDetail.NewTitle;
                                $scope.NewsContent = $sce.trustAsHtml(decodeURI($scope.NewsDetail.NewInfoDetail));
                                $("#divnewsdy").css("display", "block");
                            })
                        }
                    });
                    break;
                }
            }
        }
    }

}]);
