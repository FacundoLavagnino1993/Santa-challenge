

const gulp = require('gulp');

gulp.task('server:build', () => {
  return gulp.src(['src/server/**/*']).pipe(gulp.dest('./build'));
});

