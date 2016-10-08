var calendar = {
    config: {
        id: null,
        ok: null,
        maxDay: null,
        minDay: null,
        zIndex: 1000,
        ishotel: false,
        para: null,
        mode: null,
        format: "yyyy-MM-dd"
    },
    clear: function () {
        calendar.config.id = null;
        calendar.config.ok = null;
        calendar.config.maxDay = null;
        calendar.config.minDay = null;
        calendar.config.zIndex = 1000;
        calendar.config.para = null;
        calendar.config.mode = null;
        calendar.config.ishotel = false;
    },
    _setDay: function (m, y, d) {
        var currDay = d;
        var currMon = m;
        var currYear = y;

        var setMon = new Date().getMonth() + 1;
        var setYear = new Date().getFullYear();
        var setDay = new Date().getDate();

        var firstDay = new Date(y + "/" + m + "/" + 1).getDay();
        var calDay = [];
        var _d = 1;
        var lastDay = new Date(y, m, 0).getDate();
        for (var i = 0; i < 6; i++) {
            calDay.push("<tr>");
            for (var j = 0; j < 7; j++) {
                if (i == 0) {
                    if (firstDay > j) {
                        calDay.push("<td date=''>&nbsp;</td>");
                    }
                    else {
                        var f = calendar.festivals(y, m, _d);
                        var p = calendar.setpara(y, m, _d);
                        var _dx = (y + "-" + m + "-" + _d);
                        var tdCallenPriceClickStr = "";
                        if (calendar.config.para) {
                            tdCallenPriceClickStr = "onclick=\"javascript:_CalendarPrice('lowprice','" + _dx + "');\"";
                        }
                        if (m == currMon && currDay == _d && currYear == y) {
                            calDay.push("<td date='" + _dx + "' class='_selDay' " + tdCallenPriceClickStr + ">" + _d + "");
                        }
                        else if (m == setMon && setDay == _d && setYear == y) {
                            calDay.push("<td date='" + _dx + "' title='" + _d + "号' class='_sday' " + tdCallenPriceClickStr + ">今天");
                        }
                        else if (p[0] !== "") {
                            if (calendar.config.minDay != null && new Date(calendar.config.minDay.replace(/[年月日-]/g, "\/")) > new Date(_dx.replace(/[-]/g, "\/"))) {
                                calDay.push("<td date='' class='disDay'>" + _d + " ");
                            } else {
                                calDay.push("<td date='" + _dx + "' " + tdCallenPriceClickStr + ">" + _d + " ");
                            }
                        }
                        else if (f !== "") {
                            if (calendar.config.minDay != null && new Date(calendar.config.minDay.replace(/[年月日-]/g, "\/")) > new Date(_dx.replace(/[-]/g, "\/"))) {
                                calDay.push("<td date='' class='festival disDay'>" + f + "");
                            } else {
                                calDay.push("<td date='" + _dx + "' class='festival' " + tdCallenPriceClickStr + ">" + f + "");
                            }
                        }
                        else if (calendar.config.minDay != null && new Date(calendar.config.minDay.replace(/[年月日-]/g, "\/")) > new Date(_dx.replace(/[-]/g, "\/"))) {
                            calDay.push("<td date='' class='disDay'>" + _d + "");
                        }
                        else if (calendar.config.maxDay != null && new Date(calendar.config.maxDay.replace(/[年月日-]/g, "\/")) < new Date(_dx.replace(/[-]/g, "\/"))) {
                            calDay.push("<td date='' class='disDay'>" + _d + "");
                        }
                        else {
                            calDay.push("<td date='" + _dx + "' " + tdCallenPriceClickStr + ">" + _d + "");
                        }
                        if (p[1] == true) {
                            calDay.push("<span class='minimal'></span>")
                        }
                        if (p[0] !== "") {
                            calDay.push("<br><span class='tpliss' >￥" + p[0] + "</span></td>");
                        } else if (calendar.config.para) {
                            calDay.push("<br><span class='tpliss'>--</span></td>");
                        } else {
                            calDay.push("</td>");
                        }
                        _d++;
                    }
                }
                else {
                    if (_d <= lastDay) {
                        var f = calendar.festivals(y, m, _d);
                        var p = calendar.setpara(y, m, _d);
                        var _dx = (y + "-" + m + "-" + _d);
                        if (calendar.config.para) {
                            tdCallenPriceClickStr = "onclick=\"javascript:_CalendarPrice('lowprice','" + _dx + "');\"";
                        }
                        if (m == currMon && currDay == _d && currYear == y) {
                            calDay.push("<td date='" + _dx + "' class='_selDay'" + tdCallenPriceClickStr + ">" + _d + "");
                        }
                        else if (m == setMon && setDay == _d && setYear == y) {
                            calDay.push("<td date='" + _dx + "' title='" + _d + "号' class='_sday' " + tdCallenPriceClickStr + ">今天");
                        }
                        else if (p[0] !== "") {
                            if (calendar.config.minDay != null && new Date(calendar.config.minDay.replace(/[年月日-]/g, "\/")) > new Date(_dx.replace(/[-]/g, "\/"))) {
                                calDay.push("<td date='' class='disDay'>" + _d + " ");
                            } else {
                                calDay.push("<td date='" + _dx + "' " + tdCallenPriceClickStr + ">" + _d + " ");
                            }
                            //calDay.push("<td date='" + _dx + "' " + tdCallenPriceClickStr + ">" + _d + "");
                        }
                        else if (f !== "") {
                            //calDay.push("<td date='" + _dx + "' title='" + m + "-" + _d + "' class='festival'>" + f + "");
                            if (calendar.config.minDay != null && new Date(calendar.config.minDay.replace(/[年月日-]/g, "\/")) > new Date(_dx.replace(/[-]/g, "\/"))) {
                                calDay.push("<td date='' class='festival disDay'>" + f + "");
                            } else if (calendar.config.maxDay != null && new Date(calendar.config.maxDay.replace(/[年月日-]/g, "\/")) < new Date(_dx.replace(/[-]/g, "\/"))){
                                calDay.push("<td date='' class='festival disDay'>" + f + "");
                            } else {
                                calDay.push("<td date='" + _dx + "' class='festival' " + tdCallenPriceClickStr + ">" + f + "");
                            }
                        }
                        else if (calendar.config.minDay != null && new Date(calendar.config.minDay.replace(/[年月日-]/g, "\/")) > new Date(_dx.replace(/[-]/g, "\/"))) {
                            calDay.push("<td date='' class='disDay'>" + _d + "");
                        }
                        else if (calendar.config.maxDay != null && new Date(calendar.config.maxDay.replace(/[年月日-]/g, "\/")) < new Date(_dx.replace(/[-]/g, "\/"))) {
                            calDay.push("<td date='' class='disDay'>" + _d + "");
                        }
                        else {
                            calDay.push("<td date='" + _dx + "' " + tdCallenPriceClickStr + ">" + _d + "");
                        }
                        if (p[1] == true) {
                            calDay.push("<span class='minimal'></span>")
                        }
                        if (p[0] !== "") {
                            calDay.push("<br><span class='tpliss'>￥" + p[0] + "</span></td>");
                        } else if (calendar.config.para) {
                            calDay.push("<br><span class='tpliss'>--</span></td>");
                        } else {
                            calDay.push("</td>");
                        }
                        _d++;
                    }
                    else calDay.push("<td date=''>&nbsp;</td>");
                }
            }
            calDay.push("</tr>");
        }
        return calDay.join("");
    },
    L: function (e) {
        var l = 0;
        while (e) {
            l += e.offsetLeft;
            e = e.offsetParent;
        }
        return l
    },
    T: function (e) {
        var t = 0;
        while (e) {
            t += e.offsetTop;
            e = e.offsetParent;
        }
        return t
    },
    colse: function () {
        if (document.getElementById("_calendar")) {
            document.body.removeChild(document.getElementById("_calendar"));
            $(".calendar").remove();
        }
    },
    show: function () {
        calendar.colse();
        var config = arguments[0];
        var that = calendar.config;
        calendar.clear();
        for (var i in that) {
            if (config[i] != undefined) {
                that[i] = config[i];
            }
        }
        ;
        calendar.init(calendar.config.id);
    },
    festivals: function (y, m, d) {
        var lFtv = ["201644:清明节", "201651:五一", "201654:青年节", "201658:母亲节", "201661:六一", "201669:端午节", "2016619:父亲节", "201671:建党节", "201681:建军节", "201689:七夕节", "2016910:教师节", "2016915:中秋节", "2016101:国庆节", "2016109:重阳节", "20161224:平安夜", "20161225:圣诞节", "201711:元旦", "2017127:除夕", "2017214:情人节", "2017211:元宵节"];
        var f = "";
        for (var i = 0; i < lFtv.length; i++) {
            if (lFtv[i].split(':')[0] == (y.toString() + m.toString() + d.toString()))
                f = lFtv[i].split(':')[1];
        }
        return f;
    },
    setpara: function (y, m, d) {
        var p = "";
        var state = false;
        if (calendar.config.para && calendar.config.para.length > 0) {
            var pmin = calendar.config.para[0].p;
            for (var i = 0; i < calendar.config.para.length; i++) {
                if (pmin > calendar.config.para[i].p) {
                    pmin = calendar.config.para[i].p;
                }
            }
            for (var i = 0; i < calendar.config.para.length; i++) {
                if (calendar.config.para[i].d == (y.toString() + "-" + m.toString() + "-" + d.toString())) {
                    p = calendar.config.para[i].p;
                    if (p == pmin) {
                        state = true;
                    }
                }
            }
        }
        else {
            p = "";
        }

        return [p, state];
    },
    init: function (s) {

        var obj = s;
        //var oDay = s.valur.replace(/[年月]/g, "-").replace(/[日]/g, "");
        var oDay = "";
        if ($(s).attr("date") != "" && $(s).attr("date") != undefined) {
            oDay = $(s).attr("date");
        }

        var currMon = new Date().getMonth() + 1;
        var currYea = new Date().getFullYear();
        var currDay = new Date().getDate();
        var reg = /^(\d{4})-(\d{2})-(\d{2})$/;
        if (oDay != "" && reg.test(oDay)) {
            currMon = parseInt(oDay.split('-')[1]);
            currDay = parseInt(oDay.split('-')[2]);
            currYea = oDay.split('-')[0];
        }
        var modMone = new Date().getFullYear();
        modMone = modMone +2;
        var _yers = [];
        /*
        _yers.push("<table style='display:none;' id='calYear' class='calYear'>");
        for (var m = 0; m < 4; m++) {
            _yers.push("<tr>");
            for (var n = 0; n < 3; n++) {
                _yers.push("<td>" + modMone + "</td>");
                modMone++;
            }
            _yers.push("</tr>");
        }
        _yers.push("</table>");
        */
        _yers.push("<select style='display:none;' id='calYear' class='calYear'>");
        for (var m = modMone; m > modMone-2-120; m--) {
            _yers.push("<option value='"+m+"'>"+m+"</option>");
        }
        _yers.push("</select>");

        var stylePreMonth = "";
        if (currYea.toString() == new Date().getFullYear().toString() &&
            currMon.toString() == (new Date().getMonth() + 1).toString()) {
            stylePreMonth = " style='border-right: 16px solid #dddddd;cursor:default;' ";
        }

        var _c = [];
        var t = s.offsetHeight;
        if (calendar.config.para) {
            if (calendar.config.mode == "double") {
                var year = 0;
                if (currMon == 12) {
                    mouth = 1;
                    year = parseInt(currYea) + 1;
                }
                else {
                    mouth = parseInt(currMon) + 1;
                    year = currYea;
                }
                _c.push("<div id='calendar_head' class='calendar_head para_head'><em class='calendaremL'" + stylePreMonth + "> </em> <div class='calendarhalf'><input id='_calyear' type='text' readonly value='" + currYea + "' />年<input id='_calmod' type='text' readonly value='" + currMon + "' />月 </div><div class='line-ca-1'></div> <div  class='calendarhalf'><input id='_calyear_2' readonly type='text' value='" + year + "' />年<input id='_calmod_2' readonly type='text' value='" + mouth + "' />月 </div><em class='calendaremR'> </em>");
            } else {
                _c.push("<div id='calendar_head' class='calendar_head para_head'><em class='calendaremL'" + stylePreMonth + "> </em><input id='_calyear' type='text' readonly  value='" + currYea + "' />年<input id='_calmod' type='text' readonly value='" + currMon + "' />月<em class='calendaremR'> </em>");
            }
        } else {
            if (calendar.config.mode == "double") {
                var mouth = 0;
                var year = 0;
                if (currMon == 12) {
                    mouth = 1;
                    year = parseInt(currYea) + 1;
                }
                else {
                    mouth = parseInt(currMon) + 1;
                    year = currYea;
                }
                _c.push("<div id='calendar_head' class='calendar_head'><em class='calendaremL' " + stylePreMonth +"> </em> <div class='calendarhalf'><input id='_calyear' type='text' style='background:#f9f9f9;' readonly value='" + currYea + "' />年<input id='_calmod' type='text' style='background:#f9f9f9;' readonly value='" + currMon + "' />月</div> <div class='line-ca-1'></div> <div  class='calendarhalf'><input id='_calyear_2' type='text' style='background:#f9f9f9;' value='" + year + "' readonly />年<input readonly id='_calmod_2' style='background:#f9f9f9;' type='text' value='" + mouth + "' />月</div><em class='calendaremR'> </em>");
            } else {
                _c.push("<div id='calendar_head' class='calendar_head'><em class='calendaremL'> </em><input id='_calyear' type='text' style='background:#f9f9f9;' readonly value='" + currYea + "' />年<input id='_calmod' type='text' style='background:#f9f9f9;' readonly value='" + currMon + "' />月<em class='calendaremR'> </em>");
            }
        }

        _c.push(_yers.join(""));
        _c.push("<table style='display:none;' id='calMonth' class='calMonth'><tr><td>1月</td></tr><tr><td>2月</td></tr><tr><td>3月</td></tr><tr><td>4月</td></tr><tr><td>5月</td><tr><td>6月</td></tr><tr><td>7月</td></tr><tr><td>8月</td></tr><tr><td>9月</td></tr><tr><td>10月</td></tr><tr><td>11月</td></tr><tr><td>12月</td></tr></table>");
        _c.push("</div>");
        if (calendar.config.mode == "double") {
            var nextmouth = 0;
            if (currMon == 12) {
                nextmouth = 1
            } else {
                nextmouth = currMon + 1;
            }
            _c.push("<div class='calendar_boy double_calendar' ><i id='_bgMon'>" + currMon + "</i><i id='_bgMon2'>" + nextmouth + "</i>");
        } else {
            _c.push("<div class='calendar_boy' ><i id='_bgMon'>" + currMon + "</i>");
        }
        if (calendar.config.para) {
            _c.push("<table id='_tdCal' class='_caltable para_calendar' style='table-layout:fixed;' border='0'><tr class='tr-head'><td style='color:brown;'>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td style='color:brown;'>六</td></tr>");
        } else {
            _c.push("<table id='_tdCal' class='_caltable' border='0'><tr><td style='color:brown;'>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td style='color:brown;'>六</td></tr>");
        }
        _c.push("" + calendar._setDay(currMon, currYea, currDay) + "");

        if (calendar.config.mode == "double") {
            var mouth = 0;
            var year = 0;
            if (currMon == 12) {
                mouth = 1;
                year = parseInt(currYea) + 1;
            }
            else {
                mouth = parseInt(currMon) + 1;
                year = currYea;
            }
            if (calendar.config.para) {
                _c.push("<table id='_tdCal_double'  class='_caltable para_calendar'  border='0'><tr class='tr-head'><td style='color:brown;'>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td style='color:brown;'>六</td></tr>");
            } else {
                _c.push("<table id='_tdCal_double'  class='_caltable' border='0'><tr><td style='color:brown;'>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td style='color:brown;'>六</td></tr>");
            }
            _c.push("" + calendar._setDay(mouth, year, 0) + "");
        }
        _c.push("</table>");

        var calTop = calendar.T(s) + t;
        var calLeft = calendar.L(s);
        var bodyHith = document.body.parentNode.offsetHeight;
        var bodywidth = document.body.parentNode.offsetWidth;
        if ((calTop + 225) > bodyHith) {
            calTop = calendar.T(s) - 225;
        }
        var _boy = document.getElementsByTagName("body").item(0);
        var _div = document.createElement("div");
        _div.setAttribute('id', "_calendar");
        if (calendar.config.para) {
            _div.setAttribute('class', "calendar para_calendar");
        } else {
            _div.setAttribute('class', "calendar");
        }
        var basicw = 0;
        if (calendar.config.para) {
            basicw = 392; //292
        }
        if (calendar.config.mode == "double") {
            basicw = 560;//410
        }
        if (calendar.config.mode == "double" && calendar.config.para) {
            basicw = 734;//584
        }
        if (basicw == 0) {
            basicw = 310;//210
        }
        if (parseInt(calLeft) + basicw > $(window).width()) {
            _div.setAttribute('style', "left:" + (parseInt(calLeft) - basicw + 64) + "px; width:" + basicw + "px; top:" + calTop + "px;z-index:" + calendar.config.zIndex + ";");
        } else {
            _div.setAttribute('style', "left:" + calLeft + "px; width:" + basicw + "px; top:" + calTop + "px;z-index:" + calendar.config.zIndex + ";");
        }
        _boy.appendChild(_div);
        document.getElementById("_calendar").innerHTML = _c.join("");

        $("#_calyear").click(function () {
            if(document.getElementById("calYear").options.length > 10)
            {
              document.getElementById("calYear").size = 10;
            }else{
              document.getElementById("calYear").size = document.getElementById("calYear").options.length;
            }

            if (calendar.config.mode == "double") {
                $("#calYear").css({"left": "11.7%"});
            }else if (calendar.config.para){
                $("#calYear").css({"left": "30.3%"});
            }else{
                $("#calYear").css({"left": "26%"});
            }
            if(calendar.config.mode == "double" && calendar.config.para){
              $("#calYear").css({"left": "14.6%"});
            }

            $("#calYear").show();
            $("#calMonth").hide();
            /*
             $("#calYear td").click(function () {
               $("#_calyear").val(this.innerHTML);
               $("#_calyear_2").val(this.innerHTML);
               calendar._yearMon($("#_calmod").val(), this.innerHTML, s);
               $("#calYear").hide();
             });
             */
            $("#calYear").trigger("click");
            $("#calYear").change(function () {
                $("#_calyear").val(this.value);
                $("#_calyear_2").val(this.value);
                calendar._yearMon($("#_calmod").val(), this.value, s);
                $("#calYear").hide();
            });

        });

        $("#_calyear_2").click(function () {
            if(document.getElementById("calYear").options.length > 10)
            {
              document.getElementById("calYear").size = 10;
            }else{
              document.getElementById("calYear").size = document.getElementById("calYear").options.length;
            }

             $("#calYear").css({"left":"61.7%"});
             if(calendar.config.mode == "double" && calendar.config.para){
               $("#calYear").css({"left": "64.6%"});
             }
             $("#calYear").show();
             $("#calMonth").hide();
            /*
             $("#calYear td").click(function () {
               $("#_calyear").val(this.innerHTML);
               $("#_calyear_2").val(this.innerHTML);
               calendar._yearMon($("#_calmod").val(), this.innerHTML, s);
               $("#calYear").hide();
             });
             */
            $("#calYear").change(function () {
                $("#_calyear").val(this.value);
                $("#_calyear_2").val(this.value);
                calendar._yearMon($("#_calmod").val(), this.value, s);
                $("#calYear").hide();
            });

        });


        $("#_calmod").click(function () {
             $("#calYear").hide();
            if (calendar.config.mode == "double") {
                $("#calMonth").css({"left":"26%"});
            }else if (calendar.config.para){
                $("#calMonth").css({"left":"51.5%"});
            }else{
                $("#calMonth").css({"left":"52%"});
            }

             $("#calMonth").show();
             $("#calMonth td").click(function () {
               var mymouth = this.innerHTML.replace(/[月]/g, "");
               $("#_calmod").val(mymouth);
               if(parseInt(mymouth) == 12)
               {
                 $("#_calmod_2").val(1);
                 $("#_calyear_2").val(parseInt($("#_calyear").val())+1);
               }else{
                 $("#_calmod_2").val(parseInt(mymouth)+1);
               }
               calendar._yearMon(this.innerHTML.replace(/[月]/g, ""), $("#_calyear").val(), s);
               $("#calMonth").hide();
             });
        });

        $("#_calmod_2").click(function () {
             $("#calYear").hide();
            if (calendar.config.mode == "double") {
                $("#calMonth").css({"left":"76%"});
            }else if (calendar.config.para){
                $("#calMonth").css({"left":"53%"});
            }
             $("#calMonth").show();
             $("#calMonth td").click(function () {
               var mymouth = this.innerHTML.replace(/[月]/g, "");
               $("#_calmod_2").val(mymouth);
               if(parseInt(mymouth) == 1)
               {
                 $("#_calmod").val(12);
                 $("#_calyear").val(parseInt($("#_calyear_2").val())-1);
                 calendar._yearMon(12, $("#_calyear").val(), s);
               }else{
                 $("#_calmod").val(parseInt(mymouth)-1);
                 $("#_calyear").val(parseInt($("#_calyear_2").val()));
                 calendar._yearMon(parseInt(mymouth)-1, $("#_calyear").val(), s);
               }

               $("#calMonth").hide();
             });
        });

        $("#_tdCal tr:gt(0) td[date!=''],#_tdCal_double tr:gt(0) td[date!='']").click(function () {
            s.value = new Date($(this).attr("date").replace(/[-]/g, "/")).format(calendar.config.format);
            $(s).attr("date", new Date($(this).attr("date").replace(/[-]/g, "/")).format("yyyy-MM-dd"));
            if (calendar.config.ok != null) {
                eval(calendar.config.ok());
            }
            calendar.colse();
        }).on("mouseover", function () {
            $(this).css({"color": "#fff", "background-color": "#ff9900"});
        }).on("mouseout", function () {
            $(this).removeAttr("style")
        });


        $("#calendar_head em").click(function () {
            if ($("#calendar_head em").index(this) == 0) {
                calendar._nexPrv("L", $("#_calmod").val(), $("#_calyear").val(), s);
            }
            else {
                calendar._nexPrv("R", $("#_calmod").val(), $("#_calyear").val(), s);
            }
        });
        $("#_tdCal,#_tdCal_double").click(function () {
            $("#calYear").hide();
            $("#calMonth").hide();
        });
        document.onclick = function (e) {
            var event = e || window.event;
            var Target = event.target || event.srcElement;
            calendar.hide(event, Target, obj);
        }
    },
    hide: function (event, Target, obj) {
        var oPare = Target.parentNode;
        var isChild = true;
        if (oPare == obj || Target == obj) {
            isChild = true;
        } else {
            loop: while (oPare != document.getElementById("_calendar")) {
                oPare = oPare.parentNode;
                if (oPare == obj || oPare == null) {
                    isChild = false;
                    break loop;
                }
            }
        }
        if (!isChild) {
            calendar.colse();
        }
    },
    _selCal: function (e) {
        $("#_tdCal tr:gt(0) td[date!=''],#_tdCal_double tr:gt(0) td[date!='']").click(function () {
            e.value = new Date($(this).attr("date").replace(/[-]/g, "/")).format(calendar.config.format);
            $(e).attr("date", new Date($(this).attr("date").replace(/[-]/g, "/")).format("yyyy-MM-dd"));
            if (calendar.config.ok != null) {
                eval(calendar.config.ok());
            }
            calendar.colse();
        });
    },
    _yearMon: function (m, y, s) {
        $("#_tdCal tr:gt(0),#_tdCal_double tr:gt(0)").remove();
        $("#_tdCal").append(calendar._setDay(m, y, 0));
        if(m == 12)
        {
          $("#_tdCal_double").append(calendar._setDay(1, parseInt(y)+1, 0));
          $("#_bgMon2").html(1);
        }else{
          $("#_tdCal_double").append(calendar._setDay(parseInt(m)+1, y, 0));
          $("#_bgMon2").html(parseInt(m)+1);
        }
        $("#_bgMon").html(parseInt(m));
        $("#_tdCal tr:gt(0) td[date!=''],#_tdCal_double tr:gt(0) td[date!='']").click(function () {
            s.value = new Date($(this).attr("date").replace(/[-]/g, "/")).format(calendar.config.format);
            $(s).attr("date", new Date($(this).attr("date").replace(/[-]/g, "/")).format("yyyy-MM-dd"));
            calendar.colse();
        });
    },
    _nexPrv: function (t, m, y, s) {

        var today = new Date();
        var yn = today.getFullYear();
        var mn = today.getMonth() + 1;
        var arrl = $("#calendar_head em")[0];

        var ys = y;
        var ms = m;
        if (t == "L") {
            if (calendar.config.mode == "double" || calendar.config.para != null) {
                if (yn == y && mn == m) {
                    return;
                }
            }

            if (m == 1) {
                ms = 12;
                ys = parseInt(y) - 1;
            }
            else {
                ms = parseInt(m) - 1;
            }
        }
        else {
            if (m == 12) {
                ms = 1;
                ys = parseInt(y) + 1;
            }
            else {
                ms = parseInt(m) + 1;
            }
        }

        $("#_tdCal tr:gt(0),#_tdCal_double tr:gt(0)").remove();
        $("#_tdCal").append(calendar._setDay(ms, ys, 0));
        $("#_tdCal_double").append(calendar._setDay(ms + 1, ys, 0));
        $("#_calmod").val(ms);
        $("#_calyear").val(ys);
        if (ms == 12) {
            var ms2 = 1;
            var ys2 = parseInt(ys) + 1;
        }
        else {
            var ms2 = parseInt(ms) + 1;
            var ys2 = ys;
        }
        $("#_calmod_2").val(ms2);
        $("#_calyear_2").val(ys2);
        $("#_bgMon").html(ms);
        $("#_bgMon2").html(ms2);
        $("#_tdCal tr:gt(0) td[date!=''],#_tdCal_double tr:gt(0) td[date!='']").click(function () {
            s.value = new Date($(this).attr("date").replace(/[-]/g, "/")).format(calendar.config.format);
            $(s).attr("date", new Date($(this).attr("date").replace(/[-]/g, "/")).format("yyyy-MM-dd"));
            calendar.colse();
        });

        if (t == "L") {
            if (calendar.config.mode == "double" || calendar.config.para != null) {
                if (yn == ys && mn == ms) {
                    $(arrl).css({"border-right": "16px solid #dddddd", "cursor": "default"});
                    return;
                } else {
                    $(arrl).css({"border-right": "16px solid #aeaeae", "cursor": "pointer"});
                }
            }
        }else{
            $(arrl).css({"border-right": "16px solid #aeaeae", "cursor": "pointer"});
        }
    }
};
Date.prototype.format = function (format) {
    var o =
    {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    ;
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
        ;
    }
    ;
    return format;
};
