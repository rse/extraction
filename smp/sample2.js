
/*  import external requirements  */
import HAPI        from "hapi"
import { extract } from "../lib/extraction"

/*  import sample graph  */
import Graph       from "./graph"

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

