/* *
 * ---------------------------------------- *
 * 城市选择组件 v1.0
 * Author: VVG
 * QQ: 83816819
 * Mail: mysheller@163.com
 * http://www.cnblogs.com/NNUF/
 * ---------------------------------------- *
 * Date: 2012-07-10
 * ---------------------------------------- *
 * */

/* *
 * 全局空间 Vcity
 * */
var Vcity = {};
/* *
 * 静态方法集
 * @name _m
 * */
Vcity._m = {
    /* 选择元素 */
    $: function (arg, context) {
        var tagAll, n, eles = [], i, sub = arg.substring(1);
        context = context || document;
        if (typeof arg == 'string') {
            switch (arg.charAt(0)) {
                case '#':
                    return document.getElementById(sub);
                    break;
                case '.':
                    if (context.getElementsByClassName) return context.getElementsByClassName(sub);
                    tagAll = Vcity._m.$('*', context);
                    n = tagAll.length;
                    for (i = 0; i < n; i++) {
                        if (tagAll[i].className.indexOf(sub) > -1) eles.push(tagAll[i]);
                    }
                    return eles;
                    break;
                default:
                    return context.getElementsByTagName(arg);
                    break;
            }
        }
    },

    /* 绑定事件 */
    on: function (node, type, handler) {
        node.addEventListener ? node.addEventListener(type, handler, false) : node.attachEvent('on' + type, handler);
    },

    /* 获取事件 */
    getEvent: function (event) {
        return event || window.event;
    },

    /* 获取事件目标 */
    getTarget: function (event) {
        return event.target || event.srcElement;
    },

    /* 获取元素位置 */
    getPos: function (node) {
        var scrollx = document.documentElement.scrollLeft || document.body.scrollLeft,
            scrollt = document.documentElement.scrollTop || document.body.scrollTop;
        var pos = node.getBoundingClientRect();
        return { top: pos.top + scrollt, right: pos.right + scrollx, bottom: pos.bottom + scrollt, left: pos.left + scrollx }
    },

    /* 添加样式名 */
    addClass: function (c, node) {
        if (!node) return;
        node.className = Vcity._m.hasClass(c, node) ? node.className : node.className + ' ' + c;
    },

    /* 移除样式名 */
    removeClass: function (c, node) {
        var reg = new RegExp("(^|\\s+)" + c + "(\\s+|$)", "g");
        if (!Vcity._m.hasClass(c, node)) return;
        node.className = reg.test(node.className) ? node.className.replace(reg, '') : node.className;
    },

    /* 是否含有CLASS */
    hasClass: function (c, node) {
        if (!node || !node.className) return false;
        return node.className.indexOf(c) > -1;
    },

    /* 阻止冒泡 */
    stopPropagation: function (event) {
        event = event || window.event;
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    },
    /* 去除两端空格 */
    trim: function (str) {
        return str.replace(/^\s+|\s+$/g, '');
    }
};

/* 所有城市数据,可以按照格式自行添加（北京|beijing|bj），前16条为热门城市 */
function queryCityAirport(){
    var airpostdata;
    var airlist = new Array();

    var url = laGlobalProperty.laServiceUrl_Interface;
    var requestParam = {};
    requestParam.ActionType = laGlobalProperty.laServiceUrl_ActionType_QueryAirportList;
    requestParam.SessionId = '';
    var requestBody = {};
    requestBody.SaleChannel = laGlobalProperty.laServiceCode_SaleChannel;
    requestBody.AirportCode = '';

    requestParam.Args = JSON.stringify(requestBody);

    var postData = JSON.stringify(requestParam);

    $.ajax({
        url: url,
        type:'POST',
        async: false,
        dataType: 'json',
        contentType:'application/json; charset=UTF-8',
        data: postData,
        success: function (data) {
            airpostdata = data.Result.AllAirports;
            var nlength = data.Result.AllAirports.length;
            for (var i = 0; i < nlength; i++) {
                airlist[i] = airpostdata[i].CityName + '|' + airpostdata[i].PingYin + '|' +
                    airpostdata[i].PingYinFirst + '|' + airpostdata[i].AirportCode;

                Vcity.allCityNamelist += '|' + airpostdata[i].CityName + '|';
            }

            Vcity.allCity = airlist;
        },
        error: function (j, s, e) {

        }
    });
}

