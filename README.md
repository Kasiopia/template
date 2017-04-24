-PUG(jade) complite 
	
		for new create blocks and auto create files with *.pug, *.html, *.scss:
		node block name		
			
-SASS complite 
-import with Bowerrc libs (json, popup and etc) 

		 for this need add new file: .bowerrc
		 and save this text:  {
			"directory": "source/assets/libs"
		}

-Add tasks: imagemin and svgsprite, minijs,mincs and etc

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
	
-Add task cache and clear cache for comfort build