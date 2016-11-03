/**
 * Created by Jerry on 16/5/11.
 */

laAir.controller('laAir_MemberOnlineCheckinCtl', ['$filter', '$document', '$interval', '$window', '$scope', 'laUserService', 'laGlobalLocalService', function ($filter, $document, $interval, $window, $scope, laUserService, laGlobalLocalService) {

    $scope.title = "网上值机";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isMyInfoNav = true;


    $scope.CheckinInfo;
    $scope.SeatsInfo;

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
        laUserService.QueryPlaneSeats($scope.CheckinInfo.FlightNumber, $scope.CheckinInfo.FromCity,
            $scope.CheckinInfo.ToCity, $scope.CheckinInfo.FlightTime, $scope.CheckinInfo.CabinType, function (backData, status) {
                if (backData.Code == laGlobalProperty.laServiceCode_Success) {
                    $scope.SeatsInfo = backData.Result;
                    fillSeats();
                }
            });
    }

    $scope.btnCheckinClick = function () {
        var seat = $("#seatNumberReal").html();
        if (laGlobalLocalService.CheckStringIsEmpty(seat)) {
            bootbox.alert("请先选择座位");
            return;
        }
        bootbox.confirm("是否确定要值机?", function (result) {
            if (result) {
                var chkinfo = {
                    "FlightDate": $scope.CheckinInfo.FlightTime.substring(0, 10), //new Date($scope.CheckinInfo.FlightTime),
                    "FlightNumber": $scope.CheckinInfo.FlightNumber,
                    "SeatNumber": seat,
                    "FromCity": $scope.CheckinInfo.FromCity,
                    "ToCity": $scope.CheckinInfo.ToCity,
                    "TKTNumber": $scope.CheckinInfo.TKTNumber,
                    "TourIndex": $scope.CheckinInfo.TourIndex,
                    "PassangerName": $scope.CheckinInfo.PassengerName,
                    "CabinType": $scope.CheckinInfo.CabinType
                };
                laUserService.OnlineCheckin(chkinfo, function (backData, status) {
                    if (backData.Code == laGlobalProperty.laServiceCode_Success) {
                        bootbox.alert("值机成功", function () {
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

    $scope.getWeek = function () {
        return laGlobalLocalService.getWeekName(new Date($scope.CheckinInfo.FlightTime));
    };

    function fillSeats() {
        var nl = $scope.SeatsInfo.SeatMap.length;

        var seatCols = new Array();
        var seatRows = new Array();
        var seatMap = new Array();
        var seatUnaval = new Array();

        for (var i = 0; i < nl; i++) {
            var seatRow = $scope.SeatsInfo.SeatMap[i];
            var seatType = "e";

            //暂时只支持超级经济舱和经济舱
            if (seatRow.CabinType == 1) {
                //continue;
                seatType = "f";
            } else if (seatRow.CabinType == 2) {
                //continue;
                seatType = "g";
            } else if (seatRow.CabinType == 3) {
                seatType = "h";
            } else if (seatRow.CabinType == 4) {
                seatType = "e";
            }

            if (seatRow.EmergencySaet == 1) {
                var emerSeat = "";
                for (var x = 0; x < seatRow.Seats.length; x++) {
                    emerSeat += "_";
                }
                seatMap.push(emerSeat);
                seatRows.push("");
            }

            var rowLine = seatRow.Row.toString();//laGlobalLocalService.PadString(seatRow.Row.toString(), 2);
            seatRows.push(rowLine);

            var dseats = "";
            var dseatscol = new Array();
            for (var x = 0; x < seatRow.Seats.length; x++) {
                if (seatRow.Seats[x].SeatName != "=") {
                    dseatscol.push(seatRow.Seats[x].SeatName);
                    dseats += seatType;
                    if (seatRow.Seats[x].SeatStatus == 2) {
                        seatUnaval.push(rowLine + "_" + seatRow.Seats[x].SeatName);
                    }
                } else {
                    dseatscol.push("");
                    dseats += "_";
                }
            }
            if (dseatscol.length > seatCols.length) {
                seatCols = dseatscol;
            }
            seatMap.push(dseats);
        }

        var sc = $('#seat-map').seatCharts({
            map: seatMap,
            seats: { //定义座位属性
                f: {
                    price: 2120,
                    classes: 'first-class',
                    category: '头等舱'
                },
                g: {
                    price: 1230,
                    classes: 'business-class',
                    category: '商务舱'
                },
                h: {
                    price: 1230,
                    classes: 'preeconomy-class',
                    category: '超级经济舱'
                },
                e: {
                    price: 1230,
                    classes: 'economy-class',
                    category: '经济舱'
                }
            },
            naming: { //定义行列等信息
                top: true,
                columns: seatCols,
                rows: seatRows,
                getLabel: function (character, row, column) {
                    return row + column;
                }
            },
            legend: { //定义图例
                node: $('#legend'),
                items: [
                    ['f', 'available', '头等舱'],
                    ['g', 'available', '商务舱'],
                    ['h', 'available', '超级经济舱'],
                    ['e', 'available', '经济舱'],
                    ['f', 'unavailable', '已被定'],
                    ['e', 'selected', '已选择'],
                ]
            },
            click: function () {
                if (this.status() == 'available') {//可选座
                    $("#seatNumberReal").html(this.settings.label);
                    $("#seatNumber").html("<p data-id='item" + this.settings.id + "'>当前选择座位选择：" + this.settings.label + "</p>");//修改右侧显示的座位号
                    sc.find('selected').status('available');//每次只有一个座位能被选中，选中后移除其他选中
                    return 'selected';
                } else if (this.status() == 'selected') {//已选中
                    $("p[data-id='item" + this.settings.id + "']").remove();
                    return 'available';
                } else if (this.status() == 'unavailable') {//已售出

                    return 'unavailable';
                } else {
                    return this.style();
                }
            },
            focus: function () {
                if (this.status() == 'available') {
                    return 'focused';
                } else {
                    return this.style();
                }
            }
        });

        //设置已售出不可选座
        sc.get(seatUnaval).status('unavailable');

        $('#scrollinner').tinyscrollbar({trackSize: 200});
    }

}]);

/*
 {
 "Result": {
 "SeatMap": [
 {
 "Row": 1,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 2
 },
 {
 "SeatName": "B",
 "SeatStatus": 2
 },
 {
 "SeatName": "C",
 "SeatStatus": 2
 },
 {
 "SeatName": "=",
 "SeatStatus": 2
 },
 {
 "SeatName": "=",
 "SeatStatus": 2
 },
 {
 "SeatName": "J",
 "SeatStatus": 2
 }
 ]
 },
 {
 "Row": 2,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 1
 },
 {
 "SeatName": "B",
 "SeatStatus": 1
 },
 {
 "SeatName": "C",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "J",
 "SeatStatus": 1
 }
 ]
 },
 {
 "Row": 3,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 1
 },
 {
 "SeatName": "B",
 "SeatStatus": 1
 },
 {
 "SeatName": "C",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "J",
 "SeatStatus": 1
 }
 ]
 },
 {
 "Row": 4,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 2
 },
 {
 "SeatName": "B",
 "SeatStatus": 2
 },
 {
 "SeatName": "C",
 "SeatStatus": 2
 },
 {
 "SeatName": "=",
 "SeatStatus": 2
 },
 {
 "SeatName": "=",
 "SeatStatus": 2
 },
 {
 "SeatName": "J",
 "SeatStatus": 2
 }
 ]
 },
 {
 "Row": 5,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 2
 },
 {
 "SeatName": "B",
 "SeatStatus": 2
 },
 {
 "SeatName": "C",
 "SeatStatus": 2
 },
 {
 "SeatName": "=",
 "SeatStatus": 2
 },
 {
 "SeatName": "=",
 "SeatStatus": 2
 },
 {
 "SeatName": "J",
 "SeatStatus": 2
 }
 ]
 },
 {
 "Row": 6,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 1
 },
 {
 "SeatName": "B",
 "SeatStatus": 1
 },
 {
 "SeatName": "C",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "J",
 "SeatStatus": 1
 }
 ]
 },
 {
 "Row": 7,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 1
 },
 {
 "SeatName": "B",
 "SeatStatus": 1
 },
 {
 "SeatName": "C",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "J",
 "SeatStatus": 1
 }
 ]
 },
 {
 "Row": 8,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 1
 },
 {
 "SeatName": "B",
 "SeatStatus": 1
 },
 {
 "SeatName": "C",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "J",
 "SeatStatus": 1
 }
 ]
 },
 {
 "Row": 9,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 1
 },
 {
 "SeatName": "B",
 "SeatStatus": 1
 },
 {
 "SeatName": "C",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "J",
 "SeatStatus": 1
 }
 ]
 },
 {
 "Row": 10,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 1
 },
 {
 "SeatName": "B",
 "SeatStatus": 1
 },
 {
 "SeatName": "C",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "J",
 "SeatStatus": 1
 }
 ]
 },
 {
 "Row": 11,
 "EmergencySaet": 1,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 2
 },
 {
 "SeatName": "B",
 "SeatStatus": 2
 },
 {
 "SeatName": "C",
 "SeatStatus": 2
 },
 {
 "SeatName": "=",
 "SeatStatus": 2
 },
 {
 "SeatName": "=",
 "SeatStatus": 2
 },
 {
 "SeatName": "J",
 "SeatStatus": 2
 }
 ]
 },
 {
 "Row": 12,
 "EmergencySaet": 1,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 2
 },
 {
 "SeatName": "B",
 "SeatStatus": 2
 },
 {
 "SeatName": "C",
 "SeatStatus": 2
 },
 {
 "SeatName": "=",
 "SeatStatus": 2
 },
 {
 "SeatName": "=",
 "SeatStatus": 2
 },
 {
 "SeatName": "J",
 "SeatStatus": 2
 }
 ]
 },
 {
 "Row": 13,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 1
 },
 {
 "SeatName": "B",
 "SeatStatus": 1
 },
 {
 "SeatName": "C",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "J",
 "SeatStatus": 1
 }
 ]
 },
 {
 "Row": 14,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 1
 },
 {
 "SeatName": "B",
 "SeatStatus": 1
 },
 {
 "SeatName": "C",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "J",
 "SeatStatus": 1
 }
 ]
 },
 {
 "Row": 15,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 1
 },
 {
 "SeatName": "B",
 "SeatStatus": 1
 },
 {
 "SeatName": "C",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "J",
 "SeatStatus": 1
 }
 ]
 },
 {
 "Row": 16,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 1
 },
 {
 "SeatName": "B",
 "SeatStatus": 1
 },
 {
 "SeatName": "C",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "J",
 "SeatStatus": 1
 }
 ]
 },
 {
 "Row": 17,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 1
 },
 {
 "SeatName": "B",
 "SeatStatus": 1
 },
 {
 "SeatName": "C",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "J",
 "SeatStatus": 1
 }
 ]
 },
 {
 "Row": 18,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 1
 },
 {
 "SeatName": "B",
 "SeatStatus": 1
 },
 {
 "SeatName": "C",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "J",
 "SeatStatus": 1
 }
 ]
 },
 {
 "Row": 19,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 1
 },
 {
 "SeatName": "B",
 "SeatStatus": 1
 },
 {
 "SeatName": "C",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 2
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "J",
 "SeatStatus": 1
 }
 ]
 },
 {
 "Row": 20,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 1
 },
 {
 "SeatName": "B",
 "SeatStatus": 1
 },
 {
 "SeatName": "C",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "J",
 "SeatStatus": 1
 }
 ]
 },
 {
 "Row": 21,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 1
 },
 {
 "SeatName": "B",
 "SeatStatus": 1
 },
 {
 "SeatName": "C",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "J",
 "SeatStatus": 1
 }
 ]
 },
 {
 "Row": 22,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 1
 },
 {
 "SeatName": "B",
 "SeatStatus": 1
 },
 {
 "SeatName": "C",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "J",
 "SeatStatus": 1
 }
 ]
 },
 {
 "Row": 23,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 1
 },
 {
 "SeatName": "B",
 "SeatStatus": 1
 },
 {
 "SeatName": "C",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 2
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "J",
 "SeatStatus": 1
 }
 ]
 },
 {
 "Row": 24,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 1
 },
 {
 "SeatName": "B",
 "SeatStatus": 1
 },
 {
 "SeatName": "C",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "J",
 "SeatStatus": 1
 }
 ]
 },
 {
 "Row": 25,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 1
 },
 {
 "SeatName": "B",
 "SeatStatus": 1
 },
 {
 "SeatName": "C",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "J",
 "SeatStatus": 1
 }
 ]
 },
 {
 "Row": 26,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 1
 },
 {
 "SeatName": "B",
 "SeatStatus": 1
 },
 {
 "SeatName": "C",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "=",
 "SeatStatus": 1
 },
 {
 "SeatName": "J",
 "SeatStatus": 1
 }
 ]
 },
 {
 "Row": 27,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 2
 },
 {
 "SeatName": "B",
 "SeatStatus": 2
 },
 {
 "SeatName": "C",
 "SeatStatus": 2
 },
 {
 "SeatName": "=",
 "SeatStatus": 2
 },
 {
 "SeatName": "=",
 "SeatStatus": 2
 },
 {
 "SeatName": "J",
 "SeatStatus": 2
 }
 ]
 },
 {
 "Row": 28,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 2
 },
 {
 "SeatName": "B",
 "SeatStatus": 2
 },
 {
 "SeatName": "C",
 "SeatStatus": 2
 },
 {
 "SeatName": "=",
 "SeatStatus": 2
 },
 {
 "SeatName": "=",
 "SeatStatus": 2
 },
 {
 "SeatName": "J",
 "SeatStatus": 2
 }
 ]
 },
 {
 "Row": 29,
 "EmergencySaet": 2,
 "CabinType": 3,
 "Seats": [
 {
 "SeatName": "A",
 "SeatStatus": 2
 },
 {
 "SeatName": "B",
 "SeatStatus": 2
 },
 {
 "SeatName": "C",
 "SeatStatus": 2
 },
 {
 "SeatName": "=",
 "SeatStatus": 2
 },
 {
 "SeatName": "=",
 "SeatStatus": 2
 },
 {
 "SeatName": "J",
 "SeatStatus": 2
 }
 ]
 }
 ],
 "PlaneType": "320",
 "PlaneClass": "214D"
 },
 "Code": "0000",
 "Message": "选座成功"
 }
 */
