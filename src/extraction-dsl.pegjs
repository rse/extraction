/*
**  Extraction -- Tree Extraction for JavaScript Object Graphs
**  Copyright (c) 2015 Ralf S. Engelschall <rse@engelschall.com>
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

{
    var unroll = options.util.makeUnroll(location, options)
    var ast    = options.util.makeAST   (location, options)
}

spec
    = object
    / array

object
    = _ "{" _ content:content? _ "}" _ {
          return ast("Object").add(content)
      }

array
    = _ "[" _ content:content? _ "]" _ {
          return ast("Array").add(content)
      }

content
    = "->" _ depth:num {
          return ast("Depth").set({ depth: depth })
      }
    / field:field fields:(_ "," _ field)* {
          return unroll(field, fields, 3)
      }

field
    = property:property _ spec:spec {
          return property.add(spec)
      }
    / not:"!"? _ property:property {
          if (not !== null)
              property.set({ not: true })
          return property
      }

property
    = id:$(id) {
          return ast("Property").set({ id: id })
      }
    / "*" {
          return ast("Property").set({ any: true })
      }
    / from:num _ ".." _ to:num {
          return ast("Property").set({ from: from, to: to })
      }
    / num:num {
          return ast("Property").set({ from: num, to: num })
      }

num
    = num:$("-"? [0-9]+) {
          return parseInt(num, 10)
      }
    / num:"-oo" {
          return -Infinity
      }
    / num:"oo" {
          return Infinity
      }

id
    = [$a-zA-Z_][$a-zA-Z0-9_]*

_ "blank"
    = (co / ws)*

co "comment"
    = "//" (![\r\n] .)*
    / "/*" (!"*/" .)* "*/"

ws "whitespaces"
    = [ \t\r\n]+

