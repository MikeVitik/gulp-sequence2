'use strict'
/* global */

var gulp = require('gulp');
var seq2 = require('../index');


function createTestTask(id, t) {
    return (cb) => {
            console.log("start:" + id);
            setTimeout(() => { 
                console.log(id);
                cb();
                }, t);
    }
}

module.exports = function() {

gulp.task("tmp1", (cb) => { 
    console.log("tmp1");
    setTimeout(() => {
        cb();
    }, 2000); 
});

var Tmp2Task = seq2(
    createTestTask("parallel1", 500),
    [createTestTask("seguance task 1", 800), createTestTask("seguance task 2", 500)],
    createTestTask("parallel2", 500)
);

//gulp.task("tmp2", Tmp2Task);

gulp.task("tmp", seq2(
    () => { console.log("file stream"); return gulp.src("*.js"); },
    "tmp1",
    Tmp2Task
));

}