/**
 * Created by Jerry on 16/1/1.
 */

/**
 * 公用服务
 * Created by Jerry on 15/12/28.
 */
var laGlobalProperty = (function () {
    var _laGlobalProperty;

    var _currentUserId;

    function init() {
        return {
            setCurrentUserId: function (currentUserId) {
                _currentUserId = currentUserId;
            },
            getCurrentUserId: function () {
                return _currentUserId;
            }
        };
    }

    return {
        getInstance: function () {
            if (!_laGlobalProperty) {
                _laGlobalProperty = init();
            }
            return _laGlobalProperty;
        },

        /**
         *
         */
        laServiceConst_TransData_isAutoLogin: 'TransData_isAutoLogin',
        /**
         *
         */
        laServiceConst_TransData_AutoLoginId: 'TransData_AutoLoginId',
        /**
         *
         */
        laServiceConst_TransData_AutoLoginPwd: 'TransData_AutoLoginPwd',
        /**
         *
         */
        laServiceConst_TransData_BackUrl: 'TransData_BackUrl',
        /**
         *
         */
        laServiceConst_TransData_QueryTicket: 'TransData_QueryTicket',
        /**
         *
         */
        laServiceConst_TransData_QueryTicketByPoints: 'TransData_QueryTicketByPoints',
        /**
         *
         */
        laServiceConst_TransData_BookOrder: 'TransData_BookOrder',
        /*

         */
        laServiceConst_TransData_BookOrderByPoints: 'TransData_BookOrderByPoints',
        /**
         *
         */
        laServiceConst_TransData_OrderIdForCreate: 'TransData_OrderIdForCreate',
        //处理信息编码说明
        /*
         处理成功
         */
        laServiceCode_Success: '0000',
        /*
         本地自定义错误代码
         */
        laServiceCode_ErrorLocal: '-99999',
        /*
         渠道:1:网页端
         */
        laServiceCode_SaleChannel: 1,

        //Url说明
        /*
         地址头
         */
        //laServiceUrl_Head: 'http://120.26.82.34/',
        /*
         接口主地址
         */
        //laServiceUrl_MainInterface: 'Flight/InterfaceService',

        /*

         */
        //laServiceDomain_SessionName : 'ASP.NET_SessionId',
        /*
         接口地址
         */
        laServiceUrl_Interface: 'http://120.26.229.120:84/Flight/InterfaceService', //'http://120.26.229.120/Flight/InterfaceService',
        //laServiceUrl_Interface: 'http://www.loongair.cn/Flight/InterfaceService',
        /*
         查找航班
         */
        laServiceUrl_ActionType_SearchFlight: 1,
        /*
         登入
         */
        laServiceUrl_ActionType_Login: 2,
        /*
         创建订单
         */
        laServiceUrl_ActionType_CreateOrder: 3,
        /*
         订单列表
         */
        laServiceUrl_ActionType_OrderList: 4,
        /*
         订单详细信息
         */
        laServiceUrl_ActionType_OrderInfo: 5,
        /*
         获取支付链接
         */
        laServiceUrl_ActionType_PayUrl: 6,
        /*
         退票
         */
        laServiceUrl_ActionType_RefundOrder: 7,
        /*
         获取退票详细信息
         */
        laServiceUrl_ActionType_RefundOrderInfo: 8,
        /*
         获取退票详细信息
         */
        laServiceUrl_ActionType_RefundOrderList: 9,
        /*
         获取退票乘客
         */
        laServiceUrl_ActionType_RefundOrderPassenger: 10,
        /*
         注册
         */
        laServiceUrl_ActionType_RegisterUser: 11,
        /*
         发送注册验证码
         */
        laServiceUrl_ActionType_SendRegisterMobileCode: 12,
        /*
         查询当前登录用户信息
         */
        laServiceUrl_ActionType_GetCurrentUserInfo: 13,
        /*
         获取支付方式
         */
        laServiceUrl_ActionType_GetPayChannelList: 14,
        /*
         发送找回密码的验证码
         */
        laServiceUrl_ActionType_SendFindPwdMobileCode: 15,
        /*
         修改密码
         */
        laServiceUrl_ActionType_ChangeLoginPwd: 16,
        /*
         找回密码
         */
        laServiceUrl_ActionType_FindLoginPassword: 17,
        /*
         查询常用乘机人列表
         */
        laServiceUrl_ActionType_QueryStationPassengers: 18,
        /*
         常用乘机人维护
         */
        laServiceUrl_ActionType_MaintainStationPassengers: 19,
        /*
         查询常用乘机人详情
         */
        laServiceUrl_ActionType_QueryStationPsgDetail: 20,
        /*
         退出登录
         */
        laServiceUrl_ActionType_UserLogOut: 21,
        /*
         取消订单
         */
        laServiceUrl_ActionType_CancelOrder: 22,
        /**
         * 删除常旅客
         */
        laServiceUrl_ActionType_DelMaintainStationPassengers: 23,
        /**
         * 获取机场信息
         */
        laServiceUrl_ActionType_QueryAirportList: 24,
        /*
         未登录状态获取订单详细信息
         */
        laServiceUrl_ActionType_OrderInfoWithoutLogin: 25,
        /*
         未登录状态退票
         */
        laServiceUrl_ActionType_RefundOrderWithoutLogin: 26,
        /*
         未登录状态下获取订单信息的查询验证码
         */
        laServiceUrl_ActionType_OrderInfoImgVerifyCode: 27,
        /*
         查询特价机票
         */
        laServiceUrl_ActionType_QuerySpecialTicket: 28,
        /*
         * 修改个人信息
         */
        laServiceUrl_ActionType_ModifyUserInfo: 29,
        /*
         发送手机验证码-修改个人信息
         */
        laServiceUrl_ActionType_SendMobileCodeForModifyUserInfo: 30,
        /*
         客票验真
         */
        laServiceUrl_ActionType_CheckTicket: 31,
        /*
         客票验证图片验证码
         */
        laServiceUrl_ActionType_CheckTicketImgVerifyCode: 32,
        /*
         查询航班动态
         */
        laServiceUrl_ActionType_QueryFlightDynamic: 33,
        /*
         注册时发送短信前获取图片验证码
         */
        laServiceUrl_ActionType_ImageVerifyCodeForRegister: 34,
        /*
         查询机票日历
         */
        laServiceUrl_ActionType_QueryPriceCalendar: 37,
        /*
         查询旅客行程
         */
        laServiceUrl_ActionType_QueryPassengerTravel: 38,
        /*
         离港座位图查询
         */
        laServiceUrl_ActionType_QueryPlaneSeats: 39,
        /*
         单人值机
         */
        laServiceUrl_ActionType_OnlineCheckin: 40,
        /*
         取消值机
         */
        laServiceUrl_ActionType_OnlineCheckinCancel: 41,
        /*
         获取快递渠道
         */
        laServiceUrl_ActionType_QueryExpress: 42,
        /*
         发送机票订单验证码
         */
        laServiceUrl_ActionType_BookingTicketValidCode: 43,
        /*
         常旅客注册
         */
        laServiceUrl_ActionType_RegisterFrequentUser: 44,
        /*
        机票改期
         */
        laServiceUrl_ActionType_TransFlight: 45,
        /*
         * 查询改期航班
         */
        laServiceUrl_ActionType_QueryFlightForTrans: 46,
        /*
         * 查询新闻列表
         */
        laServiceUrl_ActionType_QueryNewsList: 47,
        /*
         * 查询新闻详情
         */
        laServiceUrl_ActionType_QueryNewsDetail: 48,
        /*
         查询常旅客积分列表
         */
        laServiceUrl_ActionType_QueryFrequentMemberPointsList: 2002,
        /*
         查询积分兑换记录
         */
        laServiceUrl_ActionType_QueryExchangePointsList: 2004,
        /*
         获取兑换对应航班所需积分
         */
        //laServiceUrl_ActionType_QueryPointsForExchangeFlight: 2005,
        /*
         积分查找航班
         */
        laServiceUrl_ActionType_QueryFlightUsePoints: 2006,
        /*
         查询会员卡信息
         */
        laServiceUrl_ActionType_QueryMemberCardInfo: 2007,
        /*
         积分补登
         */
        laServiceUrl_ActionType_PointsRetro: 2008,
        /*
         用积分创建订单
         */
        laServiceUrl_ActionType_CreateOrderByPoints: 2009,
        /*
        获取受益人信息列表
         */
        laServiceUrl_ActionType_QueryBenefitList: 2010,
        /*
        获取汉字的拼音
         */
        laServiceUrl_ActionType_GetChinesePinYin: 2011,
        /*
         发送会员卡信息至手机
         */
        laServiceUrl_ActionType_SendCardNoToMobile: 2012,
        /*
         查询我的消息列表
         */
        laServiceUrl_ActionType_QueryMyMessagelist: 2013,
        /*
         删除我的消息
         */
        laServiceUrl_ActionType_DelMyMessage: 2014,
        /*
        添加受益人
         */
        laServiceUrl_ActionType_AddBenefit: 2015,
        /*
        删除受益人
         */
        laServiceUrl_ActionType_DelBenefit: 2016,
        /**
         * 添加受益人证件信息
         */
        laServiceUrl_ActionType_AddBenefitIdInfo: 2017,
        /**
         * 获取省份列表
         */
        laServiceUrl_ActionType_QueryProvinceList: 2018,
        /**
         * 查询已审核过的受益人列表
         */
        laServiceUrl_ActionType_QueryAuditBenefitList: 2019

    };
})();

