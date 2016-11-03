/**
 * Created by Jerry on 16/5/12.
 */

laAir.controller('laAir_MemberCheckinListCtl', ['$document', '$interval', '$window', '$scope', 'laUserService', 'laGlobalLocalService', function ($document, $interval, $window, $scope, laUserService, laGlobalLocalService) {

    $scope.title = "网上值机";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isMyInfoNav = true;

    $scope.CheckinInfo;
    $scope.CheckinList;

    $scope.rs;

    var curHref = $window.location.href.split('?');
    if (curHref.length >= 2) {
        var params = curHref[1].split('&');
        for (var i = 0; i < params.length; i++) {
            var param = params[i].split('=');
            if (param.length >= 2) {
                if (param[0].toLowerCase() == 'param') {
                    try {
                        $scope.CheckinInfo = JSON.parse(new Base64().decode(params[i].substr(6)));
                    }
                    catch (e) {

                    }
                    break;
                }

            }
        }
    }

    if ($scope.CheckinInfo != null && $scope.CheckinInfo != undefined) {
        laUserService.QueryPassengerTravel($scope.CheckinInfo.Foid, $scope.CheckinInfo.PassengerName,
            function (backData, status) {
                $scope.rs = backData;
                if ($scope.rs.Code == laGlobalProperty.laServiceCode_Success) {
                    $scope.CheckinList = $scope.rs.Result;
                } else {
                    bootbox.alert($scope.rs.Message);
                }
            })
    }

    $scope.getCheckinStatusDesc = function (chk) {
        var v = chk.CheckInStatus;
        if (v.toString() == "0") {
            return "已飞";
        }
        if (v.toString() == "1") {
            return "已经值机";
        }
        if (v.toString() == "2") {
            return "可以值机";
        }
        if (v.toString() == "3") {
            return "不可值机";
        }
    };

    $scope.btnCheckinOnline = function (chk, tkt) {
        var checkInfo = {
            "FlightNumber": chk.FlightNumber,
            "FromCity": chk.FromCity,
            "FromCityCH": chk.FromCityCH,
            "ToCity": chk.ToCity,
            "ToCityCH": chk.ToCityCH,
            "FlightTime": chk.FlightTime,
            "CabinClass": chk.CabinClass,
            "CabinType": chk.CabinType,
            "TourIndex": chk.TourIndex,
            "CheckInStatus": chk.CheckInStatus,
            "TKTNumber": tkt,
            "PassengerName": $scope.CheckinInfo.PassengerName,
            "Foid": $scope.CheckinInfo.Foid
        };
        $window.location.href = 'OnlineCheckin.html?param=' + new Base64().encode(JSON.stringify(checkInfo));
    };

    $scope.btnCancelCheckinOnline = function (chk) {
        bootbox.confirm("是否确定要取消值机?", function (result) {
            if (result) {
                var chkinfo = {
                    "FlightDate": chk.FlightTime.substring(0, 10), //new Date($scope.CheckinInfo.FlightTime),
                    "FlightNumber": chk.FlightNumber,
                    "FromCity": chk.FromCity,
                    "ToCity": chk.ToCity,
                    "Foid": chk.TKTNumber
                };
                laUserService.OnlineCheckinCancel(chkinfo, function (backData, status) {
                    if (backData.Code == laGlobalProperty.laServiceCode_Success) {
                        bootbox.alert("取消值机成功", function () {
                            var queryCheckin = {
                                "Foid": $scope.CheckinInfo.Foid,
                                "PassengerName": $scope.CheckinInfo.PassengerName
                            };
                            $window.location.href = "CheckinList.html?param=" + new Base64().encode(JSON.stringify(queryCheckin));
                        })
                    } else {
                        bootbox.alert(backData.Message);
                    }
                })
            }
        });
    };

}]);