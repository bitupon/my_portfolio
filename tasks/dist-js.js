
/*
 * @task: dist
 * Copies scripts from "dist" folder into App/Project folder
 */

module.exports = function (gulp, plugins,project) {
    return function () {
        return gulp.src(['./dist/scripts/*.js'], {base: './dist/'})
            .pipe(gulp.dest(project.app))
            .pipe(plugins.notify({
                message: "Js Transfer from dist to app successful"
            }));
    };
};

