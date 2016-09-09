/**
 * Created by Jerry on 16/2/24.
 */

laAir.controller('laAir_Promotion_MorePromotionPageCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "早买早乐早优惠";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

}]);

laAir.controller('laAir_Promotion_ChifengPageCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "红山文化 沙漠印象";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

}]);

laAir.controller('laAir_Promotion_XinjiangPageCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "新疆印象";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

}]);
