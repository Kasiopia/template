"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var pug = require("gulp-pug");
var autoprefixer = require("autoprefixer");
var postcss = require("gulp-postcss");
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var concat = require("gulp-concat");
var uglify = require("gulp-uglifyjs");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var pump = require("pump");
var run = require("run-sequence");
var imagemin = require("gulp-imagemin");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var del = require("del");

//cоздаем переменную с масивом всех плагинов Postccss который мы будем использовать, пока один autoprefixer будет 
	let postplugins = [
		autoprefixer({
			browsers: ["last 3 versions"]})  // поддержка последних трех версий всех браузеров
		];

//пишем таск для работы со страницами
	gulp.task("pages", function() {
		return gulp.src("./source/pages/*.pug")
			.pipe(pug({pretty: true}))  //с переносом pretty: true
			.pipe(gulp.dest("./public"))
			.pipe(browserSync.reload({stream: true}));
	})

//пишем таск для работы со стилями
	gulp.task("styles", function() {
		gulp.src("./source/sass/*.scss") // говорим какой файл взять
			.pipe(plumber())   //не обрывается при ошибках
			.pipe(sass())  // запускаем плагин
			.pipe(postcss(postplugins))  // передаем переменную postplugins 
			.pipe(gulp.dest("./public/css/"))
			.pipe(minify()) // минифицируем
			.pipe(rename({
				suffix: ".min"   // переиминуем файл
				})
			) 
			.pipe(gulp.dest("./public/css/")) //задаем папку куда вставлять 
			.pipe(browserSync.reload({stream: true}));
	})

//таск сжатия фоток
	gulp.task("images", function() {
		return gulp.src("public/assets/root/img/**/*.{png,jpg,gif}")
		.pipe(imagemin([
			imagemin.optipng({optimizationlevel: 3}),
			imagemin.jpegtran({progressive: true})
			]))
		.pipe(gulp.dest("public/assets/root/img"));
	})

//таск объединения svg в sprite
	gulp.task("symbols", function() {
		return gulp.src("public/assets/root/img/svgsprite/*.svg")
		.pipe(svgmin())
		.pipe(svgstore({
			inlinesvg: true
		}))
		.pipe(rename("symbols.svg"))
		.pipe(gulp.dest("public/assets/root/img"));
	})

//таск очиски папки
	gulp.task("clean", function() {
		return del("public");
	})


//таск копирования нужных файлов в нужную папку
	gulp.task("copy", function() {
		return gulp.src([
			"source/assets/root/fonts/**/*.{woff,woff2,ttf}",
			"source/assets/root/img/**",
			"source/js/**"
			],	{
				base: "source"
			})
		.pipe(gulp.dest("public"));
	})

//таск для работы с библиотеками JS , берем файлы js  и объединяем их в один
	gulp.task("js-libs", function(){

		return gulp.src([
				"source/assets/libs/jquery/dist/jquery.min.js",
				"source/assets/libs/magnific-popup/dist/jquery.magnific-popup.min.js"
			])
		.pipe(concat("libs.min.js"))
		.pipe(uglify())
		.pipe(gulp.dest("public/js"))
		.pipe(browserSync.reload({stream: true}));
	})

//таск для работы с JS common
	gulp.task("compress", ["js-libs"], function (cb) {
		// the same options as described above
		var options = {
			preserveComments: "license"
		};

		pump([
				gulp.src("source/js/common.js"),
				uglify(),
				rename("common.min.js"),
				gulp.dest("public/js")				
			],
				cb
		)
		.pipe(browserSync.reload({stream: true}));
	})

//таск для запуска локального сервера и доступа к ней внутри локальной сети	
	gulp.task("browser-sync", function() {
		browserSync({
			server: {
				baseDir: "public"
			},
			notify: false,
			open: true,
			ui: false
		})
	})

//такс для слежения
	gulp.task("watch", ["browser-sync"], function() { 

		gulp.watch(["./source/sass/main.scss", "./source/**/*.scss"], ["styles"]);
		gulp.watch("./source/**/*.pug", ["pages"]);
		gulp.watch("./source/js/**/*.js", ["compress"]);
	})

	gulp.task("public", function(fn) {
		run(
			"clean",
			"pages",
			"styles",
			"compress",
			"copy",
			"images",
			"symbols",
			fn
		);
	});