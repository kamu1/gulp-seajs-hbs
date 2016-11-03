var gulp = require('gulp'),
    yargs = require('yargs').argv, //获取运行gulp命令时附加的命令行参数
    clean = require('gulp-clean'), //清理文件或文件夹
    replace = require('gulp-replace-task'), //对文件中的字符串进行替换
    transport = require("gulp-seajs-transport"), //对seajs的模块进行预处理：添加模块标识
    sconcat = require("gulp-seajs-concat"), //seajs模块合并
    concat = require("gulp-concat"), //文件合并
    uglify = require('gulp-uglify'), //js压缩混淆
    merge = require('merge-stream'), //合并多个流

    useref = require('gulp-useref'),    //合并标签引用文件
    rename = require('gulp-rename'),    //重命名
    gulpif = require('gulp-if'),        //对文件进行判断
    less = require('gulp-less'),
    minifyCss = require('gulp-minify-css'),
    htmlminify = require("gulp-html-minify"),
    fileinclude = require('gulp-file-include'), //引入HTML模板，可以模板中转json格式数据
    gulpImport = require("gulp-html-import"),

    fs = require('fs'),
    path = require('path'),
    data = require('gulp-data'),
    handlebars = require('gulp-compile-handlebars'),

    imagemin = require('gulp-imagemin'), //图片压缩
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),

    browserSync = require('browser-sync').create(), //启动静态服务器
    reload = browserSync.reload

    src = 'src',
    dist = yargs.d && yargs.d !== true ? yargs.d : 'dist',
    CONTEXT_PATH = '/' + dist,
    replace_patterns = [{ match: 'CONTEXT_PATH', replacement: yargs.b ? (yargs.b === true ? CONTEXT_PATH : ('/' + yargs.b + CONTEXT_PATH)) : CONTEXT_PATH }];
//如果设置了主目录，则设置dist到主目录下
if (yargs.b && yargs.b !== true) {
    dist = yargs.b + CONTEXT_PATH;
}

var fun = {
    dir_path: function(dirname, defaultDir) {
        var dirName = dirname;
        if (dirname == ".") {
            dirname = defaultDir;
        } else if (dirname.indexOf(".") < 0 && dirname != "") {
            dirname = filePath + '\\' + dirname;
        } else if (dirName.indexOf('..\\..\\..') >= 0) {
            dirname = dirName.replace('..\\..\\..', '..\\..');
        } else if (dirName.indexOf('..\\..') >= 0) {
            dirname = dirName.replace('..\\..', '..');
        } else if (dirName.indexOf('..') >= 0) {
            dirname = dirName.replace('..', '.\\');
        }
        return dirname;
    },
    hbs_options : {
        ignorePartials: true,
        partials: {
            footer: '<footer>the end</footer>'
        },
        batch: [src + '/app'],
        helpers: {
            capitals: function(str) {
                return str.toUpperCase();
            }
        }
    },
    file_path:{
        "imgsPath":CONTEXT_PATH + "/static/images"
    }
}

// 静态服务器 + 监听 scss/html 文件
gulp.task('serve', yargs.d ? ['css', 'js', 'html', 'index','images','public'] : (yargs.b ? ['default'] : []), function() {

    browserSync.init({
        // server: dist,
        server: {
            baseDir: "./",
            directory: true,
            notify: false,
            index: "index.html"
        }
    });

    gulp.watch(src + '/app/**/*.less', ['less']);
    gulp.watch(src + '/app/**/*.css', ['css']);
    gulp.watch(src + '/app/**/*.js', ['js']);
    gulp.watch([src + '/app/**/*.handlebars'], ['hbs','handlebars']);
    gulp.watch([src + '/app/**/*.html',src + '/app/home/work/index.hbs'], ['html']) //.on('change', reload);
});

// less编译后的css将注入到浏览器里实现更新
gulp.task('less', function() {
    return merge(gulp.src([src + '/app/**/*.less'])
        .pipe(less())
        .pipe(minifyCss())
        .pipe(gulp.dest(dist + "/app"))
        .pipe(reload({ stream: true }))
    );
});
//压缩CSS
gulp.task('css', function() {
    gulp.src([src + '/app/**/*.css', src + '/app/**/*.less']) //less优先放到数组后面
        .pipe(gulpif("*.less", less()))
        .pipe(gulpif("*.css", minifyCss()))
        .pipe(minifyCss())
        .pipe(gulp.dest(dist + "/app"))
});

