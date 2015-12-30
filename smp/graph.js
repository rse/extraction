
/*
 *  Person {
 *      id:    number
 *      name:  string
 *      tags:  string+
 *      home:  Location
 *      rival: Person?
 *  }
 *  Location {
 *      id:     number
 *      name:   string
 *      owner:  Person?
 *      subs:   Location*
 *  }
 */

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

module.exports = Graph

