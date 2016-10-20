var streamToPromise = require("stream-to-promise");
var gulp = require("gulp");

function taskToPromise(task) {
    return new Promise((r, e) => {
        function removeListener() {
            (gulp).removeListener("task_stop", successListener)
                .removeListener("task_not_found", errorListener)
                .removeListener("task_recursion", errorListener)
                .removeListener("task_err", errorListener);
        };
        function successListener(e) {
            removeListener();
            r();
        }
        function errorListener(e) {
            removeListener();
            e(e.err);
        }
        gulp
            .on("task_stop", successListener)
            .on("task_not_found", errorListener)
            .on("task_recursion", errorListener)
            .on("task_err", errorListener)
            .start(task);
    });
}

function toPromise(task) {
    if ((typeof task === "string")) {
        return taskToPromise(task);
    } else {
        var immediateRes,
        resolve, 
        promise = new Promise((r, err) => {
            try {
                resolve = r;
                //var resolve = () => { debugger; r();}
                immediateRes = task(r);
            } catch (error) {
                err(error);
            }
        });
        if(immediateRes === null) {
            resolve();
            return promise;
        }
        if(immediateRes === undefined) {
            return promise;
        }
        if (!immediateRes.then) {
            return streamToPromise(immediateRes);
        } else {
            return promise;
        }
    }
}

module.exports = function () {
    var args = Array.prototype.slice.call(arguments);
    return (cb) => {
        return new Promise((r, e) => {
            var result = args.reduceRight((acc, t) => {
                var res;
                if (Array.isArray(t)) {
                    res = () => {
                        //return Promise.all((t).map((_t) => { return (typeof _t === "string") ? taskToPromise(_t) : (streamToPromise(_t())); }))
                        Promise.all((t).map(toPromise))
                            .then(acc)
                            .catch(e);
                    };
                } else {
                    res = () => {
                        //return (((typeof t === "string") ? taskToPromise(t) : (streamToPromise(t()))))
                        return toPromise(t)
                            .then(acc)
                            .catch(e);
                    };
                }
                return res;
            }, () => {
                cb(); 
            });
            result();
        });
    }
}
