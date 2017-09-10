


var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    project = require('./project.json'),
    paths = {
        scss: './src/scss/', 
        scssThemes: './src/scss/themes/', 
        scripts:'./src/js/',    
        cssMin: './dist/css/',
        scriptsMin:'./dist/js/',
        lib:'./dist/libs/',
        deploy: './deploy/'
    },
    clean = require('del');

/*
 * @task: Complier Tasks
 */

    gulp.task('sass', require('./tasks/sass')(gulp, plugins,paths,clean));

    gulp.task('scripts', require('./tasks/scripts')(gulp, plugins,paths,clean));


/*
 * @task: FILE TRANSFER = Tasks to move files/folders from Dist to App
 */
    gulp.task('dist', require('./tasks/dist')(gulp, plugins,project));                      //Move all from Dist to App

    //gulp.task('dist-js', require('./tasks/dist-js')(gulp, plugins,project));                //Move .js from Dist to App

    gulp.task('dist-css', require('./tasks/dist-css')(gulp, plugins,project));              //Move .css from Dist to App

    gulp.task('dist-lib', require('./tasks/dist-lib')(gulp, plugins,project));              //Move libs from Dist to App





/*
 * @task: FILE TRANSFER = Tasks to move files/folders from Dist to App with compilation */


   gulp.task('app-css', gulp.series('sass','dist-css'));                                                          //Compile css and move .js from Dist to App

   //gulp.task('app-js', gulp.series('scripts','dist-js'));                                                         //Compile js and move .js from Dist to App

   gulp.task('app', gulp.parallel('app-css','dist-lib')); 




 /*
  * @task: Move everything from App to Deploy
  */
    gulp.task('deploy', require('./tasks/deploy')(gulp, plugins,project,clean));




 /*
  * @task: Move everything from App to Deploy after it processed all to app
  */
    gulp.task('provision', gulp.series('app', require('./tasks/deploy')(gulp, plugins,project,clean)));



/*
 * @task: Watcher Tasks
 */
   

    gulp.task('serve-css', gulp.series('sass', 'dist-css'), function() {
        gulp.watch('src/scss/**/*.scss',  gulp.parallel('sass', 'dist-css'));
    });

     gulp.task('serve', gulp.series('serve-css', 'dist-lib', 'dist-css'), function() {
        gulp.watch(['src/scss/**/*.scss'], ['sass', 'dist-css']);
        //gulp.watch(['src/scripts/*.js'], ['scripts', 'dist-js']);
    });

    // gulp.task('serve-js', gulp.parallel('scripts', 'dist-js'), function() {
    //     gulp.watch(['src/scripts/*.js'],  gulp.parallel('scripts', 'dist-js'));    
    // });