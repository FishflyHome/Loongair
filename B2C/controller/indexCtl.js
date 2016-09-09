/**
 * Created by Jerry on 16/1/11.
 */


//=============================== Controller ========================
laAir.controller('laIndexController', ['$rootScope', '$scope', 'laFlightService', 'laOrderService', 'laUserService', 'laGlobalLocalService', function ($rootScope, $scope, laFlightService, laOrderService, laUserService, laGlobalLocalService) {

    $scope.btnGetFlightInfo = function(){
        $scope.loginbackjson = null;
        var fli = new laEntityFlight();
        fli.AirportFrom = 'HGH';
        fli.AirportTo = 'PEK';
        fli.DepartureTime = '2016-02-20';
        laFlightService.QueryFlight(fli , function (backData, status) {
            $scope.loginbackjson = backData;
        });
    };

    $scope.chkOrderClk = function(a,f){
        var ordInfo = new laEntityOrderCreate();
        ordInfo.SaleChannel =  laGlobalProperty.laServiceCode_SaleChannel;
        ordInfo.ChildRecerveCabinPriceType = 2;

        var psg = new laEntityReservePassenger();
        psg.Brithday = '2000-01-01';
        psg.Foid = 'HZ001';
        psg.FoidType = 2;
        psg.PassengerName = '测试';
        psg.TravellerType = 1;
        /*
        var psg1 = new laEntityReservePassenger();
        psg1.Brithday = '2001-01-01';
        psg1.Foid = 'HZ002';
        psg1.FoidType = 2;
        psg1.PassengerName = '李';
        psg1.TravellerType = 1;
        */
        ordInfo.Passengers[0] = psg;
        //ordInfo.Passengers[1] = psg1;

        ordInfo.TotalAmount = (f.SalePrice + a.AirportTax + a.FuelTax + a.OtherTax) * ordInfo.Passengers.length;

        var fli = new laEntityReserveFlight();
        fli.ArriveAirport = a.AirportTo;
        fli.CabinName = f.CabinName;
        fli.ChildCabinName = '';
        fli.DepartureAirport = a.AirportFrom;
        fli.DepartureTime = a.DepartureTime;
        fli.FlightNum = a.FlightNum;

        ordInfo.Flights[0] = fli;

        var con = new laEntityContacts()
        con.ContactsAddress = '联系人地址';
        con.ContactsEMail = 'f@126.com';
        con.ContactsMobile = '13918251715';
        con.ContactsName = '联系人姓名';
        con.ContactsPhone = '联系人电话';
        con.ContactsZIP = '200299';

        ordInfo.Contacts = con;

        laOrderService.CreateOrder(ordInfo, function(backData, status){
            $scope.orderflightBack = '';
            $scope.orderflightBack = backData;
        });
    };

    $scope.btnGetOrderDetail = function(){
        //$scope.orderidDetail = '1910856491000802';
        laOrderService.QueryOrderInfo($scope.orderidDetail, function(backData, status){
            $scope.orderidDetailback = backData;
        });
    };

    $scope.btnGetOrderPayUrl = function(){
        laOrderService.GetPayUrl($scope.orderidDetail, 3, '', 1, function(backData, status){
            $scope.orderPayUrlback = backData;
        });
        /*
         {"Result":{"OrderId":1910755211003002,"PayPlatCode":3,
         "PayUrlInfo":"https://mapi.alipay.com/gateway.do?&_input_charset=utf-8&notify_url=http%3a%2f%2f120.26.82.34%2fNotify%2fAliPayNotify&out_trade_no=1910755441003402&partner=2088211148439911&payment_type=1&return_url=http%3a%2f%2f120.26.82.34%2fNotify%2fAliPayReturn&seller_email=hongyin.jiang%40loongair.cn&service=create_direct_pay_by_user&subject=%e8%ae%a2%e5%8d%95%e5%8f%b7%3a1910755211003002&total_fee=1720.00&sign=8d3b671c221d50bf64a45fa5d919de3f&sign_type=MD5",
         "PayUrlType":2},"Code":"0000","Message":"操作成功"}
         */
    };

    $scope.btnRefundOrder = function(){
        var refund = new laEntityRefundOrder();
        /*
         this.OrderId;
         this.RefundType;//退票类型，2自愿退票，3非自愿退票
         this.Note;//备注
         this.ContactsName;
         this.ContactsEMail;
         this.ContactsMobile;
         this.Passengers = new Array();
         this.RefundAmount;
         */
        refund.OrderId = $scope.orderidDetail;
        refund.RefundType = 2;
        refund.Note = '我要退票';
        refund.ContactsName = '测试';
        refund.ContactsEMail = 'f@126.com';
        refund.ContactsMobile = '13918251715';
        refund.RefundAmount = 700;

        var psg = new laEntityRefundOrderPassenger();
        psg.FlightIds[0] = '1910856491000602';
        psg.PassengerId = '1910856491000702';

        refund.Passengers[0] = psg;

        laOrderService.RefundOrder(refund, function(backData, status){
            $scope.refundOrderback = backData;
        });
    };

    $scope.btnCancelOrder = function(){
        laOrderService.CancelOrder($scope.cancelorderid, function(backData, status){
            $scope.cancelOrderback = backData;
        });
    };

    $scope.btnGetOrderList = function(){
        laOrderService.QueryOrderList(1, 1000, '2016-01-01 00:00:00', '2018-01-01 00:00:00', function(backData, status){
            $scope.orderListback = backData;
        });
    };

    $scope.btnGetPayChannel = function(){
        $scope.orderpaychannelBack = null;
        laOrderService.GetPayChannel(function(backData, status){
            $scope.orderpaychannelBack = backData;
        });
        /*
         {"Result":[{"PayPlatCodeDisplay":"支付宝","PayPlatCode":3}],"Code":"0000","Message":"操作成功"}
         */
    };

    $scope.btnGetCurrentUInfo = function(){
        $scope.currentUserInfo = null;
        laUserService.GetCurrentUserInfo(function(backData, status){
            $scope.currentUserInfo = backData;
            $scope.currentUser = backData;
        });
    };

    $scope.btnGetMobileCode = function(){
        $scope.MobileCodeBack = null;
        laUserService.SendRegisterMobileCode($scope.mobile, "", function(backData, status){
            $scope.MobileCodeBack = backData.Code +',' + backData.Message +',' + backData.SessionID;
            $scope.SessionId = backData.SessionID;
        });
    };

    $scope.btnUserRegister = function(){
        $scope.RegisterBack = null;
        laUserService.Register($scope.userName, $scope.foid, $scope.pwd, $scope.mobile, $scope.mobilecode, function(backData, status){
            $scope.RegisterBack = backData;
        });
    };

    $scope.btnUserLogin = function(){
        $scope.LoginBack = null;
        laUserService.Login($scope.userNamelogin, $scope.pwdlogin, '', function(backData, status){
            $scope.LoginBack = backData;
        });
    };

    $scope.btnUserLogout = function(){
        $scope.LoginBack = null;
        laUserService.UserLogOut(function(backData, status){
            $scope.LoginBack = backData;
        });
    };

    $scope.btnQueryStationPassengers = function(){
        laUserService.QueryStationPassengers(1, 10, '', '', function(backData, status){
            $scope.stationPassengersBack = backData;
        });
    };

    $scope.fl = new laEntityStationPassenger();

    $scope.btnQueryStationPassengersDetail = function(){
        laUserService.QueryStationPassengersDetail($scope.fl.Tid, function(backData, status){
            $scope.stationPassengersDetailBack = backData;

            $scope.fl.FlierName = backData.Result.FlierName;
            $scope.fl.Foid = backData.Result.Foid;
            $scope.fl.FoidType = backData.Result.FoidType;
            $scope.fl.TravellerType = backData.Result.TravellerType;
            $scope.fl.Mobile = backData.Result.Mobile;
            $scope.fl.EMail = backData.Result.EMail;
            $scope.fl.Brithday = backData.Result.Brithday;
            $scope.fl.Tid = backData.Result.Tid;
        });
    };

    $scope.btnMStationPassengers = function(){
        laUserService.MaintainStationPassengers($scope.fl, function(backData, status){
            $scope.mStationPassengersBack = backData;
        });
    };

    $scope.btnDelMStationPassengers = function(){
        var t = new Array();
        t[0] = $scope.fl.Tid
        laUserService.DelMaintainStationPassengers(t, function(backData, status){
            $scope.mStationPassengersBack = backData;
        });
    };

    $scope.btnChangeLoginPwd = function(){
        laUserService.ChangeUserPassword($scope.oldpwd, $scope.newpwd, function(backData, status){
            $scope.changeLoginPwdBack = backData;
        });
    };

    $scope.btnSendFindPwdValidCode = function(){
        laUserService.SendFindPasswordMobileCode('13918251715', '370', '', function(backData, status){
            $scope.SendFindPwdValidCodeBack = backData;
        });
    };

    $scope.btnFindLoginPassword = function(){
        laUserService.FindLoginPassword('13918251715', '370', $scope.fpwdnewpwd, $scope.fpwdmvalidcode, function(backData, status){
            $scope.FindLoginPasswordBack = backData;
        });
    };

    $scope.btnQueryAirportInfo = function(){
        laUserService.QueryAirportInfo('CGQ', function(backData, status){
            $scope.queryAirportInfoBack = backData;
        });
    };

    $rootScope.testname = 'Hi,Jerry';
}]);

laAir.controller('lahello', ['$rootScope', '$scope', 'laGlobalLocalService', function ($rootScope, $scope, laGlobalLocalService) {

    $scope.btnShowU = function () {
        alert($rootScope.testname);
        var uInfo = JSON.parse(laGlobalLocalService.getCookie('UserInfo'));

        $scope.userinfoshow = uInfo.SessionID;
    }
}]);