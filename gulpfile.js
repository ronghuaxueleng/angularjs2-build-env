const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint')
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const tsconfig = require('tsconfig-glob');
const htmlreplace = require('gulp-html-replace');
const distPath = 'dist';

const libs = {
  "angular2Polyfills": {
    "source": "node_modules/angular2/bundles/angular2-polyfills.js",
    "dist": "libs/angular2-polyfills.js"
  },
  "system": {
    "source": "node_modules/systemjs/dist/system.src.js",
    "dist": "libs/system.src.js"
  },
  "rx": {
    "source": "node_modules/rxjs/bundles/Rx.js",
    "dist": "libs/Rx.js"
  },
  "angular2": {
    "source": "node_modules/angular2/bundles/angular2.dev.js",
    "dist": "libs/angular2.dev.js"
  }
};

const dist = Object.values(libs).map(function(item){
  return item.dist;
});


// 清理编译后目录
gulp.task('clean', function () {
  return del(distPath+'/**/*');
});

// 复制源码到编译目录
gulp.task('copy:assets', ['clean'], function() {
  return gulp.src(['app/**/*', 'styles.css', '!app/**/*.ts'], { base : './' })
    .pipe(gulp.dest(distPath))
});

//替换html页面上引用库的路径
gulp.task('copy:htmlreplace', function(){
  var dist = {};
  Object.keys(libs).forEach(function(key, item){
    dist[key] = libs[key]['dist'];
  });
  gulp.src('index.html')
    .pipe(htmlreplace(dist))
    .pipe(gulp.dest(distPath+'/'));
});

// 复制库依赖库
gulp.task('copy:libs', ['clean'], function() {
  return gulp.src(Object.values(libs).map(function(item){
    return item.source;
  })).pipe(gulp.dest(distPath+'/libs'))
});

// linting
gulp.task('tslint', function() {
  return gulp.src('app/**/*.ts')
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});


//  使用tsconfig.json编译TypeScript脚本
/**
gulp.task('compile', ['clean'], function () {
  return gulp
    .src(tscConfig.files)
    .pipe(sourcemaps.init())
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(distPath+'/app'));
});
*/

// 不使用tsconfig.json编译TypeScript脚本
gulp.task('compile', ['clean'], function () {
  return gulp
    .src('app/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(distPath+'/app'));
});

// 更新tsconfig文件
gulp.task('tsconfig-glob', function () {
  return tsconfig({
    configPath: '.',
    indent: 2
  });
});

//运行自动刷新服务
gulp.task('serve', ['build'], function() {
  browserSync({
    server: {
      baseDir: distPath
    }
  });

  gulp.watch(['app/**/*', 'index.html', 'styles.css'], ['buildAndReload']);
});

gulp.task('build', ['tslint', 'compile', 'copy:libs', 'copy:assets', 'copy:htmlreplace']);
gulp.task('default', ['build']);
