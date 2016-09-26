/**
 * Created by ssyufei on 16/8/9.
 */

laAir.controller('laAir_MemberBeneficiaryPageCtl', ['$sce', '$filter', '$interval', '$document', '$window', '$scope', 'laUserService', 'laGlobalLocalService', function ($sce, $filter, $interval, $document, $window, $scope, laUserService, laGlobalLocalService) {

    $scope.$on("MemberContentPage", function (event, data) {
        var IsFrequentPassenger = data.IsFrequentPassenger;
        if (!IsFrequentPassenger) {
            $window.location.href = "MyInfo.html";
        }
    });

    $scope.title = "受益人";
    $document[0].title = $scope.title;
    /**
     * 设置导航栏ClassName
     * @type {boolean}
     */
    $scope.isMyInfoNav = true;

    $scope.isMem_Beneficiary = true;

    $scope.isAdd = true;

    $scope.BenefitList = new Array();

    $scope.showFoidDivCnt = 0;
    $scope.foIdTypeOptions = new Array();
    $scope.sexOptions = [{"v": 1, "t": "男"}, {"v": 2, "t": "女"}];
    $scope.benefit;
    $scope.FoidDiv;

    initBenefitInfo();
    QueryBenefitList();

    $scope.ParseBirthdayByFoid = function (f) {
        if (f.v == 1) {
            $scope.benefit.MB_Birthday = laGlobalLocalService.ParseBirthdayByIdCode(f.no);
        }
    };

    $scope.ChooseFoidType = function (f) {
        var sel = 0;
        for (var i = 0; i < $scope.FoidDiv.length; i++) {
            if ($scope.FoidDiv[i].s && f.v == $scope.FoidDiv[i].v && f.v > 0) {
                sel++;
            }
        }
        if (sel > 1) {
            f.v = 0;
            bootbox.alert("该证件类型已被选择,不能重复填写");
            return;
        }
    };

    $scope.btnShowMoreFoid = function () {
        for (var i = 0; i < $scope.FoidDiv.length; i++) {
            if (!$scope.FoidDiv[i].s) {
                $scope.FoidDiv[i].s = true;
                $scope.showFoidDivCnt++;
                if (!$scope.isAdd) {
                    $("#foid" + $scope.FoidDiv[i].v).removeAttr("readonly");
                    //$("#href" + $scope.FoidDiv[i].v).css("display", "block");
                } else {
                    //$("#foid" + $scope.FoidDiv[i].v).attr("readonly", "readonly");
                    //$("#href" + $scope.FoidDiv[i].v).css("display", "none");
                }
                break;
            }
        }
    };

    $scope.btnDelFoidDiv = function (f) {
        f.s = false;
        f.no = "";
        $scope.showFoidDivCnt--;
    };

    $scope.getChinesePYXing = function () {
        laUserService.getChinesePinYin($scope.benefit.MB_SecondName, function (backData, status) {
            if (backData.Code == laGlobalProperty.laServiceCode_Success) {
                if (!laGlobalLocalService.CheckStringIsEmpty(backData.PinYin)) {
                    $scope.benefit.MB_SecondNamePinYin = backData.PinYin;
                }
            }
        });
    };

    $scope.getChinesePYMing = function () {
        laUserService.getChinesePinYin($scope.benefit.MB_FirstName, function (backData, status) {
            if (backData.Code == laGlobalProperty.laServiceCode_Success) {
                if (!laGlobalLocalService.CheckStringIsEmpty(backData.PinYin)) {
                    $scope.benefit.MB_FirstNamePinYin = backData.PinYin;
                }
            }
        });
    };

    $scope.UpperCaseInfoSecondName = function () {
        $scope.benefit.MB_SecondNamePinYin = $scope.benefit.MB_SecondNamePinYin.toUpperCase();
    };

    $scope.UpperCaseInfoFirstName = function () {
        $scope.benefit.MB_FirstNamePinYin = $scope.benefit.MB_FirstNamePinYin.toUpperCase();
    };

    $scope.SearchFoid = function (fd) {
        for (var i = 0; i < $scope.foIdTypeOptions.length; i++) {
            if ($scope.foIdTypeOptions[i].v == fd.FoidType) {
                return $sce.trustAsHtml($scope.foIdTypeOptions[i].t + fd.Foid + "<br>");
            }
        }
    };

    $scope.btnShowAddInfo = function () {
        $('.modal').modal('show');
    };

    $scope.btnEditBenefit = function (b) {
        b.MB_Birthday = $filter('date')(b.MB_Birthday, 'yyyy-MM-dd');
        //$scope.benefit = b;
        $scope.benefit.BeneficiaryInfolist = b.BeneficiaryInfolist;
        $scope.benefit.MB_Approved = b.MB_Approved;
        $scope.benefit.MB_Birthday = b.MB_Birthday;
        $scope.benefit.MB_Enabled = b.MB_Enabled;
        $scope.benefit.MB_FPCardNo = b.MB_FPCardNo;
        $scope.benefit.MB_FirstName = b.MB_FirstName;
        $scope.benefit.MB_FirstNamePinYin = b.MB_FirstNamePinYin;
        $scope.benefit.MB_Name = b.MB_Name;
        $scope.benefit.MB_SecondName = b.MB_SecondName;
        $scope.benefit.MB_SecondNamePinYin = b.MB_SecondNamePinYin;
        $scope.benefit.MB_SexType = b.MB_SexType;
        $scope.benefit.Tid = b.Tid;

        $scope.isAdd = false;

        $scope.showFoidDivCnt = 0;
        var pfoid = b.BeneficiaryInfolist;
        for (var i = 0; i < $scope.FoidDiv.length; i++) {
            $scope.FoidDiv[i].s = false;
            $scope.FoidDiv[i].no = "";
            $scope.FoidDiv[i].h = false;
            for (var n = 0; n < pfoid.length; n++) {
                if (pfoid[n].FoidType == $scope.FoidDiv[i].v) {
                    $scope.FoidDiv[i].no = pfoid[n].Foid;
                    $scope.FoidDiv[i].s = true;
                    $scope.FoidDiv[i].h = true;
                    //$("#href" + $scope.FoidDiv[i].v).css("display", "none");
                    $scope.showFoidDivCnt++;
                    break;
                }
            }
        }

        $('.modal').modal('show');
    };

    $scope.btnDeleteBenefit = function (b) {
        bootbox.confirm("是否要删除该受益人?", function (result) {
            if (result) {
                laUserService.DelBenefit(b.Tid, function (backData, status) {
                    var rs = backData;
                    if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                        QueryBenefitList();
                    } else {
                        bootbox.alert(rs.Message);
                    }
                });
            }
        });
    };

    $scope.btnAddBenefit = function () {
        $scope.benefit.MB_Birthday = $("#birthday").val();

        if (laGlobalLocalService.CheckStringIsEmpty($scope.benefit.MB_Birthday)) {
            bootbox.alert("请输入出生日期");
            return;
        }
        if (!laGlobalLocalService.CheckDateFormat($scope.benefit.MB_Birthday)) {
            bootbox.alert("请按照YYYY-MM-DD格式输入出生日期");
            return;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.benefit.MB_SecondName)) {
            bootbox.alert("请输入中文姓");
            return;
        }
        if (laGlobalLocalService.getChineseStringCnt($scope.benefit.MB_SecondName) <= 0) {
            bootbox.alert("中文姓请输入汉字");
            return;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.benefit.MB_FirstName)) {
            bootbox.alert("请输入中文名");
            return;
        }
        if (laGlobalLocalService.getChineseStringCnt($scope.benefit.MB_FirstName) <= 0) {
            bootbox.alert("中文名请输入汉字");
            return;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.benefit.MB_SecondNamePinYin)) {
            bootbox.alert("请输入中文姓拼音");
            return;
        }
        if (laGlobalLocalService.CheckStringIsEmpty($scope.benefit.MB_FirstNamePinYin)) {
            bootbox.alert("请输入中文名拼音");
            return;
        }

        $scope.benefit.BeneficiaryInfolist = new Array();
        for (var i = 0; i < $scope.FoidDiv.length; i++) {
            var f = $scope.FoidDiv[i];
            if (f.s && f.v > 0) {
                if (laGlobalLocalService.CheckStringIsEmpty(f.no)) {
                    bootbox.alert("请输入证件号码");
                    return;
                }
                if (f.v == 1) {
                    if (!laGlobalLocalService.CheckStringLengthRange(f.no, 15)) {
                        bootbox.alert("请输入15-18位的身份证号码");
                        return;
                    }
                    if (!laGlobalLocalService.IdentityCodeValid(f.no)) {
                        bootbox.alert("请输入有效的身份证号码");
                        return;
                    }
                }
                if (f.v == 2) {
                    if (!laGlobalLocalService.CheckPassportFormat(f.no)) {
                        bootbox.alert("请输入有效的护照号码");
                        return;
                    }
                }
                $scope.benefit.BeneficiaryInfolist.push({"Foid": f.no, "FoidType": f.v});
            }
        }

        if ($scope.benefit.BeneficiaryInfolist.length == 0) {
            bootbox.alert("请至少填写一种证件类型");
            return;
        }

        if (!checkSameFoidFromList()) {
            bootbox.alert("不同受益人的证件类型和号码不能相同");
            return;
        }

        laUserService.AddBenefit($scope.benefit, function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $('.modal').modal('hide');
                initBenefitInfo();
                QueryBenefitList();
            } else {
                bootbox.alert(rs.Message);
            }
        });

    };

    $scope.btnSaveBenefit = function () {
        var newFoidlist = new Array();
        for (var i = 0; i < $scope.FoidDiv.length; i++) {
            var f = $scope.FoidDiv[i];
            if (f.s && !f.h && f.v > 0) {
                if (laGlobalLocalService.CheckStringIsEmpty(f.no)) {
                    bootbox.alert("请输入证件号码");
                    return;
                }
                if (f.v == 1) {
                    if (!laGlobalLocalService.CheckStringLengthRange(f.no, 15)) {
                        bootbox.alert("请输入15-18位的身份证号码");
                        return;
                    }
                    if (!laGlobalLocalService.IdentityCodeValid(f.no)) {
                        bootbox.alert("请输入有效的身份证号码");
                        return;
                    }
                }
                if (f.v == 2) {
                    if (!laGlobalLocalService.CheckPassportFormat(f.no)) {
                        bootbox.alert("请输入有效的护照号码");
                        return;
                    }
                }
                newFoidlist.push({"Foid": f.no, "FoidType": f.v});
            }
        }

        if (newFoidlist.length <= 0) {
            bootbox.alert("证件信息没有变化无须提交修改");
            return;
        }

        if (!checkSameFoidFromList()) {
            bootbox.alert("不同受益人的证件类型和号码不能相同");
            return;
        }

        laUserService.AddBenefitIdInfo($scope.benefit.Tid, newFoidlist, function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $('.modal').modal('hide');
                $scope.isAdd = true;
                initBenefitInfo();
                QueryBenefitList();
            } else {
                bootbox.alert(rs.Message);
            }
        });
    };

    $scope.btnCancelBenefit = function () {
        $('.modal').modal('hide');
        initBenefitInfo();
    };

    function checkSameFoidFromList() {
        if ($scope.BenefitList.length == 0) {
            return true;
        }

        var alist = new Array();
        for (var i = 0; i < $scope.BenefitList.length; i++) {
            for (var l = 0; l < $scope.BenefitList[i].BeneficiaryInfolist.length; l++) {
                alist.push($scope.BenefitList[i].BeneficiaryInfolist[l]);
            }
        }

        for (var n = 0; n < $scope.FoidDiv.length; n++) {
            for (var i = 0; i < alist.length; i++) {
                if ($scope.FoidDiv[n].v == alist[i].FoidType &&
                    $scope.FoidDiv[n].no == alist[i].Foid) {
                    if ($scope.isAdd) {
                        return false;
                    } else {
                        if (!$scope.FoidDiv[n].h) {
                            return false;
                        }
                    }

                }
            }
        }

        return true;
    }

    function initBenefitInfo() {

        $scope.foIdTypeOptions = new Array();
        var fdTmp = laEntityEnumfoIdTypeOptions;
        $scope.foIdTypeOptions.push({v: 0, t: '==请选择=='});
        for (var i = 0; i < fdTmp.length; i++) {
            var fd = {v: fdTmp[i].v, t: fdTmp[i].t};
            $scope.foIdTypeOptions.push(fd);
        }

        $scope.showFoidDivCnt = 0;
        $scope.isAdd = true;

        $scope.benefit = {
            "Tid": 0,
            "MB_Name": "",
            "MB_FPCardNo": "",
            "MB_SexType": 1,
            "MB_Birthday": "",
            "MB_SecondName": "",
            "MB_FirstName": "",
            "MB_SecondNamePinYin": "",
            "MB_FirstNamePinYin": "",
            "BeneficiaryInfolist": new Array()
        };

        $scope.FoidDiv = new Array();
        for (var i = 0; i < fdTmp.length; i++) {
            var simF = {
                "v": fdTmp[i].v,
                "t": fdTmp[i].t,
                "no": "",
                "s": false,
                "h": false
            };
            if (i == 0) {
                simF.s = true;
            }
            if (simF.s) {
                $scope.showFoidDivCnt++;
            }
            $scope.FoidDiv.push(simF);
        }
    }

    function QueryBenefitList() {
        laUserService.QueryBenefitList(function (backData, status) {
            var rs = backData;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                $scope.BenefitList = rs.Result;
            }
        });
    }

}]);


