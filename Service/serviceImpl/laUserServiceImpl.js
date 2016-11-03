/**
 * 用户业务类
 * Created by Jerry on 15/12/26.
 */

var laUser = angular.module('laUser', ['laGlobal']);

/**
 * 用户操作类
 */
laUser.factory('laUserService', ['$http', 'laGlobalHTTPService', 'laGlobalLocalService', '$filter', function ($http, laGlobalHTTPService, laGlobalLocalService, $filter) {
    var laUserService = {};

    /**
     * 用户登录
     * @param userName        用户名
     * @param userPwd         用户密码
     * @param validCode       验证码
     * @param callBack        回调函数
     */
    laUserService.Login = function (userName, userPwd, validCode, callBack) {

        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_Login;
        requestParam.SessionId = '';
        var requestBody = {};
        requestBody.LoginWay = 1;
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.UserName = userName;
        requestBody.Password = userPwd;
        requestBody.Token = '';
        requestBody.VerifyCode = validCode;
        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData,
            function (data, status) {
                var uInfo = data;

                var userInfo = new laEntityUser();
                userInfo.Code = uInfo.Code;
                userInfo.Message = uInfo.Message;
                if (status == true && userInfo.Code == laGlobalProperty.laServiceCode_Success) {
                    /*
                     userInfo.Address = uInfo.Address;
                     userInfo.EMail = uInfo.EMail;
                     userInfo.Mobile = uInfo.Mobile;
                     userInfo.Name = uInfo.Name;
                     userInfo.Sex = uInfo.Sex;
                     userInfo.UserName = uInfo.UserName;
                     userInfo.Brithday = uInfo.Brithday;
                     userInfo.SexCH = uInfo.SexCH;
                     userInfo.FoidType = uInfo.FoidType;
                     userInfo.FoidTypeCH = uInfo.FoidTypeCH;
                     userInfo.Foid = uInfo.Foid;
                     userInfo.SessionOut = uInfo.SessionOut;
                     */
                    userInfo.SessionID = uInfo.SessionID;
                    laGlobalLocalService.writeCookie('UserInfo', JSON.stringify(userInfo), 0);
                }
                callBack(userInfo, status);
            }
        )
    };

    /**
     * 退出登录
     * @param callBack
     * @constructor
     */
    laUserService.UserLogOut = function (callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_UserLogOut;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                if (data.Code == laGlobalProperty.laServiceCode_Success) {
                    laGlobalLocalService.removeCookie('UserInfo');
                }
                callBack(data, status);
            }
        )
    };

    /**
     * 查询当前登录用户信息
     * @param callBack
     * @constructor
     */
    laUserService.GetCurrentUserInfo = function (callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_GetCurrentUserInfo;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                var uInfo = data;
                var userInfo = new laEntityUser();
                userInfo.Code = uInfo.Code;
                userInfo.Message = uInfo.Message;

                if (status == true) {
                    userInfo.Address = uInfo.Address;
                    userInfo.EMail = uInfo.EMail;
                    userInfo.Mobile = uInfo.Mobile;
                    userInfo.Name = uInfo.Name;
                    userInfo.Brithday = uInfo.Brithday;
                    userInfo.Sex = uInfo.Sex;
                    userInfo.SexCH = uInfo.SexCH;
                    userInfo.FoidType = uInfo.FoidType;
                    userInfo.FoidTypeCH = uInfo.FoidTypeCH;
                    userInfo.Foid = uInfo.Foid;
                    userInfo.UserName = uInfo.UserName;
                    userInfo.SessionOut = uInfo.SessionOut;
                }

                callBack(userInfo, status);
            }
        )
    };

    /**
     * 修改用户信息
     * @param u 用户信息
     * @param callBack
     * @constructor
     */
    laUserService.ModifyUserInfo = function (u, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_ModifyUserInfo;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.Foid = u.Foid;
        requestBody.FoidType = u.FoidType;
        requestBody.Brithday = u.Brithday;
        requestBody.Address = u.Address;
        requestBody.Email = u.Email;
        requestBody.UserInfoAmendVerifyCode = u.ValidCode;
        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 发送手机验证码-修改个人信息
     * @param callBack
     * @constructor
     */
    laUserService.SendModifyUserInfoMobileCode = function (callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_SendMobileCodeForModifyUserInfo;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();
        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                var backData = data;
                var baseEntity = new laEntityBase();

                baseEntity.Code = backData.Code;
                baseEntity.Message = backData.Message;
                baseEntity.SessionID = backData.SessionID;

                callBack(baseEntity, status);
            }
        )
    };

    /**
     * 检查登录
     * @returns {boolean}
     * @constructor
     */
    laUserService.CheckLogin = function (callBack) {
        var result = false;
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_GetCurrentUserInfo;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                var uInfo = data;
                if (uInfo.Code == laGlobalProperty.laServiceCode_Success && uInfo.SessionOut == false) {
                    result = true;
                } else {
                    result = false;
                }

                callBack(uInfo, result);
            }
        );

        /*
         var url = laGlobalProperty.laServiceUrl_Interface;
         $.ajax({
         url: url,
         type: 'POST',
         async: false,
         dataType: 'json',
         contentType: 'application/json; charset=UTF-8',
         data: postData,
         success: function (data) {
         var rs = data;
         if (rs.Code == laGlobalProperty.laServiceCode_Success && rs.SessionOut == false) {
         result = true;
         } else {
         result = false;
         }
         callBack(rs, result);
         }
         });
         */

    };

    /**
     * 用户注册
     * @param userName            用户名
     * @param foId                身份证
     * @param pwd                 密码
     * @param mobile              手机号
     * @param mobileVerifyCode    手机验证码
     * @param callBack
     * @constructor
     */
    laUserService.Register = function (userName, foId, pwd, mobile, mobileVerifyCode, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_RegisterUser;
        requestParam.SessionId = laGlobalLocalService.getCookie('SessionID');
        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.Name = userName;
        requestBody.Foid = foId;
        requestBody.Password = pwd;
        requestBody.Mobile = mobile;
        requestBody.MobileVerifyCode = mobileVerifyCode;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 发送注册验证码
     * @param mobile     接收手机号
     * @param imageVerifyCode 图片验证码
     * @param sessionID
     * @param callBack
     * @constructor
     */
    laUserService.SendRegisterMobileCode = function (mobile, imageVerifyCode, sessionID, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_SendRegisterMobileCode;
        requestParam.SessionId = sessionID;
        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.Mobile = mobile;
        requestBody.ImageVerifyCode = imageVerifyCode;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                var backData = data;
                var baseEntity = new laEntityBase();

                baseEntity.Code = backData.Code;
                baseEntity.Message = backData.Message;
                baseEntity.SessionID = backData.SessionID;

                callBack(baseEntity, status);
            }
        )
    };

    /**
     * 注册时发送短信验证码之前获取图片验证码
     * @param callBack
     * @constructor
     */
    laUserService.ImageVerifyCodeForRegisterSendMobileValid = function (callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_ImageVerifyCodeForRegister;
        requestParam.SessionId = '';

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 发送找回密码的短信验证码
     * @param userId
     * @param foid
     * @param imgValidCode
     * @param callBack
     * @constructor
     */
    laUserService.SendFindPasswordMobileCode = function (userId, foid, imgValidCode, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_SendFindPwdMobileCode;
        requestParam.SessionId = '';
        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.UserName = userId;
        requestBody.Foid = foid;
        requestBody.ImageVerifyCode = imgValidCode;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 找回密码
     * @param userId
     * @param foid
     * @param newpwd
     * @param mobileVerifyCode
     * @param callBack
     * @constructor
     */
    laUserService.FindLoginPassword = function (userId, foid, newpwd, mobileVerifyCode, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_FindLoginPassword;
        requestParam.SessionId = laGlobalLocalService.getCookie('SessionID');
        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.UserName = userId;
        requestBody.Foid = foid;
        requestBody.Password = newpwd;
        requestBody.MobileVerifyCode = mobileVerifyCode;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 查询常用乘机人信息列表
     * @param newPageIndex
     * @param pageSize
     * @param name
     * @param foid
     * @param callBack
     * @constructor
     */
    laUserService.QueryStationPassengers = function (newPageIndex, pageSize, name, foid, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_QueryStationPassengers;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.NewPageIndex = newPageIndex;
        requestBody.OnePageCount = pageSize;
        requestBody.Name = name;
        requestBody.Foid = foid;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                var psgList = new Array();
                var psgData = data;
                if (status == true && psgData.Code == laGlobalProperty.laServiceCode_Success) {
                    var n = psgData.Result.Fliers.length;
                    for (var i = 0; i < n; i++) {
                        var tmpPsg = psgData.Result.Fliers[i];
                        var psg = new laEntityStationPassenger();
                        psg.FlierName = tmpPsg.FlierName;
                        psg.Foid = tmpPsg.Foid;
                        psg.FoidType = tmpPsg.FoidType;
                        psg.FoidTypeCH = tmpPsg.FoidTypeCH;
                        psg.TravellerType = tmpPsg.TravellerType;
                        psg.TravellerTypeCH = tmpPsg.TravellerTypeCH;
                        psg.Mobile = tmpPsg.Mobile;
                        psg.EMail = tmpPsg.EMail;
                        psg.Brithday = tmpPsg.Brithday;
                        psg.Tid = tmpPsg.Tid;
                        psg.AllCount = psgData.Count;
                        psgList[i] = psg;
                    }
                }
                callBack(psgList, status);
            }
        )
    };

    /**
     * 查询常用乘机人详情
     * @param tid
     * @param callBack
     * @constructor
     */
    laUserService.QueryStationPassengersDetail = function (tid, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_QueryStationPsgDetail;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.Tid = tid;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 常用乘机人信息维护
     * @param f
     * @param callBack
     * @constructor
     */
    laUserService.MaintainStationPassengers = function (f, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_MaintainStationPassengers;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.FlierName = f.FlierName;
        requestBody.Foid = f.Foid;
        requestBody.FoidType = f.FoidType;
        requestBody.TravellerType = f.TravellerType;
        requestBody.Mobile = f.Mobile;
        requestBody.EMail = f.EMail;
        requestBody.Brithday = f.Brithday;
        requestBody.Tid = f.Tid;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 删除常旅客
     * @param tids id 列表
     * @param callBack
     * @constructor
     */
    laUserService.DelMaintainStationPassengers = function (tids, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_DelMaintainStationPassengers;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.Tids = tids;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 修改密码
     * @param oldPwd
     * @param newPwd
     * @param callBack
     * @constructor
     */
    laUserService.ChangeUserPassword = function (oldPwd, newPwd, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_ChangeLoginPwd;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.OldPassword = oldPwd;
        requestBody.Password = newPwd;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 查询机场信息
     * @param airportCode 可空
     * @param callBack
     * @constructor
     */
    laUserService.QueryAirportInfo = function (airportCode, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_QueryAirportList;
        requestParam.SessionId = '';//laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.AirportCode = airportCode;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    laUserService.FillCityAirportInfo = function (cityObjIdList, callBack) {
        laUserService.QueryAirportInfo('', function (dataBack, status) {
            var rs = dataBack;
            if (rs.Code == laGlobalProperty.laServiceCode_Success) {
                Vcity.allCityNamelist = '';
                Vcity.allCityCodelist = '';
                var airlist = new Array();
                var hotairlist = new Array();
                var AirPostdata = rs.Result.AllAirports;
                var AirHotPostdata = rs.Result.HotAirports;
                var nlength = AirPostdata.length;
                for (var i = 0; i < nlength; i++) {
                    airlist[i] = AirPostdata[i].CityName + '|' + AirPostdata[i].PingYin + '|' +
                        AirPostdata[i].PingYinFirst + '|' + AirPostdata[i].AirportCode;

                    Vcity.allCityNamelist += '|' + AirPostdata[i].CityName + '|';
                    Vcity.allCityCodelist += '|' + AirPostdata[i].AirportCode + '|';
                }

                Vcity.allCity = airlist;

                nlength = AirHotPostdata.length;
                for (var i = 0; i < nlength; i++) {
                    hotairlist[i] = AirHotPostdata[i].CityName + '|' + AirHotPostdata[i].PingYin + '|' +
                        AirHotPostdata[i].PingYinFirst + '|' + AirHotPostdata[i].AirportCode;
                }
                Vcity.allHostCity = hotairlist;

                var citys = Vcity.allCity, match, letter,
                    regEx = Vcity.regEx,
                    reg2 = /^[a-h]$/i, reg3 = /^[i-p]$/i, reg4 = /^[q-z]$/i;
                if (!Vcity.oCity) {
                    Vcity.oCity = {hot: {}, ABCDEFGH: {}, IJKLMNOP: {}, QRSTUVWXYZ: {}};
                    for (var i = 0, n = citys.length; i < n; i++) {
                        match = regEx.exec(citys[i]);
                        letter = match[3].toUpperCase();
                        if (reg2.test(letter)) {
                            if (!Vcity.oCity.ABCDEFGH[letter]) Vcity.oCity.ABCDEFGH[letter] = [];
                            Vcity.oCity.ABCDEFGH[letter].push(citys[i]);
                        } else if (reg3.test(letter)) {
                            if (!Vcity.oCity.IJKLMNOP[letter]) Vcity.oCity.IJKLMNOP[letter] = [];
                            Vcity.oCity.IJKLMNOP[letter].push(citys[i]);
                        } else if (reg4.test(letter)) {
                            if (!Vcity.oCity.QRSTUVWXYZ[letter]) Vcity.oCity.QRSTUVWXYZ[letter] = [];
                            Vcity.oCity.QRSTUVWXYZ[letter].push(citys[i]);
                        }
                        //热门城市 前16条
                        /*if (i < 16) {
                            if (!Vcity.oCity.hot['hot']) Vcity.oCity.hot['hot'] = [];
                            Vcity.oCity.hot['hot'].push(citys[i]);
                        }*/
                    }
                    for (var i=0; i< Vcity.allHostCity.length;i++){
                        if (!Vcity.oCity.hot['hot']) Vcity.oCity.hot['hot'] = [];
                        Vcity.oCity.hot['hot'].push(Vcity.allHostCity[i]);
                    }
                }

                var cityLength = cityObjIdList.length;
                for (var n = 0; n < cityLength; n++) {
                    new Vcity.CitySelector({input: cityObjIdList[n]});
                }

                callBack();
            }
        })
    };

    laUserService.SearchCityCodeByCityName = function (cName) {
        var citylist = Vcity.allCityNamelist.split("|");
        var codelist = Vcity.allCityCodelist.split("|");
        var n = citylist.length;
        for (var i = 0; i < n; i++) {
            if (cName == citylist[i]) {
                return codelist[i];
            }
        }
        return "";
    };

    /**
     * 查询新闻列表
     * @param callBack
     * @param queryNews
     * @constructor
     */
    laUserService.QueryNewList = function (callBack, queryNews) {

        var newsList = {
            "list": [{"n": 51, "showindex": 950, "v":true, "t": "关于长龙航空全面禁止航空运输三星Galaxy Note7 手机的通告", "d": "2016-10-28", "c": ""},
                {"n": 50, "showindex": 951, "v":true, "t": "用爱心点燃希望 让孩童沐浴阳光", "d": "2016-10-27", "c": ""},
                {"n": 49, "showindex": 952, "v":true, "t": "冬春换季 长龙航空将新开10条航线", "d": "2016-10-27", "c": ""},
                {"n": 48, "showindex": 953, "v":true, "t": "长龙航空圆满完成全国首架B737-300货机 WQAR改装", "d": "2016-10-17", "c": ""},
                {"n": 47, "showindex": 954, "v":true, "t": "长龙航空打造“国庆”主题航班为祖国庆生", "d": "2016-10-8", "c": ""},
                {"n": 46, "showindex": 955, "v":true, "t": "长龙航空10月1日首开昆明=榆林直飞航线", "d": "2016-10-1", "c": ""},
                {"n": 45, "showindex": 956, "v":true, "t": "浙江长龙航空曲臂式高空作业车项目招标公告", "d": "2016-9-29", "c": ""},
                {"n": 43, "showindex": 958, "v":true, "t": "长龙航空正式成为国际航空运输协会（IATA）会员", "d": "2016-9-14", "c": ""},
                {"n": 42, "showindex": 959, "v":true, "t": "浙江长龙航空圆满完成G20峰会保障任务", "d": "2016-9-8", "c": ""},
                {"n": 41, "showindex": 960, "v":true, "t": "长龙航空8月19日将新开深圳=乌兰察布=哈尔滨独飞航线", "d": "2016-8-19", "c": ""},
                {"n": 40, "showindex": 961, "v":true, "t": "长龙航空顺利保障浙江省第三批援青干部人才出行", "d": "2016-7-28", "c": ""},
                {"n": 39, "showindex": 962, "v":true, "t": "关于郑州调整出港航班值机关闭时间的通知", "d": "2016-7-19", "c": ""},
                {"n": 38, "showindex": 963, "v":true, "t": "长龙航空新开深圳=遵义=西宁独飞航线", "d": "2016-7-19", "c": ""},
                {"n": 37, "showindex": 964, "v":true, "t": "浙江长龙航空有限公司货运包舱销售招标公告", "d": "2016-7-11", "c": ""},
                {"n": 36, "showindex": 965, "v": true, "t": "长龙航空再添新飞机助力暑运  机队规模达到20架", "d": "2016-7-8", "c": ""},
                {"n": 35, "showindex": 966, "v": true, "t": "长龙航空开通杭州至越南航线 开启国际客运征程", "d": "2016-6-29", "c": ""},
                {"n": 34, "showindex": 967, "v": true, "t": "关于禁止旅客携带或托运锂电池动力平衡车乘机的通告", "d": "2016-6-13", "c": ""},
                {"n": 33, "showindex": 968, "v": true, "t": "长龙航空顺利接收首台CFM56-5B备用发动机", "d": "2016-6-12", "c": ""},
                {"n": 32, "showindex": 969, "v": true, "t": "长龙航空又一架A320客机抵杭  机队规模达到19架", "d": "2016-6-7", "c": ""},
                {"n": 31, "showindex": 970, "v": true, "t": "旅途中的六一  与长龙航空一起高空寄语童年", "d": "2016-6-3", "c": ""},
                {"n": 30, "showindex": 971, "v": true, "t": "长龙航空6月1日新开昆明=银川、杭州=桂林=昆明航线", "d": "2016-6-3", "c": ""},
                {"n": 29, "showindex": 972, "v": true, "t": "长龙航空优化超级经济舱服务  龙井茶为饮品标配", "d": "2016-6-3", "c": ""},
                {"n": 28, "showindex": 973, "v": true, "t": "浙江长龙航空人力资源管理系统项目招标公告", "d": "2016-5-24", "c": ""},
                {"n": 27, "showindex": 974, "v": true, "t": "关于防范短信诈骗的提醒", "d": "2016-5-10", "c": ""},
                {"n": 26, "showindex": 975, "v": true, "t": "关于昆明机场调整出港航班值机关闭时间的通知", "d": "2016-5-4", "c": ""},
                {"n": 25, "showindex": 976, "v": true, "t": "长龙航空万米高空开展世界读书日活动 伴着书香去旅行", "d": "2016-4-25", "c": ""},
                {"n": 24, "showindex": 977, "v": true, "t": "长龙航空荣获浙江省2016年春运工作先进单位称号", "d": "2016-4-14", "c": ""},
                {"n": 23, "showindex": 978, "v": true, "t": "长龙航空再添一架全新A320客机 机队规模达到18架", "d": "2016-4-14", "c": ""},
                {"n": 22, "showindex": 979, "v": false, "t": "招商邀请书", "d": "2016-4-11", "c": ""},
                {"n": 21, "showindex": 980, "v": false, "t": "浙江长龙航空关于杭州出港国际航班招标业务公告", "d": "2016-4-11", "c": ""},
                {"n": 20, "showindex": 981, "v": true, "t": "长龙航空3月29日开通杭州=安顺=西双版纳独飞航线", "d": "2016-3-30", "c": ""},
                {"n": 19, "showindex": 982, "v": true, "t": "长龙航空3月27日开通杭州=淮安=西安独飞航线", "d": "2016-3-29", "c": ""},
                {"n": 18, "showindex": 983, "v": true, "t": "长龙航空3月27日开通杭州=沈阳航线", "d": "2016-3-29", "c": ""},
                {"n": 17, "showindex": 984, "v": true, "t": "长龙航空3月27日开通杭州=盐城=太原独飞航线", "d": "2016-3-29", "c": ""},
                {"n": 16, "showindex": 985, "v": true, "t": "长龙航空3月27日开通深圳=洛阳=哈尔滨独飞航线", "d": "2016-3-29", "c": ""},
                {"n": 15, "showindex": 986, "v": true, "t": "长龙航空3月28日开通杭州=银川=乌鲁木齐航线", "d": "2016-3-29", "c": ""},
                {"n": 14, "showindex": 987, "v": true, "t": "长龙航空又迎来一架全新A320客机  机队规模达到17架", "d": "2016-3-29", "c": ""},
                {"n": 13, "showindex": 988, "v": true, "t": "长龙航空3月27日开通杭州=邯郸=成都独飞航线", "d": "2016-3-29", "c": ""},
                {"n": 12, "showindex": 989, "v": true, "t": "夏秋换季 长龙航空将于3月27日起新开7条航线", "d": "2016-3-29", "c": ""},
                {"n": 11, "showindex": 990, "v": true, "t": "风雪无情人有情,长龙助力回家路", "d": "2016-3-29", "c": ""},
                {"n": 10, "showindex": 991, "v": true, "t": "女子丢失驾驶证万分着急,长龙航空辗转物归原主", "d": "2016-3-29", "c": ""},
                {"n": 9, "showindex": 992, "v": true, "t": "新闻通稿：女人节空姐放假,长龙航班上清一色男空乘服务", "d": "2016-3-29", "c": ""},
                {"n": 8, "showindex": 993, "v": true, "t": "长龙航空获萧山经济技术开发区两项年度十强企业称号", "d": "2016-3-29", "c": ""},
                {"n": 7, "showindex": 994, "v": true, "t": "为确保航班安全,长龙航空开展人鼠大战", "d": "2016-3-29", "c": ""},
                {"n": 6, "showindex": 995, "v": true, "t": "长龙航空获民航华东“安康杯”竞赛优胜单位称号", "d": "2016-3-29", "c": ""},
                {"n": 5, "showindex": 996, "v": true, "t": "2016长龙航空夏秋航季新增航班", "d": "2016-3-24", "c": ""},
                {"n": 4, "showindex": 997, "v": true, "t": "长龙航空在华东地区2015年度“平安民航”建设工作考核中位列航空公司第二名", "d": "2016-2-22", "c": ""},
                {"n": 3, "showindex": 998, "v": true, "t": "长龙航空2月10日新开杭州=桂林=西双版纳航线", "d": "2016-2-14", "c": ""},
                {"n": 2, "showindex": 999, "v": true, "t": "长龙航空评选出“2015年度优秀地面服务代理人", "d": "2016-2-6", "c": ""},
                {"n": 1, "showindex": 10000, "v": true, "t": "长龙航空“为爱飞行，幸福家倍”公益行动助环卫工人阖家团圆", "d": "2016-2-5", "c": ""}]
        };

        //临时启用本地新闻
        queryNews = null;

        if (queryNews == null || queryNews == undefined) {
            var allLocalInfo = {
                "newsList": newsList.list,
                "PageInfo": {
                    "PageIndex": 1,
                    "TotalPage": 1,
                    "PageSize": newsList.list.length,
                    "DataCount": newsList.list.length
                }
            };
            callBack(allLocalInfo, true);
        } else {
            var requestParam = {};
            requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_QueryNewsList;
            requestParam.SessionId = "";

            var requestBody = {};
            requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
            requestBody.NewPageIndex = queryNews.PageIndex;
            requestBody.OnePageCount = queryNews.PageSize;
            requestBody.CreateTimeStart = queryNews.StartTime;
            requestBody.CreateTimeEnd = queryNews.EndTime;

            requestParam.Args = JSON.stringify(requestBody);

            var postData = JSON.stringify(requestParam);

            laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                    var list = data.newLists.NLs;
                    var outList = new Array();
                    var n = list.length;
                    for (var i = 0; i < n; i++) {
                        var sim = list[i];
                        var item = {
                            "n": sim.NewTid,
                            "showindex": (i + 1 ),
                            "v": true,
                            "t": sim.NewTitle,
                            "d": sim.CreateTime,
                            "c": ""
                        };
                        outList.push(item);
                    }
                    var allInfo = {
                        "newsList": outList,
                        "PageInfo": {
                            "PageIndex": data.newLists.NowPageIndex,
                            "TotalPage": data.newLists.TotalPage,
                            "PageSize": data.newLists.OnePageCount,
                            "DataCount": data.newLists.DataCount
                        }
                    };
                    callBack(allInfo, status);
                }
            )
        }
    };

    /**
     * 查询新闻详情
     * @param tid
     * @param callBack
     * @constructor
     */
    laUserService.QueryNewsDetail = function (tid, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_QueryNewsDetail;
        requestParam.SessionId = "";

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.NewTid = tid;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 获取首页大图
     * @param callBack
     * @constructor
     */
    laUserService.QueryIndexImageList = function (callBack) {
        var imgList = {
            "list": [{"showindex": 1, "v": true, "t": "", "href": "#", "imgUrl": "/Resource/images/loginbg9.jpg"},
                {"showindex": 1, "v": true, "t": "", "href": "#", "imgUrl": "/Resource/images/loginbg8.jpg"},
                {"showindex": 2, "v":true, "t": "", "href": "#", "imgUrl": "/Resource/images/loginbg7.jpg"},
                {"showindex": 3, "v":true, "t": "", "href": "#", "imgUrl": "/Resource/images/loginbg6.jpg"},
                {"showindex": 4, "v":false, "t": "", "href": "#", "imgUrl": "/Resource/images/loginbg5.jpg"},
                {"showindex": 5, "v":true, "t": "", "href": "#", "imgUrl": "/Resource/images/loginbg4.jpg"},
                {"showindex": 6, "v": false, "t": "", "href": "#", "imgUrl": "/Resource/images/loginbg3.jpg"},
                {"showindex": 7, "v": false, "t": "", "href": "#", "imgUrl": "/Resource/images/loginbg1.jpg"},
                {"showindex": 8, "v": false, "t": "", "href": "#", "imgUrl": "/Resource/images/loginbg2.jpg"}]
        };

        callBack(imgList.list, true);
    };

    /**
     * 查询快递渠道列表
     * @param callBack
     * @constructor
     */
    laUserService.QueryExpressList = function (callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_QueryExpress;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 查询旅客行程
     * @param foid
     * @param passangerName
     * @param callBack
     * @constructor
     */
    laUserService.QueryPassengerTravel = function (foid, passangerName, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_QueryPassengerTravel;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        //requestBody.FoidType = foidType;
        requestBody.Foid = foid;
        requestBody.PassangerName = passangerName;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 离港座位图查询
     * @param flightNumber
     * @param fromCity
     * @param toCity
     * @param flightTime
     * @param cabinType
     * @param callBack
     * @constructor
     */
    laUserService.QueryPlaneSeats = function(flightNumber, fromCity, toCity, flightTime, cabinType, callBack){
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_QueryPlaneSeats;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.FlightNumber = flightNumber;
        requestBody.FromCity = fromCity;
        requestBody.ToCity = toCity;
        requestBody.FlightTime = flightTime;
        requestBody.CabinType = cabinType;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 网上值机
     * @param checkInInfo
     * @param callBack
     * @constructor
     */
    laUserService.OnlineCheckin = function(checkInInfo, callBack){
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_OnlineCheckin;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.FlightDate = checkInInfo.FlightDate;
        requestBody.FlightNumber = checkInInfo.FlightNumber;
        requestBody.SeatNumber = checkInInfo.SeatNumber;
        requestBody.FromCity = checkInInfo.FromCity;
        requestBody.ToCity = checkInInfo.ToCity;
        requestBody.TKTNumber = checkInInfo.TKTNumber;
        requestBody.TourIndex = checkInInfo.TourIndex;
        requestBody.PassangerName =  checkInInfo.PassangerName;
        requestBody.CabinType =  checkInInfo.CabinType;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 取消网上值机
     * @param checkInInfo
     * @param callBack
     * @constructor
     */
    laUserService.OnlineCheckinCancel = function(checkInInfo, callBack){
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_OnlineCheckinCancel;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.FlightDate = checkInInfo.FlightDate;
        requestBody.FlightNumber = checkInInfo.FlightNumber;
        requestBody.Foid = checkInInfo.Foid;
        //requestBody.FoidType = checkInInfo.FoidType;
        requestBody.FromCity = checkInInfo.FromCity;
        requestBody.ToCity = checkInInfo.ToCity;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    return laUserService;
}]);