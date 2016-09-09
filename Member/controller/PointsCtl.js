/**
 * Created by Jerry on 16/7/4.
 */

laAir.controller('laAir_MemberPointsPageCtl', ['$filter', '$interval', '$document', '$window', '$scope', 'laUserService', 'laGlobalLocalService', function ($filter, $interval, $document, $window, $scope, laUserService, laGlobalLocalService) {

    $scope.$on("MemberContentPage", function (event, data) {
        var IsFrequentPassenger = data.IsFrequentPassenger;
        if (!IsFrequentPassenger) {
            $window.location.href = "MyInfo.html";
        }
    });

    $scope.title = "会员积分";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isMyInfoNav = true;

    $scope.isMem_Points = true;

    $scope.MemberLevelV;

    $scope.MemberLevel = laEntityEnummemberLevel;
    $scope.PointsAuditStatus = laEntityEnummemberPointsAuditStatus;
    $scope.PointType = laEntityEnummemberPointType;
    $scope.PointState = [{v: 1, t: '累积积分'}, {v: 2, t: '升级积分'}, {v: 3, t: '消费积分'}];
    $scope.PointEnabled = [{v: 1, t: '有效'}, {v: 2, t: '无效'}];

    var today = new Date();
    var endtime = $filter('date')(new Date(), 'yyyy-MM-dd');
    var starttime = $filter('date')(new Date(today.setDate(today.getDate() - 180)), 'yyyy-MM-dd');
    $("#endTime").val(endtime);
    $("#startTime").val(starttime);
    $scope.endTime = endtime;
    $scope.startTime = starttime;

    $scope.approved = 0;

    $scope.PointsList;

    $scope.pageIndex = 1;
    $scope.pageSize = 10;
    $scope.totalPage = 0;

    $scope.curP;

    QueryPointsList();

    $scope.showDetail = function (p, idx) {
        $scope.curP = p;console.log(idx);

        new PopupLayer({
            trigger: "#tr" + idx, popupBlk: "#divmsgcontent", closeBtn: "#divclosemsgcontent"
        });
    };

    $scope.getEnumTextPointEnabled = function (v) {
        return laGlobalLocalService.getEnumTextByKeyT(v, $scope.PointEnabled);
    };

    $scope.getEnumTextPointState = function (v) {
        return laGlobalLocalService.getEnumTextByKeyT(v, $scope.PointState);
    };

    $scope.getEnumTextPointsAuditStatus = function (v) {
        return laGlobalLocalService.getEnumTextByKeyT(v, $scope.PointsAuditStatus);
    };

    $scope.getEnumTextPointType = function (v) {
        return laGlobalLocalService.getEnumTextByKeyT(v, $scope.PointType);
    };

    $scope.btnQueryClick = function () {
        QueryPointsList();
    };

    $scope.btnPrePageClick = function () {
        if ($scope.pageIndex == 1) {
            return;
        }
        $scope.pageIndex--;
        QueryPointsList();
    };

    $scope.btnNextPageClick = function () {
        if ($scope.pageIndex == $scope.totalPage) {
            return;
        }
        $scope.pageIndex++;
        QueryPointsList();
    };

    function QueryPointsList() {
        $scope.endTime = $("#endTime").val();
        $scope.startTime = $("#startTime").val();
        laUserService.QueryPointsList($scope.pageIndex, $scope.pageSize, $scope.startTime, $scope.endTime, $scope.approved, function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.PointsList = rs;
                $scope.totalPage = rs.PageCount;

                for (var i = 0; i < $scope.MemberLevel.length; i++) {
                    if ($scope.PointsList.Level == $scope.MemberLevel[i].n) {
                        $scope.MemberLevelV = i + 1;
                        break;
                    }
                }

                /*
                 $scope.totalPage = 0;
                 var cn = rs.DataCount;
                 if (cn > 0) {
                 if ($scope.pageSize >= cn) {
                 $scope.totalPage = 1;
                 } else {
                 $scope.totalPage = Math.ceil(cn / $scope.pageSize);
                 }
                 }
                 */
                /*

                 "FlightDate": "2016-07-17T00:00:00",
                 "FlightNo": "GJ8860",
                 "Cabin": "Q",
                 "From": "WDS",
                 "To": "HGH",
                 "IntegralAccu": 800,
                 "IntegralForLevel": 800,
                 "EffectiveDate": "0001-01-01T00:00:00",
                 "Reviewed": 1
                 */
                /*
                 var v = {
                 "Name": "天空之城",
                 "cardNo": "123456789012",
                 "Level": "钻石",
                 "IntegralLeft": 15000,
                 "NextLevel": "无",
                 "IntegralCount": 30000,
                 "LevelUpIntegral": 30000,
                 "FlightIntegral": 23000,
                 "Result": [{
                 "CreateDate": "0001-01-01T00:00:00",
                 "IA_VolumeFraction": 2000,
                 "EffectiveDate": "2016-07-14T00:00:00+08:00",
                 "Type": 2,
                 "Reviewed": 1,
                 "IntegralAttr": 1,
                 "Segment": 2
                 }],
                 "Code": "0000",
                 "Message": "获取成功"
                 };
                 */
            }
        })
    }

}]);

