
Extraction
==========

Tree Extraction for JavaScript Object Graphs

<p/>
<img src="https://nodei.co/npm/extraction.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/extraction.png" alt=""/>

About
-----

Extraction is a small JavaScript library for extracting object trees
from arbitrary object graphs. Object graphs usually have cycles and
contain many information. Hence, the clue is that the extracted object
trees use links to break reference cycles and can be just partial by
leaving out information. The Extraction library is intended for two
main use cases: to support the persisting and restoring of arbitrary
in-memory object graph structures (where the cycle problem has to be
resolved) and to support the generation of responses in REST APIs based
on object graphs (where the partial information has to be resolved).

Installation
------------

#### Node environments (with NPM package manager):

```shell
$ npm install extraction
```

#### Browser environments (with Bower package manager):

```shell
$ bower install extraction
```

Usage
-----

The Extraction library exposes two API functions:

### `extract`

This is the main API method for extracting an object tree from an object
graph with the help of a tree extraction DSL.

```
extraction.extract(graph: object, spec: string, options?: object): object
```

FIXME

### `reify`

This is a utility API method to re-generate an object graph from an
object tree by reifying all self-references back to the referenced
objects.

```
extraction.reify(tree: object, options?: object): object
```

FIXME

Example
-------

Suppose we have an object graph (aka "business model") based
on two entity definitions (in pseudo language):

```
Person {
    id:    number
    name:  string
    tags:  string+
    home:  Location
    rival: Person?
}
Location {
    id:     number
    name:   string
    owner:  Person?
    subs:   Location*
}
```

A possible JavaScript instanciation of this object graph definition then
could be:

```js
/*  the sample object graph  */
var Graph = {
    Person: [
        { id: 7,   name: "God",   tags: [ "good", "nice" ] },
        { id: 666, name: "Devil", tags: [ "bad", "cruel" ] }
    ],
    Location: [
        { id: 0,   name: "World" },
        { id: 1,   name: "Heaven" },
        { id: 999, name: "Hell" }
    ]
}
Graph.Person[0].home    = Graph.Location[1]
Graph.Person[1].home    = Graph.Location[2]
Graph.Person[1].rival   = Graph.Person[0]
Graph.Person[0].rival   = Graph.Person[1]
Graph.Location[0].subs  = [ Graph.Location[1], Graph.Location[2] ]
Graph.Location[1].owner = Graph.Person[0]
Graph.Location[2].owner = Graph.Person[1]
```

Because of the relationship cycles in this graph, you cannot easily
serialize this graph as JSON with plain `JSON.stringify()` as it
will detect but not handle the cycles correctly. With the Extraction library
you can serialize and deseralize this graph just fine:

```js
/*  import external requirements  */
import { extract, reify } from "extraction"
import { expect }         from "chai"
import { inspect }        from "util"

/*  extract entire graph as a tree with self-references  */
let tree = extract(Graph, "{ -> oo }")
console.log(inspect(tree, { depth: null }))

//  { Person:
//     [ { id: 7,
//         name: 'God',
//         tags: [ 'good', 'nice' ],
//         home: { id: 1, name: 'Heaven', owner: '@self.Person.0' },
//         rival:
//          { id: 666,
//            name: 'Devil',
//            tags: [ 'bad', 'cruel' ],
//            home: { id: 999, name: 'Hell', owner: '@self.Person.0.rival' },
//            rival: '@self.Person.0' } },
//       '@self.Person.0.rival' ],
//    Location:
//     [ { id: 0,
//         name: 'World',
//         subs: [ '@self.Person.0.home', '@self.Person.0.rival.home' ] },
//       '@self.Person.0.home',
//       '@self.Person.0.rival.home' ] }

/*  as the tree has no cycles, it can be serialized/unserialized just fine  */
tree = JSON.parse(JSON.stringify(tree))

/*  reify the object references to gain the original graph again  */
let GraphNew = reify(tree)
expect(GraphNew).to.be.deep.equal(Graph)
```

Now suppose we have a REST API where we want to let Persons
with their home Location be queried:

```js
/*  import external requirements  */
import HAPI        from "hapi"
import { extract } from "./lib/extraction"

/*  import sample graph  */
import Graph       from "./sample-graph"

/*  establish a new REST service  */
var server = new HAPI.Server()
server.connection({ address: "0.0.0.0", port: "12345" })

/*  provide REST endpoints  */
server.route({
    method: "GET",
    path: "/persons/{id}",
    handler: (request, reply) => {
        let id = parseInt(request.params.id)
        let person = Graph.Person.find((person) => person.id === id)
        let response = JSON.stringify(extract(
            person, "{ id, name, home { id, name } }"
        ))
        reply(response)
    }
})

/*  fire up REST service  */
server.start((err) => {
    if (err)
        console.log(err)
})
```

Querying the two Persons yields:

```
$ curl http://127.0.0.1:12345/persons/7
{"id":7,"name":"God","home":{"id":1,"name":"Heaven"}}

$ curl http://127.0.0.1:12345/persons/6660
{"id":666,"name":"Devil","home":{"id":999,"name":"Hell"}}
```

Implementation Notice
---------------------

Although the Extraction library is written in ECMAScript 6, it is
transpiled to ECMAScript 5 and this way runs in really all(!) current
(as of 2015) JavaScript environments, of course.

License
-------

Copyright (c) 2015 Ralf S. Engelschall (http://engelschall.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

