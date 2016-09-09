/**
 * @author
 */
(function ($) {
    $.fn.Slide = function (options) {
        var opts = $.extend({}, $.fn.Slide.deflunt, options);
        var index = 1;
        var targetLi = $("." + opts.claNav + " li", $(this));//
        var clickNext = $("." + opts.claNav + " .next", $(this));//
        var clickPrev = $("." + opts.claNav + " .prev", $(this));//
        var ContentBox = $("." + opts.claCon, $(this));//
        var ContentBoxNum = ContentBox.children().size();//
        var slideH = ContentBox.children().first().height();//
        var slideW = ContentBox.children().first().width();//
        var autoPlay;
        var slideWH;
        var selIndex = 0;
        var currLeft = 0;
        if (opts.effect == "scroolY" || opts.effect == "scroolTxt") {
            slideWH = slideH;
        } else if (opts.effect == "scroolX" || opts.effect == "scroolLoop") {
            ContentBox.css("width", ContentBoxNum * slideW);
            slideWH = slideW;
        } else if (opts.effect == "fade") {
            ContentBox.children().first().css("z-index", "1");
        }

        if (opts.defIndex > 0) {
            if (opts.defIndex % opts.steps == 0) {
                index = opts.defIndex / opts.steps;
            } else {
                index = parseInt(opts.defIndex / opts.steps) + 1;
            }
            if (index < 1) {
                index = 1;
            }

            if (index > 1) {
                currLeft = -(index - 1) * opts.steps * slideW + opts.scrollFix * slideW;
                ContentBox.animate({"left": currLeft}, opts.speed);
            } else if (index == 1) {
                if (opts.scrollFix < 0) {
                    currLeft = opts.scrollFix * slideW;
                    ContentBox.animate({"left": currLeft}, opts.speed);
                }
            }

            selIndex = index;
        }

        return this.each(function () {
            var $this = $(this);
            //
            var doPlay = function () {
                $.fn.Slide.effect[opts.effect](ContentBox, targetLi, index, slideWH, opts);
                index++;
                if (index * opts.steps >= ContentBoxNum) {
                    index = 0;
                }
            };
            clickNext.click(function (event) {
                if (opts.loop == false) {
                    if (index * opts.steps * slideW > ContentBox.width() - ContentBox.parent().width()) {
                        currLeft = -(ContentBox.width() - ContentBox.parent().width());
                        ContentBox.animate({"left": currLeft}, opts.speed);
                        return;
                    }

                    if (selIndex == index && index > 1) {
                        ContentBox.animate({"left": (opts.scrollFix * slideW) + currLeft}, opts.speed);
                    }

                    currLeft = -index * opts.steps * slideW;
                    ContentBox.animate({"left": currLeft}, opts.speed);
                    index++;

                    if (selIndex == index) {
                        if (index > 1) {
                            currLeft = -(index - 1) * opts.steps * slideW + opts.scrollFix * slideW;
                            ContentBox.animate({"left": currLeft}, opts.speed);
                        } else if (index == 1) {
                            if (opts.scrollFix < 0) {
                                currLeft = opts.scrollFix * slideW;
                                ContentBox.animate({"left": currLeft}, opts.speed);
                            }
                        }
                    }
                    return;
                }
                $.fn.Slide.effectLoop.scroolLeft(ContentBox, targetLi, index, slideWH, opts, function () {
                    for (var i = 0; i < opts.steps; i++) {
                        ContentBox.find("li:first", $this).appendTo(ContentBox);
                    }
                    ContentBox.css({"left": "0"});
                });
                event.preventDefault();
            });
            clickPrev.click(function (event) {
                if (opts.loop == false) {
                    if (index == 1) {
                        currLeft = 0;
                        ContentBox.animate({"left": currLeft}, opts.speed);
                        return;
                    }

                    if (selIndex == index && index > 1) {
                        ContentBox.animate({"left": (-opts.scrollFix * slideW) + currLeft}, opts.speed);
                    }

                    currLeft = -(index - 2) * opts.steps * slideW;
                    ContentBox.animate({"left": currLeft}, opts.speed);
                    index--;
                    if (selIndex == index) {
                        if (index > 1) {
                            currLeft = -(index - 1) * opts.steps * slideW + opts.scrollFix * slideW;
                            ContentBox.animate({"left": currLeft}, opts.speed);
                        } else if (index == 1) {
                            if (opts.scrollFix < 0) {
                                currLeft = opts.scrollFix * slideW;
                                ContentBox.animate({"left": currLeft}, opts.speed);
                            }
                        }
                    }
                    return;
                }
                for (var i = 0; i < opts.steps; i++) {
                    ContentBox.find("li:last").prependTo(ContentBox);
                }
                ContentBox.css({"left": -index * opts.steps * slideW});
                $.fn.Slide.effectLoop.scroolRight(ContentBox, targetLi, index, slideWH, opts);
                event.preventDefault();
            });
            //
            if (opts.autoPlay) {
                autoPlay = setInterval(doPlay, opts.timer);
                ContentBox.hover(function () {
                    if (autoPlay) {
                        clearInterval(autoPlay);
                    }
                }, function () {
                    if (autoPlay) {
                        clearInterval(autoPlay);
                    }
                    autoPlay = setInterval(doPlay, opts.timer);
                });
            }

            //
            targetLi.hover(function () {
                if (autoPlay) {
                    clearInterval(autoPlay);
                }
                index = targetLi.index(this);
                window.setTimeout(function () {
                    $.fn.Slide.effect[opts.effect](ContentBox, targetLi, index, slideWH, opts);
                }, 200);

            }, function () {
                if (autoPlay) {
                    clearInterval(autoPlay);
                }
                autoPlay = setInterval(doPlay, opts.timer);
            });
        });
    };
    $.fn.Slide.deflunt = {
        effect: "scroolY",
        autoPlay: true,
        speed: "normal",
        timer: 1000,
        defIndex: 0,
        claNav: "JQ-slide-nav",
        claCon: "JQ-slide-content",
        loop: true,
        steps: 1,
        scrollFix: 0
    };
    $.fn.Slide.effectLoop = {
        scroolLeft: function (contentObj, navObj, i, slideW, opts, callback) {
            contentObj.animate({"left": -i * opts.steps * slideW}, opts.speed, callback);
            if (navObj) {
                navObj.eq(i).addClass("on").siblings().removeClass("on");
            }
        },

        scroolRight: function (contentObj, navObj, i, slideW, opts, callback) {
            contentObj.stop().animate({"left": 0}, opts.speed, callback);

        }
    };
    $.fn.Slide.effect = {
        fade: function (contentObj, navObj, i, slideW, opts) {
            contentObj.children().eq(i).stop().animate({opacity: 1}, opts.speed).css({"z-index": "1"}).siblings().animate({opacity: 0}, opts.speed).css({"z-index": "0"});
            navObj.eq(i).addClass("on").siblings().removeClass("on");
        },
        scroolTxt: function (contentObj, undefined, i, slideH, opts) {
            //alert(i*opts.steps*slideH);
            contentObj.animate({"margin-top": -opts.steps * slideH}, opts.speed, function () {
                for (var j = 0; j < opts.steps; j++) {
                    contentObj.find("li:first").appendTo(contentObj);
                }
                contentObj.css({"margin-top": "0"});
            });
        },
        scroolX: function (contentObj, navObj, i, slideW, opts, callback) {
            contentObj.stop().animate({"left": -i * opts.steps * slideW}, opts.speed, callback);
            if (navObj) {
                navObj.eq(i).addClass("on").siblings().removeClass("on");
            }
        },
        scroolY: function (contentObj, navObj, i, slideH, opts) {
            contentObj.stop().animate({"top": -i * opts.steps * slideH}, opts.speed);
            if (navObj) {
                navObj.eq(i).addClass("on").siblings().removeClass("on");
            }
        }
    };
})(jQuery);