/**
 * 通用底层服务类
 */
var laGlobal = angular.module('laGlobal', ['ngCookies']);

/**
 * 其他服务
 */
laGlobal.factory('laGlobalLocalService', ['$window', '$cookies', '$cookieStore', function ($window, $cookies, $cookieStore) {
    var laGlobalLocalService = {};

    /**
     * 写Cookie
     * @param name
     * @param value
     * @param expireDays
     */
    laGlobalLocalService.writeCookie = function (name, value, expireDays) {
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + expireDays);
        if (expireDays > 0) {
            try {
                $cookies.put(name, value, {'expires': expireDate, 'path': '/'});
            } catch (err) {
                //兼容IE8 必须明确指定domain
                $cookieStore.put(name, value, {'domain': $window.location.host, 'expires': expireDate, 'path': '/'});
            } finally {

            }

        } else {
            try {
                $cookies.put(name, value, {'path': '/'});
            } catch (err) {
                //兼容IE8 必须明确指定domain
                $cookieStore.put(name, value, {'domain': $window.location.host, 'path': '/'});
            } finally {

            }

        }
    };

    /**
     * 读Cookie
     * @param name
     * @returns {*}
     */
    laGlobalLocalService.getCookie = function (name) {
        var result;
        try {
            result = $cookies.get(name);
        } catch (err) {
            result = $cookieStore.get(name);
        } finally {

        }
        return result;
    };

    /**
     * 删除Cookie
     * @param name
     */
    laGlobalLocalService.removeCookie = function (name) {
        try {
            $cookies.remove(name);
        } catch (err) {
            $cookieStore.remove(name);
        } finally {

        }

    };

    /**
     * 获取星期几
     * @param inDate
     */
    laGlobalLocalService.getWeekName = function (inDate) {
        var week;
        if (inDate.getDay() == 0)          week = "周日";
        if (inDate.getDay() == 1)          week = "周一";
        if (inDate.getDay() == 2)          week = "周二";
        if (inDate.getDay() == 3)          week = "周三";
        if (inDate.getDay() == 4)          week = "周四";
        if (inDate.getDay() == 5)          week = "周五";
        if (inDate.getDay() == 6)          week = "周六";

        return week;
    };

    /**
     * 取当前已登录用户的SessionId
     * @returns {string}
     */
    laGlobalLocalService.getCurrentUserSessionId = function () {
        var sessionId = '';
        if (laGlobalLocalService.getCookie('UserInfo') != undefined) {
            var uInfo = JSON.parse(laGlobalLocalService.getCookie('UserInfo'));
            sessionId = uInfo.SessionID;
        }
        return sessionId;
    };

    /**
     * 校验身份证
     * @param code
     * @param callback
     * @constructor
     */
    laGlobalLocalService.IdentityCodeValid = function (code) {
        var city = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江 ",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北 ",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏 ",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外 "
        };
        var tip = "";
        var pass = true;

        //if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
        var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
        if (!code || !regIdCard.test(code)) {
            tip = "身份证号格式错误";
            pass = false;
        }

        else if (!city[code.substr(0, 2)]) {
            tip = "地址编码错误";
            pass = false;
        }
        else {
            //18位身份证需要验证最后一位校验位
            if (code.length == 18) {
                code = code.split('');
                //∑(ai×Wi)(mod 11)
                //加权因子
                var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                //校验位
                var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++) {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                var last = parity[sum % 11];
                if (parity[sum % 11] != code[17]) {
                    tip = "身份证校验位错误";
                    pass = false;
                }
            }
        }
        return pass;
    };

    //从身份证解析生日
    laGlobalLocalService.ParseBirthdayByIdCode = function (v) {
        var result = '';
        if (!laGlobalLocalService.CheckStringIsEmpty(v)) {
            if (v.length >= 15) {
                var tmp = v.substr(6, 8);
                result = tmp.substr(0, 4) + '-' + tmp.substr(4, 2) + '-' + tmp.substr(6, 2);
            }
        }
        return result;
    };

    /**
     * 校验字符串是否为空
     * @param v
     * @returns {boolean}
     * @constructor
     */
    laGlobalLocalService.CheckStringIsEmpty = function (v) {
        var result = false;
        if (v == undefined || v == '' || v == null) {
            result = true;
        }
        return result;
    };

    /**
     * 获取字符串(含汉字)长度
     * @param v
     */
    laGlobalLocalService.getStringLength = function (v) {
        var sum = 0;
        for (var i = 0; i < v.length; i++) {
            var c = v.charCodeAt(i);
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                sum++;
            }
            else {
                sum += 2;
            }
        }
        return sum;
    };

    /**
     * 找出汉字的个数
     * @param v
     * @returns {number}
     */
    laGlobalLocalService.getChineseStringCnt = function (v) {
        var sum = 0;
        for (var i = 0; i < v.length; i++) {
            var c = v.charCodeAt(i);
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            }
            else {
                sum++;
            }
        }
        return sum;
    };
    
    /**
     * 校验字符串长度
     * @param v
     * @param len
     * @returns {boolean}
     * @constructor
     */
    laGlobalLocalService.CheckStringLength = function (v, len) {
        var result = true;
        if (laGlobalLocalService.CheckStringIsEmpty(v)) {
            result = false;
        } else if (v.length != len) {
            result = false;
        }
        return result;
    };

    /**
     * 校验手机号码
     * @param c
     * @returns {boolean}
     * @constructor
     */
    laGlobalLocalService.CheckMobileCode = function (c) {
        //var patrn = /^(13[0-9]|15[0|3|6|7|8|9]|18[8|9]|17[0-9])\d{8}$/;
        var patrn = /^(1[0-9])\d{9}$/;//暂定:只要满足1开头11位即可
        if (!patrn.exec(c)) {
            return false;
        }
        return true;
    };

    /**
     * 校验密码6-20位数字和字符
     * @param v
     * @returns {boolean}
     * @constructor
     */
    laGlobalLocalService.CheckPassWord = function (v) {
        var patrn = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;  //6-20位数字和字符
        if (!patrn.exec(v)) {
            return false;
        }
        return true;
    };

    /**
     * 检查输入长度限制
     * @param v
     * @param minLen
     * @param maxLen 如果传第三个参数表示有最大值检查
     * @returns {boolean}
     * @constructor
     */
    laGlobalLocalService.CheckStringLengthRange = function (v, minLen) {
        var result = true;
        if (laGlobalLocalService.CheckStringIsEmpty(v)) {
            result = false;
        } else if (v.length < minLen) {
            result = false;
        }
        if (arguments.length >= 3) { //如果有最大长度
            if (v.length > arguments[2]) {
                result = false;
            }
        }
        return result;
    };

    /**
     * 检查是否是有效的日期格式(yyyy-MM-dd)
     * @param v
     * @returns {boolean}
     * @constructor
     */
    laGlobalLocalService.CheckDateFormat = function (v) {
        var a = /^(\d{4})-(\d{2})-(\d{2})$/;
        if (!a.test(v)) {
            return false;
        }
        else {
            return true;
        }
    };

    /**
     * 邮箱格式验证
     * @param v
     * @returns {boolean}
     * @constructor
     */
    laGlobalLocalService.CheckEMailFormat = function (v) {
        var temp = v;
        //对电子邮件的验证
        var email = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (!email.test(temp)) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * 护照格式验证
     * @param v
     * @returns {boolean}
     * @constructor
     */
    laGlobalLocalService.CheckPassportFormat = function (v) {
        return true;

        var temp = v;
        //对护照的验证
        var passport = /^1[45][0-9]{7}|G[0-9]{8}|E[0-9]{8}|R[0-9]{6,9}|P[0-9]{7}|S[0-9]{7,8}|D[0-9]+$/;
        if (!passport.test(temp)) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * 判断是否是数字
     * @param s
     * @returns {boolean}
     * @constructor
     */
    laGlobalLocalService.IsNum = function (s) {
        if (s != null) {
            var r, re;
            re = /\d*/i;
            r = s.match(re);
            return (r == s) ? true : false;
        }
        return false;
    };

    /**
     * 前补零
     * @param str
     * @param n
     * @returns {*}
     * @constructor
     */
    laGlobalLocalService.PadString = function (str, n) {
        var len = str.length;
        while (len < n) {
            str = "0" + str;
            len++;
        }
        return str;
    };

    /**
     * 根据枚举值取说明文本
     * @param v
     * @param ilist
     */
    laGlobalLocalService.getEnumTextByKeyT = function (v, ilist) {
        var len = ilist.length;
        for (var i = 0; i < len; i++) {
            if (v == ilist[i].v) {
                return ilist[i].t;
            }
        }
        return "";
    };

    return laGlobalLocalService;
}]);

