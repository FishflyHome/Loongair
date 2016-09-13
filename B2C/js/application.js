//*描述：首页JS函数
/***************************************************************************************************************/

$(function () {
    InitPage();

    //bootbox使用中文
    bootbox.setLocale("zh_CN");

    //航班预定页，舱位价格显示和隐藏
    /*
    $("a.showmore").on('click', function () {
        if ($(this).next(".prices").height() != 80) {
            //console.log($(this).next(".prices").height())
            $(this).next(".prices").animate({height: "80px"});
            $(this).html("<b>+</b>展开");
        } else {
            $(this).next(".prices").css({height: "auto"});
            $(this).html("<b>-</b>收起")
        }
    })
    */

    /*
     $("a[data-name='tooltips']").hover(function () {
     var title = $(this).attr("data-title");
     if (typeof(title) == "undefined") {
     title = "退改签规则"
     }
     var content = $(this).attr("data-tips");
     var box = $("<div class='roles'><table><thead><tr><th>"+title+"</th></tr></thead><tbody><tr><td>" + content + "</td></tr></tbody></table></div>")
     $("body").append(box);
     box.css({top: $(this).offset().top, left: $(this).offset().left});
     }, function () {
     $(".roles").remove();
     });
     */

    var title_pop = ["退改签规则", "扫描下载客户端"];
    $(document).on("mouseover mouseout", "a[data-name='tooltips']", function (event) {
        if (event.type == "mouseover") {
            var title = $(this).attr("data-title");
            if (typeof(title) == "undefined") {
                title = title_pop[0]
            }
            if (title == title_pop[1]) {
                var content = $(this).attr("data-tips");
                var box = $("<div class='roles'><table><thead><tr><th>" + title + "</th></tr></thead><tbody><tr><td>" + content + "</td></tr></tbody></table></div>")
                $("body").append(box);
                if ($(window).width() < 1275) {
                    box.css({top: $(this).offset().top, right: $(window).width() - $(this).offset().left - 60});
                } else {
                    box.css({top: $(this).offset().top, left: $(this).offset().left});
                }
            }
        } else if (event.type == "mouseout") {
            $(".roles").remove();
        }
    });
});
function InitPage() {

    //鼠标滑过显示二级菜单
    $(document).on("mouseover mouseout",".nav li",function(event){
        if(event.type == "mouseover"){
            //$(this).attr("class", "active");
            $(this).find(".overhref").css("display", "block");
            $(this).find(".outhref").css("display", "none");
            if($(this).find(".secondary_menu").length > 0 && $(this).find(".secondary_menu").hasClass("hide"))
            {
                $(this).find(".secondary_menu").removeClass("hide");
            }
        }else if(event.type == "mouseout"){
            //$(this).attr("class", "");
            $(this).find(".overhref").css("display", "none");
            $(this).find(".outhref").css("display", "block");
            if($(this).find(".secondary_menu").length > 0)
            {
                $(this).find(".secondary_menu").addClass("hide");
            }
        }
    });
    //$("#BackTrip").hide();//隐藏返程时间选择
    //绑定选项卡切换事件
    $(".tab-city a").on("click", function (e) {
        var content = $("[mark=" + $(this).attr("data-href") + "]");
        content.siblings().hide();
        content.show();
        $(this).parent().siblings().removeClass("active");
        $(this).parent().addClass("active");
    });
    //到达城市和出发城市对换
    $("#change").on("click", function () {
        var temp = $("#startCity").val();
        $("#startCity").val($("#endCity").val());
        $("#endCity").val(temp);
        var tempsegnum = $("#startCity").attr("segnum");
        $("#startCity").attr("segnum", $("#endCity").attr("segnum"));
        $("#endCity").attr("segnum", tempsegnum);
    })
    $("#change1").on("click", function () {
        var temp = $("#startCity1").val();
        $("#startCity1").val($("#endCity1").val());
        $("#endCity1").val(temp);
        var tempsegnum = $("#startCity1").attr("segnum");
        $("#startCity1").attr("segnum", $("#endCity1").attr("segnum"));
        $("#endCity1").attr("segnum", tempsegnum);
    });
    //单程切换清空返程时间
    $(".tab-radiobox input[type=radio]").on("change", function () {
        if ($(this).attr("id") == "srode") {
            $("#endTime").val("").attr("readonly", true);
        } else {
            $("#endTime").removeAttr("readonly");
        }
    });
    //单程往返切换
    $(".tab-radiobox label").on('click', function () {
        $(this).addClass("active");
        $(this).siblings("label").removeClass("active");
    });
    //特价机票tab切换
    $(".tabs ul li").on('click', function () {
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
        $("#" + $(this).attr("data-href") + "").addClass("active").siblings().removeClass("active");
    });

    var testDate;
    //航班动态查询方式切换
    $(".flight input[type=radio]").on("change", function () {
        if ($(this).attr("id") == "number") {
            $("#sub_flight").show().next().hide();
        } else {
            $("#sub_flight").hide().next().show();
        }
    })

}


