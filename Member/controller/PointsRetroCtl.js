/**
 * Created by Jerry on 16/7/4.
 */

laAir.controller('laAir_MemberPointsRetroPageCtl', ['$interval', '$document', '$window', '$scope', 'laUserService', 'laGlobalLocalService', function ($interval, $document, $window, $scope, laUserService, laGlobalLocalService) {

    $scope.$on("MemberContentPage", function (event, data) {
        var IsFrequentPassenger = data.IsFrequentPassenger;
        if (!IsFrequentPassenger) {
            $window.location.href = "MyInfo.html";
        }
    });

    $scope.title = "积分补登";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isMyInfoNav = true;

    $scope.isMem_PointsRetro = true;

    $scope.cabinOptions = laEntityEnumCabinTypeOptions;

    $scope.PointsRetroInfo = {
        "TicketNo": "",
        "FlightNo": "",
        "Cabin": "",
        "FlightDate": "",
        "From": "",
        "To": "",
        "SeatNo": ""
    };

    $("#startCity").attr("segnum", "");
    $("#endCity").attr("segnum", "");

    initFillCity();

    /**
     * 根据出发/到达城市文本查找城市代码
     * @param inputId
     * @param v
     */
    $scope.searchCityCodeByVal = function (inputId) {
        var cityName = $("#" + inputId).val();
        if (cityName != null && cityName.length >= 2) {
            var n = Vcity.allCity.length;
            for (var i = 0; i < n; i++) {
                var item = Vcity.allCity[i].split("|");
                if (item[0] == cityName) {
                    $("#" + inputId).attr("segnum", item[3]);
                    break;
                }
            }
        }
    };

    $scope.btnPointsRetroClick = function () {

        $scope.PointsRetroInfo.FlightDate = $("#startTime").val();
        $scope.PointsRetroInfo.From = $("#startCity").attr("segnum");
        $scope.PointsRetroInfo.To = $("#endCity").attr("segnum");

        if (laGlobalLocalService.CheckStringIsEmpty($scope.PointsRetroInfo.TicketNo)) {
            bootbox.alert('请输入机票票号');
            return;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.PointsRetroInfo.Cabin)) {
            bootbox.alert('请输入舱位');
            return;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.PointsRetroInfo.FlightNo)) {
            bootbox.alert('请输入航班号');
            return;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.PointsRetroInfo.FlightDate)) {
            bootbox.alert('请输入航班日期');
            return;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.PointsRetroInfo.From)) {
            bootbox.alert('请输入起始地');
            return;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.PointsRetroInfo.To)) {
            bootbox.alert('请输入目的地');
            return;
        }
        //if (laGlobalLocalService.CheckStringIsEmpty($scope.PointsRetroInfo.SeatNo)) {
        //    bootbox.alert('请输入座位号');
        //    return;
        //}

        $scope.PointsRetroInfo.SeatNo = "";

        laUserService.PointsRetro($scope.PointsRetroInfo.TicketNo, $scope.PointsRetroInfo.FlightNo,
            $scope.PointsRetroInfo.Cabin, $scope.PointsRetroInfo.FlightDate, $scope.PointsRetroInfo.From, $scope.PointsRetroInfo.To, $scope.PointsRetroInfo.SeatNo, function (backData, status) {
                var rs = backData;
                if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                    $scope.PointsRetroInfo = {
                        "TicketNo": "",
                        "FlightNo": "",
                        "Cabin": "",
                        "FlightDate": "",
                        "From": "",
                        "To": "",
                        "SeatNo": ""
                    };

                    bootbox.alert("提交成功,请等待审核后生效");
                } else {
                    bootbox.alert(rs.Message);
                }
            });
    };

    function initFillCity() {
        laUserService.FillCityAirportInfo(new Array("startCity", "endCity"), function () {
            //var sv = $("#startCity").val();
            //if (sv == undefined || sv == '') {
                var defCity = {"s": {"c": "HGH", "n": "杭州"}, "e": {"c": "PEK", "n": "北京"}};
                $("#startCity").attr("segnum", defCity.s.c);
                $("#startCity").val(defCity.s.n);
                $("#endCity").attr("segnum", defCity.e.c);
                $("#endCity").val(defCity.e.n);
            //}

            var st = $("#startTime").val();
            if (st == undefined || st == '') {
                var td = new Date();
                td = new Date(td.setDate(td.getDate() + 1));
                var tdmm = (parseInt(td.getMonth() + 1)).toString();
                tdmm = (tdmm.length < 2) ? '0' + tdmm : tdmm;
                var tdday = td.getDate().toString();
                tdday = (tdday.length < 2) ? '0' + tdday : tdday;
                $("#startTime").val(td.getFullYear() + '-' + tdmm + '-' + tdday);
                $("#startTime").attr("date", td.getFullYear() + '-' + tdmm + '-' + tdday);
            } else {
                $("#startTime").attr("date", st);
            }
        });
    }

}]);
