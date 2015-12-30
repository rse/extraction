
/*  import external requirements  */
import { extract, reify } from "../lib/extraction"
import { expect }         from "chai"
import { inspect }        from "util"

/*  import sample graph  */
import Graph              from "./graph"

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

