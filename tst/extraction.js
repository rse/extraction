/*
**  Extraction -- Tree Extraction for JavaScript Object Graphs
**  Copyright (c) 2015 Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit Person to whom the Software is furnished to do so, subject to
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

/* global describe: false */
/* global it: false */
/* global expect: false */
/* global require: false */
/* jshint -W030: false */

var extraction = require("../lib/extraction.js")
var Graph      = require("../smp/graph.js")

describe("Extraction Library", function () {
    it("should expose its official API", function () {
        expect(extraction).to.be.an("object")
        expect(extraction).to.respondTo("extract")
        expect(extraction).to.respondTo("reify")
    })
    it("should extract simply", function () {
        expect(extraction.extract(Graph, "{}", { ignoreMatchErrors: true, debug: false }))
            .to.be.deep.equal({})
        expect(extraction.extract(Graph, "{ * }", { ignoreMatchErrors: true, debug: false }))
            .to.be.deep.equal({ Person: [], Location: [] })
        expect(extraction.extract(Graph, "{ Person: [ *: { id, name } ] }", { ignoreMatchErrors: true, debug: false }))
            .to.be.deep.equal({ Person: [ { id: 7, name: "God" }, { id: 666, name: "Devil" } ] })
    })
    it("should fail to extract", function () {
        //  expect(extraction.extract(Graph.Person[0], "{ name, home: { owner: { id, name } } }"))
        //      .to.throw(Error)
    })
    it("should fully extract and reify again", function () {
        var g = extraction.extract(Graph, "{ -> oo }")
        extraction.reify(g)
        expect(g).to.be.deep.equal(Graph)
    })
})

