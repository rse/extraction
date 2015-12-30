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

/*  internal requirements  */
import Seen        from "./extraction-seen.js"
import dsl2ast     from "./extraction-dsl.js"

/*  extract values  */
const extractValue = (value, ast, options, depth, path, seen, toDepth) => {
    /*  optionally pre-process value  */
    if (options.procValueBefore)
        value = options.procValueBefore(value, path)

    /*  provide debug information about current extraction  */
    if (options.debug)
        console.log(`extraction: DEBUG: match VALUE: path: ${path}, depth: ${depth}, ` +
            `mode: ${toDepth !== undefined ? "DEPTH" : "MATCH"}, ` +
            `graph: ${typeof value}, AST: ${ast !== null ? ast.type() : "null"}`)

    /*  optionally post-process value  */
    if (options.procValueAfter)
        value = options.procValueAfter(value, path)
    return value
}

/*  extract objects/arrays  */
const extractObjectOrArray = (value, ast, options, depth, path, seen, toDepth) => {
    /*  optionally pre-process value  */
    if (options.procValueBefore)
        value = options.procValueBefore(value, path)

    /*  provide debug information about current extraction  */
    if (options.debug)
        console.log(`extraction: DEBUG: match OBJECT: path: ${path}, depth: ${depth}, ` +
            `mode: ${toDepth !== undefined ? "DEPTH" : "MATCH"}, ` +
            `graph: ${typeof value}, AST: ${ast !== null ? ast.type() : "null"}`)

    /*  detect circles in graph and break it with references to objects  */
    let pathPrevious = seen.get(value)
    if (pathPrevious) {
        if (options.makeRefValue)
            value = options.makeRefValue(pathPrevious, path, value)
        else
            value = pathPrevious
    }
    else {
        seen.set(value, path)

        /*  support depth-based traversal  */
        let properties
        if (toDepth === undefined) {
            properties = ast.childs()
            if (properties.length === 1 && properties[0].type() === "Depth") {
                toDepth = depth + properties[0].get("depth")
                properties = undefined
            }
        }

        /*  helper function: determine whether value should be extracted  */
        const shouldExtract = (properties, toDepth, val) => {
            let extract = false
            let subAst = null
            if (toDepth !== undefined)
                extract = true
            else {
                for (let k = 0; k < properties.length; k++) {
                    if (properties[k].get("id") === val)
                        extract = true
                    else if (properties[k].get("any") === true)
                        extract = true
                    else {
                        let from = properties[k].get("from")
                        let to   = properties[k].get("to")
                        if (   from !== undefined && to !== undefined
                            && from <= Number(val) && Number(val) <= to)
                            extract = true
                    }
                    if (extract && properties[k].get("not") === true)
                        extract = false
                    if (extract) {
                        subAst = properties[k]
                        if (subAst.childs().length === 1)
                            /*  can only be Object or Array node  */
                            subAst = subAst.childs()[0]
                    }
                }
            }
            return [ extract, subAst ]
        }

        /*  iterate over object properties  */
        if (value instanceof Array) {
            let skip = false
            if (ast !== null && ast.type() !== "Array") {
                if (!options.ignoreMatchErrors)
                    throw new Error(`extraction failed at "${path}": found "Array", expected "${ast.type()}"`)
                else
                    skip = true
            }
            let a = []
            if (!skip && (toDepth === undefined || (toDepth !== undefined && depth < toDepth))) {
                let [ i, j ] = [ 0, 0 ]
                for (; i < value.length; i++) {
                    let [ extract, subAst ] = shouldExtract(properties, toDepth, j)
                    if (extract) {
                        if (typeof value[i] === "object" && value[i] !== null)
                            a[j++] = extractObjectOrArray(value[i], subAst, options,
                                depth + 1, `${path}.${i}`, seen, toDepth)
                        else
                            a[j++] = extractValue(value[i], subAst, options,
                                depth + 1, `${path}.${i}`, seen, toDepth)
                    }
                }
            }
            value = a
        }
        else {
            let skip = false
            if (ast !== null && ast.type() !== "Object") {
                if (!options.ignoreMatchErrors)
                    throw new Error(`extraction failed at "${path}": found "Object", expected "${ast.type()}"`)
                else
                    skip = true
            }
            let o = {}
            if (!skip && (toDepth === undefined || (toDepth !== undefined && depth < toDepth))) {
                for (var key in value) {
                    if (!Object.hasOwnProperty.call(value, key))
                        continue
                    let [ extract, subAst ] = shouldExtract(properties, toDepth, key)
                    if (extract) {
                        if (typeof value[key] === "object" && value[key] !== null)
                            o[key] = extractObjectOrArray(value[key], subAst, options,
                                depth + 1, `${path}.${key}`, seen, toDepth)
                        else
                            o[key] = extractValue(value[key], subAst, options,
                                depth + 1, `${path}.${key}`, seen, toDepth)
                    }
                }
            }
            value = o
        }
    }

    /*  optionally post-process value  */
    if (options.procValueAfter)
        value = options.procValueAfter(value, path)
    return value
}

/*  API function  */
const extract = (graph, tree, options) => {
    /*  argument sanity checking  */
    if (typeof graph !== "object")
        throw new Error("invalid graph argument (expected object type)")
    if (graph === null)
        throw new Error("invalid graph argument (expected not-null value)")
    if (typeof tree !== "string")
        throw new Error("invalid tree argument (expected string type)")
    if (options === undefined)
        options = {}
    if (typeof options !== "object")
        throw new Error("invalid options argument (expected object type)")

    /*  parse extraction tree DSL into AST  */
    let treeAST = dsl2ast(tree, options)

    /*  remember seen objects in a collection  */
    let seen = new Seen()

    /*  start recursive extraction  */
    return extractObjectOrArray(graph, treeAST, options, 0, "@self", seen, undefined)
}

export default extract
