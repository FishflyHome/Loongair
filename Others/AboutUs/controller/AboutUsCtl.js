/**
 * Created by Jerry on 16/2/23.
 */

laAir.controller('laAir_AboutUs_loongAirPageCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "长龙简介";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

    $scope.is_About_LoongAirNav = true;

}]);

laAir.controller('laAir_AboutUs_loongAirHistoryPageCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "长龙历程";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

    $scope.is_About_HistoryNav = true;

}]);

laAir.controller('laAir_AboutUs_HonorPageCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "长龙荣誉";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

    $scope.is_About_HonorNav = true;

}]);

laAir.controller('laAir_AboutUs_ResponsibilityPageCtl', ['$document', '$scope', function ($document, $scope) {

    $scope.title = "社会责任与企业理念";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

    $scope.is_About_ResponsibilityNav = true;

}]);

laAir.controller('laAir_AboutUs_JoinUsPageCtl', ['$document', '$scope', function ($document, $scope) {
    $scope.title = "长龙招聘";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

    $scope.is_About_JoinUsNav = true;
}]);

laAir.controller('laAir_AboutUs_BGInvestigationPageCtl', ['$document', '$scope', function ($document, $scope) {
    $scope.title = "空勤人员背景调查须知";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

    $scope.is_About_BGInvestigationNav = true;

    $scope.pwdDoc = "";
    $scope.showDownload = false;

    $scope.btnCheckRightForDownload = function () {
        if ($scope.pwdDoc == "bjdcgj2016") {
            $scope.showDownload = true;
        } else {
            bootbox.alert("密码输入错误,请重新输入");
        }
    }
}]);

laAir.controller('laAir_AboutUs_ExaminationPageCtl', ['$document', '$scope', function ($document, $scope) {
    $scope.title = "空勤人员体检须知";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

    $scope.is_About_ExaminationNav = true;
}]);

laAir.controller('laAir_AboutUs_WebSiteMapPageCtl', ['$window', '$filter', '$document', '$scope', 'laFlightService', 'laGlobalLocalService', function ($window, $filter, $document, $scope, laFlightService, laGlobalLocalService) {
    $scope.title = "网站地图";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

    $scope.is_About_WebSiteMapNav = true;

    $scope.TransportMenuList = laMapMenu_Transport;
    $scope.PassengerMenuList = laMapMenu_PassengerSvr;
    $scope.AirplaneMenuList = laMapMenu_Airplane;

    //查询特价机票
    $scope.SpecialTicket;
    laFlightService.QuerySpecialTicket('', '', function (dataBack, status) {
        var rs = dataBack;
        if (rs.Code == laGlobalProperty.laServiceCode_Success) {
            $scope.SpecialTicket = rs;
        }
    });

    /**
     * 机票预定按钮点击
     * @param tic
     */
    $scope.btnTicketClick = function (tic) {
        var fli = new laEntityFlight();
        fli.AirportFrom = tic.DepartureAirportCode;
        fli.AirportTo = tic.ArriveAirportCode;
        fli.AirportFromCH = tic.DepartureAirportCH;
        fli.AirportToCH = tic.ArriveAirportCH;
        fli.DepartureTime = $filter('date')(tic.FlightDate, 'yyyy-MM-dd');
        fli.RoundTripTime = "";
        fli.RoundTrip = false;

        laGlobalLocalService.writeCookie(laGlobalProperty.laServiceConst_TransData_QueryTicket, JSON.stringify(fli), 0);
        $window.location.href = '/ETicket/AirlineList.html';
    };
}]);

laAir.controller('laAir_AboutUs_ContactPageCtl', ['$document', '$scope', function ($document, $scope) {
    $scope.title = "联系我们";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isHomeNav = true;

    $scope.is_About_ContactNav = true;
}]);