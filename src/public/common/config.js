// var config = {
// 	"main": '/' + (window.document.location.pathname+"/").split("/")[1]
// };
seajs.config({
	base: '@@CONTEXT_PATH',
	// 设置路径，方便跨目录调用
	paths: {
		"public": "public",			//资源目录
		'plugin': "public/plugin",	//插件目录
		"common": "public/common",	//公共程序目录
		"home": "app/home",			//前端资源目录
		"admin": "app/admin",		//后端资源目录
		"json": "app/json",			//json数据目录
		"tpl": "app/template"		//公共模板目录
	},

	// 设置别名，方便调用
	alias: {
		'seajs-style': 'plugin/seajs/seajs-style',
		'$': 'plugin/jquery/jquery-1.11.1',
		'jQuery': 'plugin/jquery/jquery-1.11.1',
		'zepto': 'plugin/zepto/zepto-1.1.3',
		'handlebars': 'plugin/handlebars/handlebars1.3.0',
		'swiper': 'plugin/swiper/swiper.min',
		'swiper.jq': 'plugin/swiper/swiper.jquery.min',
		'swiper.css': 'plugin/swiper/swiper.min.css',
		'helper': 'common/helper',
		'photoswipe.css': 'plugin/photoswipe/photoswipe.css',
		'photoswipe-skin.css': 'plugin/photoswipe/default-skin.css',
		'photoswipe': 'plugin/photoswipe/photoswipe.min',
		'photoswipe-ui': 'plugin/photoswipe/photoswipe-ui-default.min'
	},
	preload: []

});
