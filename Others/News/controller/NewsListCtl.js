/**
 * Created by Jerry on 16/3/29.
 */
laAir.controller('laAir_News_NewsListPageCtl', ['$window', '$document', '$scope', 'laUserService', function ($window, $document, $scope, laUserService) {

    $scope.title = "长龙新闻";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

    $scope.NewsList;

    laUserService.QueryNewList(function (dataBack, status) {
        $scope.NewsList = dataBack;
    });//, {"PageIndex": 1, "PageSize": 10, "StartTime": "", "EndTime": ""}

}]);