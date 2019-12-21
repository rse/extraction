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

/*  external requirements  */
import ASTY        from "asty"
import PEGutil     from "pegjs-util"
import CacheLRU    from "cache-lru"

/*  pre-parse PEG grammar (replaced by browserify)  */
/* global __dirname: false */
var PEG = require("pegjs-otf")
var PEGparser = PEG.generateFromFile(
    `${__dirname}/extraction-dsl.pegjs`,
    { optimize: "speed" }
)

/*  limited global cache of ASTs  */
var ASTcache = new CacheLRU()
ASTcache.limit(64)

/*  parse the Domain-Specific Language (DSL) into the Abstract Syntax Tree (AST)  */
export default function dsl2ast (dsl, options) {
    /*  show input DSL  */
    if (options.debug)
        console.log("extraction: DEBUG: extraction tree DSL:\n" +
            "extraction: DEBUG: | " + dsl)

    /*  try to take AST from cache  */
    let treeAST = ASTcache.get(dsl)
    if (treeAST !== undefined) {
        if (options.debug)
            console.log("extraction: DEBUG: extraction tree AST: reusing from cache")
    }
    else {
        /*  generate AST form DSL  */
        if (options.debug)
            console.log("extraction: DEBUG: extraction tree AST: generating from scratch")
        const asty = new ASTY()
        const result = PEGutil.parse(PEGparser, dsl, {
            makeAST: (line, column, offset, args) =>
                asty.create(...args).pos(line, column, offset)
        })
        if (result.error !== null)
            throw new Error("failed to parse extraction tree DSL:\n" +
                PEGutil.errorMessage(result.error, true).replace(/^/mg, "ERROR: "))
        treeAST = result.ast
        ASTcache.set(dsl, treeAST)
    }

    /*  sanity check DSL via AST  */
    if (treeAST.type() !== "Object" && treeAST.type() !== "Array")
        throw new Error("extraction tree DSL has to be an Object or Array at outmost scope")

    /*  show output AST  */
    if (options.debug)
        console.log("extraction: DEBUG: extraction tree AST:\n" +
            treeAST.dump().replace(/\r?\n$/, "").replace(/^/mg, "extraction: DEBUG: | "))
    return treeAST
}

