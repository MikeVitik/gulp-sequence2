'use strict'
/* global */

var gulp = require('gulp');
var seq2 = require('../index');


function createTestTask(id, t) {
    return (cb) => {
            console.log(">" + id);
            setTimeout(() => { 
                console.log("<" + id);
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

function UsedSequence2Task(cb) { seq2(
    createTestTask("parallel1", 500),
    [createTestTask("sequance task 1", 800), createTestTask("sequance task 2", 500)],
    createTestTask("parallel2", 500)
    )(cb);
}

function NamedFunctionTask(cb) {
    setTimeout(cb, 200);
}

//gulp.task("tmp2", Tmp2Task);

gulp.task("tmp", seq2(
    NamedFunctionTask,
    () => { console.log("file stream"); return gulp.src("*.js"); },
    "tmp1",
    UsedSequence2Task
));

}