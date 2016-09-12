define("plugin/handlebars/handlebars1.3.0handlebars-helpers",["./condition-helpers","handlebars","./underscore-helpers","gallery/underscore/1.6.0/underscore","./moment-helpers","gallery/moment/2.6.0/moment","./json-helpers","gallery/json/1.0.3/json"],function(a){a("./condition-helpers"),a("./underscore-helpers"),a("./moment-helpers"),a("./json-helpers")}),define("alinw/handlebars-helpers/1.0.3/condition-helpers",["handlebars"],function(require,exports,module){var Handlebars=require("handlebars");Handlebars.registerHelper("expr_compare",function(a,b,c,d){var e,f;if(arguments.length<3)throw new Error("Handlerbars Helper 'compare' needs 2 parameters");if("undefined"==typeof d){var d=c;c=b,b="==="}if(e={"==":function(a,b){return a==b},"===":function(a,b){return a===b},"!=":function(a,b){return a!=b},"!==":function(a,b){return a!==b},"<":function(a,b){return b>a},">":function(a,b){return a>b},"<=":function(a,b){return b>=a},">=":function(a,b){return a>=b},"typeof":function(a,b){return typeof a==b}},!e[b])throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+b);return f=e[b](a,c),f?d.fn(this):d.inverse(this)}),Handlebars.registerHelper("expr_true",function(expression,options){return eval(expression)?options.fn(this):options.inverse(this)})}),define("alinw/handlebars-helpers/1.0.3/underscore-helpers",["gallery/underscore/1.6.0/underscore","handlebars"],function(require,exports,module){var _=require("gallery/underscore/1.6.0/underscore"),Handlebars=require("handlebars"),each=function(a,b){return _.reduce(a,function(c,d,e){return c+b.fn(d,{data:{index:e,first:0===e,last:e===a.length-1}})},"")},boolean=function(a){var b=arguments[arguments.length-1].fn,c=arguments[arguments.length-1].inverse;return _[a].apply(null,_.toArray(arguments).slice(1,arguments.length-1))?b(this):c(this)};Handlebars.registerHelper("_map",function(list,iterator,context,options){if("undefined"==typeof options){var options=context;context=null}_.isString(iterator)&&eval("iterator = "+iterator);var mapped=_.map(list,iterator,context);return each(mapped,options)}),Handlebars.registerHelper("_reduce",function(list,iterator,memo,context){if("undefined"==typeof options){var options=context;context=null}return _.isString(iterator)&&eval("iterator = "+iterator),_.reduce(list,iterator,memo,context)}),Handlebars.registerHelper("_reduceRight",function(list,iterator,memo,context,options){if("undefined"==typeof options){var options=context;context=null}return _.isString(iterator)&&eval("iterator = "+iterator),_.reduceRight(list,iterator,memo,context)}),Handlebars.registerHelper("_find",function(list,predicate,context,options){if("undefined"==typeof options){var options=context;context=null}_.isString(predicate)&&eval("predicate = "+predicate);var found=_.find(list,predicate,context);return _.isUndefined(found)?options.inverse(this):options.fn(found)}),Handlebars.registerHelper("_filter",function(list,predicate,context,options){if("undefined"==typeof options){var options=context;context=null}_.isString(predicate)&&eval("predicate = "+predicate);var filtered=_.filter(list,predicate,context);return each(filtered,options)}),Handlebars.registerHelper("_where",function(a,b,c){return each(_.where(a,b),c)}),Handlebars.registerHelper("_findWhere",function(a,b,c){var d=_.findWhere(a,b);return _.isUndefined(d)?c.inverse(this):c.fn(d)}),Handlebars.registerHelper("_reject",function(list,predicate,context,options){if("undefined"==typeof options){var options=context;context=null}_.isString(predicate)&&eval("predicate = "+predicate);var rejected=_.reject(list,predicate,context);return each(rejected,options)}),Handlebars.registerHelper("_every",function(list,predicate,context,options){return _.isString(predicate)&&eval("predicate = "+predicate),boolean.apply(this,_.union(["every"],_.toArray(arguments).slice(0,arguments.length)))}),Handlebars.registerHelper("_some",function(list,predicate,context,options){return _.isString(predicate)&&eval("predicate = "+predicate),boolean.apply(this,_.union(["some"],_.toArray(arguments).slice(0,arguments.length)))}),Handlebars.registerHelper("_contains",function(){return boolean.apply(this,_.union(["contains"],_.toArray(arguments).slice(0,arguments.length)))}),Handlebars.registerHelper("_invoke",function(a,b,c){var d=_.toArray(arguments).slice(2,arguments.length-1),e=_.invoke.apply(null,_.union([a,b],d));return each(e,c)}),Handlebars.registerHelper("_pluck",function(a,b,c){return each(_.pluck(a,b),c)}),Handlebars.registerHelper("_max",function(a,b,c,d){if("undefined"==typeof d){var d=c;c=null}return d.fn(_.max(a,b,c))}),Handlebars.registerHelper("_min",function(a,b,c,d){if("undefined"==typeof d){var d=c;c=null}return d.fn(_.min(a,b,c))}),Handlebars.registerHelper("_sortBy",function(a,b,c,d){if("undefined"==typeof d){var d=c;c=null}return each(_.sortBy(a,b,c),d)}),Handlebars.registerHelper("_first",function(a,b,c){if("undefined"==typeof c){var c=b;b=null}return each(_.first(a,b),c)}),Handlebars.registerHelper("_initial",function(a,b,c){if("undefined"==typeof c){var c=b;b=null}return each(_.initial(a,b),c)}),Handlebars.registerHelper("_last",function(a,b,c){if("undefined"==typeof c){var c=b;b=null}return each(_.last(a,b),c)}),Handlebars.registerHelper("_rest",function(a,b,c){if("undefined"==typeof c){var c=b;b=null}return each(_.rest(a,b),c)}),Handlebars.registerHelper("_compact",function(a,b){return each(_.compact(a),b)}),Handlebars.registerHelper("_flatten",function(a,b){return each(_.flatten(a),b)}),Handlebars.registerHelper("_without",function(){var a=arguments[0],b=arguments.slice(1,arguments.length-1),c=arguments[arguments.length-1];return each(_.without(a,b),c)}),Handlebars.registerHelper("_union",function(){var a=arguments.slice(0,arguments.length-1),b=arguments[arguments.length-1];return each(_.union(a),b)}),_.each(["isEqual","isEmpty","isElement","isArray","isObject","isArguments","isFunction","isString","isNumber","isFinite","isBoolean","isDate","isRegExp","isNaN","isNull","isUndefined"],function(a){_.isFunction(_[a])&&Handlebars.registerHelper("_"+a,function(b,c){return _[a](b)?c.fn(this):c.inverse(this)})})}),define("alinw/handlebars-helpers/1.0.3/moment-helpers",["gallery/moment/2.6.0/moment","handlebars"],function(a){var b=a("gallery/moment/2.6.0/moment"),c=a("handlebars");c.registerHelper("moment_format",function(a,c){return arguments.length<=2?b().format(a):b(c).format(a)})}),define("alinw/handlebars-helpers/1.0.3/json-helpers",["handlebars","gallery/json/1.0.3/json"],function(a){"use strict";var b=a("handlebars");a("gallery/json/1.0.3/json"),b.registerHelper("json_stringify",function(a){return JSON.stringify(a)})});
