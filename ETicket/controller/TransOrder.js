/**
 * Created by ssyufei on 16/7/27.
 */

laAir.controller('laAir_ETicket_TransOrderPageCtl', ['$sce', '$document', '$interval', '$filter', '$window', '$scope', 'laUserService', 'laOrderService', 'laFlightService', 'laGlobalLocalService', function ($sce, $document, $interval, $filter, $window, $scope, laUserService, laOrderService, laFlightService, laGlobalLocalService) {

    $scope.title = "改期";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isSchTripNav = true;

    //$scope.RefundTypeOptions = laEntityEnumrefundTypeOptions;

    //订单信息
    $scope.orderInfo;
    $scope.ordId;
    //航段对应的乘机人信息 一对多
    $scope.Flight_Psglist = new Array();

    $scope.selFlightId = "";
    $scope.changePsglist = new Array();

    $scope.Param;

    $scope.CanTransPsgCnt = 0;

    var curHref = $window.location.href.split('?');
    if (curHref.length >= 2) {
        var params = curHref[1].split('&');
        for (var i = 0; i < params.length; i++) {
            var param = params[i].split('=');
            if (param.length >= 2) {
                if (param[0].toLowerCase() == 'ordid') {
                    $scope.ordId = param[1];
                    break;
                }
                if (param[0].toLowerCase() == 'param') {   //表示根据参数未登录查订单信息
                    try {
                        //$scope.Param = JSON.parse(new Base64().decode(param[1]));
                        $scope.Param = JSON.parse(new Base64().decode(params[i].substr(6)));
                    } catch (e) {

                    }

                    break;
                }
            }
        }
    }
    if ($scope.ordId != undefined && $scope.ordId != null) {
        getOrderInfo($scope.ordId);
    }
    if ($scope.Param != undefined && $scope.Param != null) {
        getOrderInfoWithoutLogin();
    }

    $scope.setFlightId = function (fliId) {
        $scope.selFlightId = fliId;

        /**
         var n = $scope.Flight_Psglist.length;
         for (var i = 0; i < n; i++) {
            var fPsg = $scope.Flight_Psglist[i];
            if (fPsg.Flight.FlightId == fliId) {
                for (var l = 0; l < fPsg.Psglist.length; l++) {
                    fPsg.Psglist[l].Selected = true;
                }
            }
        }
         **/

    };

    $scope.selAllTypePsg = function (fliId, psgtype, psglist) {
        $scope.selFlightId = fliId;
        var n = psglist.length;
        for (var i = 0; i < n; i++) {
            if (psgtype == 1) {
                if (psglist[i].TravellerType == 1) {
                    psglist[i].Selected = true;
                }
                if (psglist[i].TravellerType == 2) {
                    psglist[i].Selected = false;
                }

            }
            if (psgtype == 2) {
                if (psglist[i].TravellerType == 1) {
                    psglist[i].Selected = false;
                }
                if (psglist[i].TravellerType == 2) {
                    psglist[i].Selected = true;
                }

            }
        }
    };

    $scope.btnTransClick = function () {
        if (laGlobalLocalService.CheckStringIsEmpty($scope.selFlightId)) {
            bootbox.alert("请选择要改期的航程");
            return;
        }
        $scope.changePsglist = new Array();

        var n = $scope.Flight_Psglist.length;
        var fPsg = $scope.Flight_Psglist[0];
        for (var i = 0; i < n; i++) {
            fPsg = $scope.Flight_Psglist[i];
            if (fPsg.Flight.FlightNum == $scope.selFlightId) {
                for (var l = 0; l < fPsg.Psglist.length; l++) {
                    if (fPsg.Psglist[l].Selected) {
                        var psg = {
                            "PassengerId": fPsg.Psglist[l].PassengerId,
                            "SegmentId": fPsg.Psglist[l].FlightId, //$scope.selFlightId,
                            "TravellerType": fPsg.Psglist[l].TravellerType
                        };
                        $scope.changePsglist.push(psg);
                    }
                }
                break;
            }
        }

        if ($scope.changePsglist.length == 0) {
            bootbox.alert("请在已选的航班信息下选择要改期的乘机人");
            return;
        }

        bootbox.confirm("您确定要改期吗?", function (result) {
            if (result) {
                var transInfo = {
                    "DepartureAirport": fPsg.Flight.DepartureAirport,
                    "DepartureCityCH": fPsg.Flight.DepartureCityCH,
                    "ArriveCityCH": fPsg.Flight.ArriveCityCH,
                    "ArriveAirport": fPsg.Flight.ArriveAirport,
                    "DepartureTime": $filter('date')(fPsg.Flight.DepartureTime, 'yyyy-MM-dd'),
                    "OrderId": $scope.orderInfo.OrderId,
                    "ChangePassenger": $scope.changePsglist
                };
                $window.location.href = "/ETicket/TransAirlineList.html?param=" + new Base64().encode(JSON.stringify(transInfo));
            }
        });
    };
    /**
     * 查询订单信息
     * @param ordId
     */
    function getOrderInfo(ordId) {
        laOrderService.QueryOrderInfo(ordId, function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.orderInfo = rs;

                getFlight_Psglist();
            }
        });
    }

    function getOrderInfoWithoutLogin() {
        laOrderService.QueryOrderInfoWithoutLogin($scope.Param.ordid, $scope.Param.mobile, $scope.Param.verifycode, $scope.Param.sessionId, function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.orderInfo = rs;

                getFlight_Psglist();
            }
        });
    }

    function getFlight_Psglist() {
        var n = $scope.orderInfo.FlightList.length;
        for (var i = 0; i < n; i++) {
            var simFli = $scope.orderInfo.FlightList[i];
            var psgs = new Array();
            var l = $scope.orderInfo.Passengers.length;
            for (var u = 0; u < l; u++) {
                var psg = $scope.orderInfo.Passengers[u];
                var flis = psg.Flights;
                var f = flis.length;
                for (var y = 0; y < f; y++) {
                    if (simFli.FlightNum == flis[y].FlightNum && flis[y].CanTrans) {
                        var simpsg = {
                            "FlightId": flis[y].FlightId,
                            "Foid": psg.Foid,
                            "FoidType": psg.FoidType,
                            "PassengerId": psg.PassengerId,
                            "PassengerName": psg.PassengerName,
                            "TravellerType": psg.TravellerType,
                            "TravellerTypeDisplay": psg.TravellerTypeDisplay,
                            "Selected": false
                        };
                        psgs.push(simpsg);
                    }
                }
            }

            if (psgs.length > 0) {
                var fPsg = {"Flight": simFli, "Psglist": psgs};
                $scope.Flight_Psglist.push(fPsg);
            }
        }
    }

}]);

