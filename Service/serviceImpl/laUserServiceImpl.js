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
     * 查询当前用户/常旅客信息
     * @param callBack
     * @constructor
     */
    laUserService.GetCurrentUserInfo = function (callBack) {
        /**
         * 老的查询用户信息接口
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
         */

        /**
         * 新的查询常旅客信息的接口,兼容老接口
         * Modified on 2016-7-5 by Jerry
         */
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
                userInfo.Code = data.Code;
                userInfo.Message = data.Message;

                if (status == true) {
                    userInfo.Address = uInfo.Address;
                    userInfo.Mobile = uInfo.Mobile;
                    userInfo.Name = uInfo.Name;
                    userInfo.Brithday = uInfo.Birthday;
                    userInfo.Sex = uInfo.Sex;
                    userInfo.SexCH = uInfo.SexCH;
                    userInfo.FoidType = uInfo.FoidType;
                    userInfo.FoidTypeCH = uInfo.FoidTypeCH;
                    userInfo.Foid = uInfo.Foid;
                    userInfo.UserName = uInfo.UserName;
                    userInfo.SessionOut = uInfo.SessionOut;

                    userInfo.IsFrequentPassenger = uInfo.IsFrequentPassenger;
                    userInfo.SecondNameCn = uInfo.SecondNameCn;//中文姓
                    userInfo.FirstNameCn = uInfo.FirstNameCn;//中文名
                    userInfo.SecondNameCnPinYin = uInfo.SecondNameCnPinYin;//中文姓拼音
                    userInfo.FirstNameCnPinYin = uInfo.FirstNameCnPinYin;//中文名拼音
                    userInfo.IDInfoList = uInfo.IDInfoList;//证件列表 //[{"Foid":"37","FoidType":1},{"Foid":"G98","FoidType":2}];
                    userInfo.Tel = uInfo.Tel;//联系电话
                    userInfo.BirthDay = uInfo.Birthday;//new Date(uInfo.BirthDay.replace(/-/g, "/"));//出生日期
                    userInfo.Nationaity = uInfo.Nationaity;//国籍
                    userInfo.NationaityCH = laGlobalLocalService.getEnumTextByKeyT(userInfo.Nationaity, laEntityEnumnationaityOptions);//uInfo.NationaityCH;//国籍名称
                    userInfo.ContactAddressHope = uInfo.ContactAddressHope;//希望联系地址:1:家庭;2:单位;
                    userInfo.ContactAddressHopeCH = laGlobalLocalService.getEnumTextByKeyT(userInfo.ContactAddressHope, laEntityEnumcontactAddressHope);//uInfo.ContactAddressHopeCH;//希望联系地址名称
                    userInfo.HomeAddressCountry = uInfo.HomeAddressCountry;//家庭地址:国家
                    userInfo.HomeAddressCountryCH = laGlobalLocalService.getEnumTextByKeyT(userInfo.HomeAddressCountry, laEntityEnumnationaityOptions);
                    userInfo.HomeAddressProvince = uInfo.HomeAddressProvince;//家庭地址:省/洲
                    userInfo.HomeAddressCity = uInfo.HomeAddressCity;//家庭地址:城市
                    userInfo.HomeAddressDetail = uInfo.HomeAddressDetail;//家庭详细地址
                    userInfo.HomePostCode = uInfo.HomePostCode;//家庭地址邮编
                    userInfo.HomeTel = uInfo.HomeTel;//家庭联系电话
                    userInfo.CompanyAddressCountry = uInfo.CompanyAddressCountry;//单位地址:国家
                    userInfo.CompanyAddressCountryCH = laGlobalLocalService.getEnumTextByKeyT(userInfo.CompanyAddressCountry, laEntityEnumnationaityOptions);
                    userInfo.CompanyAddressProvince = uInfo.CompanyAddressProvince;//单位地址:省/洲
                    userInfo.CompanyAddressCity = uInfo.CompanyAddressCity;//单位地址:城市
                    userInfo.CompanyAddressDetail = uInfo.CompanyAddressDetail;
                    userInfo.CompanyName = uInfo.CompanyName;//单位名称
                    userInfo.Job = uInfo.Job;//职业
                    userInfo.JobCH = laGlobalLocalService.getEnumTextByKeyT(userInfo.Job, laEntityEnumjob);
                    userInfo.Position = uInfo.Position;//职位
                    userInfo.PositionCH = laGlobalLocalService.getEnumTextByKeyT(userInfo.Position, laEntityEnumjobPosition);//uInfo.PositionCH;//职位名称
                    userInfo.CompanyTel = uInfo.CompanyTel;//单位联系电话
                    userInfo.Wechat = uInfo.Wechat;//微信
                    userInfo.EMail = uInfo.EMail;//电邮
                    userInfo.Integral = uInfo.Integral;
                    userInfo.Level = uInfo.Level;
                    userInfo.Fax = uInfo.FPD_Fax;
                    userInfo.PPMeals = uInfo.FPD_PPMeals;
                    userInfo.PPSeats = uInfo.FPD_PPSeats;
                    userInfo.PPDiscount = uInfo.FPD_PPDiscount;
                    userInfo.PPChannel = uInfo.FPD_PPChannel;
                    userInfo.PPPaymentMethod = uInfo.FPD_PPPaymentMethod;
                    userInfo.ContactHope = uInfo.ContactHope;//希望联系方式
                    userInfo.ContactHopeCH = laGlobalLocalService.getEnumTextByKeyT(userInfo.ContactHope, laEntityEnumcontactHope);//uInfo.ContactHopeCH;//希望联系方式名称
                    userInfo.LanguageHope = uInfo.LanguageHope;//希望联系的语言 中文=1,English=2
                    userInfo.LanguageHopeCH = laGlobalLocalService.getEnumTextByKeyT(userInfo.LanguageHope, laEntityEnumlanguageHope);//uInfo.LanguageHopeCH;//希望联系的语言名称
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
     * 修改常旅客信息
     * @param u
     * @param callBack
     * @constructor
     */
    laUserService.ModifyFrequentUserInfo = function (u, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_ModifyUserInfo;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;

        requestBody.Foid = u.Foid;
        requestBody.FoidType = u.FoidType;
        requestBody.BirthDay = u.BirthDay;

        requestBody.Address = u.Address;
        requestBody.Email = u.EMail;
        requestBody.Tel = u.Tel;

        requestBody.FPD_Nationaity = u.Nationaity;
        requestBody.FPD_ContactAddressHope = u.ContactAddressHope;
        requestBody.FPD_HomeAddressCountry = u.HomeAddressCountry;
        requestBody.FPD_HomeAddressProvince = u.HomeAddressProvince;
        requestBody.FPD_HomeAddressCity = u.HomeAddressCity;
        requestBody.FPD_HomeAddressDetail = u.HomeAddressDetail;
        requestBody.FPD_HomePostCode = u.HomePostCode;
        requestBody.FPD_HomeTel = u.HomeTel;
        requestBody.FPD_CompanyAddressCountry = u.CompanyAddressCountry;
        requestBody.FPD_CompanyAddressProvince = u.CompanyAddressProvince;
        requestBody.FPD_CompanyAddressCity = u.CompanyAddressCity;
        requestBody.FPD_CompanyAddressDetail = u.CompanyAddressDetail;
        requestBody.FPD_CompanyName = u.CompanyName;
        requestBody.FPD_Job = u.Job;
        requestBody.FPD_Position = u.Position;
        requestBody.FPD_CompanyTel = u.CompanyTel;
        requestBody.FPD_Fax = u.Fax;
        requestBody.FPD_PPMeals = u.PPMeals;
        requestBody.FPD_PPSeats = u.PPSeats;
        requestBody.FPD_PPDiscount = u.PPDiscount;
        requestBody.FPD_PPChannel = u.PPChannel;
        requestBody.FPD_PPPaymentMethod = u.PPPaymentMethod;
        requestBody.FPD_Wechat = u.Wechat;
        requestBody.FPD_ContactHope = u.ContactHope;
        requestBody.FPD_LanguageHope = u.LanguageHope;
        requestBody.IDInfoList = u.IDInfoList;

        requestBody.UserInfoAmendVerifyCode = u.MobileValidCode;
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
    /*
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
    */

    /**
     * 注册会员
     * @param u
     * @param callBack
     * @constructor
     */
    laUserService.Register = function (u, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_RegisterUser;
        requestParam.SessionID = laGlobalLocalService.getCookie('SessionID');

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;

        requestBody.Foid = u.Foid;
        requestBody.Mobile = u.Mobile;
        requestBody.MobileVerifyCode = u.MobileValidCode;
        requestBody.Name = u.Name;
        requestBody.Password = u.Password;
        requestBody.VerifyCode = u.VerifyCode;

        requestBody.FoidType = u.FoidType;
        requestBody.Address = u.Address;
        requestBody.Email = u.EMail;
        requestBody.BirthDay = u.BirthDay;
        requestBody.SexType = u.Sex;

        requestBody.FPD_SecondNameCn = u.SecondNameCn;
        requestBody.FPD_FirstNameCn = u.FirstNameCn;
        requestBody.FPD_SecondNameCnPinYin = u.SecondNameCnPinYin;
        requestBody.FPD_FirstNameCnPinYin = u.FirstNameCnPinYin;

        requestBody.FPD_Nationaity = u.Nationaity;
        requestBody.FPD_ContactAddressHope = u.ContactAddressHope;
        requestBody.FPD_HomeAddressCountry = u.HomeAddressCountry;
        requestBody.FPD_HomeAddressProvince = u.HomeAddressProvince;
        requestBody.FPD_HomeAddressCity = u.HomeAddressCity;
        requestBody.FPD_HomeAddressDetail = u.HomeAddressDetail;
        requestBody.FPD_HomePostCode = u.HomePostCode;
        requestBody.FPD_HomeTel = u.HomeTel;
        requestBody.FPD_CompanyAddressCountry = u.CompanyAddressCountry;
        requestBody.FPD_CompanyAddressProvince = u.CompanyAddressProvince;
        requestBody.FPD_CompanyAddressCity = u.CompanyAddressCity;
        requestBody.FPD_CompanyAddressDetail = u.CompanyAddressDetail;
        requestBody.FPD_CompanyName = u.CompanyName;
        requestBody.FPD_Job = u.Job;
        requestBody.FPD_Position = u.Position;
        requestBody.FPD_CompanyTel = u.CompanyTel;
        requestBody.FPD_Fax = u.Fax;
        requestBody.FPD_PPMeals = u.PPMeals;
        requestBody.FPD_PPSeats = u.PPSeats;
        requestBody.FPD_PPDiscount = u.PPDiscount;
        requestBody.FPD_PPChannel = u.PPChannel;
        requestBody.FPD_PPPaymentMethod = u.PPPaymentMethod;
        requestBody.FPD_Wechat = u.Wechat;
        requestBody.FPD_ContactHope = u.ContactHope;
        requestBody.FPD_LanguageHope = u.LanguageHope;
        requestBody.FPD_Inviter = u.FPD_Inviter;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 升级为常旅客
     * @param u
     * @param callBack
     * @constructor
     */
    laUserService.RegisterFrequent = function (u, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_RegisterFrequentUser;
        requestParam.SessionID = laGlobalLocalService.getCookie('SessionID');

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;

        requestBody.Foid = u.Foid;
        requestBody.Mobile = u.Mobile;
        requestBody.Name = u.Name;
        requestBody.Password = u.Password;
        requestBody.VerifyCode = u.VerifyCode;

        requestBody.FoidType = u.FoidType;
        requestBody.Address = u.Address;
        requestBody.Email = u.EMail;
        requestBody.BirthDay = u.BirthDay;
        requestBody.SexType = u.Sex;

        requestBody.FPD_SecondNameCn = u.SecondNameCn;
        requestBody.FPD_FirstNameCn = u.FirstNameCn;
        requestBody.FPD_SecondNameCnPinYin = u.SecondNameCnPinYin;
        requestBody.FPD_FirstNameCnPinYin = u.FirstNameCnPinYin;

        requestBody.FPD_Nationaity = u.Nationaity;
        requestBody.FPD_ContactAddressHope = u.ContactAddressHope;
        requestBody.FPD_HomeAddressCountry = u.HomeAddressCountry;
        requestBody.FPD_HomeAddressProvince = u.HomeAddressProvince;
        requestBody.FPD_HomeAddressCity = u.HomeAddressCity;
        requestBody.FPD_HomeAddressDetail = u.HomeAddressDetail;
        requestBody.FPD_HomePostCode = u.HomePostCode;
        requestBody.FPD_HomeTel = u.HomeTel;
        requestBody.FPD_CompanyAddressCountry = u.CompanyAddressCountry;
        requestBody.FPD_CompanyAddressProvince = u.CompanyAddressProvince;
        requestBody.FPD_CompanyAddressCity = u.CompanyAddressCity;
        requestBody.FPD_CompanyAddressDetail = u.CompanyAddressDetail;
        requestBody.FPD_CompanyName = u.CompanyName;
        requestBody.FPD_Job = u.Job;
        requestBody.FPD_Position = u.Position;
        requestBody.FPD_CompanyTel = u.CompanyTel;
        requestBody.FPD_Fax = u.Fax;
        requestBody.FPD_PPMeals = u.PPMeals;
        requestBody.FPD_PPSeats = u.PPSeats;
        requestBody.FPD_PPDiscount = u.PPDiscount;
        requestBody.FPD_PPChannel = u.PPChannel;
        requestBody.FPD_PPPaymentMethod = u.PPPaymentMethod;
        requestBody.FPD_Wechat = u.Wechat;
        requestBody.FPD_ContactHope = u.ContactHope;
        requestBody.FPD_LanguageHope = u.LanguageHope;
        requestBody.FPD_Inviter = u.FPD_Inviter;

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
     * 删除常用旅客信息
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

    /**
     * 添加受益人信息
     * @param benefit
     * @param callBack
     * @constructor
     */
    laUserService.AddBenefit = function (benefit, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_AddBenefit;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.MB_Name = benefit.MB_Name;
        requestBody.MB_FPCardNo = benefit.MB_FPCardNo;
        requestBody.MB_SexType = benefit.MB_SexType;
        requestBody.MB_Birthday = benefit.MB_Birthday;
        requestBody.MB_SecondName = benefit.MB_SecondName;
        requestBody.MB_FirstName = benefit.MB_FirstName;
        requestBody.MB_SecondNamePinYin = benefit.MB_SecondNamePinYin;
        requestBody.MB_FirstNamePinYin = benefit.MB_FirstNamePinYin;
        requestBody.BeneficiaryInfolist = benefit.BeneficiaryInfolist;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 删除受益人
     * @param tid
     * @param callBack
     * @constructor
     */
    laUserService.DelBenefit = function (tid, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_DelBenefit;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.tid = tid;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 添加受益人证件信息
     * @param tid
     * @param idlist
     * @param callBack
     * @constructor
     */
    laUserService.AddBenefitIdInfo = function (tid, idlist, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_AddBenefitIdInfo;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.mbtid = tid;
        requestBody.idlist = idlist;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 查询受益人列表
     * @param callBack
     * @constructor
     */
    laUserService.QueryBenefitList = function (callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_QueryBenefitList;
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
     * 查询已审核过的受益人列表
     * @param pageIndex
     * @param pageSize
     * @param callBack
     * @constructor
     */
    laUserService.QueryAuditBenefitList = function (pageIndex, pageSize, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_QueryAuditBenefitList;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.OnePageCount = pageSize;
        requestBody.NewPageIndex = pageIndex;

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
     * 查询我的消息列表
     * @param pageNum
     * @param pageSize
     * @param callBack
     * @constructor
     */
    laUserService.QueryMyMessagelist = function (pageNum, pageSize, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_QueryMyMessagelist;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.PageNum = pageNum;
        requestBody.PageSize = pageSize;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 删除我的消息
     * @param idlist
     * @param callBack
     * @constructor
     */
    laUserService.DelMyMessagelist = function (idlist, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_DelMyMessage;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.tidlist = idlist;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 查询常旅客积分列表
     * @param pageNum
     * @param pageSize
     * @param startDate
     * @param endDate
     * @param approved 0:全部;1:已审核;2:未审核;
     * @param callBack
     * @constructor
     */
    laUserService.QueryPointsList = function (pageNum, pageSize, startDate, endDate, approved, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_QueryFrequentMemberPointsList;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.PageNum = pageNum;
        requestBody.PageSize = pageSize;
        requestBody.StartDate = startDate;
        requestBody.EndDate = endDate;
        requestBody.ApprovedOrNot = approved;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 查询常旅客积分兑换积分记录
     * @param callBack
     * @constructor
     */
    laUserService.QueryExchangePointsList = function (callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_QueryExchangePointsList;
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
     * 获取兑换对应航班所需积分
     * @param flightDate 航班日期
     * @param airportFrom 起始地
     * @param airportTo 到达地
     * @param cabin 舱位
     * @param callBack
     * @constructor
     */
    /*
    laUserService.QueryPointsForExchangeFlight = function (flightDate, airportFrom, airportTo, cabin, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_QueryPointsForExchangeFlight;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.flightDate = flightDate;
        requestBody.airportFrom = airportFrom;
        requestBody.airportTo = airportTo;
        requestBody.cabin = cabin;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };
    */

    /**
     * 积分查找航班
     * @param FlightNum 航班号
     * @param AirportFrom 起始地
     * @param AirportTo 到达地
     * @param DepartureTime 起飞时间
     * @param Cabin 舱位
     * @param callBack
     * @constructor
     */
    laUserService.QueryFlightUsePoint = function (FlightNum, AirportFrom, AirportTo, DepartureTime, Cabin, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_QueryFlightUsePoints;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.FlightNum = FlightNum;
        requestBody.AirportFrom = AirportFrom;
        requestBody.AirportTo = AirportTo;
        requestBody.DepartureTime = DepartureTime;
        requestBody.Cabin = Cabin;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                var fli = data;
                var flightList = new laEntityFlightList();
                flightList.Code = fli.Code;
                flightList.Message = fli.Message;

                if (status == true && flightList.Code == laGlobalProperty.laServiceCode_Success) {
                    var flightInfo = fli.Result;
                    var nFlis = flightInfo.FlightInfos.length;
                    for (var n = 0; n < nFlis; n++) {
                        var flightData = new laEntityFlight();
                        flightData.FlightNum = flightInfo.FlightInfos[n].FlightNum;
                        flightData.AirportFrom = flightInfo.FlightInfos[n].AirportFrom;
                        flightData.AirportFromCH = flightInfo.FlightInfos[n].AirportFromCH;
                        flightData.AirportTo = flightInfo.FlightInfos[n].AirportTo;
                        flightData.AirportToCH = flightInfo.FlightInfos[n].AirportToCH;
                        flightData.Distance = flightInfo.FlightInfos[n].Distance;
                        flightData.DepartureTime = new Date(flightInfo.FlightInfos[n].DepartureTime.replace(/-/g, "/"));
                        flightData.ArriveTime = new Date(flightInfo.FlightInfos[n].ArriveTime.replace(/-/g, "/"));
                        flightData.AirportTax = flightInfo.FlightInfos[n].AirportTax;
                        flightData.FuelTax = flightInfo.FlightInfos[n].FuelTax;
                        flightData.OtherTax = flightInfo.FlightInfos[n].OtherTax;
                        flightData.ChildAirportTax = flightInfo.FlightInfos[n].ChildAirportTax;
                        flightData.ChildFuelTax = flightInfo.FlightInfos[n].ChildFuelTax;
                        flightData.ChildOtherTax = flightInfo.FlightInfos[n].ChildOtherTax;
                        flightData.JiXing = flightInfo.FlightInfos[n].JiXing;
                        flightData.JingTing = flightInfo.FlightInfos[n].JingTing;

                        var nCarBinLength = flightInfo.FlightInfos[n].CabinInfos.length;
                        for (var i = 0; i < nCarBinLength; i++) {
                            var cabinData = flightInfo.FlightInfos[n].CabinInfos[i];
                            /*
                            var nnn = {
                                "Result": {
                                    "FlightInfos": [{
                                        "FlightNum": "GJ8887",
                                        "AirportFrom": "HGH",
                                        "AirportFromCH": "杭州萧山国际机场",
                                        "AirportTo": "PEK",
                                        "AirportToCH": "北京首都机场",
                                        "Distance": 0,
                                        "DepartureTime": "2016-07-15 19:05",
                                        "ArriveTime": "2016-07-15 21:25",
                                        "AirportTax": 50,
                                        "FuelTax": 0,
                                        "OtherTax": 0,
                                        "ChildAirportTax": 0,
                                        "ChildFuelTax": 0,
                                        "ChildOtherTax": 0,
                                        "JiXing": "320",
                                        "JingTing": false,
                                        "CabinInfos": [{
                                            "CabinName": "Y",
                                            "CabinType": 0,
                                            "LeftCount": 11,
                                            "AdultIntegral": 50000,
                                            "ChildIntegral": 25000,
                                            "AdultSaleIntegral": 50000,
                                            "ChildSaleIntegral": 25000,
                                            "RefundRule": "0-2-0",
                                            "ChangeRule": "不得改期-2-不得改期",
                                            "SignedTransfer": 2,
                                            "SignedTransferDisplay": "Disable",
                                            "Discount": 0,
                                            "AccidentInsurancePrice": 0,
                                            "AccidentSumInsured": 0,
                                            "AccidentInsuranceTktPriceDiscount": 0,
                                            "AccidentInsuranceCanBuyCount": 0,
                                            "DelayInsurancePrice": 0,
                                            "DelaySumInsured": 0,
                                            "DelayInsuranceTktPriceDiscount": 0,
                                            "DelayInsuranceCanBuyCount": 0
                                        }]
                                    }]
                                }, "Code": "0000", "Message": "查询成功"
                            };
                            */
                            var cabinInfo = new laEntityCabinInfo();
                            cabinInfo.CabinName = cabinData.CabinName;
                            cabinInfo.CabinType = cabinData.CabinType;
                            cabinInfo.CabinTypeName = laEntityEnumCabinTypename[cabinData.CabinType];
                            cabinInfo.LeftCount = cabinData.LeftCount;
                            cabinInfo.Discount = cabinData.Discount;
                            cabinInfo.Price = cabinData.AdultIntegral;//Price;
                            cabinInfo.ChildPrice = cabinData.ChildIntegral;//ChildPrice;
                            cabinInfo.SalePrice = cabinData.AdultSaleIntegral;//SalePrice;
                            cabinInfo.ChildSalePrice = cabinData.ChildSaleIntegral;//ChildSalePrice;
                            //cabinInfo.PriceBase = cabinData.PriceBase;
                            //cabinInfo.ChildPriceBase = cabinData.ChildPriceBase;
                            cabinInfo.RefundRule = cabinData.RefundRule;
                            cabinInfo.ChangeRule = cabinData.ChangeRule;
                            cabinInfo.SignedTransfer = cabinData.SignedTransfer;
                            cabinInfo.SignedTransferDisplay = cabinData.SignedTransferDisplay;
                            cabinInfo.AccidentInsurancePrice = cabinData.AccidentInsurancePrice;
                            cabinInfo.AccidentSumInsured = cabinData.AccidentSumInsured;
                            cabinInfo.AccidentInsuranceTktPriceDiscount = cabinData.AccidentInsuranceTktPriceDiscount;
                            cabinInfo.AccidentInsuranceCanBuyCount = cabinData.AccidentInsuranceCanBuyCount;
                            cabinInfo.DelayInsurancePrice = cabinData.DelayInsurancePrice;
                            cabinInfo.DelaySumInsured = cabinData.DelaySumInsured;
                            cabinInfo.DelayInsuranceTktPriceDiscount = cabinData.DelayInsuranceTktPriceDiscount;
                            cabinInfo.DelayInsuranceCanBuyCount = cabinData.DelayInsuranceCanBuyCount;

                            flightData.CabinInfoList[i] = cabinInfo;
                        }

                        flightList.FlightList[n] = flightData;
                    }

                    if (flightInfo.LowPriceFlights != undefined) {
                        var nLowPrice = flightInfo.LowPriceFlights.length;
                        for (var l = 0; l < nLowPrice; l++) {
                            var lowPrice = new laEntityLowPriceFlights();
                            var cd = new Date(flightInfo.LowPriceFlights[l].FlightDate.replace(/-/g, "/"));
                            lowPrice.FlightDate = cd.getFullYear() + "-" + (cd.getMonth() + 1) + "-" + cd.getDate();
                            lowPrice.LowPrice = flightInfo.LowPriceFlights[l].LowPrice;

                            flightList.LowPriceFlights[l] = lowPrice;
                        }
                    }
                }
                callBack(flightList, status);
            }
        )
    };

    /**
     * 用积分预定订单
     * @param ordInfo 订单信息
     * @param callBack
     * @constructor
     */
    laUserService.CreateOrderByPoints = function (ordInfo, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_CreateOrderByPoints;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = ordInfo.SaleChannel;
        requestBody.ChildRecerveCabinPriceType = ordInfo.ChildRecerveCabinPriceType;
        requestBody.Contacts = ordInfo.Contacts;
        requestBody.Flights = ordInfo.Flights;
        requestBody.Passengers = ordInfo.Passengers;
        requestBody.VerifyCode = ordInfo.VerifyCode;

        requestBody.TotalAmount = ordInfo.TotalAmount;
        requestBody.TotalIntegral = ordInfo.TotalIntegral;
        requestBody.Address = ordInfo.Itinerary;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                //{"Result":{"Amount":790,"OrderId":1930272531004402},"Code":"0000","Message":"预定成功"}
                callBack(data, status);
            }
        )
    };

    /**
     * 获取会员卡信息
     * @param callBack
     * @constructor
     */
    laUserService.QueryMemberCardInfo = function (callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_QueryMemberCardInfo;
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
     * 发送会员卡信息至手机
     * @param cardNo
     * @param name
     * @param callBack
     * @constructor
     */
    laUserService.SendCardNoToMobile = function (cardNo, name, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_SendCardNoToMobile;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.CardNo = cardNo;
        requestBody.Name = name;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 积分补登
     * @param TicketNo 机票票号
     * @param FlightNo 航班号
     * @param Cabin 舱位
     * @param FlightDate 航班日期
     * @param From 起始地
     * @param To 到达地
     * @param SeatNo 座位号
     * @param callBack
     * @constructor
     */
    laUserService.PointsRetro = function (TicketNo, FlightNo, Cabin, FlightDate, From, To, SeatNo, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_PointsRetro;
        requestParam.SessionId = laGlobalLocalService.getCurrentUserSessionId();

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.TicketNo = TicketNo;
        requestBody.FlightNo = FlightNo;
        requestBody.Cabin = Cabin;
        requestBody.FlightDate = FlightDate;
        requestBody.From = From;
        requestBody.To = To;
        requestBody.SeatNo = SeatNo;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 获取汉字的拼音
     * @param ChineseChar 汉字
     * @param callBack
     */
    laUserService.getChinesePinYin = function (ChineseChar, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_GetChinesePinYin;
        requestParam.SessionId = "";

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.Chinese = ChineseChar;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack(data, status);
            }
        )
    };

    /**
     * 获取省份列表
     * @param country
     * @param callBack
     * @constructor
     */
    laUserService.QueryProvinceList = function (country, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_QueryNewProvinceList;
        requestParam.SessionId = "";

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.Country = country;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack({"Province": data.Result, "Code": data.Code}, status);
            }
        )
    };

    /**
     * 获取城市列表
     * @param provinceId
     * @param callBack
     * @constructor
     */
    laUserService.QueryCityList = function (provinceId, callBack) {
        var requestParam = {};
        requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_QueryCityList;
        requestParam.SessionId = "";

        var requestBody = {};
        requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
        requestBody.provinceTid = provinceId;

        requestParam.Args = JSON.stringify(requestBody);

        var postData = JSON.stringify(requestParam);

        laGlobalHTTPService.requestByPostUrl(postData, function (data, status) {
                callBack({"City": data.Result, "Code": data.Code}, status);
            }
        )
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
    laUserService.QueryPlaneSeats = function (flightNumber, fromCity, toCity, flightTime, cabinType, callBack) {
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
    laUserService.OnlineCheckin = function (checkInInfo, callBack) {
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
        requestBody.PassangerName = checkInInfo.PassangerName;
        requestBody.CabinType = checkInInfo.CabinType;

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
    laUserService.OnlineCheckinCancel = function (checkInInfo, callBack) {
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