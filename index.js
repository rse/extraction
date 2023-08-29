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

(function ($) {
    $(document).ready(function () {
        var update = function () {
            var code = ""
            code += $(".box-graph-code div.code").text()
            code += "var Output = Extraction.extract(Graph, "
            code += JSON.stringify($(".box-query-input textarea").val().replace(/^\s+/, "").replace(/\s+$/, ""))
            code += ", { debug: false })"
            var error  = null
            var output = null
            try {
                eval(code)
                output = JSON.stringify(Output, null, "    ")
            }
            catch (ex) {
                error = ex.message
            }
            if (error)
                $(".box-query-output div.code")
                    .addClass("error")
                    .text(error)
            else {
                $(".box-query-output div.code")
                    .removeClass("error")
                    .text(output)
                $("*[data-syntax]").each(function () {
                    var language = $(this).data("syntax")
                    var syntax = new Syntax({
                        language: language,
                        cssPrefix: "syntax-"
                    })
                    syntax.config({})
                    var text = $(this).text()
                    text = text
                        .replace(/^(?:[ \t]*\r?\n)+/, "")
                        .replace(/([ \t]*\r?\n)(?:[ \t]*\r?\n)*[ \t]*$/, "$1")
                    syntax.richtext(text)
                    var html = syntax.html()
                    $(this).html(html)
                    $(".syntax-anchor", this).each(function () {
                        var m = $(this).attr("class").match(/syntax-anchor-(\S+)/)
                        var num = m[1]
                        $(this).addClass("cn-" + num + "-i")
                    })
                    $(this).addClass("syntax")
                })
            }
        }
        $(".box-query-input textarea").keyup(update)
        $(".box-query-input textarea").change(update)
        update()

    })
})(jQuery)

