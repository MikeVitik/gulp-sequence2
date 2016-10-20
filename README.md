# gulp-sequence2

[![NPM](https://nodei.co/npm/gulp-sequence2.png)](https://npmjs.org/package/gulp--sequence2)

A plugin for [Gulp](https://github.com/gulpjs/gulp) allow to write task as a function and combine it in funcitonal style. It usefull for reducing count of gulp tasks. 

## Install

Install with [npm](https://npmjs.org/package/gulp-sequence2)

```
npm install --save-dev gulp-sequence2
```

## usage
```js
function createTestTask(id, t) {
    return (cb) => {
            console.log("start:" + id);
            setTimeout(() => { 
                console.log(id);
                cb();
                }, t);
    }
}

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
```

```
[17:36:30] Starting 'tmp'...
file stream
[17:36:30] Starting 'tmp1'...
tmp1
[17:36:32] Finished 'tmp1' after 2 s
start:parallel1
parallel1
start:seguance task 1
start:seguance task 2
seguance task 2
seguance task 1
start:parallel2
parallel2
[17:36:34] Finished 'tmp' after 3.82 s
```