/**
 * 网络请求服务
 */
laGlobal.factory('laGlobalHTTPService', ['$http', 'laGlobalLocalService', function ($http, laGlobalLocalService) {
    var laGlobalHTTPService = {};

    var isDebug = true;
    var _timeout = 15000;//设置15秒超时

    /**
     * 网络请求(POST)
     * @param url        请求地址
     * @param postData   提交的数据
     * @param callBack   回调(返回的数据|true(false))
     */
    laGlobalHTTPService.requestByPost = function (url, postData, callBack) {
        $http.post(url, postData,
            {
                //headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                //headers: { 'Content-Type': 'application/json; charset=UTF-8','dataType':'json' }
                headers: {'Content-Type': 'application/json; charset=UTF-8'},
                timeout: _timeout
            }
        ).success(function (data, status, headers, config) {
                if (data.SessionID != undefined) {
                    laGlobalLocalService.writeCookie('SessionID', data.SessionID, 10);
                }
                //console.log('[Request ' + url + ' ByPost at ' + new Date().toLocaleString() + ' Success] \r\nStatus:' + status + '\r\n========================================\r\n' + 'Data:' + JSON.stringify(data) + '\r\n========================================\r\n' + 'Config:' + JSON.stringify(config));

                callBack(data, true);
            }).error(function (data, status, headers, config) {
                //console.log('[Request ' + url + ' ByPost at ' + new Date().toLocaleString() + ' Error] \r\nStatus:' + status + '\r\n========================================\r\n' + 'Data:' + JSON.stringify(data) + '\r\n========================================\r\n' + 'Config:' + JSON.stringify(config));

                //callBack(data, false);
                callBack({Code: laGlobalProperty.laServiceCode_ErrorLocal, Message: 'Server Error'}, false);
            });
    };

    /**
     * 网络请求(POST)
     * @param postData   提交的数据
     * @param callBack   回调(返回的数据|true(false))
     */
    laGlobalHTTPService.requestByPostUrl = function (postData, callBack) {
        var url = laGlobalProperty.laServiceUrl_Interface;

        $http.post(url, postData,
            {
                //headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                //headers: { 'Content-Type': 'application/json; charset=UTF-8','dataType':'json' }
                headers: {'Content-Type': 'application/json; charset=UTF-8'},
                timeout: _timeout
                //, withCredentials:true
            }
        ).success(function (data, status, headers, config) {
                if (data.SessionID != undefined) {
                    laGlobalLocalService.writeCookie('SessionID', data.SessionID, 0);
                }
                if (isDebug) {
                    console.log('[Request ' + url + ' ByPost at ' + new Date().toLocaleString() +
                        ' Success] \r\nStatus:' + status + '\r\n========================================\r\n' +
                        'Data:' + JSON.stringify(data) + '\r\n========================================\r\n' +
                            //'Headers:'+headers+'\r\n========================================\r\n'+
                        'Config:' + JSON.stringify(config)
                    );
                }
                callBack(data, true);
            }).error(function (data, status, headers, config) {

                /*
                 console.log('[Request ' + url + ' ByPost at ' + new Date().toLocaleString() +
                 ' Error] \r\nStatus:' + status + '\r\n========================================\r\n' +
                 'Data:' + JSON.stringify(data) + '\r\n========================================\r\n' +
                 //'Headers:'+headers+'\r\n========================================\r\n'+
                 'Config:' + JSON.stringify(config)
                 );
                 */

                //callBack(data, false);
                callBack({Code: laGlobalProperty.laServiceCode_ErrorLocal, Message: 'Server Error'}, false);
            });
    };

    /**
     * 网络请求(GET)
     * @param url        请求地址
     * @param params     提交的数据(JSON或对象)
     * @param callBack   回调(返回的数据|true(false))
     */
    laGlobalHTTPService.requestByGet = function (url, params, callBack) {
        $http.get(url,
            {
                params: params,
                headers: {'Content-Type': 'application/json; charset=UTF-8'},
                timeout: _timeout
            }
        ).success(function (data, status, headers, config) {
                /*
                 console.log('[Request ' + url + ' ByGet at ' + new Date().toLocaleString() +
                 ' Success] \r\nStatus:' + status + '\r\n========================================\r\n' +
                 'Data:' + JSON.stringify(data) + '\r\n========================================\r\n' +
                 //'Headers:'+headers+'\r\n========================================\r\n'+
                 'Config:' + JSON.stringify(config)
                 );
                 */

                callBack(data, true);
            }).error(function (data, status, headers, config) {
                /*
                 console.log('[Request ' + url + ' ByGet at ' + new Date().toLocaleString() +
                 ' Error] \r\nStatus:' + status + '\r\n========================================\r\n' +
                 'Data:' + JSON.stringify(data) + '\r\n========================================\r\n' +
                 //'Headers:'+headers+'\r\n========================================\r\n'+
                 'Config:' + JSON.stringify(config)
                 );
                 */

                callBack(data, false);
            });
        ;
    };

    return laGlobalHTTPService;
}]);