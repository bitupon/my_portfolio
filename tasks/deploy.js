
/*
 * @task: deploy
 * Copies "App" folder under "deploy" folder
 */

module.exports = function (gulp, plugins,paths,clean) {
    return function () {     
       clean([paths.deploy + '*']);
       return gulp.src([
                './app/**/**/*.*', '!./app/settings.xml'             
                ], {base: './app'})
            .pipe(gulp.dest(paths.deploy))
            .pipe(plugins.notify({
                message: "Deployment Successful"
            }));

        
    };
};
