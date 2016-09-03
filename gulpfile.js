var fs = require('fs'),
	cheerio = require('cheerio'),
	gulp = require('gulp'),
	concat = require('gulp-concat'),
	htmlmin = require('gulp-htmlmin'),
	rimraf = require('gulp-rimraf'),
	rename = require('gulp-rename'),
	replace = require('gulp-replace'),
	webserver = require('gulp-webserver'),
	uglify = require('gulp-uglify'),
	unzip = require('gulp-unzip'),
	zip = require('gulp-zip'),
	exclude_min = [], //eg ['js/lib/jsfxr.min.js']
	config = { js: [] };


gulp.task('build', ['initbuild', 'jsmin', 'addjs', 'zip', 'clean', 'report']);

//do we need this?
gulp.task('serve', function() {
	gulp.src('.')
		.pipe(webserver({
			livereload: false,
			host: '0.0.0.0',
			port: 8013,
			open: true
		}));
});


gulp.task('initbuild', function() {

	var stream, html, $, src, js = [];

	// delete prev files
	stream = gulp.src('game.zip')
		.pipe(rimraf());

	stream = gulp.src('./tmp/g.js')
		.pipe(rimraf());

	stream = gulp.src('./tmp/index.html')
		.pipe(rimraf());

	// get a list of all js scripts from our dev file
	html = fs.readFileSync('index.html', 'utf-8', function(e, data) {
		return data;
	});

	$ = cheerio.load(html);

	$('script').each(function() {
		src = $(this).attr('src');
		if (exclude_min.indexOf(src) === -1) { //exclude already minified files
			js.push(src);
		}
	});

	config.js = js;

});

gulp.task('jsmin', ['initbuild'], function() {

	var stream = gulp.src(config.js)
		.pipe(concat('g.js')) //all js files are concatenated into g.js
		.pipe(uglify())
		.pipe(gulp.dest('./tmp'));

	return stream;

});

gulp.task('addjs', ['jsmin'], function() {
	var i, tmp, extra_js = '';

	var js = fs.readFileSync('./tmp/g.js', 'utf-8', function(e, data) {
		return data;
	});

	//include already minified files
	for (i = 0; i < exclude_min.length; i += 1) {
		console.log(exclude_min[i])
		extra_js += fs.readFileSync(exclude_min[i], 'utf-8', function(e, data) {
			return data;
		});
	}
	console.log(extra_js.length, 'OK', exclude_min);

	var stream = gulp.src('index.html')
		.pipe(replace(/<.*?script.*?>.*?<\/.*?script.*?>/igm, ''))
		.pipe(replace(/<\/body>/igm, '<script>'+extra_js+' '+js+'</script></body>'))
		.pipe(htmlmin({collapseWhitespace: true}))
		//.pipe(rename('index.html'))
		.pipe(gulp.dest('./tmp'));

	return stream;

});

gulp.task('zip', ['addjs'], function() {
	var stream = gulp.src('./tmp/index.html')
		.pipe(zip('game.zip'))
		.pipe(gulp.dest('.'));

	return stream;
});

//do we need this?
/*gulp.task('unzip', ['zip'], function() {
	var stream = gulp.src('game.zip')
		.pipe(unzip())
		.pipe(gulp.dest('.'));

	return stream;
});*/


gulp.task('clean', ['zip'], function() {
	var stream = gulp.src('./tmp')
		.pipe(rimraf());


	return stream;
});

gulp.task('report', ['clean'], function() {
	var stat = fs.statSync('game.zip'),
		limit = 1024 * 13,
		size = stat.size,
		remaining = limit - size,
		percentage = (remaining / limit) * 100;

	percentage = Math.round(percentage * 100) / 100

	console.log('\n\n-------------');
	console.log('BYTES USED: ' + stat.size);
	console.log('BYTES REMAINING: ' + remaining);
	console.log(percentage +'%');
	console.log('-------------\n\n');
});