//Vcity.allCityNamelist = '';
//queryCityAirport();

/* 正则表达式 筛选中文城市名、拼音、首字母 */

Vcity.regEx = /^([\u4E00-\u9FA5\uf900-\ufa2d]+)\|(\w+)\|(\w)\w*\|(\w)\w*$/i;
Vcity.regExChiese = /([\u4E00-\u9FA5\uf900-\ufa2d]+)/;

/* *
 * 格式化城市数组为对象oCity，按照a-h,i-p,q-z,hot热门城市分组：
 * {HOT:{hot:[]},ABCDEFGH:{a:[1,2,3],b:[1,2,3]},IJKLMNOP:{i:[1.2.3],j:[1,2,3]},QRSTUVWXYZ:{}}
 * */

(function () {
    /*
     var citys = Vcity.allCity, match, letter,
     regEx = Vcity.regEx,
     reg2 = /^[a-h]$/i, reg3 = /^[i-p]$/i, reg4 = /^[q-z]$/i;
     if (!Vcity.oCity) {
     Vcity.oCity = { hot: {}, ABCDEFGH: {}, IJKLMNOP: {}, QRSTUVWXYZ: {} };
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
     if (i < 16) {
     if (!Vcity.oCity.hot['hot']) Vcity.oCity.hot['hot'] = [];
     Vcity.oCity.hot['hot'].push(citys[i]);
     }
     }
     }
     */
})();

/* 城市HTML模板 */
Vcity._template = [
    '<p class="tip">热门城市(支持汉字/拼音)<span class="pull-right"><a style="color:red;" href="javascript:;">X</a></span></p>',
    '<ul>',
    '<li class="on">热门城市</li>',
    '<li>ABCDEFGH</li>',
    '<li>IJKLMNOP</li>',
    '<li>QRSTUVWXYZ</li>',
    '</ul>'
];

/* *
 * 城市控件构造函数
 * @CitySelector
 * */

Vcity.CitySelector = function () {
    this.initialize.apply(this, arguments);
};

