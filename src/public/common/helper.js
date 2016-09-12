define(function(require, exports, module) {
	//通用辅助方法
	var $ = require("zepto");
	//初始化滑屏模块
	exports.loading=function(obj,text){
		if (obj=="remove"){
			$(".loading-wait").remove();
			return false;
		}
		if (typeof(obj)=="string"){text=obj;}
		if (!$(".loading-wait").length){
			$("body").append('<div class="loading-wait vmc" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:999;background:rgba(0,0,0,.3);"><div style="font-size:12px;background:rgba(255,255,255,.9);border-radius:3px;padding:3px 5px;color:#444;box-shadow: 1px 1px 10px 0px #333;"><span class="loading" style="display:inline-block;width:16px;height:16px;vertical-align: middle;"></span>&nbsp;'+ text +'</div></div>')
		}
	};
	exports.registerHelper=function(){
		//自定义Handlerbars扩展
		//自定义加强判断
		var Handlebars = require("handlebars");
		Handlebars.registerHelper('IF', function(left, operator, right, options) {
	         if (arguments.length < 3) {
	           throw new Error('Handlerbars Helper "IF" 至少需要2个参数');
	         }
	         var operators = {
	           '==':     function(l, r) {return l == r; },
	           '===':    function(l, r) {return l === r; },
	           '!=':     function(l, r) {return l != r; },
	           '!==':    function(l, r) {return l !== r; },
	           '<':      function(l, r) {return l < r; },
	           '>':      function(l, r) {return l > r; },
	           '<=':     function(l, r) {return l <= r; },
	           '>=':     function(l, r) {return l >= r; },
	           'typeof': function(l, r) {return typeof l == r; }
	         };
	         if (!operators[operator]) {
	           throw new Error('Handlerbars Helper "IF" '+ operator +' 运算符不存在');
	         }
	         var result = operators[operator](left, right);
	         if (result) {
	           return options.fn(this);
	         } else {
	           return options.inverse(this);
	         }
	     });
		//判断是否是数组
		Handlebars.registerHelper('if_array', function(value, options) {
		  if(value instanceof Array) {
		    return options.fn(this);
		  } else {
		    return options.inverse(this);
		  }
		});
		//判断是否是字符串
		Handlebars.registerHelper('if_string', function(value, options) {
		  if(typeof(value)=="string") {
		    return options.fn(this);
		  } else {
		    return options.inverse(this);
		  }
		});

	}
	exports.swiper=function(obj, direction, config){
		if (!config && typeof(direction) == 'object'){config=direction};	//如果config为空，第二个参数是对像则赋给config
		require("swiper.css");
		require("swiper");
		//渲染已加载的子滑屏模块
		obj=exports.$(obj);
		if (obj && obj.length && obj.hasClass("swiper-container")){
			//"#"+obj.attr("id")
			var swiperV = new Swiper(obj, typeof(config)=="object" ? config: {
				pagination: '.swiper-pagination',	//导航对象
				paginationClickable: true,	//导航事件
				direction: direction=='vertical'?'vertical':"horizontal",	//方向
				spaceBetween: 0,	//每屏间隔
				mousewheelControl: direction=='vertical'?true : false	//鼠标滚轮
			});
			//标识滑屏方向
			swiperV.container.addClass(direction=='vertical'?'vertical':"horizontal");
		};
	};
	//加载JS
	exports.loadJs=function(obj){
		if (obj){
			require.async(obj);
		}
	};
	//加载样式文件
	exports.loadCss=function(tpl,obj){
		if (tpl && obj){
			if (obj instanceof Array){
				tpl = tpl.concat(obj);
			}else if(typeof(obj) == "string"){
				tpl.push(obj);
			}
		}
		return tpl
	};
	//懒加载图片
	exports.lazyLoad=function(obj){
		obj.find("[data-src]").each(function(){
			var This=$(this);
			if (This.get(0).tagName.toLocaleLowerCase()=="img"){
				This.attr("src",This.attr("data-src")).removeAttr("data-src");
			}else{
				//懒加载背景图片
				This.css("background-image",'url('+This.attr("data-src")+')').removeAttr("data-src");
			}
		});
	};
	//滑屏进度条
	exports.progress=function(obj,Index,countObj){
		obj=exports.$(obj);
		obj=obj.eq(0);
		var Length=obj.children().children(".swiper-slide").length;
		//优选以指定的记数对象长度
		if (exports.$(countObj) && exports.$(countObj).length){
			Length = exports.$(countObj).length;
		}
		//若没有进度条，先渲染
		if (!obj.find(".swiper-progress").length){
			obj.append('<div class="swiper-progress"><div style="width:'+ (100/Length) +'%"></div></div>');
		}
		//根据索引值来改变进度条
		if (typeof(Index) == "number" && Index>=0){
			if (Index<1){
				obj.find(".swiper-progress").css({opacity:0});
			}else{
				obj.find(".swiper-progress").css({opacity:0.9});
			}
			obj.find(".swiper-progress>*").width(100/Length*(Index+1)+"%");
		}
	};
	//将对象字符串封装成jquery或zepto对象
	exports.$=function(obj){
		if (typeof(obj) == "string"){
			return $(obj);
		}
		return obj;
	};

});