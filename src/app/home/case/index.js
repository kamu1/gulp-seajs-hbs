define(["zepto"],function(require,exprots,module){
	var $ = require("zepto");
	exprots.init=function(){
		$(document).on("click",".J-link-btn span",function(){
			var This=$(this);
			if (This.attr("data-link")){
				window.open(This.attr("data-link"),"_blank");
			}
		});
	}
})