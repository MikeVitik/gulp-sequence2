"use strict"

var gulp = require("gulp");
var gulpSequence = require("./index");
var test = require("./tests/index");

test();

gulp.task("default", ["tmp"]);