Vcity.CitySelector.prototype = {

    constructor: Vcity.CitySelector,

    /* 初始化 */

    initialize: function (options) {
        var input = options.input;
        this.input = Vcity._m.$('#' + input);
        this.inputEvent();
    },

    /* *
     * @createWarp
     * 创建城市BOX HTML 框架
     * */

    createWarp: function () {
        var inputPos = Vcity._m.getPos(this.input);
        var div = this.rootDiv = document.createElement('div');
        var that = this;

        // 设置DIV阻止冒泡
        Vcity._m.on(this.rootDiv, 'click', function (event) {
            Vcity._m.stopPropagation(event);
        });

        // 设置点击文档隐藏弹出的城市选择框
        Vcity._m.on(document, 'click', function (event) {
            event = Vcity._m.getEvent(event);
            var target = Vcity._m.getTarget(event);
            if (target == that.input) return false;
            if (that.cityBox) Vcity._m.addClass('hide', that.cityBox);
            if (that.ul) Vcity._m.addClass('hide', that.ul);
            if (that.myIframe) Vcity._m.addClass('hide', that.myIframe);
        });
        div.className = 'citySelector';
        div.style.position = 'absolute';

        if(inputPos.left + 330 > document.body.clientWidth )
        {
            div.style.right = 10 + 'px';
        }else{
            div.style.left = inputPos.left + 'px';
        }
        div.style.top = inputPos.bottom + 'px';
        div.style.zIndex = 999999;

        // 判断是否IE6，如果是IE6需要添加iframe才能遮住SELECT框
        var isIe = (document.all) ? true : false;
        var isIE6 = this.isIE6 = isIe && !window.XMLHttpRequest;
        if (isIE6) {
            var myIframe = this.myIframe = document.createElement('iframe');
            myIframe.frameborder = '0';
            myIframe.src = 'about:blank';
            myIframe.style.position = 'absolute';
            myIframe.style.zIndex = '-1';
            this.rootDiv.appendChild(this.myIframe);
        }

        var childdiv = this.cityBox = document.createElement('div');
        childdiv.className = 'cityBox';
        childdiv.id = 'cityBox';
        childdiv.innerHTML = Vcity._template.join('');
        var hotCity = this.hotCity = document.createElement('div');
        hotCity.className = 'hotCity';
        childdiv.appendChild(hotCity);
        div.appendChild(childdiv);
        this.createHotCity();

        //设置关闭按钮事件
        Vcity._m.on(childdiv, 'click', function (event) {
            var target = Vcity._m.getTarget(event);
            var t_close = target.innerHTML;
            if (t_close == 'X'){
                if (that.cityBox) Vcity._m.addClass('hide', that.cityBox);
            }
        })
    },

    /* *
     * @createHotCity
     * TAB下面DIV：hot,a-h,i-p,q-z 分类HTML生成，DOM操作
     * {HOT:{hot:[]},ABCDEFGH:{a:[1,2,3],b:[1,2,3]},IJKLMNOP:{},QRSTUVWXYZ:{}}
     **/

    createHotCity: function () {
        var odiv, odl, odt, odd, odda = [], str, key, ckey, sortKey, regEx = Vcity.regEx,
            oCity = Vcity.oCity;
        for (key in oCity) {
            odiv = this[key] = document.createElement('div');
            // 先设置全部隐藏hide
            odiv.className = key + ' ' + 'cityTab hide';
            sortKey = [];
            for (ckey in oCity[key]) {
                sortKey.push(ckey);
                // ckey按照ABCDEDG顺序排序
                sortKey.sort();
            }
            for (var j = 0, k = sortKey.length; j < k; j++) {
                odl = document.createElement('dl');
                odt = document.createElement('dt');
                odd = document.createElement('dd');
                odt.innerHTML = sortKey[j] == 'hot' ? '&nbsp;' : sortKey[j];
                odda = [];
                //var reg = new RegExp("^" + value + "|\\|" + value, 'gi');

                var reg = /^([\u4E00-\u9FA5\uf900-\ufa2d]+)\|(\w+)\|(\w+)\|(\w+)$/i;
                for (var i = 0, n = oCity[key][sortKey[j]].length; i < n; i++) {
                    if (reg.test(oCity[key][sortKey[j]][i])) {
                        var match = reg.exec(oCity[key][sortKey[j]][i]);
                        str = '<a href="javascript:void(0)" segnum="' + match[4] + '">' + match[1] + '</a>';
                        odda.push(str);
                    }
                }
                odd.innerHTML = odda.join('');
                odl.appendChild(odt);
                odl.appendChild(odd);
                odiv.appendChild(odl);
            }

            // 移除热门城市的隐藏CSS
            Vcity._m.removeClass('hide', this.hot);
            this.hotCity.appendChild(odiv);
        }
        document.body.appendChild(this.rootDiv);
        /* IE6 */
        this.changeIframe();

        this.tabChange();
        this.linkEvent();
    },

    /* *
     *  tab按字母顺序切换
     *  @ tabChange
     * */

    tabChange: function () {
        var lis = Vcity._m.$('li', this.cityBox);
        var divs = Vcity._m.$('div', this.hotCity);
        var that = this;
        for (var i = 0, n = lis.length; i < n; i++) {
            lis[i].index = i;
            lis[i].onclick = function () {
                for (var j = 0; j < n; j++) {
                    Vcity._m.removeClass('on', lis[j]);
                    Vcity._m.addClass('hide', divs[j]);
                }
                Vcity._m.addClass('on', this);
                Vcity._m.removeClass('hide', divs[this.index]);
                /* IE6 改变TAB的时候 改变Iframe 大小*/
                that.changeIframe();
            };
        }
    },

    /* *
     * 城市LINK事件
     *  @linkEvent
     * */

    linkEvent: function () {
        var links = Vcity._m.$('a', this.hotCity);
        var that = this;
        for (var i = 0, n = links.length; i < n; i++) {
            links[i].onclick = function () {
                that.input.value = this.innerHTML;
                $("#" + $(that.input).attr("id")).attr("segnum", $(this).attr("segnum"));
                Vcity._m.addClass('hide', that.cityBox);
                /* 点击城市名的时候隐藏myIframe */
                Vcity._m.addClass('hide', that.myIframe);
            }
        }
    },

    /* *
     * INPUT城市输入框事件
     * @inputEvent
     * */
    inputEvent: function () {
        var that = this;

        Vcity._m.on(this.input, 'click', function (event) {
            event = event || window.event;
            if (!that.cityBox) {
                that.createWarp();
            } else if (!!that.cityBox && Vcity._m.hasClass('hide', that.cityBox)) {
                // slideul 不存在或者 slideul存在但是是隐藏的时候 两者不能共存
                if (!that.ul || (that.ul && Vcity._m.hasClass('hide', that.ul))) {
                    Vcity._m.removeClass('hide', that.cityBox);

                    /* IE6 移除iframe 的hide 样式 */
                    //alert('click');
                    Vcity._m.removeClass('hide', that.myIframe);
                    that.changeIframe();
                }
            }
        });
        Vcity._m.on(this.input, 'focus', function () {
            if (!that.cityBox) {
                that.createWarp();
            }
            that.input.select();
            if (that.input.value == '城市名') that.input.value = '';
        });
        Vcity._m.on(this.input, 'blur', function () {
            if (that.input.value == '') that.input.value = '';
        });
        Vcity._m.on(this.input, 'keyup', function (event) {
            event = event || window.event;
            var keycode = event.keyCode;
            Vcity._m.addClass('hide', that.cityBox);
            that.createUl();

            if (keycode == 9){ //tab键
                var target = Vcity._m.getTarget(event);
                if (!that.cityBox) {
                    that.createWarp();
                } else if (!!that.cityBox && Vcity._m.hasClass('hide', that.cityBox)) {
                    if (that.cityBox) Vcity._m.removeClass('hide', that.cityBox);
                    if (that.ul) Vcity._m.addClass('hide', that.ul);
                    if (that.myIframe) Vcity._m.addClass('hide', that.myIframe);
                }
            }

            /* 移除iframe 的hide 样式 */
            Vcity._m.removeClass('hide', that.myIframe);

            // 下拉菜单显示的时候捕捉按键事件
            if (that.ul && !Vcity._m.hasClass('hide', that.ul) && !that.isEmpty) {
                that.KeyboardEvent(event, keycode);
            }
        });
        Vcity._m.on(this.input, 'keydown', function (event){
            event = event || window.event;
            var keycode = event.keyCode;
            if (keycode == 9) { //如果是tab键
                if (that.cityBox) Vcity._m.addClass('hide', that.cityBox);
                if (that.ul) Vcity._m.addClass('hide', that.ul);
                if (that.myIframe) Vcity._m.addClass('hide', that.myIframe);
            }
        });
    },

    /* *
     * 生成下拉选择列表
     * @ createUl
     * */

    createUl: function () {
        var str;
        var value = Vcity._m.trim(this.input.value);
        // 当value不等于空的时候执行
        if (value !== '') {
            var reg = new RegExp("^" + value + "|\\|" + value, 'gi');
            var regExDemo = /^([\u4E00-\u9FA5\uf900-\ufa2d]+)\|(\w+)\|(\w+)\|(\w+)$/i;
            // 此处需设置中文输入法也可用onpropertychange
            var searchResult = [];
            for (var i = 0, n = Vcity.allCity.length; i < n; i++) {
                if (reg.test(Vcity.allCity[i])) {
                    var match = regExDemo.exec(Vcity.allCity[i]);
                    if (searchResult.length !== 0) {
                        str = '<li segnum="' + match[4] + '"><b class="cityname" segnum="' + match[4] + '">' + match[1] + '</b><b class="cityspell" segnum="' + match[4] + '">' + match[2] + '</b></li>';
                    } else {
                        str = '<li class="on" segnum="' + match[4] + '"><b class="cityname" segnum="' + match[4] + '">' + match[1] + '</b><b class="cityspell" segnum="' + match[4] + '">' + match[2] + '</b></li>';
                    }
                    searchResult.push(str);
                }
            }
            this.isEmpty = false;
            // 如果搜索数据为空
            if (searchResult.length == 0) {
                this.isEmpty = true;
                str = '<li class="empty">对不起，没有找到数据 "<em>' + value + '</em>"</li>';
                searchResult.push(str);
            }
            // 如果slideul不存在则添加ul
            if (!this.ul) {
                var ul = this.ul = document.createElement('ul');
                ul.className = 'cityslide';
                this.rootDiv && this.rootDiv.appendChild(ul);
                // 记录按键次数，方向键
                this.count = 0;
            } else if (this.ul && Vcity._m.hasClass('hide', this.ul)) {
                this.count = 0;
                Vcity._m.removeClass('hide', this.ul);
            }
            this.ul.innerHTML = searchResult.join('');

            /* IE6 */
            this.changeIframe();

            // 绑定Li事件
            this.liEvent();
        } else {
            Vcity._m.addClass('hide', this.ul);
            Vcity._m.removeClass('hide', this.cityBox);

            Vcity._m.removeClass('hide', this.myIframe);

            this.changeIframe();
        }
    },

    /* IE6的改变遮罩SELECT 的 IFRAME尺寸大小 */
    changeIframe: function () {
        if (!this.isIE6) return;
        this.myIframe.style.width = this.rootDiv.offsetWidth + 'px';
        this.myIframe.style.height = this.rootDiv.offsetHeight + 'px';
    },

    /* *
     * 特定键盘事件，上、下、Enter键
     * @ KeyboardEvent
     * */

    KeyboardEvent: function (event, keycode) {
        var lis = Vcity._m.$('li', this.ul);
        var len = lis.length;
        switch (keycode) {
            case 40: //向下箭头↓
                this.count++;
                if (this.count > len - 1) this.count = 0;
                for (var i = 0; i < len; i++) {
                    Vcity._m.removeClass('btn', lis[i]);
                }
                Vcity._m.addClass('btn', lis[this.count]);
                break;
            case 38: //向上箭头↑
                this.count--;
                if (this.count < 0) this.count = len - 1;
                for (i = 0; i < len; i++) {
                    Vcity._m.removeClass('btn', lis[i]);
                }
                Vcity._m.addClass('btn', lis[this.count]);
                break;
            case 13: // enter键
                this.input.value = Vcity.regExChiese.exec(lis[this.count].innerHTML)[0];
                $(this.input).attr("segnum", $(lis[this.count]).attr("segnum"));
                Vcity._m.addClass('hide', this.ul);
                Vcity._m.addClass('hide', this.ul);
                /* ie6 */
                Vcity._m.addClass('hide', this.myiframe);
                break;
            default:
                break;
        }
    },

    /* *
     * 下拉列表的li事件
     * @ liEvent
     * */

    liEvent: function () {
        var that = this;
        var lis = Vcity._m.$('li', this.ul);
        for (var i = 0, n = lis.length; i < n; i++) {
            Vcity._m.on(lis[i], 'click', function (event) {
                event = Vcity._m.getEvent(event);
                var target = Vcity._m.getTarget(event);
                var v = Vcity.regExChiese.exec(target.innerHTML);
                if (v == null || v == undefined){
                    v = Vcity.regExChiese.exec(target.parentNode.innerHTML);
                }
                that.input.value = v[0];
                $(that.input).attr("segnum", $(target).attr("segnum"));
                Vcity._m.addClass('hide', that.ul);
                /* IE6 下拉菜单点击事件 */
                Vcity._m.addClass('hide', that.myIframe);
            });
            Vcity._m.on(lis[i], 'mouseover', function (event) {
                event = Vcity._m.getEvent(event);
                var target = Vcity._m.getTarget(event);
                Vcity._m.addClass('on', target);
            });
            Vcity._m.on(lis[i], 'mouseout', function (event) {
                event = Vcity._m.getEvent(event);
                var target = Vcity._m.getTarget(event);
                Vcity._m.removeClass('on', target);
            })
        }
    }
};
