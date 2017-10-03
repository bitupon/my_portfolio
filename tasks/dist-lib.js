
/*
 * @task: dist
 * Copies all except scripts from "dist" folder into App/Project folder
 */

module.exports = function (gulp, plugins,project) {
    return function () {
        return gulp.src([
                './dist/libs/jquery/dist/jquery.min.js',
                './dist/libs/bootstrap/*/*.*',              
                './dist/libs/font-awesome/*/*.*',
                 './dist/libs/skrollr/*.*'               
                ], {base: './dist/'})
            .pipe(gulp.dest(project.app))
            .pipe(plugins.notify({
                 message: "Libs folder transfer from dist to app successful"
             }));
    };
};
