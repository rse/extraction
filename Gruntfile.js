/*
**  Extraction -- Tree Extraction for JavaScript Object Graphs
**  Copyright (c) 2015-2023 Ralf S. Engelschall <rse@engelschall.com>
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

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        copy: {
            "normalize": {
                src: [ "node_modules/normalize.css/normalize.css" ],
                dest: "lib/normalize/normalize.css"
            },
            "gridless": {
                src: [ "node_modules/gridless/predef/eg12.css" ],
                dest: "lib/gridless/eg12.css"
            },
            "syntax": {
                src: [ "node_modules/syntax/lib/syntax.browser.js" ],
                dest: "lib/syntax/syntax.js"
            },
            "jquery": {
                src: [ "node_modules/jquery/dist/jquery.min.js" ],
                dest: "lib/jquery/jquery.js"
            },
            "extraction": {
                src: [ "node_modules/extraction/lib/extraction.js" ],
                dest: "lib/extraction/extraction.js"
            },
            "typopro": {
                files: [
                    { expand: true, flatten: false, cwd: "node_modules/typopro-web/web",
                      src: "TypoPRO-OpenSans/**", dest: "lib/typopro/" },
                    { expand: true, flatten: false, cwd: "node_modules/typopro-web/web",
                      src: "TypoPRO-BebasNeue/**", dest: "lib/typopro/" },
                    { expand: true, flatten: false, cwd: "node_modules/typopro-web/web",
                      src: "TypoPRO-DejaVu/**", dest: "lib/typopro/" },
                    { expand: true, flatten: false, cwd: "node_modules/typopro-web/web",
                      src: "TypoPRO-Journal/**", dest: "lib/typopro/" }
                ]
            },
            "font-awesome-css": {
                src: [ "node_modules/font-awesome/css/font-awesome.css" ],
                dest: "lib/fontawesome/fontawesome.css",
                options: {
                    process: function (content, srcpath) {
                        return content.replace(/\.\.\/fonts\/fontawesome-webfont/g, "fontawesome");
                    }
                }
            },
            "font-awesome-fonts": {
                files: [{
                    expand: true, flatten: false, cwd: "node_modules/font-awesome/fonts",
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

    grunt.registerTask("default", [ "copy" ]);
};

