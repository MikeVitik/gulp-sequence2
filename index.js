/*jslint devel: true, maxerr: 50, node: true, es6: true, white: true */ /*global define */

"use strict";

var streamToPromise = require("stream-to-promise");
var gutil = require('gulp-util');
var gulp = require("gulp");


function logError(error) {
    var err = new gutil.PluginError('sequence2', error, {showStack: true});
}

function taskToPromise(task) {
    return new Promise(function (r) {
        function successListener() {
            removeListener();
            r();
        }
        function errorListener(e) {
            removeListener();
            logError(e.err)
            //errorPlugin.log(e.err);
        }
        function removeListener() {
            (gulp).removeListener("task_stop", successListener)
                .removeListener("task_not_found", errorListener)
                .removeListener("task_recursion", errorListener)
                .removeListener("task_err", errorListener);
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
    if (typeof task === "string") {
        return taskToPromise(task);
    } else {
        if (task.name) {
            gutil.log("Starting '" + task.name + "'...");
        }
        var immediateRes,
            resolve,
            promise = new Promise(function(r, err) {
                try {
                    resolve = function () {
                        if (task.name) {
                            gutil.log("Finished '" + task.name + "'");
                        }
                        r();
                    };
                    immediateRes = task(r);
                } catch (error) {
                    err(error);
                }
            });
        if (immediateRes === null) {
            resolve();
            return promise;
        }
        if (immediateRes === undefined) {
            return promise;
        }
        if (gutil.isStream(immediateRes)) {
            return streamToPromise(immediateRes);
        } else {
            return immediateRes;
        }
    }
}

module.exports = function() {
    var args = Array.prototype.slice.call(arguments);
    return function (cb) {
        var result = args.reduceRight(function(acc, t) {
            var res;
            if (Array.isArray(t)) {
                res = function() {
                    Promise.all((t).map(toPromise))
                        .then(acc)
                        .catch(logError);
                };
            } else {
                res = function () {
                    return toPromise(t)
                        .then(function () {
                            if(t.name) {
                                gutil.log("Finished '" + t.name + "'");
                            }
                            acc();
                        })
                        .catch(logError);
                };
            }
            return res;
        }, function() { cb(); });
        result();
    };
};