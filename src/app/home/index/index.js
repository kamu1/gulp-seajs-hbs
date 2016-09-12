define(['home/case/index'], function(require, exports, module) {
    //执行项目案例
    var caseIndex = require('home/case/index');
    caseIndex.init();
    //页面加载完成后再执行滑屏动作及图片懒加载
    window.onload = function() {
        require.async(["zepto", "swiper"], function($, Swiper) {
            //渲染左导航列表
            var nav_name = $(".swiper-H .nav-name").map(function() {
                return '<li id="' + $(this).attr("data-id") + '"><div>' + $(this).text() + '</div></li>'
            }).get().join("");
            // $(nav_name).insertAfter($(".J-sidebar-nav .J-my-info"));
            $(".J-sidebar-nav ul").html('<li class="J-my-info"><div>基本信息</div></li>'+ nav_name +'<li class="J-2weima to-up"><div>关于简历</div></li>')
            //滑屏定位
            var fun = {
                    coordinateValue: function() {
                        var winH = $(window).height();
                        var Nav = $(".page-content .nav-name");
                        var Jia = [],
                            Jia_name = [],
                            Jian = [],
                            Jian_name = [];
                        var Nav_name;
                        Nav.each(function(v) {
                                var Top = parseInt($(this).offset().top);
                                if (Top < 0) {
                                    Jian.push(Top);
                                    Jian_name.push(JSON.parse('{"top_' + Top + '":"' + $(this).attr("data-id") + '"}'));
                                } else {
                                    Jia.push(Top);
                                    Jia_name.push(JSON.parse('{"top_' + Top + '":"' + $(this).attr("data-id") + '"}'));
                                }
                            })
                            //先找最小正数，且位置在上半部分的
                        $.each(Jia_name, function(i) {
                                var currentArr = Jia_name[i]["top_" + Math.min.apply(null, Jia)];
                                if (currentArr && Math.min.apply(null, Jia) < winH * .6) {
                                    Nav_name = currentArr;
                                }
                            })
                            //最小正数不满足，则找最大负数
                        if (!Nav_name) {
                            $.each(Jian_name, function(i) {
                                var currentArr = Jian_name[i]["top_" + Math.max.apply(null, Jia)];
                                if (currentArr) {
                                    Nav_name = currentArr;
                                }
                            })
                        }
                        //若以上条件不满足，在下半部分未识别的区域，则找到其上一项
                        if (!Nav_name) {
                            Nav.each(function(v) {
                                if ($(this).offset().top <= 0) {
                                    Nav_name = $(this).attr("data-id");
                                }
                            })
                        }
                        if (!$(".sidebar-nav li.active2").length) {
                            //这里判断一下，防止屏幕翻转的时候被同时选择两个
                            $('#' + Nav_name).addClass("active").siblings().removeClass("active").closest("ul").attr("data-nav", Nav_name);
                        }
                        // swiper.getWrapperTranslate('y');
                    },
                    lazyImages: function() {
                        var lazyImgs = $("img.lazy-load");
                        lazyImgs.each(function() {
                            var This = $(this);
                            var data_src = This.attr("data-src");
                            if (This.offset().top < ($(window).height() + $(window).height() * .5)) {
                                This.attr("src", data_src)
                                This.removeAttr("data-src").removeClass("lazy-load");
                            }
                        })
                    }

                }
                //页面加载完后懒加载第一屏图片
            fun.lazyImages();
            var swiper1 = new Swiper($('.swiper-V'), {
                // scrollbar: '.swiper-scrollbar',
                // direction: 'vertical',
                slidesPerView: 'auto',
                mousewheelControl: false,
                freeMode: true,
                lazyLoading: true,
                lazyLoadingInPrevNext: true,
                lazyLoadingOnTransitionStart: false,
                onSetTransition: function(swiper, transiton) {
                    swiper.onResize();
                },
                onTouchStart: function(swiper, even) {
                    swiper.onResize();
                }
            });
            var swiper2 = new Swiper('.swiper-H', {
                direction: 'vertical',
                slidesPerView: 'auto',
                mousewheelControl: true,
                freeMode: true,
                lazyLoading: true,
                lazyLoadingInPrevNext: true,
                lazyLoadingOnTransitionStart: false,
                onProgress: function(swiper, progress) {
                    //调用运算滚动值
                    fun.coordinateValue();
                    //懒加载图片
                    fun.lazyImages();

                    //这里对翻到页底时，不管有几项在页面中显示，以最后一项为选中状态
                    if (Math.abs(swiper.getWrapperTranslate('y')) >= ($(".swiper-H .swiper-wrapper>*").height() - $(window).height())) {
                        var Nav_name = $(".page-content .nav-name").last().attr("data-id");
                        $('#' + Nav_name).addClass("active").siblings().removeClass("active").closest("ul").attr("data-nav", Nav_name);
                    }
                },
                onSetTransition: function(swiper, transiton) {
                    swiper2.onResize();
                    //懒加载图片
                    fun.lazyImages();
                },
                onTouchStart: function(swiper, even) {
                    swiper2.onResize();
                    //懒加载图片
                    fun.lazyImages();
                },
                onTouchEnd: function(swiper, even) {
                    swiper2.onResize();
                }
            });
            //调用运算滚动值
            fun.coordinateValue();
            $(".my-experience").css("margin-left", "8.1px"); //此行解决在安卓浏览器页面滚动失效的问题，具体原因还未知

            $("body").on('touchmove', function() {
                return false;
            });

            $(".swiper-H .swiper-wrapper").on('webkitTransitionEnd transitionend', function() {
                //解决长屏点击导航定位不匹配的问题
                fun.coordinateValue();
                //懒加载图片
                fun.lazyImages();
            });
            $(".page-sidebar").on('webkitTransitionEnd transitionend', function() {
                swiper2.onResize();
            })
            $(document).on("click", ".sidebar-nav li[id]", function() {
                var Obj = $('.page-content .' + $(this).attr("id"));
                $(".swiper-H .swiper-wrapper").css({ "transition-duration": "500ms" });
                swiper2.setWrapperTranslate(-Obj.position().top);
                $(this).addClass("active").siblings().removeClass("active active2").closest("ul").attr("data-nav", $(this).attr("id"));
                $("#personal-info").removeClass("active");
            });
            $(document).on("click", ".J-my-info", function() {
                $(this).addClass("active2").siblings().removeClass("active active2");
                $("#personal-info").addClass("active").find(".ma-pic").hide().siblings().show();
            });
            $(document).on("click", ".J-2weima", function() {
                $(this).addClass("active2").siblings().removeClass("active active2");
                $("#personal-info").addClass("active").find(".ma-pic").show().siblings().hide();
            });
            $(document).on("touchend click", ".personal-info", function() {
                $("#personal-info").removeClass("active");
                $(".sidebar-nav li").removeClass("active active2");
                $("#" + $(".J-my-info").closest("ul").attr("data-nav")).addClass("active"); //.trigger("click");
            });
        });
    }
})
