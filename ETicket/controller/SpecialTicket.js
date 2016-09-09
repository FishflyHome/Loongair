/**
 * Created by Jerry on 16/3/8.
 */

laAir.controller('laAir_ETicket_SpecialTicketPageCtl', ['$document', '$filter', '$window', '$scope', 'laUserService', 'laFlightService', 'laGlobalLocalService', function ($document, $filter, $window, $scope, laUserService, laFlightService, laGlobalLocalService) {

    $scope.title = "特价机票";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isSchTripNav = true;

    $scope.SpecialTicket;

    laUserService.FillCityAirportInfo(new Array("startCity"), function () {
        var defCity = {"s": {"c": "HGH", "n": "杭州"}, "e": {"c": "PEK", "n": "北京"}};
        $("#startCity").attr("segnum", defCity.s.c);
        $("#startCity").val(defCity.s.n);
    });

    QuerySpecialTicket("");

    /**
     * 查询特价机票
     */
    $scope.btnQueryTicket = function () {
        var airPortCode = '';
        if (!laGlobalLocalService.CheckStringIsEmpty($("#startCity").val())) {
            airPortCode = $("#startCity").attr("segnum");
        }
        QuerySpecialTicket(airPortCode);
    };

    /**
     * 机票预定按钮点击
     * @param tic
     */
    $scope.btnTicketClick = function(tic) {
        var fli = new laEntityFlight();
        fli.AirportFrom = tic.DepartureAirportCode;
        fli.AirportTo = tic.ArriveAirportCode;
        fli.AirportFromCH = tic.DepartureAirportCH;
        fli.AirportToCH = tic.ArriveAirportCH;
        fli.DepartureTime = $filter('date')(tic.FlightDate,'yyyy-MM-dd');
        fli.RoundTripTime = "";
        fli.RoundTrip = false;

        laGlobalLocalService.writeCookie(laGlobalProperty.laServiceConst_TransData_QueryTicket, JSON.stringify(fli), 0);
        $window.location.href = '/ETicket/AirlineList.html';
    };

    /**
     * 查询特价机票
     * @param airPortCode
     * @constructor
     */
    function QuerySpecialTicket(airPortCode) {
        laFlightService.QuerySpecialTicket(airPortCode, '', function (dataBack, status) {
            var rs = dataBack;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.SpecialTicket = rs;
            }
        })
    }

}]);
