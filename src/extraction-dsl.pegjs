/*
**  Extraction -- Tree Extraction for JavaScript Object Graphs
**  Copyright (c) 2015-2019 Dr. Ralf S. Engelschall <rse@engelschall.com>
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

/*  import pegjs-util functionality  */
{
    var unroll = options.util.makeUnroll(location, options)
    var ast    = options.util.makeAST   (location, options)
}

/*  entire specificiation  */
spec
    = object
    / array

/*  object specification  */
object
    = _ "{" _ content:content? _ "}" _ {
          return ast("Object").add(content)
      }

/*  array specification  */
array
    = _ "[" _ content:content? _ "]" _ {
          return ast("Array").add(content)
      }

/*  whole content of object/array  */
content
    = "->" _ depth:num {
          return ast("Depth").set({ depth: depth })
      }
    / item:item items:(_ "," _ item)* {
          return unroll(item, items, 3)
      }

/*  single content item  */
item
    = property:property _ ":" _ spec:spec {
          return property.add(spec)
      }
    / not:"!"? _ property:property {
          if (not !== null)
              property.set({ not: true })
          return property
      }

/*  property identification  */
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

/*  integral number and special cases of plus/minus infinity  */
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

/*  JavaScript identifier  */
id
    = [$a-zA-Z_][$a-zA-Z0-9_]*

/*  optional blank material  */
_ "blank"
    = (co / ws)*

/*  C/C++ style comments  */
co "comment"
    = "//" (![\r\n] .)*
    / "/*" (!"*/" .)* "*/"

/*  ASCII whitespaces  */
ws "whitespaces"
    = [ \t\r\n]+

