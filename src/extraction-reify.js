/*
**  Extraction -- Tree Extraction for JavaScript Object Graphs
**  Copyright (c) 2015-2018 Ralf S. Engelschall <rse@engelschall.com>
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

/*  recursive reify process  */
const reifyInternal = (node, options, path, map) => {
    /*  optionally pre-process node  */
    if (options.procValueBefore)
        node = options.procValueBefore(node, path)

    /*  provide debug information about current extraction  */
    if (options.debug)
        console.log(`reify: DEBUG: path: ${path}, graph: ${typeof node}`)

    /*  determine whether node is an object reference  */
    let isRef = false
    if (options.isReference)
        isRef = options.isReference(node, path)
    else
        isRef = (typeof node === "string" && node.match(/^@self(?:\..+|)$/))
    if (isRef) {
        /*  process object references  */
        let obj
        if (options.getObject)
            obj = options.getObject(node, path)
        else
            obj = map[node]
        if (obj === undefined)
            throw new Error(`invalid object reference "${node}" at path "${path}"`)
        node = obj
    }
    else if (node !== null && typeof node === "object") {
        /*  process objects  */
        if (options.setObject)
            options.setObject(node, path)
        else
            map[path] = node
        if (node instanceof Array) {
            /*  array object  */
            for (let i = 0; i < node.length; i++)
                node[i] = reifyInternal(node[i], options, `${path}.${i}`, map)
        }
        else
            /*  regular object  */
            for (let key in node)
                if (Object.hasOwnProperty.call(node, key))
                    node[key] = reifyInternal(node[key], options, `${path}.${key}`, map)
    }

    /*  optionally post-process node  */
    if (options.procValueAfter)
        node = options.procValueAfter(node, path)

    return node
}

/*  API function  */
const reify = (graph, options) => {
    /*  argument sanity checking  */
    if (typeof graph !== "object")
        throw new Error("invalid graph argument (expected object type)")
    if (graph === null)
        throw new Error("invalid graph argument (expected not-null value)")
    if (options === undefined)
        options = {}
    if (typeof options !== "object")
        throw new Error("invalid options argument (expected object type)")

    /*  start recursive reify process  */
    return reifyInternal(graph, options, "@self", { "@self": graph })
}

export default reify