//清理构建目录
gulp.task('cls', function() {
    if (dist.toLowerCase().replace(/[\/\\]/g, "") == "src") {
        return false
    }
    gulp.src([
            //包含-b=的主目录及文件
            (yargs.b && yargs.b !== true) ? yargs.b : dist,
            dist.replace(/[\/\\]/g, "") + '.html',
            //如果-b和-d参数值一样，下面再匹配删除一下主目录.html
            './' + ((yargs.b && yargs.b !== true) ? yargs.b.replace(/[\/\\]/g, "") : dist.replace(/[\/\\]/g, "")) + '.html',
            src + '/temp_app'
        ], { read: false })
        .pipe(clean())
});
//清理临时的app目录
gulp.task('del', function() {
    gulp.src([
            src + '/temp_app',
            src + '/app/**/*.hbs'
        ], { read: false })
        .pipe(clean())
});
//生成导出可调试的JS
gulp.task('js', function() {
    gulp.src([src + '/app/**/*.js'])
        .pipe(replace({
            patterns: replace_patterns
        }))
        .pipe(gulp.dest(dist + "/app"))

});
//导出public目录
gulp.task('public', function() {
    gulp.src([src + '/public/**/*.*'])
        .pipe(replace({
            patterns: replace_patterns
        }))
        .pipe(gulp.dest(dist + "/public"))

});
//seajs合并模式
gulp.task('seajs', function() {
    return merge(
        gulp.src(src + '/app/**/*.js', { base: src + '/app' })
        .pipe(transport())
        .pipe(sconcat({
            base: src + '/app'
        }))
        .pipe(uglify({
            mangle: {
                except: ['require', 'exports', 'module'] //这几个变量不能压缩混淆，否则会引发seajs的一些意外问题
            }
        }))
        .pipe(replace({
            patterns: replace_patterns
        }))
        .pipe(gulp.dest(dist + '/app')),

        gulp.src([src + '/public/**/*.*'], { base: src + "/public" })
        .pipe(replace({
            patterns: replace_patterns
        }))
        .pipe(gulp.dest(dist + '/public'))
        .pipe(reload({ stream: true }))
    );
});

//压缩生成HTML
gulp.task('html', function() {
    return merge(
        gulp.src([src + '/app/**/*.html'])  //,src + '/app/**/*.handlebars'
            .pipe(data(function(file) {
                try {
                    //识别.html和.handlebars文件
                    var baseName=path.basename(file.path, ".html")==path.basename(file.path)?path.basename(file.path, ".handlebars"):path.basename(file.path, ".html");
                    var filePath = path.join(path.dirname(file.path), baseName + ".json");
                    return JSON.parse(fs.readFileSync(filePath));
                } catch (err) {
                    console.log("> " + filePath)
                    return {};
                }
            }))
            .pipe(handlebars(typeof(data)=="object" ? Object.assign(data,{"imgsPath":dist}):fun.file_path, fun.hbs_options)) //'src/app/admin/index.json'
            //引入JSON的HTML模板
            // .pipe(fileinclude({
            //   prefix: '@@',
            //   basepath: 'src/app/common/'//'@file'
            // }))
            .pipe(htmlminify())
            .pipe(replace({
                patterns: replace_patterns
            }))
            .pipe(gulp.dest(dist + "/app"))
            .pipe(reload({ stream: true }))
    );
});
//生成临时引导页
gulp.task('index', ['index.html'], function() {
    gulp.src([src + '/*.html'])
        .pipe(replace({
            patterns: replace_patterns
        }))
        .pipe(rename(dist.replace(/[\/\\]/g, "") + ".html"))
        .pipe(gulp.dest("./"))
});
gulp.task('index.html', function() {
    gulp.src([src + '/*.html'])
        .pipe(replace({
            patterns: replace_patterns
        }))
        .pipe(gulp.dest(dist + "/"))
});
//生成.hbs
gulp.task('hbs', function() {
    gulp.src([src + '/app/**/*.handlebars'])
        .pipe(data(function(file) {
            try {
                //识别.html和.hbs文件
                var baseName=path.basename(file.path, ".html")==path.basename(file.path)?path.basename(file.path, ".handlebars"):path.basename(file.path, ".html");
                var filePath = path.join(path.dirname(file.path), baseName + ".json");
                return JSON.parse(fs.readFileSync(filePath));
            } catch (err) {
                console.log("> " + filePath)
                return {};
            }
        }))
        .pipe(handlebars(typeof(data)=="object" ? Object.assign(data,{"imgsPath":dist}):fun.file_path, fun.hbs_options)) //'src/app/admin/index.json'
        .pipe(replace({
            patterns: replace_patterns
        }))
        .pipe(rename(function(path){
            path.extname = ".hbs";
        }))
        .pipe(gulp.dest(src + "/app"))
        // .pipe(reload({ stream: true }))
});
//导出.handbars
gulp.task('handlebars', function() {
    gulp.src([src + '/app/**/*.handlebars'])
        .pipe(replace({
            patterns: replace_patterns
        }))
        .pipe(gulp.dest(dist + "/app"))
        // .pipe(reload({ stream: true }))
});

