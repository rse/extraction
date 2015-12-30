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

/* global describe: false */
/* global it: false */
/* global expect: false */
/* global require: false */
/* jshint -W030: false */

var extraction = require("../lib/extraction.js")

/*  the sample graph  */
var persons = [
    { id: 7,   name: "God",   tags: [ "good", "nice" ] },
    { id: 666, name: "Devil", tags: [ "bad", "cruel" ] }
]
var locations = [
    { id: 1,   name: "Heaven" },
    { id: 999, name: "Hell" }
]
persons[0].location = locations[0]
persons[1].location = locations[1]
persons[1].counterpart = persons[0]
persons[0].counterpart = persons[1]
locations[0].owner = persons[0]
locations[0].owner = persons[1]
var graph = {
    persons: persons,
    locations: locations
}

describe("Extraction Library", function () {
    it("should expose its official API", function () {
        expect(extraction).to.be.an("object")
        expect(extraction).to.respondTo("extract")
        expect(extraction).to.respondTo("reify")
    })
    it("should extract simply", function () {
        expect(extraction.extract(graph, "{}", { ignoreMatchErrors: true, debug: true }))
            .to.be.deep.equal({})
        expect(extraction.extract(graph, "{ * }", { ignoreMatchErrors: true, debug: true }))
            .to.be.deep.equal({ persons: [], locations: [] })
        expect(extraction.extract(graph, "{ persons [ * { id, name } ] }", { ignoreMatchErrors: true, debug: true }))
            .to.be.deep.equal({ persons: [ { id: 7, name: "God" }, { id: 666, name: "Devil" } ] })
        extraction.extract(graph, "{ persons [ * { id, name } ] }")
        extraction.extract(graph, "{ persons [ * { id, name } ] }")
        /*
        console.log(require("util").inspect(extraction(graph,
            "{ persons [ * { id, tags [ -> oo ] } ], !locations }"
        ), { depth: null, colors: true }))
        console.log(require("util").inspect(extraction(graph,
            "{ -> oo }"
        ), { depth: null, colors: true }))
        */
        console.log(extraction.extract(graph, "{ -> oo }", {
            procValueAfter: (value) => {
                if (typeof value === "object" && value !== null) {
                    if (value instanceof Array)
                        value = "[" + value.join(",") + "]"
                    else
                        value = "{" + Object.keys(value).map(function (key) {
                            return JSON.stringify(key) + ":" + value[key]
                        }).join(",") + "}"
                }
                else
                    value = JSON.stringify(value)
                return value
            }
        }))
        var g = extraction.extract(graph, "{ -> oo }")
        extraction.reify(g)
        expect(g).to.be.deep.equal(graph)
    })
})

