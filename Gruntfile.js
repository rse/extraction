/*
**  Extraction -- Tree Extraction for JavaScript Object Graphs
**  Copyright (c) 2015-2016 Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/* global module: true */
module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-bower-install-simple");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        "bower-install-simple": {
            "main": {
                options: {
                    color:       true,
                    production:  true,
                    directory:   "bower_components"
                }
            }
        },
        copy: {
            "normalize": {
                src: [ "bower_components/normalize.css/normalize.css" ],
                dest: "lib/normalize/normalize.css"
            },
            "gridless": {
                src: [ "bower_components/gridless/predef/eg12.css" ],
                dest: "lib/gridless/eg12.css"
            },
            "syntax": {
                src: [ "bower_components/syntax/lib/syntax.browser.js" ],
                dest: "lib/syntax/syntax.js"
            },
            "jquery": {
                src: [ "bower_components/jquery/dist/jquery.min.js" ],
                dest: "lib/jquery/jquery.js"
            },
            "extraction": {
                src: [ "bower_components/extraction/lib/extraction.js" ],
                dest: "lib/extraction/extraction.js"
            },
            "typopro": {
                files: [
                    { expand: true, flatten: false, cwd: "bower_components/typopro-web/web",
                      src: "TypoPRO-OpenSans/**", dest: "lib/typopro/" },
                    { expand: true, flatten: false, cwd: "bower_components/typopro-web/web",
                      src: "TypoPRO-BebasNeue/**", dest: "lib/typopro/" },
                    { expand: true, flatten: false, cwd: "bower_components/typopro-web/web",
                      src: "TypoPRO-DejaVu/**", dest: "lib/typopro/" },
                    { expand: true, flatten: false, cwd: "bower_components/typopro-web/web",
                      src: "TypoPRO-Journal/**", dest: "lib/typopro/" }
                ]
            },
            "font-awesome-css": {
                src: [ "bower_components/fontawesome/css/font-awesome.css" ],
                dest: "lib/fontawesome/fontawesome.css",
                options: {
                    process: function (content, srcpath) {
                        return content.replace(/\.\.\/fonts\/fontawesome-webfont/g, "fontawesome");
                    }
                }
            },
            "font-awesome-fonts": {
                files: [{
                    expand: true, flatten: false, cwd: "bower_components/fontawesome/fonts",
                    src: "fontawesome-webfont.*", dest: "lib/fontawesome/",
                    rename: function (src, dest) {
                        return src + dest.replace(/fontawesome-webfont/, "fontawesome");
                    }
                }]
            }
        },
        clean: {
            clean:     [ "lib" ],
            distclean: [ "node_modules", "bower_components" ]
        }
    });

    grunt.registerTask("default", [ "bower-install-simple", "copy" ]);
};