//生成临时HTML
gulp.task('temphtml',['hbs',"seajs",'images',"index"], function() { //,'css' 打包处理，独立CSS任务可以不需要
    gulp.src([src + '/app/**/*.html',src + '/app/**/*.handlebars'])
        .pipe(data(function(file) {
            try {
                //识别.html和.handlebars文件
                var baseName=path.basename(file.path, ".html")==path.basename(file.path)?path.basename(file.path, ".handlebars"):path.basename(file.path, ".html");
                var filePath = path.join(path.dirname(file.path), baseName + ".json");
                return JSON.parse(fs.readFileSync(filePath));
            } catch (err) {
                console.log("> " + filePath)
                return {};
            }
        }))
        .pipe(handlebars(typeof(data)=="object" ? Object.assign(data,{"imgsPath":dist}):fun.file_path, fun.hbs_options))
        //引入JSON的HTML模板
        // .pipe(fileinclude({
        //   prefix: '@@',
        //   basepath: 'src/app/common/'//'@file'
        // }))
        // .pipe(htmlminify())
        .pipe(replace({
            patterns: replace_patterns
        }))
        .pipe(gulp.dest(src + "/temp_app"))
});
//同步JS和CSS文件到临时目录
gulp.task('tofiles', function() {
    gulp.src([src + '/app/**/*.css', src + '/app/**/*.js',, src + '/app/**/*.less'])
        .pipe(gulpif("*.less", less()))
        .pipe(gulp.dest(src + "/temp_app"))
});

//生成临时目录下的文件
gulp.task('todist', function() {
    setTimeout(function(){
        var appDirname=["home","admin"];
        fs.readdir(src + '/app/'+appDirname[0], function(err, files) {
            if (err) {
                throw err;
            }
            for(var i=0;i<files.length;i++){
                if (files[i].indexOf(".")<0){
                    gulp.src([src + '/temp_app/'+appDirname[0]+'/'+files[i]+'/*.html'])
                        .pipe(useref())
                        .pipe(gulpif('*.js', uglify({
                            mangle: {
                                except: ['seajs','require', 'exports', 'module'] //这几个变量不能压缩混淆，否则会引发seajs的一些意外问题
                            }
                        })))
                        .pipe(gulpif('*.css', minifyCss()))
                        .pipe(htmlminify())
                        .pipe(replace({
                            patterns: replace_patterns
                        }))
                        .pipe(gulp.dest(dist + '/app/'+appDirname[0]+'/'+files[i]))
                }
            }
        });
        fs.readdir(src + '/app/'+appDirname[1], function(err, files) {
            if (err) {
                throw err;
            }
            for(var i=0;i<files.length;i++){
                if (files[i].indexOf(".")<0){
                    gulp.src([src + '/temp_app/'+appDirname[1]+'/'+files[i]+'/*.html'])
                        .pipe(useref())
                        .pipe(gulpif('*.js', uglify({
                            mangle: {
                                except: ['seajs','require', 'exports', 'module'] //这几个变量不能压缩混淆，否则会引发seajs的一些意外问题
                            }
                        })))
                        .pipe(gulpif('*.css', minifyCss()))
                        .pipe(htmlminify())
                        .pipe(replace({
                            patterns: replace_patterns
                        }))
                        .pipe(gulp.dest(dist + '/app/'+appDirname[1]+'/'+files[i]))
                }
            }
        });
    },2000);

});

//图片压缩并导出
gulp.task('images', function() {
    gulp.src(src + '/static/**/*.{png,jpg,gif,ico}')
        .pipe(cache(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
            svgoPlugins: [{ removeViewBox: false }], //不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        })))
        .pipe(gulp.dest(dist + '/static'))
        .pipe(reload({ stream: true })),
        //非图片源文件也同步复制过去
        gulp.src(src + '/static/**/*.!({png,jpg,gif,ico})')
        .pipe(gulp.dest(dist + '/static'))

});

//默认执行link和script标签进行HTML的合并
gulp.task('default', ["temphtml", "todist", "tofiles","public",'handlebars'], function() {
    console.log("完成后请执行：gulp.del  清除临时目录");
});

//可调试任务
gulp.task("dev", ['css', 'js', 'html', 'images',"public"], function() {
    //运行调试模式时导出一下公用库
});
