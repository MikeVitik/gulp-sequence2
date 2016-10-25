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
```

```
[11:09:19] Starting 'tmp'...
[11:09:19] Starting 'NamedFunctionTask'...
[11:09:20] Finished 'NamedFunctionTask'
file stream
[11:09:20] Starting 'tmp1'...
tmp1
[11:09:22] Finished 'tmp1' after 2 s
[11:09:22] Starting 'UsedSequence2Task'...
>parallel1
<parallel1
>sequance task 1
>sequance task 2
<sequance task 2
<sequance task 1
>parallel2
<parallel2
[11:09:23] Finished 'UsedSequence2Task'
[11:09:23] Finished 'tmp' after 4.02 s
```