/* =========================================================
 * bootstrap-modal.js v2.3.2
 * http://twbs.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {
    "use strict"; // jshint ;_;
    /* MODAL CLASS DEFINITION
     * ====================== */
    var Modal = function (element, options) {
        this.options = options
        this.$element = $(element)
            .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
        this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
    }
    Modal.prototype = {
        constructor: Modal
        , toggle: function () {
            return this[!this.isShown ? 'show' : 'hide']()
        }
        , show: function () {
            var that = this
                , e = $.Event('show')
            this.$element.trigger(e)
            if (this.isShown || e.isDefaultPrevented()) return
            this.isShown = true
            this.escape()
            this.backdrop(function () {
                var transition = $.support.transition && that.$element.hasClass('fade')
                if (!that.$element.parent().length) {
                    that.$element.appendTo(document.body) //don't move modals dom position
                }
                that.$element.show()
                if (transition) {
                    that.$element[0].offsetWidth // force reflow
                }
                that.$element
                    .addClass('in')
                    .attr('aria-hidden', false)
                that.enforceFocus()
                transition ?
                    that.$element.one($.support.transition.end, function () {
                        that.$element.focus().trigger('shown')
                    }) :
                    that.$element.focus().trigger('shown')
            })
        }

        , hide: function (e) {
            e && e.preventDefault()
            var that = this
            e = $.Event('hide')
            this.$element.trigger(e)
            if (!this.isShown || e.isDefaultPrevented()) return
            this.isShown = false
            this.escape()
            $(document).off('focusin.modal')
            this.$element
                .removeClass('in')
                .attr('aria-hidden', true)
            $.support.transition && this.$element.hasClass('fade') ?
                this.hideWithTransition() :
                this.hideModal()
        }
        , enforceFocus: function () {
            var that = this
            $(document).on('focusin.modal', function (e) {
                if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
                    that.$element.focus()
                }
            })
        }
        , escape: function () {
            var that = this
            if (this.isShown && this.options.keyboard) {
                this.$element.on('keyup.dismiss.modal', function (e) {
                    e.which == 27 && that.hide()
                })
            } else if (!this.isShown) {
                this.$element.off('keyup.dismiss.modal')
            }
        }
        , hideWithTransition: function () {
            var that = this
                , timeout = setTimeout(function () {
                    that.$element.off($.support.transition.end)
                    that.hideModal()
                }, 500)
            this.$element.one($.support.transition.end, function () {
                clearTimeout(timeout)
                that.hideModal()
            })
        }
        , hideModal: function () {
            var that = this
            this.$element.hide()
            this.backdrop(function () {
                that.removeBackdrop()
                that.$element.trigger('hidden')
            })
        }
        , removeBackdrop: function () {
            this.$backdrop && this.$backdrop.remove()
            this.$backdrop = null
        }
        , backdrop: function (callback) {
            var that = this
                , animate = this.$element.hasClass('fade') ? 'fade' : ''

            if (this.isShown && this.options.backdrop) {
                var doAnimate = $.support.transition && animate

                this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
                    .appendTo(document.body)

                this.$backdrop.click(
                    this.options.backdrop == 'static' ?
                        $.proxy(this.$element[0].focus, this.$element[0])
                        : $.proxy(this.hide, this)
                )
                if (doAnimate) this.$backdrop[0].offsetWidth // force reflow
                this.$backdrop.addClass('in')
                if (!callback) return
                doAnimate ?
                    this.$backdrop.one($.support.transition.end, callback) :
                    callback()
            } else if (!this.isShown && this.$backdrop) {
                this.$backdrop.removeClass('in')
                $.support.transition && this.$element.hasClass('fade') ?
                    this.$backdrop.one($.support.transition.end, callback) :
                    callback()
            } else if (callback) {
                callback()
            }
        }
    }
    /* MODAL PLUGIN DEFINITION
     * ======================= */
    var old = $.fn.modal
    $.fn.modal = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('modal')
                , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('modal', (data = new Modal(this, options)))
            if (typeof option == 'string') data[option]()
            else if (options.show) data.show()
        })
    }
    $.fn.modal.defaults = {
        backdrop: true
        , keyboard: true
        , show: true
    }
    $.fn.modal.Constructor = Modal
    /* MODAL NO CONFLICT
     * ================= */
    $.fn.modal.noConflict = function () {
        $.fn.modal = old
        return this
    }
    /* MODAL DATA-API
     * ============== */
    $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
        var $this = $(this)
            , href = $this.attr('href')
            , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
            , option = $target.data('modal') ? 'toggle' : $.extend({remote: !/#/.test(href) && href}, $target.data(), $this.data())
        e.preventDefault()
        $target
            .modal(option)
            .one('hide', function () {
                $this.focus()
            })
    })
}(window.jQuery);
