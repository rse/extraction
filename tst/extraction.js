/*
**  Extraction -- Tree Extraction for JavaScript Object Graphs
**  Copyright (c) 2015-2019 Dr. Ralf S. Engelschall <rse@engelschall.com>
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

const extraction = require("../lib/extraction.js")
const Graph      = require("../smp/graph.js")

describe("Extraction Library", function () {
    it("should expose its official API", function () {
        expect(extraction).to.be.an("object")
        expect(extraction).to.respondTo("extract")
        expect(extraction).to.respondTo("reify")
    })
    it("should extract simple cases", function () {
        expect(extraction.extract(Graph, "{}"))
            .to.be.deep.equal({})
        expect(extraction.extract(Graph, "{ * }"))
            .to.be.deep.equal({ Person: [], Location: [] })
        expect(extraction.extract(Graph.Person[0], "{ * }"))
            .to.be.deep.equal({ id: 7, name: "God", tags: [], home: {}, rival: {} })
        expect(extraction.extract(Graph.Person[0], "{ id, name }"))
            .to.be.deep.equal({ id: 7, name: "God" })
    })
    it("should extract more complex cases", function () {
        expect(extraction.extract(Graph, "{ Person: [ *: { id, name } ] }"))
            .to.be.deep.equal({ Person: [ { id: 7, name: "God" }, { id: 666, name: "Devil" } ] })
        expect(extraction.extract(Graph, "{ Person: [ *: { id, name, tags: [ * ] } ] }"))
            .to.be.deep.equal({ Person: [
                { id: 7, name: "God", tags: [ "good", "nice" ] },
                { id: 666, name: "Devil", tags: [ "bad", "cruel" ] }
            ] })
    })
    it("should extract cycles", function () {
        expect(extraction.extract(Graph.Person[0], "{ home: { owner } }"))
            .to.be.deep.equal({ home: { owner: "@self" } })
        expect(extraction.extract(Graph, "{ -> oo }"))
            .to.be.deep.equal({
                Person: [ {
                    id: 7,
                    name: "God",
                    tags: [ "good", "nice" ],
                    home: { id: 1, name: "Heaven", owner: "@self.Person.0" },
                    rival: {
                        id: 666,
                        name: "Devil",
                        tags: [ "bad", "cruel" ],
                        home: { id: 999, name: "Hell", owner: "@self.Person.0.rival" },
                        rival: "@self.Person.0"
                    }
                }, "@self.Person.0.rival" ],
                Location: [ {
                    id: 0,
                    name: "World",
                    subs: [ "@self.Person.0.home", "@self.Person.0.rival.home" ]
                }, "@self.Person.0.home", "@self.Person.0.rival.home" ]
            })
    })
    it("should fully extract and reify again", function () {
        let g = extraction.extract(Graph, "{ -> oo }")
        g = extraction.reify(g)
        expect(g).to.be.deep.equal(Graph)
    })
    it("should fail to extract", function () {
        //  expect(extraction.extract(Graph.Person[0], "{ name, home: { owner: { id, name } } }"))
        //      .to.throw(Error)
    })
})

