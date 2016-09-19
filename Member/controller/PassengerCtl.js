/**
 * Created by Jerry on 16/2/16.
 */

laAir.controller('laAir_MemberPassengerPageCtl', ['$document', '$window', '$scope', 'laUserService', 'laGlobalLocalService', function ($document, $window, $scope, laUserService, laGlobalLocalService) {

    $scope.title = "常用旅客信息";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isMyInfoNav = true;

    $scope.isMem_StationPsg = true;

    $scope.psgTypeOptions = laEntityEnumpsgTypeOptions;
    $scope.foIdTypeOptions = laEntityEnumfoIdTypeOptions;

    //当前用户信息
    $scope.UserInfo;
    //常旅客列表
    $scope.PassengerList;
    $scope.Passenger = InitNewPassenger();

    $scope.psgNameValid = true;
    $scope.psgFoidValid = true;
    $scope.psgMobileValid = true;
    $scope.psgEMailValid = true;
    $scope.psgBirthdayValid = true;

    $scope.pageIndex = 1;
    $scope.pageSize = 2;
    $scope.totalPage = 0;
    $scope.pageIndexCnt = 2;
    $scope.pageIndexList = new Array();
    $scope.inputPageIndex = "";

    QueryCurrentUserInfo();
    QueryPassengerList();

    $scope.CheckFlierName = function () {
        $scope.psgNameValid = true;
        if (laGlobalLocalService.CheckStringIsEmpty($scope.Passenger.FlierName)) {
            $scope.psgNameValid = false;
            return false;
        } else {
            return true;
        }
    };

    $scope.CheckFoid = function () {
        $scope.psgFoidValid = true;
        if (laGlobalLocalService.CheckStringIsEmpty($scope.Passenger.Foid)) {
            $scope.psgFoidValid = false;
            return false;
        }
        $scope.Passenger.Foid = $scope.Passenger.Foid.toUpperCase();
        if ($scope.Passenger.FoidType == 1) {
            if (!laGlobalLocalService.IdentityCodeValid($scope.Passenger.Foid)) {
                $scope.psgFoidValid = false;
                return false;
            } else {
                $scope.Passenger.Brithday = laGlobalLocalService.ParseBirthdayByIdCode($scope.Passenger.Foid);
                return true;
            }
        }
        if ($scope.Passenger.FoidType == 2) {
            if (!laGlobalLocalService.CheckPassportFormat($scope.Passenger.Foid)) {
                $scope.psgFoidValid = false;
                return false;
            }
        }
        return true;
    };

    $scope.CheckMobile = function () {
        $scope.psgMobileValid = true;
        if (laGlobalLocalService.CheckStringIsEmpty($scope.Passenger.Mobile)) {
            return true;
        }
        if (!laGlobalLocalService.CheckStringLength($scope.Passenger.Mobile, 11)) {
            $scope.psgMobileValid = false;
            return false;
        } else {
            return true;
        }
    };

    $scope.CheckEMail = function () {
        $scope.psgEMailValid = true;
        if (laGlobalLocalService.CheckStringIsEmpty($scope.Passenger.EMail)) {
            return true;
        }
        if (!laGlobalLocalService.CheckEMailFormat($scope.Passenger.EMail)) {
            $scope.psgEMailValid = false;
            return false;
        } else {
            return true;
        }
    };

    $scope.CheckBirthday = function () {
        $scope.psgBirthdayValid = true;
        if (laGlobalLocalService.CheckStringIsEmpty($scope.Passenger.Brithday) || !laGlobalLocalService.CheckDateFormat($scope.Passenger.Brithday)) {
            $scope.psgBirthdayValid = false;
            return false;
        } else {
            return true;
        }
    };

    $scope.btnAddPassengerClick = function () {

        $scope.Passenger.Brithday = $("#psgBirthday").val();

        if (!$scope.CheckFlierName()) {
            return;
        }
        if (!$scope.CheckFoid()) {
            return;
        }
        if (!$scope.CheckMobile()) {
            return;
        }
        if (!$scope.CheckEMail()) {
            return;
        }
        if (!$scope.CheckBirthday()) {
            return;
        }

        laUserService.MaintainStationPassengers($scope.Passenger, function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                QueryPassengerList();
                if ($scope.Passenger.Tid <= 0) {
                    //$scope.PassengerList[$scope.PassengerList.length] = $scope.Passenger;
                } else {
                    bootbox.alert('修改常旅客信息成功');
                }
                $scope.Passenger = InitNewPassenger();

            } else {
                bootbox.alert('维护常旅客信息失败:' + rs.Message, function () {
                    //callback
                });
            }

        })

    };

    $scope.btnDelPassengerClick = function (tid) {
        bootbox.confirm("是否要删除该旅客信息?", function (result) {
            if (result) {
                var t = new Array();
                t[0] = tid;
                laUserService.DelMaintainStationPassengers(t, function (backData, status) {
                    var rs = backData;
                    if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                        /*
                         var n = $scope.PassengerList.length;
                         for (var i = 0; i < n; i++) {
                         if ($scope.PassengerList[i].Tid == tid) {
                         $scope.PassengerList.splice(i, 1);
                         }
                         }
                         */
                        QueryPassengerList();
                    } else {
                        bootbox.alert('删除常旅客信息失败' + rs.Message, function () {
                        });
                    }
                })
            }
        });
    };

    $scope.btnEditPassengerClick = function (psg) {
        //$scope.Passenger = psg;
        $scope.Passenger.FlierName = psg.FlierName;
        $scope.Passenger.Foid = psg.Foid;//身份证
        $scope.Passenger.FoidType = psg.FoidType;//证件类型：1身份证，2护照，100其他
        $scope.Passenger.TravellerType = psg.TravellerType;//乘客类型：1成人，2儿童
        $scope.Passenger.Mobile = psg.Mobile;//手机号
        $scope.Passenger.EMail = psg.EMail;//邮箱
        $scope.Passenger.Brithday = psg.Brithday;//生日，儿童必须要有生日，可从身份证解析，
        $scope.Passenger.Tid = psg.Tid;//Tid为0则是添加，Tid不为了0为修改
    };

    $scope.btnPrePageClick = function () {
        if ($scope.pageIndex == 1) {
            return;
        }
        $scope.pageIndex--;
        QueryPassengerList();
    };

    $scope.btnNextPageClick = function () {
        if ($scope.pageIndex == $scope.totalPage) {
            return;
        }
        $scope.pageIndex++;
        QueryPassengerList();
    };

    $scope.btnPageClick = function (p) {
        $scope.pageIndex = p;
        QueryPassengerList();
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
        QueryPassengerList();
    };

    function InitNewPassenger() {
        var result = new laEntityStationPassenger();
        result.TravellerType = 1;
        result.FoidType = 1;
        result.Tid = 0; //0表示添加
        return result;
    }

    function QueryCurrentUserInfo() {
        laUserService.GetCurrentUserInfo(function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.UserInfo = rs;
            }
        })
    }

    function QueryPassengerList() {
        laUserService.QueryStationPassengers($scope.pageIndex, $scope.pageSize, '', '', function (backData, status) {
            var rs = backData;
            $scope.PassengerList = rs;

            var allcount = 0;
            if ($scope.PassengerList.length > 0) {
                allcount = $scope.PassengerList[0].AllCount;
            }
            $scope.totalPage = Math.ceil(allcount / $scope.pageSize);

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
        })
    }

}]);